import { NextApiRequest, NextApiResponse } from 'next';

/* import { logger } from '@app/src/pages/old_api/log'; */
import { getCachedToken } from '@app/src/pages/api/token-cache';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const accessToken = await getCachedToken();
      res.status(200).json({ accessToken });
    } catch (error) {
      /* logger.log(
        SEVERITY_ERROR,
        `[${LOG_LABEL.BE}, ${LOG_LABEL.CRITICAL}, access-token] - failed to retrieve the access token`,
        {
          version: process.env.npm_package_version || 'unknown',
        },
      ); */
      res.status(500).json({ error: 'Failed to retrieve access token' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
export default handler;
