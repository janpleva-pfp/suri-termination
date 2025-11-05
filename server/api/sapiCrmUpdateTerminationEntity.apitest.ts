/* // import { TerminationEntity } from '@app/types/TerminationEntity/TerminationEntity';
// import { getSapiRest } from '../getSapiRest';
// import { AppHttpResponse } from '@app/types/api/AppHttpResponse';
// import { convertTerminationEntityToCrmTerminationEntity } from './utils/convertTerminationEntityToCrm';

import { TerminationEntity } from '@definedTypes/TerminationEntity/TerminationEntity';

import { getNewTerminationEntityMock } from './__mocks__/getNewTerminationEntityMock';
import { sapiCrmUpdateTerminationEntity } from './sapiCrmUpdateTerminationEntity';

// export interface CrmUpdateTerminationEntityResponse extends AppHttpResponse {}

// export const sapiCrmUpdateTerminationEntity = async (
//   terminationEntity: TerminationEntity,
// ): Promise<CrmUpdateTerminationEntityResponse> => {
//   const sapiRest = await getSapiRest();
//   const crmTerminationEntity = convertTerminationEntityToCrmTerminationEntity(terminationEntity);
//   const response = await sapiRest.post('/sf-public/terminate-contract', crmTerminationEntity);
//   return {
//     status: response.status,
//     success: response.status === 200,
//     _response: response,
//   };
// };

// import { sapiLinkBuilderCreateTerminationEntity } from './sapiLinkBuilderCreateTerminationEntity';
// import { getNewTerminationEntityMock } from './__mocks__/getNewTerminationEntityMock';
// import { TerminationEntity } from '@app/types/TerminationEntity/TerminationEntity';

describe('sapiCrmUpdateTerminationEntity', () => {
  it('should create or update a new termination entity in CRM', async () => {
    const linkBuilderEntityMock: TerminationEntity = getNewTerminationEntityMock();
    const sapiResult = await sapiCrmUpdateTerminationEntity(linkBuilderEntityMock);
    expect(sapiResult.success).toBe(true);
  });
});
 */
