import getConfig from 'next/config';

import { LOG_LABEL, SEVERITY_ERROR, SEVERITY_INFO } from '@app/constants';
import { IOauthToken } from '@app/sdk/bo/fe/misc';
import { isTokenExpired } from '@app/src/utils/helpers';

import { logger } from './log';
const clientId = process.env.OAUTH_CLIENT_ID;
const grantType = 'client_credentials';
const clientSecret = process.env.OAUTH_CLIENT_SECRET;
const scope = 'public';
const { publicRuntimeConfig } = getConfig();
let url = publicRuntimeConfig?.apiBaseUrl;
let cachedToken: IOauthToken | null = null;
const getOAuthTokenAsync = async (): Promise<IOauthToken> => {
  const result: IOauthToken = {
    access_token: '',
    token_type: '',
    expires_in: null,
    scope: '',
    jti: '',
  };
  try {
    const data = await fetch(`${url}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encodeURI(`grant_type=${grantType}&scope=${scope}&client_id=${clientId}&client_secret=${clientSecret}`),
    });
    if (data.ok) {
      const authToken = await data.json();
      result.access_token = authToken.access_token;
      result.token_type = authToken.token_type;
      result.expires_in = new Date(Date.now() + authToken?.expires_in * 1000);
      result.scope = authToken.scope;
      result.jti = authToken.jti;
    }
    return result;
  } catch (e) {
    // eslint-disable-next-line no-console
    logger.log(SEVERITY_ERROR, 'getOAuthTokenAsync() failed with error:', e);
    return result;
  }
};
export const getCachedToken = async (): Promise<IOauthToken | null> => {
  if (isTokenExpired(cachedToken)) {
    const token = await getOAuthTokenAsync();
    logger.log(SEVERITY_INFO, `[${LOG_LABEL.BE}, access-token] - auth token expired, fetched a new one`, {
      oldToken: cachedToken,
      newToken: token,
      version: process.env.npm_package_version || 'unknown',
    });
    cachedToken = token;
  }
  return cachedToken || null;
};
