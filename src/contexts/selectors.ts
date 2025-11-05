import { useMemo } from 'react';

import { useAppState } from './appStateContext';
import { useFormState } from './formContext';
import { useUIState } from './uiContext';

/**
 * Optimized Context Selectors - Use these hooks to subscribe only to specific parts of state
 * This prevents unnecessary re-renders when unrelated state changes
 */

// AppState selectors
export const useAppStateSelector = <T>(selector: (state: any) => T): T => {
  const { appState } = useAppState();
  return useMemo(() => selector(appState), [appState, selector]);
};

export const useFormDataOnly = () => {
  return useAppStateSelector((state) => state.formData);
};

export const usePdfDataOnly = () => {
  return useAppStateSelector((state) => state.pdf);
};

export const useLinkBuilderDataOnly = () => {
  return useAppStateSelector((state) => state.linkBuilderData);
};

export const useWebsiteOnly = () => {
  const { website } = useAppState();
  return website;
};

export const useIsSuriOnly = () => {
  const { isSuri } = useAppState();
  return isSuri;
};

// Form state selectors
export const useFormSubmissionState = () => {
  const { formState } = useFormState();
  return useMemo(
    () => ({
      isSubmitting: formState.isSubmitting,
      submitCount: formState.submitCount,
      lastSubmitTime: formState.lastSubmitTime,
    }),
    [formState.isSubmitting, formState.submitCount, formState.lastSubmitTime],
  );
};

export const useFormValidationState = () => {
  const { formState } = useFormState();
  return useMemo(
    () => ({
      isDirty: formState.isDirty,
      isValid: formState.isValid,
    }),
    [formState.isDirty, formState.isValid],
  );
};

// UI state selectors
export const useLoadingState = () => {
  const { uiState } = useUIState();
  return uiState.isLoading;
};

export const useErrorState = () => {
  const { uiState } = useUIState();
  return uiState.error;
};

export const useThemeState = () => {
  const { uiState } = useUIState();
  return uiState.theme;
};

export const useClientState = () => {
  const { uiState } = useUIState();
  return uiState.isClient;
};

// Combined selectors for common use cases
export const useFormAndUIState = () => {
  const { formState } = useFormState();
  const { uiState } = useUIState();

  return useMemo(
    () => ({
      isSubmitting: formState.isSubmitting,
      isLoading: uiState.isLoading,
      error: uiState.error,
      isValid: formState.isValid,
    }),
    [formState.isSubmitting, formState.isValid, uiState.isLoading, uiState.error],
  );
};
