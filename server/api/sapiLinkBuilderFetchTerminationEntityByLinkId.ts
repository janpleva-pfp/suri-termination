import { FetchTerminationEntityResponse } from '@app/src/types/TerminationEntity/FetchTerminationEntityResponse';
import { TerminationEntity } from '@definedTypes/TerminationEntity/TerminationEntity';

import { getSapiRest } from '../getSapiRest';

export const sapiFetchTerminationEntityByLinkId = async (linkId: string): Promise<FetchTerminationEntityResponse> => {
  const sapiRest = await getSapiRest();
  const ret = await sapiRest.get(`/link-builder/link/${linkId}`);
  const terminationEntity: TerminationEntity = { linkId, ...ret.data };
  return {
    data: terminationEntity,
    success: true,
    status: ret.status,
    _response: ret,
  };
};
