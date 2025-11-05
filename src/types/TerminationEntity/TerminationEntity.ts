import { Agent } from '../Agent/Agent';
import { PolicyHolder, Provider } from '../main';

import { TerminationData } from './TerminationData';

export type TerminationReasons =
  | 'anniversaryOfInsuranceContract'
  | 'maxTwoMonthsFromChange'
  | 'oneMonthFromChange'
  | 'disabledVehicle'
  | 'changeOfOwnerCar'
  | 'vehicleStolen'
  | 'differentReason';
export interface TerminationEntity {
  linkId?: string; // ID odkazu
  type?: string; //'terminate2025'; // Typ požadavku
  website: string; //'suri.cz' | 'povinne-ruceni.com' | 'srovnator.cz'; // Web, ze kterého požadavek pochází
  affiliate?: string; // Affiliate, obsah cookie affiliate
  product: string; //'car';
  data?: TerminationData;
  properties?: {
    agent?: Agent; // Agent, pokud je k dispozici
    callFrom?: string; // Zdroj v CRM
  };
  trackingParams?: {
    pfpUid?: string; // UUID z cookie pfp-uid
  };
  signature?: string; // Base64 podpis
}
export interface PDFEntity {
  name?: string; // terminate2025
  type?: string; //'PDF/HTML'; // Typ požadavku
  website?: string; //'suri.cz' | 'povinne-ruceni.com' | 'srovnator.cz'; // Web, ze kterého požadavek pochází
  affiliate?: string; // Affiliate, obsah cookie affiliate
  product: string; //'car';
  parameters: TerminationData & { signDate?: string; signatureImg?: string };
  properties?: {
    agent?: Agent; // Agent, pokud je k dispozici
    callFrom?: string; // Zdroj v CRM
  };
  trackingParams?: {
    pfpUid?: string; // UUID z cookie pfp-uid
  };
}

export type PolicyHolderTypes = 'person' | 'self-employed' | 'company' | '';
export interface CrmTerminationEntity {
  type: string;
  product: string;
  website: string;
  contractNumber: string;
  contractTerminationReason: TerminationReasons;
  differentReason?: string;
  needAttachment?: string;
  terminationFileUrl?: string;
  terminationFileTime?: string;
  policyHolder?: PolicyHolder;
  overpaymentSendTo?: string;
  provider?: Provider;
  properties?: {
    agent?: {
      username?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
    };
    callFrom?: string;
  };
  terminationState: terminationStates;
  linkId: string;
}
export type apiActions =
  | 'lbNewTermination'
  | 'lbEditTermination'
  | 'lbGetTermination'
  | 'pdfGenerate'
  | 'getInsuranceCompanies'
  | 'crmCreateTermination'
  | 'emailSubmit'
  | 'sendErrorEmail';
export type terminationStates =
  | 'processed'
  | 'sentForSignature'
  | 'clientSelf'
  | 'clientSigned'
  | 'waitingDocuments'
  | 'sentToInsurer';
