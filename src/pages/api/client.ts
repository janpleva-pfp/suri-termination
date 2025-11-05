// api/client.ts
import axios, { AxiosInstance } from 'axios';
import getConfig from 'next/config';

import { SEVERITY_ERROR } from '@app/constants';
import type { InsuranceCompanyOption } from '@definedTypes';

import { logger } from './log';

const { publicRuntimeConfig } = getConfig();
const API_LINK = publicRuntimeConfig?.apiBaseUrl;

export const createApiClient = (token: string): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_LINK,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      logger.log(SEVERITY_ERROR, 'API error:', error);
      return Promise.reject(error);
    },
  );
  return instance;
};
export const fetchInsuranceCompanies = async (apiClient: AxiosInstance): Promise<InsuranceCompanyOption[]> => {
  try {
    const response = await apiClient.get('/content/insurance-companies');
    if (response.data && response.data.data && typeof response.data.data === 'object') {
      const companies = Object.entries(response.data.data).map(([key, value]) => {
        const company = value as any;
        return {
          id: key,
          contentKey: key,
          name: company.name || '',
          nameFull: company.name || '',
          shortName: company.shortName || '',
          fullInfo: company.fullInfo || '',
          companyIdentificationNumber: company.IC || '',
        };
      });
      return companies;
    }
    // Původní zpracování pro jiné formáty
    if (Array.isArray(response.data)) {
      return response.data;
    }
    if (response.data && typeof response.data === 'object') {
      const possibleKeys = ['items', 'data', 'companies', 'results', 'content'];
      for (const key of possibleKeys) {
        if (Array.isArray(response.data[key])) {
          return response.data[key];
        }
      }
    }
    logger.log(SEVERITY_ERROR, 'Neočekávaný formát dat z API:', response.data);
    return [];
  } catch (error) {
    logger.log(SEVERITY_ERROR, 'Chyba při načítání pojišťoven:', error);
    throw error;
  }
};
/**
 * Získá data kontraktu podle UUID
 */
export const fetchLinkBuilderData = async (apiClient: AxiosInstance, linkId: string) => {
  try {
    const response = await apiClient.get(`/link-builder/link/${linkId}`);
    return response.data;
  } catch (error) {
    logger.log(SEVERITY_ERROR, 'Chyba při načítání dat pro link:', error);
    throw error;
  }
};
