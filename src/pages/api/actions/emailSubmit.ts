import type { NextApiRequest, NextApiResponse } from 'next';

import { SEVERITY_ERROR, SEVERITY_INFO } from '@app/constants';
import { sapiCrmSendEmail } from '@app/server/api/sapiCrmSendEmail';
import { sapiGetInsuranceCompaniesOptions } from '@app/server/api/sapiGetInsuranceCompaniesOptions';
import { prepareEmailObject } from '@app/src/lib/emailHelper';
import { EmailRecipientType, EmailType } from '@app/src/types/Email/EmailRequest';
import { TerminationEntity } from '@app/src/types/TerminationEntity/TerminationEntity';
import { logObjectOneLevel } from '@app/src/utils/devlogger';

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
    // Log the incoming request body for debugging without pdf content
    const { pdfBase64Content, ...restBody } = request.body;

    logger.log(SEVERITY_INFO, '[api-emailSubmit] Submitting email', logObjectOneLevel(restBody));

    const {
      emailAction,
      emailTo,
      terminationData,
    }: {
      emailAction: EmailType;
      emailTo: EmailRecipientType;
      terminationData: TerminationEntity;
    } = request.body;

    if (!emailAction || !emailTo || !terminationData) {
      return response.status(400).json({
        success: false,
        error: 'Missing required parameters: emailAction, emailTo, terminationData',
      });
    }

    // Get insurance companies if recipient is insurer
    let insuranceCompanies;
    if (emailTo === 'insurer') {
      const insuranceCompaniesResponse = await sapiGetInsuranceCompaniesOptions();
      insuranceCompanies = insuranceCompaniesResponse._response?.data?.data;
    }

    // Prepare email object
    devlogger.log('Preparing email object with:', {
      emailAction,
      emailTo,
      terminationData,
      'pdfBase64Content present': !!pdfBase64Content,
      insuranceCompanies,
    });
    const emailObject = await prepareEmailObject(
      emailAction,
      emailTo,
      terminationData,
      pdfBase64Content,
      insuranceCompanies,
    );
    if (!emailObject) {
      logger.log(SEVERITY_ERROR, '[api-emailSubmit] Failed to prepare email object');
      return response.status(400).json({
        success: false,
        error: 'Failed to prepare email object - recipient email not found',
      });
    }
    const { data, email, ...rest } = emailObject;
    logger.log(SEVERITY_INFO, `[api-emailSubmit] Prepared email object for action: ${emailAction}`, {
      data: logObjectOneLevel(data),
      email: logObjectOneLevel(email),
      ...rest,
    });

    // Send email via CRM
    const emailResponse = await sapiCrmSendEmail(emailObject);

    if (emailResponse.status !== 200) {
      logger.log(
        SEVERITY_ERROR,
        `[api-emailSubmit] Email ${emailAction} submission FAILED - Email response`,
        emailResponse,
      );
      return response.status(emailResponse.status).json({
        success: 500,
        error: 'Failed to send email',
        details: emailResponse._response,
      });
    }
    logger.log(
      SEVERITY_INFO,
      `[api-emailSubmit] Email ${emailAction} sent successfully - Email response`,
      logObjectOneLevel(emailResponse),
    );
    return response.status(200).json({
      status: 200,
      data: {
        emailType: emailAction,
        recipientType: emailTo,
        recipient: emailObject.email.recipients[0].email,
      },
    });
  } catch (error) {
    return response.status(500).json({
      success: 500,
      error: 'Internal server error',
    });
  }
}
