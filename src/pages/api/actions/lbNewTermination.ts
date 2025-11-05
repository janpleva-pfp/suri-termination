import type { NextApiRequest, NextApiResponse } from 'next';

import { SEVERITY_ERROR, SEVERITY_INFO } from '@app/constants';
import { sapiLinkBuilderCreateTerminationEntity } from '@app/server/api/sapiLinkBuilderCreateTerminationEntity';
import { prepareTerminationObject } from '@app/src/lib/transformDataLB';
import { logObjectOneLevel } from '@app/src/utils/devlogger';

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
    const terminationEntity = await prepareTerminationObject(request.body.data);
    logger.log(SEVERITY_INFO, '[api-lbNewTermination] terminationEntity', terminationEntity);
    const terminationEntityResponse = await sapiLinkBuilderCreateTerminationEntity(terminationEntity);
    const linkId = terminationEntityResponse._response?.data.linkId;
    logger.log(
      SEVERITY_INFO,
      '[api-lbNewTermination] terminationEntityResponse',
      logObjectOneLevel(terminationEntityResponse),
    );
    devlogger.log('[api-lbNewTermination] terminationEntityResponse', terminationEntityResponse);
    return response.status(200).json({
      status: 'success',
      data: {
        data: { ...terminationEntity, linkId },
        id: terminationEntityResponse._response?.data?.linkId,
      },
    });
  } catch (error) {
    logger.log(SEVERITY_ERROR, '[api-lbNewTermination] Error creating termination entity:', error);
    return response.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}
