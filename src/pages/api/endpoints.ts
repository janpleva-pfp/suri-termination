import axios from 'axios';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const API_URL = publicRuntimeConfig?.apiBaseUrl;
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
// Set token
export const setApiToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};
// API endpointy
const endpoints = {
  // POST endpointy
  // GET endpointy
  allInsuranceCompanies: async () => {
    try {
      const response = await api.get('/content/insurance-companies');
      if (response.data && response.data.data && typeof response.data.data === 'object') {
        return Object.entries(response.data.data).map(([key, value]) => {
          const item = value as any;
          return {
            id: key,
            contentKey: key,
            name: item.name || '',
            nameFull: item.name || '',
            companyIdentificationNumber: item.IC || '',
          };
        });
      }
      return [];
    } catch (error) {
      devlogger.error('Error in getting insurance companies:', error);
      throw error;
    }
  },
  // Prepared for future link builder use
  getTerminationData: async (linkId: string) => {
    try {
      const response = await api.get(`/link-builder/link/${linkId}`);
      return response.data;
    } catch (error) {
      devlogger.error(`Chyba při získávání dat kontraktu ${linkId}:`, error);
      throw error;
    }
  },
};
export default endpoints;
