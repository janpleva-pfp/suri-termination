import { useEffect, useState } from 'react';

/**
 * Shared hook for client-side detection to prevent hydration mismatches
 * Replaces individual isClient state in each component
 */
export const useClientSide = (): boolean => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
};
