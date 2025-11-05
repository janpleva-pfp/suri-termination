import { PolicyHolder } from '../PolicyHolder/PolicyHolder';
import { Provider } from '../Provider/Provider';
export interface LinkBuilderData {
  contractNumber: string;
  contractTerminationReason: string;
  differentReason: string;
  overpaymentSendTo: string;
  policyHolder: PolicyHolder;
  provider: Provider;
}
