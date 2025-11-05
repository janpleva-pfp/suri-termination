import type { NextApiRequest, NextApiResponse } from 'next';

import { SEVERITY_ERROR, SEVERITY_INFO } from '@app/constants';
import { sapiUpdateTerminationEntity } from '@app/server/api/sapiLinkBuilderUpdateTerminationEntity';
import { prepareTerminationObject } from '@app/src/lib/transformDataLB';

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
    logger.log(SEVERITY_INFO, '[api-lbEditTermination] request.body.data', request.body);
    const terminationEntity = await prepareTerminationObject(
      { ...request.body.data, linkId: request.body.linkId },
      request.body.lbData,
    );
    logger.log(SEVERITY_INFO, '[api-lbEditTermination] terminationEntity', terminationEntity);
    if (!terminationEntity.linkId) {
      throw new Error('Missing linkId in request body for editing termination entity');
    }
    const terminationEntityResponse = await sapiUpdateTerminationEntity(terminationEntity);
    const apiResponseData = terminationEntityResponse.data || terminationEntityResponse;
    devlogger.log('[Edit termination] terminationEntity', terminationEntityResponse);
    return response.status(200).json({
      status: 'success',
      data: {
        data: apiResponseData,
        id: terminationEntityResponse.data?.linkId,
      },
    });
  } catch (error) {
    logger.log(SEVERITY_ERROR, '[api-lbEditTermination] Error creating termination entity', error);
    return response.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}
