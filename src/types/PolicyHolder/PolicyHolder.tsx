import { PolicyHolderTypes } from '../TerminationEntity/TerminationEntity';

export interface PolicyHolder {
  type?: PolicyHolderTypes;
  firstName?: string;
  lastName?: string;
  birthNumber?: string;
  companyName?: string;
  companyID?: string;
  street?: string;
  town?: string;
  zip?: string;
  bankAccount?: string;
  phoneNumber?: string;
  email?: string;
}
