import type { NextApiRequest, NextApiResponse } from 'next';

import { SEVERITY_ERROR, SEVERITY_INFO } from '@app/constants';
import { ErrorEmailData } from '@app/src/types/Email/ErrorEmail';

import { logger } from '../log';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  logger.log(SEVERITY_INFO, 'Request method - SEND ERROR EMAIL:', method);
  switch (method) {
    case 'POST':
      return handlePost(req, res);
    default:
      res.setHeader('Allow', ['POST']);
      devlogger.log('request method not supported', method);
      return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
}

async function handlePost(request: NextApiRequest, response: NextApiResponse) {
  try {
    const errorData: ErrorEmailData = request.body.errorData;
    logger.error(
      SEVERITY_ERROR,
      'TERMINATE_API_FAILURE',
      errorData ? errorData : 'Error email requested but no error data provided',
    );

    return response.status(200).json({
      status: 'success',
      data: {},
    });
  } catch (error) {
    logger.log(SEVERITY_ERROR, '[api-sendErrorEmail] API error', { error, requestBody: request.body });
    return response.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}
