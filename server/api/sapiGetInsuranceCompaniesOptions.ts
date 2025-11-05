/**
 * @openapi operationId: getInsuranceCompanies
 * Endpoint to fetch insurance companies
 * Method: GET
 * Path: /insurance-company
 */
import { AxiosResponse } from 'axios';

import { SEVERITY_ERROR, SEVERITY_INFO } from '@app/constants';
import { logger } from '@app/src/pages/api/log';
import { AppHttpResponse } from '@definedTypes/api/AppHttpResponse';

import { InsuranceCompanyOption } from '../../src/types';
import { getSapiRest } from '../getSapiRest';

export interface InsuranceCompaniesOptionsResponse extends AppHttpResponse {
  data: InsuranceCompanyOption[];
}

export const sapiGetInsuranceCompaniesOptions = async (): Promise<InsuranceCompaniesOptionsResponse> => {
  try {
    logger.log(SEVERITY_INFO, '[sapiGetInsuranceCompaniesOptions] Fetching insurance companies options from SAPI');
    const sapiRest = await getSapiRest();
    const response: AxiosResponse = await sapiRest.get('/content/insurance-companies');
    const retValues = convertResponseDataToProviderList(response);
    const ret: InsuranceCompaniesOptionsResponse = {
      status: 200,
      success: true,
      _response: response,
      data: retValues,
    };
    return ret;
  } catch (error: any) {
    logger.log(SEVERITY_ERROR, '[sapiGetInsuranceCompaniesOptions] Failed to fetch insurance companies:', {
      error: error.message,
      status: error.response?.status,
      response: error.response
    });

    // Return empty data with error status to allow graceful degradation
    return {
      status: error.response?.status || 500,
      success: false,
      _response: error.response,
      data: [],
    };
  }
};

// -------------- UTILS -------------
export const convertResponseDataToProviderList = (res: AxiosResponse): InsuranceCompanyOption[] => {
  const keys = Object.keys(res.data.data);

  // NORMALIZE TO ARRAY
  const companies: any[] = keys.map((key) => ({
    ...res.data.data[key],
    contentKey: key,
  }));

  // FILTER
  const filteredCompanies = companies.filter(
    (company) => company?.gnv?.displayed && company?.companyIdentificationNumber,
  );

  // FORMAT TO OPTION
  const ret: InsuranceCompanyOption[] = filteredCompanies.map((company) => ({
    id: company.companyIdentificationNumber,
    name: company.name,
    contentKey: company.contentKey,
  }));
  // order ret alphabetically by name
  ret.sort((a, b) => a.name.localeCompare(b.name));
  return ret;
};
