import type { NextApiRequest, NextApiResponse } from 'next';

import { SEVERITY_ERROR, SEVERITY_INFO } from '@app/constants';
import { sapiFetchTerminationEntityByLinkId } from '@app/server/api/sapiLinkBuilderFetchTerminationEntityByLinkId';

import { logger } from '../log';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  switch (method) {
    case 'POST':
      return handlePost(req, res);
    default:
      res.setHeader('Allow', ['POST']);
      logger.log(SEVERITY_ERROR, 'request method not supported', method, req.method, req.body);
      return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
}

async function handlePost(request: NextApiRequest, response: NextApiResponse) {
  try {
    if (typeof request.body.linkId !== 'string' || request.body.linkId.trim() === '') {
      throw new Error('Invalid or missing linkId in request body');
    }

    logger.log(SEVERITY_INFO, '[api-lbGetTermination] LINK_ID', request.body.linkId);
    const terminationEntityResponse = await sapiFetchTerminationEntityByLinkId(request.body.linkId);

    const apiResponseData = terminationEntityResponse.data;
    devlogger.log('apiResponseData', apiResponseData);
    logger.log(SEVERITY_INFO, '[api-lbGetTermination] RESPONSE', apiResponseData);
    // Return format expected by apiRequest function
    return response.status(200).json({
      status: 'success',
      data: {
        data: apiResponseData,
        id: request.body.linkId,
      },
    });
  } catch (error) {
    logger.log(SEVERITY_ERROR, 'Error creating termination entity:', error);
    return response.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}
