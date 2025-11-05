import { SEVERITY_ERROR, SEVERITY_INFO } from '@app/constants';
import { logger } from '@app/src/pages/api/log';
import { AppHttpResponse } from '@definedTypes/api/AppHttpResponse';
import { ErrorEmailRequest } from '@definedTypes/Email/ErrorEmail';

import { getSapiRest } from '../getSapiRest';

export interface SendErrorEmailResponse extends AppHttpResponse {
  emailId?: string;
}

export const sapiSendErrorEmail = async (emailRequest: ErrorEmailRequest): Promise<SendErrorEmailResponse> => {
  try {
    const sapiRest = await getSapiRest();
    logger.log(SEVERITY_INFO, 'Sending error email via pdf-service:', emailRequest.subject.value);
    const response = await sapiRest.post('/email/send', emailRequest);
    return {
      status: response.status,
      success: response.status === 200,
      emailId: response.data?.emailId,
      _response: response,
    };
  } catch (error: any) {
    logger.log(SEVERITY_ERROR, 'sapiSendErrorEmail error', { error, emailRequest });

    return {
      status: 500,
      success: false,
      _response: error.response || null,
    };
  }
};
