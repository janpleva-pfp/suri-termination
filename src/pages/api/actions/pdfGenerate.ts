import type { NextApiRequest, NextApiResponse } from 'next';

import { SEVERITY_ERROR, SEVERITY_INFO } from '@app/constants';
import { sapiPdfCreateFileTerminationEntity } from '@app/server/api/sapiPdfCreateFileTerminationEntity';
import { uploadFile } from '@app/server/uploadToSharepoint';
import { preparePDFObject } from '@app/src/lib/transformDataLB';

import { logger } from '../log';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  switch (method) {
    case 'POST':
      return handlePost(req, res);
    default:
      res.setHeader('Allow', ['POST']);
      return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
}

async function handlePost(request: NextApiRequest, response: NextApiResponse) {
  try {
    if (typeof request.body.linkId !== 'string' || request.body.linkId.trim() === '') {
      throw new Error('Invalid or missing linkId in request body');
    }
    const PDFEntity = await preparePDFObject(request.body.data);
    if (!PDFEntity.parameters.provider?.companyIdentificationNumber) {
      logger.log(
        SEVERITY_ERROR,
        '[api-pdfGenerate] Missing provider.companyIdentificationNumber, cannot create filename for upload',
      );
      return response.status(500).json({ error: 'Missing provider.companyIdentificationNumber' });
    }
    const PDFEntityResponse = await sapiPdfCreateFileTerminationEntity(PDFEntity);

    // Handle PDF binary data properly
    if (PDFEntityResponse.status == 200) {
      if (!PDFEntity.parameters?.signatureImg) {
        logger.log(SEVERITY_INFO, '[api-pdfGenerate] Warning: signatureImg is missing in the parameters');
      }

      const pdfRaw = PDFEntityResponse._response.data;
      let pdfBuffer: Buffer;
      if (Buffer.isBuffer(pdfRaw)) {
        pdfBuffer = pdfRaw;
      } else if (typeof pdfRaw === 'string') {
        pdfBuffer = Buffer.from(pdfRaw, 'latin1');
      } else {
        logger.log(SEVERITY_ERROR, '[api-pdfGenerate] pdfRaw is neither Buffer nor string');
        throw new Error('pdfRaw is neither Buffer nor string');
      }
      const pdfBase64 = pdfBuffer.toString('base64');
      let fileOutsideUrl: string | undefined;
      if (pdfBase64) {
        // If signatureImg is present, upload the PDF to SharePoint
        if (PDFEntity.parameters?.signatureImg) {
          // filename should be YYYY-MM-DD_HH-mm-ss_provider.companyIdentificationNumber_contractNumber.pdf
          const now = new Date();
          const dateStr =
            now
              .toISOString()
              .replace(/T/, '_')
              .replace(/\.\d{3}Z$/, '') // remove .sssZ (milliseconds and Z)
              .replace(/:/g, '-') + '_'; // replace colons and add trailing underscore
          const fileName = `${dateStr}${PDFEntity.parameters.provider.companyIdentificationNumber}_${PDFEntity.parameters.contractNumber}.pdf`;
          try {
            fileOutsideUrl = await uploadFile(pdfBuffer, fileName);
          } catch (err) {
            logger.log(SEVERITY_ERROR, '[api-pdfGenerate] Error uploading PDF to SharePoint:', err);
            return response.status(500).json({ status: 'error', error: 'Failed to upload PDF' });
          }
        }
        return response.status(200).json({
          status: 200,
          data: {
            pdfData: pdfBase64,
            fileOutsideUrl: fileOutsideUrl || null,
            contentType: 'application/pdf',
            id: request.body.linkId,
          },
        });
      }
    } else {
      logger.log(SEVERITY_ERROR, '[api-pdfGenerate] Failed to generate PDF, status code:', PDFEntityResponse.status);
      return response.status(500).json({
        status: 500,
        error: 'Internal server error',
      });
    }
  } catch (error) {
    logger.log(SEVERITY_ERROR, '[api-pdfGenerate] Error creating PDF:', error);
    return response.status(500).json({
      status: 500,
      error: 'Internal server error',
    });
  }
}
