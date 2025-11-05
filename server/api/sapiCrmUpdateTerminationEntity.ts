import { SEVERITY_ERROR, SEVERITY_INFO } from '@app/constants';
import { logger } from '@app/src/pages/api/log';
import { AppHttpResponse } from '@definedTypes/api/AppHttpResponse';
import { CrmTerminationEntity } from '@definedTypes/TerminationEntity/TerminationEntity';

import { getSapiRest } from '../getSapiRest';

export interface CrmUpdateTerminationEntityResponse extends AppHttpResponse {}

export const sapiCrmUpdateTerminationEntity = async (
  terminationEntity: CrmTerminationEntity,
): Promise<CrmUpdateTerminationEntityResponse> => {
  try {
    const sapiRest = await getSapiRest();
    logger.log(
      SEVERITY_INFO,
      '[sapi - sapiCrmUpdateTerminationEntity] Updating termination entity in CRM:',
      terminationEntity,
    );
    const response = await sapiRest.post('/sf-public/terminate-contract', terminationEntity);
    return {
      status: response.status,
      success: response.status === 200,
      _response: response,
    };
  } catch (error: any) {
    logger.log(
      SEVERITY_ERROR,
      '[sapi - sapiCrmUpdateTerminationEntity] Error updating termination entity in CRM:',
      error,
    );
    return {
      status: 500,
      success: false,
      _response: error.response || null,
    };
  }
};
