import { PolicyHolder } from '../PolicyHolder/PolicyHolder';
import { Provider } from '../Provider/Provider';

import { TerminationReasons } from './TerminationEntity';
export interface TerminationData {
  contractNumber?: string;
  contractTerminationReason?: TerminationReasons;
  differentReason?: string;
  overpaymentSendTo?: string;
  policyHolder: PolicyHolder;
  provider?: Provider;
}
