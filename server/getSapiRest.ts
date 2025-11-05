import { getRestUrl } from '../config/config';

import { createAxiosInstance } from './createAxiosInstance';

export const getSapiRest = async () => {
  return await createAxiosInstance({
    baseURL: getRestUrl(),
  });
};
