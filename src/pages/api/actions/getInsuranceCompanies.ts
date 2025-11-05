import type { NextApiRequest, NextApiResponse } from 'next';

import { SEVERITY_ERROR, SEVERITY_INFO } from '@app/constants';
import { sapiGetInsuranceCompaniesOptions } from '@app/server/api/sapiGetInsuranceCompaniesOptions';

import { logger } from '../log';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  switch (method) {
    case 'POST':
      return handlePost(req, res);
    default:
      res.setHeader('Allow', ['POST']);
      logger.log(
        SEVERITY_INFO,
        '[api-getInsuranceCompanies] request method not supported',
        method,
        req.method,
        req.body,
      );
      return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
}

async function handlePost(request: NextApiRequest, response: NextApiResponse) {
  try {
    const terminationEntityResponse = await sapiGetInsuranceCompaniesOptions();
    const apiResponseData = terminationEntityResponse.data;

    // Return format expected by apiRequest function
    return response.status(200).json({
      status: 'success',
      data: {
        data: apiResponseData,
      },
    });
  } catch (error) {
    logger.log(SEVERITY_ERROR, '[api-getInsuranceCompanies] Error fetching insurance companies', error);
    return response.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}
