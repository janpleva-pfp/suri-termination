import { sapiFetchTerminationEntityByLinkId } from './sapiLinkBuilderFetchTerminationEntityByLinkId';

describe('sapiLinkBuilderFetchTerminationEntityByLinkId', () => {
  it('should return TerminationEntity if linkId exists', async () => {
    const testLinkId: string = '38356665-9954-4371-af0d-160ef9b5b35c';
    const sapiResult = await sapiFetchTerminationEntityByLinkId(testLinkId);

    expect(sapiResult.data.linkId).toEqual(testLinkId);
    expect(sapiResult.success).toBe(true);
  });
});
