/* eslint-disable no-undef */
// import { getInitialParentSettings, isDataInaccurate } from '@app/helpers/appStateHelper';
import React, {
  createContext,
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useState,
} from 'react';

import { getWebsiteFromDomain } from '@pfp/frontend-platform';
import getConfig from 'next/config';
import { useRouter } from 'next/router';

import {
  DEFAULT_PARENT_SETTINGS,
  TE_DEFAULT_PRODUCT,
  TE_DEFAULT_TYPE,
  TE_DEFAULT_WEBSITE,
  WEBSITES,
} from '@app/constants';
import { FormDataIn } from '@app/sdk/bo/fe/forms';

import { TerminationEntity } from '../types/TerminationEntity/TerminationEntity';
const { publicRuntimeConfig: _publicRuntimeConfig } = getConfig();
export interface AppState {
  linkBuilderData?: TerminationEntity;
  pdf?: {
    pdfData: string;
    fileOutsideUrl?: string;
  };
  formData?: FormDataIn;
  isLoading?: boolean;
}
export enum ActionType {
  InitStore = 'init_store',
  UpdateStore = 'update_store',
  ResetStore = 'reset_store',
  UpdateParentSettings = 'update_parent_settings',
}
export interface AppStateAction {
  type: ActionType;
  payload: AppState;
}
export const initialState: AppState = {
  formData: {
    initialized: false,
    parentSettings: {
      affiliate: undefined,
      email: undefined,
      experimentId: undefined,
      experimentVariant: undefined,
      gclid: undefined,
      googleClientId: undefined,
      googleSessionId: undefined,
      linkId: undefined,
      pfpUid: undefined,
      subProductName: undefined,
      utmCampaign: undefined,
      utmMedium: undefined,
      utmSource: undefined,
      website: undefined,
      type: undefined,
      crmNoOpp: undefined,
    },
    termination: {
      insuranceCompany: '',
    },
  },
  isLoading: true,
};

export const AppReducer = (state: AppState, action: AppStateAction): AppState => {
  switch (action.type) {
    case ActionType.InitStore: {
      return {
        formData: {
          ...action.payload.formData,
          initialized: true,
        },
        ...(action.payload.pdf ? { pdf: action.payload.pdf } : {}),
        linkBuilderData: action.payload.linkBuilderData,
      };
    }
    case ActionType.UpdateStore: {
      return {
        ...state,
        formData: {
          ...state.formData,
          ...action.payload.formData,
        },
        ...(action.payload.pdf ? { pdf: action.payload.pdf } : {}),
        linkBuilderData: {
          type: TE_DEFAULT_TYPE,
          ...state.linkBuilderData,
          ...action.payload.linkBuilderData,
          website: action.payload.linkBuilderData?.website ?? state.linkBuilderData?.website ?? TE_DEFAULT_WEBSITE,
          product: action.payload.linkBuilderData?.product ?? state.linkBuilderData?.product ?? TE_DEFAULT_PRODUCT,
          data: action.payload.linkBuilderData?.data ?? state.linkBuilderData?.data ?? ({} as any),
        },
      };
    }
    case ActionType.ResetStore: {
      return {
        formData: {
          ...initialState.formData,
          parentSettings: state.formData?.parentSettings,
        },
        pdf: undefined,
        linkBuilderData: undefined,
      };
    }
    case ActionType.UpdateParentSettings: {
      return {
        ...state,
        formData: {
          ...state.linkBuilderData,
          ...state.formData,
          parentSettings: {
            ...state.formData?.parentSettings,
            ...action.payload.formData?.parentSettings,
          },
        },
      };
    }
    default:
      return state;
  }
};

export interface AppStateContextProps {
  appState: AppState;
  isFormDataInitialized?: boolean;
  isSuri: boolean;
  website: string;
  dispatch: React.Dispatch<AppStateAction>;
  isLocalStorageEmpty: boolean;
}

const AppStateContext = createContext<AppStateContextProps>({} as AppStateContextProps);

export const AppStateProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const router = useRouter();
  const [state, dispatch] = useReducer(AppReducer, initialState);
  const [isLocalStorageEmpty, _setIsLocalStorageEmpty] = useState<boolean>(false);

  // Memoize the dispatch function to prevent unnecessary re-renders
  const memoizedDispatch = useCallback(dispatch, []);

  // Memoize website calculation to prevent recalculation on every render
  const website = useMemo(() => {
    return router.query['website']?.toString() || (getWebsiteFromDomain() as string);
  }, [router.query]);

  // Memoize derived values to prevent recalculation
  const derivedWebsite = useMemo(() => {
    return state?.formData?.parentSettings?.website || website || DEFAULT_PARENT_SETTINGS.website;
  }, [state?.formData?.parentSettings?.website, website]);

  const isSuri = useMemo(() => {
    return derivedWebsite === WEBSITES.SURI;
  }, [derivedWebsite]);

  const isFormDataInitialized = useMemo(() => {
    return state?.formData?.initialized;
  }, [state?.formData?.initialized]);

  // Memoize the complete context value to prevent object recreation
  const contextValue = useMemo(
    () => ({
      appState: state,
      isFormDataInitialized,
      website: derivedWebsite,
      isSuri,
      dispatch: memoizedDispatch,
      isLocalStorageEmpty,
    }),
    [state, isFormDataInitialized, derivedWebsite, isSuri, memoizedDispatch, isLocalStorageEmpty],
  );

  return <AppStateContext.Provider value={contextValue}>{children}</AppStateContext.Provider>;
};
export function useAppState(): AppStateContextProps {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error(`'useAppState' must be used within the 'AppStateProvider'.`);
  }
  return context;
}
