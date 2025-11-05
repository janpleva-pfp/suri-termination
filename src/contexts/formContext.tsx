import React, { createContext, ReactNode, useCallback, useContext, useMemo } from 'react';

import { FormContextProps, FormState } from '../types/AppState';

/**
 * Form State Context - Handles form-specific state separate from main app state
 * This helps reduce re-renders when only form state changes
 */

export const FormContext = createContext<FormContextProps>({} as FormContextProps);

const initialFormState: FormState = {
  isSubmitting: false,
  isDirty: false,
  isValid: false,
  submitCount: 0,
  lastSubmitTime: null,
};

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [formState, setFormState] = React.useState<FormState>(initialFormState);

  // Memoized setter functions
  const setSubmitting = useCallback((isSubmitting: boolean) => {
    setFormState((prev) => ({ ...prev, isSubmitting }));
  }, []);

  const setDirty = useCallback((isDirty: boolean) => {
    setFormState((prev) => ({ ...prev, isDirty }));
  }, []);

  const setValid = useCallback((isValid: boolean) => {
    setFormState((prev) => ({ ...prev, isValid }));
  }, []);

  const incrementSubmitCount = useCallback(() => {
    setFormState((prev) => ({ ...prev, submitCount: prev.submitCount + 1 }));
  }, []);

  const updateLastSubmitTime = useCallback(() => {
    setFormState((prev) => ({ ...prev, lastSubmitTime: Date.now() }));
  }, []);

  const resetFormState = useCallback(() => {
    setFormState(initialFormState);
  }, []);

  // Memoize context value
  const contextValue = useMemo(
    () => ({
      formState,
      setSubmitting,
      setDirty,
      setValid,
      incrementSubmitCount,
      updateLastSubmitTime,
      resetFormState,
    }),
    [formState, setSubmitting, setDirty, setValid, incrementSubmitCount, updateLastSubmitTime, resetFormState],
  );

  return <FormContext.Provider value={contextValue}>{children}</FormContext.Provider>;
};

export const useFormState = (): FormContextProps => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormState must be used within a FormProvider');
  }
  return context;
};
