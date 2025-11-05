import { LOG_LABEL } from '@app/constants';
import { IOauthToken, LogFunction } from '@app/sdk/bo/fe/misc';
import { HttpClient } from '@app/sdk/client/http-client';
export let globalTokenCache: IOauthToken | null = null;
export const nextApiClient = new HttpClient('/api');
export const isTokenExpired = (token?: IOauthToken | null): boolean => {
  return !token || !token.expires_in || new Date(token.expires_in) <= new Date();
};
export const checkTokenValidityAndLogErrors = (logError: LogFunction, token?: IOauthToken | null) => {
  if (!token) {
    logError('Token is missing', [LOG_LABEL.AUTH_TOKEN], { token });
  } else if (!token.expires_in) {
    logError('Token expires_in property missing', [LOG_LABEL.AUTH_TOKEN], { token });
  } else if (new Date(token.expires_in) <= new Date()) {
    logError('Token is expired', [LOG_LABEL.AUTH_TOKEN], { token });
  }
};
export const setTokenCache = (token: IOauthToken) => {
  globalTokenCache = token;
};
export const getAccessToken = async (): Promise<IOauthToken | null> => {
  if (isTokenExpired(globalTokenCache)) {
    // eslint-disable-next-line no-console
    try {
      const result = await nextApiClient.get('auth-token');
      const token = result.data?.accessToken || null;
      setTokenCache(token);
      return token;
    } catch (e) {
      return null;
    }
  }
  return globalTokenCache;
};
