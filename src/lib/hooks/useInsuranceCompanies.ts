import { useEffect, useRef, useState } from 'react';

import endpoints from '@app/src/pages/api/endpoints';
import type { InsuranceCompanyOption } from '@definedTypes';

interface UseInsuranceCompaniesReturn {
  insuranceCompanies: InsuranceCompanyOption[];
  isLoading: boolean;
  error: Error | null;
}
export const useInsuranceCompanies = (token: string | null): UseInsuranceCompaniesReturn => {
  const [insuranceCompanies, setInsuranceCompanies] = useState<InsuranceCompanyOption[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const fetchedRef = useRef(false);
  const fetchData = async () => {
    if (fetchedRef.current && insuranceCompanies.length > 0) {
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const companies = await endpoints.allInsuranceCompanies();
      setInsuranceCompanies(companies);
      fetchedRef.current = true;
    } catch (err) {
      // eslint-disable-next-line no-console
      devlogger.error('Error loading insurance companies:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);
  return {
    insuranceCompanies,
    isLoading,
    error,
  };
};
