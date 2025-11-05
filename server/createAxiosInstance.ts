import axios, { AxiosInstance, CreateAxiosDefaults } from 'axios';
import jwt from 'jsonwebtoken';

import { SEVERITY_ERROR } from '@app/constants';
import { logger } from '@app/src/pages/api/log';
import { CachedAccessToken } from '@definedTypes/AccessToken';

import { sapiGetServerAccessToken } from './sapiGetServerAccessToken';
let cachedToken: CachedAccessToken | null = null;

const isTokenExpired = (token: CachedAccessToken): boolean => {
  // Add 5-minute buffer before actual expiry to avoid race conditions
  const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
  return Date.now() >= (token.expires_at - bufferTime);
};

const getValidAccessToken = async (): Promise<CachedAccessToken> => {
  if (!cachedToken || isTokenExpired(cachedToken)) {
    // parse token from server using jwt
    
    const newToken = await sapiGetServerAccessToken();
    const decoded = jwt.decode(newToken?.access_token);
    
    // Convert expires_in (seconds) to absolute timestamp
    const expiresAt = Date.now() + (newToken.expires_in * 1000);
    
    cachedToken = {
      ...newToken,
      expires_at: expiresAt
    };
    
    logger.log('info', '[createAxiosInstance] New access token obtained', {
      expires_in_seconds: newToken.expires_in,
      expires_at: new Date(expiresAt).toISOString()
    });
  }
  
  return cachedToken;
};

export const createAxiosInstance = async (config?: CreateAxiosDefaults): Promise<AxiosInstance> => {
  try {
    const ret = axios.create({
      ...config,
    });

    const accessToken = await getValidAccessToken();
    
    ret.interceptors.request.use(async function (config) {
      // Get fresh token for each request (in case it expired)
      const currentToken = await getValidAccessToken();
      const token = `Bearer ${currentToken.access_token}`;
      config.headers.Authorization = token;
      return config;
    });

    return ret;
  } catch (error) {
    logger.log(SEVERITY_ERROR, '[createAxiosInstance] Error creating Axios instance:', error);
    throw error;
  }
};
