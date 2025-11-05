import { AxiosResponse } from 'axios';

import { EmailRecipientType, EmailType } from '../Email/EmailRequest';
import { ErrorEmailData } from '../Email/ErrorEmail';
import { ContractCancellationFormData, FinalStepDeciderResult } from '../Form/ContractCancellationForm';
import { apiActions, TerminationEntity } from '../TerminationEntity/TerminationEntity';
export interface AppHttpResponse {
  status: number;
  success: boolean;
  _response: AxiosResponse;
}
export type restDataRequest = {
  action: apiActions;
  linkId?: string;
  target?: 'agent' | 'client';
  data?: ContractCancellationFormData;
  lbData?: TerminationEntity;
  deciderActions?: FinalStepDeciderResult;
  fileData?: {
    fileUrl: string;
    fileTime: string;
  };
  // Email-specific parameters
  emailAction?: EmailType;
  emailTo?: EmailRecipientType;
  terminationData?: TerminationEntity;
  pdfBase64Content?: string;
  // Error email parameters
  errorData?: ErrorEmailData;
};
export type restDataResponse = {
  data?: any;
  error?: string | null;
  success?: boolean;
  status: number;
  id?: number | string;
};
