import React, { memo, ReactNode } from 'react';

import { AppStateProvider } from './appStateContext';
import { FormProvider } from './formContext';
import { UIProvider } from './uiContext';

/**
 * Combined Context Provider - Optimized composition of all contexts
 * Uses React.memo to prevent unnecessary re-renders and proper context layering
 */
interface CombinedProviderProps {
  children: ReactNode;
  initialTheme?: string;
}

const CombinedProviderComponent: React.FC<CombinedProviderProps> = ({ children, initialTheme }) => {
  return (
    <UIProvider initialTheme={initialTheme}>
      <FormProvider>
        <AppStateProvider>{children}</AppStateProvider>
      </FormProvider>
    </UIProvider>
  );
};

// Memoize the combined provider to prevent unnecessary re-renders
export const CombinedProvider = memo(CombinedProviderComponent);

// Export individual providers for selective usage
export { AppStateProvider } from './appStateContext';
export { FormProvider } from './formContext';
export { UIProvider } from './uiContext';

// Export hooks
export { useAppState } from './appStateContext';
export { useFormState } from './formContext';
export { useUIState } from './uiContext';

// Export optimized selectors
export * from './selectors';

// Export types
export type { AppState, AppStateAction, AppStateContextProps } from './appStateContext';
export type { FormState } from './formContext';
export type { UIState } from './uiContext';
