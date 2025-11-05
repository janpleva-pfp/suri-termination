import { RuianAddress } from '@app/sdk/bo/fe/address';

export interface SelectOption {
  value: string;
  label: string;
}

export interface ZipTownOption {
  index: number;
  zip: string;
  town: string;
}

interface FormStep {
  isInitialStepComplete?: boolean;
}

export interface BasicInfoIn extends FormStep {
  userSameAsPolicyHolder?: boolean;
  ownerSameAsPolicyHolder?: boolean;
  policyHolder?: UserIn;
  user?: UserIn;
  owner?: UserIn;
  insuranceStart?: Date | null;
  // PG-6870 A/B test
  isCallbackChecked?: boolean;
}

export interface UserIn {
  title?: string | null;
  jobTitle?: string | null;
  role?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  age?: number | null;
  dateOfBirth?: Date | null;
  birthDate?: string | null;
  birthNumber?: string | null;
  isVatPayer?: boolean;

  town?: string | null;
  zip?: string | null;
  zipTown?: ZipTownOption | null;
  street?: string | null;
  districtHouseNo?: string | null;
  houseNo?: string | null;
  sameContactAddress?: boolean;
  ruianAddress?: RuianAddress | null;
  ruianId?: string;
  ruianContactAddress?: RuianAddress | null;
  contactZipTown?: ZipTownOption | null;
  contactStreet?: string | null;
  contactDistrictHouseNo?: string | null;
  contactHouseNo?: string | null;
  contactZip?: string | null;

  phonePrefix?: string | null;
  phone?: string | null;
  phoneNumber?: string | null;
  country?: string | null;
  // type?: UserType | null;

  // merkCompany?: Partial<MerkCompanyOut> | null;
}

export interface DraftAcceptContent {
  contractNumber: string;
  properties: {
    acceptCommunicationLogsId: string;
    paymentGatewayUrl: string;
    paymentDueInternal?: string;
    paymentDueInternalBankTransfer?: string;
  };
}

export interface ParentSettingsIn {
  affiliate?: string; // "REB-SKANSKA"
  email?: string; // "test@test.com"
  experimentId?: string; // "PDbKfKqYTzinYVhAbUYU2A"
  experimentVariant?: string; // "b"
  gclid?: string; // "Cj0KCQiAwyuBhDrARIsACf94RUXJce1tXEdgt40SbCosHUdLgzKMDCuP11h1"
  googleClientId?: string; // "426781404.1624779579.9"
  googleSessionId?: string; // "4267814044"
  linkId?: string; // "8712acbd-851f-4245-86a0-ee4d4b832500"
  pfpUid?: string; // "8712acbd-851f-4245-86a0-ee4d4b832500"
  regPlate?: string; // "1AB 2345"
  subProductName?: string; // "tpl|tplcic|cic"
  utmCampaign?: string; // "567"
  utmMedium?: string; // "890"
  utmSource?: string; // "123"
  website?: string; // "suri.cz"
  // Sauto parametry - affiliate=sauto
  type?: string; // "car|motorcycle|van|truck|campervan"
  manufacturer?: string;
  model?: string;
  seats?: string;
  capacity?: string;
  power?: string;
  yearOfConstruction?: string; // "YYYY"
  firstRegistered?: string; // "YYYY-MM-DD"
  // "i když není ve formuláři, pro některé pojišťovny je max. hmotnost cenotvorná, pro některé typy vozidel povinná"
  weight?: string;
  carValue?: string; // "cena s DPH pro havarijní pojištění"
  mileage?: string;
  fuel?: string; // "benzín=petrol|nafta=diesel|hybrid=hybrid|elektrický=electric|lpg=lpg"
  crmNoOpp?: boolean;
}

export interface FormDataIn {
  initialized?: boolean;
  basicInfo?: BasicInfoIn;
  parentSettings?: ParentSettingsIn;
  termination?: {
    insuranceCompany: string;
  };
}
