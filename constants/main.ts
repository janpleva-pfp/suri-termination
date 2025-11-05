// Localstorage
import { BasicInfoIn, UserIn } from '@app/sdk/bo/fe/forms';

export const LOCALSTORAGE_APP_STATE_KEY = 'srovnator_app_state';
export const LOCALSTORAGE_LAST_STEP_KEY = 'srovnator_last_step';
export const LOCALSTORAGE_LAST_UPDATE_KEY = 'srovnator_last_update';
export const ACCESS_TOKEN_KEY = 'rn_access_token';
export const LOCAL_STORAGE_APP_DOMAIN_KEY = 'srovnator_domain';

// Some insurance companies require the birth number to return quotes
export const INSURANCE_COMPANIES_BIRTH_NUMBER_REQUIRED = [];

export const INSURANCE_COMPANIES_WITHOUT_PRICE: string[] = [];

// Skla, Střet se zvěří, Asistenční služby
export const FAVOURITE_COVERAGES = ['glass', 'animal', 'assistance', 'glassLimitless'];

// job titles used for company contact person for Kooperativa
export const JOB_TITLES = [
  'členka představenstva',
  'členka výboru',
  'člen představenstva',
  'člen výboru',
  'ekonom',
  'ekonomka',
  'generální ředitel',
  'generální ředitelka',
  'jednatel',
  'jednatelka',
  'místopředseda',
  'místopředsedkyně',
  'primátor',
  'primátorka',
  'prokurista',
  'prokuristka',
  'předseda',
  'předseda představenstva',
  'předsedkyně',
  'předsedkyně představenstva',
  'ředitel',
  'ředitelka',
  'společník',
  'starosta',
  'starostka',
  'účetní',
  'zástupce',
  'zástupkyně',
  'zplnomocněná',
  'zplnomocněný',
];

// roles used for company contact person for Uniqa
export const ROLES = [
  {
    label: 'Statutární orgán',
    value: 'STATUTORY_AUTHORITY',
  },
  {
    label: 'Zástupce pojistníka na základě plné moci',
    value: 'REPRESENTATIVE',
  },
];

export const GOOGLE_CLIENT_ID_REGEX = /^GA1.\d./g;

interface Websites {
  [key: string]: string;
}

export const WEBSITES: Websites = {
  SURI: 'suri.cz',
  SROVNATOR: 'srovnator.cz',
  POVCOM: 'povinne-ruceni.com',
};

export const DISABLED_PHONE_BRANDS: string[] = [];

export const DEFAULT_MARKETING_IDS = {
  API_KEY: '',
  GTM: '',
  MEASUREMENT_ID: '',
  POSTHOG: '',
  SKLIK: '',
  UA: '',
};

export const MARKETING_IDS = {
  [WEBSITES.SURI]: {
    GID: '5G8N5YD9BP',
    GTM: 'GTM-MMKM24',
    POSTHOG: 'phc_eMqVJlGSXh5FXCDH1hd4tdnaypfgRr021V2QSmxWwjp',
    SKLIK: '100068531',
    UA: 'UA-1832875-36',
  },
  [WEBSITES.SROVNATOR]: {
    GID: '80NR1S40CJ',
    GTM: 'GTM-PJCWLVW',
    POSTHOG: 'phc_rqWAQPXD1jsSbI63pQRP9pr2bDfPWRNsx5NC9Ls4ldW',
    SKLIK: '100068531',
    UA: 'UA-1832875-32',
  },
  [WEBSITES.POVCOM]: {
    GID: '60FLXD392F',
    GTM: 'GTM-54R655',
    POSTHOG: 'phc_8q3RZoeU9DOHsy2HvfIsT1AOvrphqCLUdL1yW1y8zCS',
    SKLIK: '100068533',
    UA: 'UA-1832875-1',
  },
  SURI_STAGING: {
    GID: 'WW2XWT734S',
    GTM: '',
    POSTHOG: 'phc_SuWomfSpsx24n8iHEzJhNj4ga09Q5I7AR8V2heCZW8o',
    SKLIK: '',
    UA: 'UA-1832875-46',
  },
};
export const WEBSITE_PROPS = {
  [WEBSITES.SURI]: {
    email: 'info@suri.cz',
    name: 'SURI.CZ',
    phoneInfo: '+420 226 289 779',
  },
  [WEBSITES.SROVNATOR]: {
    email: 'info@srovnator.cz',
    name: 'Srovnator.cz',
    phoneInfo: '+420 226 289 779',
  },
  [WEBSITES.POVCOM]: {
    email: 'info@povinne-ruceni.com',
    name: 'Povinne-ruceni.com',
    phoneInfo: '+420 226 289 779',
  },
};

export const RATING_BANNER_BRANDS = [WEBSITES.SROVNATOR];

export type VALIDATION_FORM_TYPES = BasicInfoIn | UserIn;

export const BIRTH_NUMBER_VALIDATION = {
  REQUIRED_AGE: 15,
  DIVIDING_DATE_BETWEEN_OLD_AND_NEW_FORMAT: new Date(1953, 11, 31, 23, 59, 59), // 31. Dec 1953
  NEW_FORMAT_LENGTH: 10,
  OLD_FORMAT_LENGTH: 9,
};

export const DEFAULT_PARENT_SETTINGS = {
  affiliate: '',
  googleClientId: '',
  googleSessionId: '',
  pfpUid: '',
  email: '',
  experimentId: '',
  experimentVariant: '',
  linkId: '',
  regPlate: '',
  utmCampaign: '',
  utmMedium: '',
  utmSource: '',
  subProductName: 'tplcic',
  website: WEBSITES.SURI,
  crmNoOpp: false,
};

export const DEFAULT_VEHICLE_PARENT_SETTINGS = {
  type: '',
  manufacturer: '',
  model: '',
  seats: '',
  capacity: '',
  power: '',
  yearOfConstruction: '',
  firstRegistered: '',
  weight: '',
  carValue: '',
  mileage: '',
  fuel: '',
};

export const AFFILIATES = {
  SAUTO: 'sauto',
};

export const DEFAULT_ADDRESS_COUNT = 50;

export const USER_UNKNOWN = 'unknown';
export const NOT_AVAILABLE = 'neni';
