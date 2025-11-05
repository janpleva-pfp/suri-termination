import { NextApiRequest, NextApiResponse } from 'next';

import { sapiGetInsuranceCompaniesOptions } from '@app/server/api/sapiGetInsuranceCompaniesOptions';
export default async function healthCheck(req: NextApiRequest, res: NextApiResponse) {
  try {
    const result = await sapiGetInsuranceCompaniesOptions();
    res.status(200).json({ status: 'ok', data: result.data, env: process.env.CONTENT_ENV });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error, env: process.env.CONTENT_ENV });
  }
}
