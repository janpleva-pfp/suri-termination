// import { CrmClientStepType, MarketingIdsBrand } from '@app/enums';

/**
 * '1990-01-31'
 */
export type DateString = string;
export type DateTimeString = string;
/**
 * '13:35'
 */
export type TimeHoursMinutesString = string;

export interface TrackingParams {
  gclid: string | undefined;
  googleclientid: string | undefined;
  googleSessionId: string | undefined;
  'pfp-uid': string | undefined;
  'utm-source': string | undefined;
  'utm-medium': string | undefined;
  'utm-campaign': string | undefined;
  // 'client-step'?: CrmClientStepType;
  crmNoOpp?: boolean;
  dataLink?: string;
  feSettings?: string;
  versionVop?: string;
}

export interface ErrorOut<T> {
  data: T;
}

export interface MarketingIds {
  API_KEY: string;
  GTM: '';
  MEASUREMENT_ID: '';
  SKLIK: '';
  UA: '';
}

export type GaConfig = {
  // [key in MarketingIdsBrand]: MarketingIds;
};

export interface IOauthToken {
  access_token?: string;
  expires_in?: Date | null;
  token_type?: string;
  scope?: string;
  jti?: string;
}

export type TranslationFunction = (value: string, options?: Record<string, string | number>) => string;

export interface InsuranceFeatureFlag {
  type: string;
  enabled: boolean;
}

export type LogFunction = (logName: string, labels: string[], additionalData?: any, isCritical?: boolean) => void;
