import React, { createContext, ReactNode, useCallback, useContext, useMemo } from 'react';

import { UIContextProps, UIState } from '../types/AppState';

/**
 * UI State Context - Handles loading states, errors, and UI-specific state
 * Separated from main app state to reduce unnecessary re-renders
 */

export const UIContext = createContext<UIContextProps>({} as UIContextProps);

export const UIProvider: React.FC<{ children: ReactNode; initialTheme?: string }> = ({
  children,
  initialTheme = 'default',
}) => {
  const [uiState, setUIState] = React.useState<UIState>({
    isLoading: false,
    error: null,
    theme: initialTheme,
    isClient: false,
  });

  // Memoized setter functions to prevent recreating on every render
  const setLoading = useCallback((loading: boolean) => {
    setUIState((prev) => ({ ...prev, isLoading: loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setUIState((prev) => ({ ...prev, error }));
  }, []);

  const setTheme = useCallback((theme: string) => {
    setUIState((prev) => ({ ...prev, theme }));
  }, []);

  const setIsClient = useCallback((isClient: boolean) => {
    setUIState((prev) => ({ ...prev, isClient }));
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      uiState,
      setLoading,
      setError,
      setTheme,
      setIsClient,
    }),
    [uiState, setLoading, setError, setTheme, setIsClient],
  );

  return <UIContext.Provider value={contextValue}>{children}</UIContext.Provider>;
};

export const useUIState = (): UIContextProps => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUIState must be used within a UIProvider');
  }
  return context;
};
