import { InsuranceCompanyOption } from '../InsuranceCompanyContent';
import { PolicyHolderTypes, TerminationReasons, terminationStates } from '../TerminationEntity/TerminationEntity';

export interface ContractCancellationFormData {
  linkId?: string; // Optional link ID for pre-filling data
  contractNumber: string;
  insuranceCompany: string;
  contractTerminationReason: TerminationReasons;
  differentReason?: string;
  policyHolderType: PolicyHolderTypes;
  firstName?: string;
  lastName?: string;
  birthNumber?: string;
  ico?: string;
  companyName?: string;
  companyID?: string;
  street: string;
  town: string;
  zip: string;
  phoneNumber: string;
  email: string;
  overpaymentSendTo: 'bankAccount' | 'otherAccount' | 'address';
  bankAccount?: string;
  signature?: string;
}
export type EmailActions = Array<{
  emailAction:
    | 'linkToClient'
    | 'instructionsToClient'
    | 'terminateToInsurer'
    | 'completionToClient'
    | 'terminateToBackoffice'
    | 'transferNotifyToClient';
  emailTo: 'clientService' | 'client' | 'insurer';
}>;

export interface ContractCancellationFormProps {
  token: string | null;
  insuranceCompanies?: InsuranceCompanyOption[];
  linkId?: string;
}
export type DeciderResult =
  | 'autoFinalization'
  | 'userFinalization'
  | 'documentsNeeded'
  | 'documentsForAuto'
  | 'dataError';
export type FinalStepDeciderResult =
  | {
      result: DeciderResult;
      terminationState: terminationStates;
      emailActions: EmailActions;
    }
  | { error: string };
export type SubmitAndRedirectParams = {
  routerParams?: { pathname: string; query?: Record<string, string> };
  deciderActions?: FinalStepDeciderResult;
};
