import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
export const getRestUrl = () => {
  return publicRuntimeConfig?.apiBaseUrl;
};
