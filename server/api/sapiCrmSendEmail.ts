import { SEVERITY_ERROR, SEVERITY_INFO } from '@app/constants';
import { logger } from '@app/src/pages/api/log';
import { logObjectOneLevel } from '@app/src/utils/devlogger';
import { AppHttpResponse } from '@definedTypes/api/AppHttpResponse';
import { ObjectEmailRequest } from '@definedTypes/Email/EmailRequest';

import { getSapiRest } from '../getSapiRest';

export interface CrmSendEmailResponse extends AppHttpResponse {}

export const sapiCrmSendEmail = async (emailRequest: ObjectEmailRequest): Promise<CrmSendEmailResponse> => {
  try {
    const sapiRest = await getSapiRest();
    const response = await sapiRest.post('/sf-public/object-email', emailRequest);

    //create copy of emailRequest without email.attachments for logging

    const {
      email: { attachments, ...emailWithoutAttachments },
      ...logRequest
    } = emailRequest;
    logger.log(SEVERITY_INFO, '[sapi - sapiCrmSendEmail] CRM email send data:', {
      request: { ...logRequest, email: emailWithoutAttachments },
      response: logObjectOneLevel(response),
    });
    if (response.status !== 200) {
      logger.log(SEVERITY_ERROR, '[sapi - sapiCrmSendEmail] CRM email send failed:', response);
      throw new Error(`CRM email send failed with status ${response.status}`);
    }
    return {
      status: response.status,
      success: response.status === 200,
      _response: response,
    };
  } catch (error: any) {
    logger.log(SEVERITY_ERROR, '[sapi - sapiCrmSendEmail] Error sending email via CRM:', error);
    return {
      status: 500,
      success: false,
      _response: error.response || null,
    };
  }
};
