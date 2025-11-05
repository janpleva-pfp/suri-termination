import type { NextApiRequest, NextApiResponse } from 'next';

import { SEVERITY_ERROR } from '@app/constants';
import { sapiCrmUpdateTerminationEntity } from '@app/server/api/sapiCrmUpdateTerminationEntity';
import { prepareCRMTerminationObject } from '@app/src/lib/transformDataLB';
import { restDataRequest } from '@app/src/types/api/AppHttpResponse';

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
    const body = request.body as restDataRequest;
    if (!body.lbData || !body.deciderActions) {
      logger.log(SEVERITY_ERROR, '[api-crmCreateTermination] Missing lbData or deciderActions in request body:', body);
      throw new Error('Missing lbData or deciderActions in request body');
    }
    const terminationEntity = prepareCRMTerminationObject(body.lbData, body.deciderActions, body.fileData);
    if (!terminationEntity.linkId) {
      logger.log(
        SEVERITY_ERROR,
        '[api-crmCreateTermination] Missing linkId in prepared termination entity:',
        terminationEntity,
      );
      throw new Error('Missing linkId in request body for editing termination entity');
    }
    const terminationEntityResponse = await sapiCrmUpdateTerminationEntity(terminationEntity);
    const apiResponseData = terminationEntityResponse._response?.data;
    devlogger.log('[api-crmCreateTermination] API RESPONSE DATA', terminationEntityResponse);
    return response.status(200).json({
      status: 'success',
      data: {
        data: apiResponseData,
        id: apiResponseData?.linkId,
      },
    });
  } catch (error) {
    logger.log(SEVERITY_ERROR, '[api-crmCreateTermination] Error creating termination entity:', error);
    return response.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}
