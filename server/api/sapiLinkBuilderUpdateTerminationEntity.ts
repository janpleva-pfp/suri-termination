import { TerminationEntity } from '@definedTypes/TerminationEntity/TerminationEntity';

import { getSapiRest } from '../getSapiRest';

export interface UpdateTerminationEntityResponse {
  data: TerminationEntity;
  success: boolean;
  response?: any;
}

export const sapiUpdateTerminationEntity = async (
  terminationEntity: TerminationEntity,
): Promise<UpdateTerminationEntityResponse> => {
  const sapiRest = await getSapiRest();
  const ret = await sapiRest.post(
    '/link-builder/generic/termination2025/' + terminationEntity.linkId,
    terminationEntity,
  );
  if (ret.status !== 200) {
    throw new Error(`Failed to create termination entity: ${ret.statusText}`);
  }
  return {
    data: terminationEntity,
    success: true,
    response: ret,
  };
};
