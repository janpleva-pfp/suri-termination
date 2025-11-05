import { AppHttpResponse } from '@definedTypes/api/AppHttpResponse';
import { PDFEntity } from '@definedTypes/TerminationEntity/TerminationEntity';

import { getSapiRest } from '../getSapiRest';

export interface PdfCreateFileTerminationEntityResponse extends AppHttpResponse {}

export const sapiPdfCreateFileTerminationEntity = async (
  terminationEntity: PDFEntity,
): Promise<PdfCreateFileTerminationEntityResponse> => {
  const sapiRest = await getSapiRest();
  const response = await sapiRest.post('/template/render/pfp/pdf/general/terminate2025', terminationEntity, {
    responseType: 'arraybuffer', // Ensure we get raw binary data
  });
  return {
    status: response.status,
    success: response.status === 200,
    _response: response,
  };
};
