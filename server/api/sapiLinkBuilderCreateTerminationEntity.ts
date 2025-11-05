import { AppHttpResponse } from '@definedTypes/api/AppHttpResponse';
import { TerminationEntity } from '@definedTypes/TerminationEntity/TerminationEntity';

import { getSapiRest } from '../getSapiRest';

export interface CreateTerminationEntityResponse extends AppHttpResponse {
  data: TerminationEntity;
}

export const sapiLinkBuilderCreateTerminationEntity = async (
  terminationEntity: TerminationEntity,
): Promise<CreateTerminationEntityResponse> => {
  const sapiRest = await getSapiRest();
  const ret = await sapiRest.post('/link-builder/generic/termination2025', terminationEntity);
  if (ret.status !== 200) {
    throw new Error(`Failed to create termination entity: ${ret.statusText}`);
  }
  return {
    data: terminationEntity,
    status: ret.status,
    success: true,
    _response: ret,
  };
};
