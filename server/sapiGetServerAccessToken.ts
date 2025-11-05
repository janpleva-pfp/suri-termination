import axios from 'axios';

import { SEVERITY_ERROR } from '@app/constants';
import { logger } from '@app/src/pages/api/log';
import { getRestUrl } from '@config/config';
import { AccessToken } from '@definedTypes/AccessToken';

export const sapiGetServerAccessToken = async (): Promise<AccessToken> => {
  const clientId = process.env.OAUTH_CLIENT_ID;
  const grantType = 'client_credentials';
  const clientSecret = process.env.OAUTH_CLIENT_SECRET;
  const scope = 'public';
  if (!clientId || !clientSecret) {
    throw new Error('OAuth client ID or client secret is not defined in environment variables');
  }
  const data = `grant_type=${grantType}&scope=${scope}&client_id=${clientId}&client_secret=${clientSecret}`;
  try {
    const baseURL = getRestUrl();
    const axiosInstance = await axios.create();
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${baseURL}/oauth/token`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: 'CookieConsentPolicy=0:1; LSKey-c$CookieConsentPolicy=0:1',
      },
      data: data,
    };
    const res = await axiosInstance.request(config);
    if (!res.data.access_token) {
      logger.log(SEVERITY_ERROR, '[sapi - sapiGetServerAccessToken] Access token not found in response:', {
        clientId,
        baseURL,
        responseData: res.data,
      });
      throw new Error('[sapi - sapiGetServerAccessToken] Access token not found in response');
    }

    return res.data as AccessToken;
  } catch (error: any) {
    logger.log(SEVERITY_ERROR, '[sapi - sapiGetServerAccessToken] OAuth token request failed:', {
      clientId,
      baseURL: getRestUrl(),
      error: error.response?.data || error.message,
      status: error.response?.status,
    });
    throw error; // Re-throw instead of returning error as AccessToken
  }
};
