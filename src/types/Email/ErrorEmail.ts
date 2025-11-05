import { TerminationEntity } from '../TerminationEntity/TerminationEntity';

export type ErrorContext =
  | 'form-validation'
  | 'form-submit'
  | 'lb-create'
  | 'lb-update'
  | 'pdf-generation'
  | 'crm-update'
  | 'email-send'
  | 'unknown';

export interface ErrorEmailData {
  errorMessage: string;
  errorContext: ErrorContext;
  timestamp: string;
  linkId?: string;
  contractNumber?: string;
  website: string;
  linkBuilderData?: TerminationEntity;
  pdfUrl?: string;
}

export interface ErrorEmailRecipient {
  email: string;
  name?: string;
}

export interface ErrorEmailSender {
  email: string;
  name: string;
}

export interface ErrorEmailSubject {
  _type: 'static';
  value: string;
}

export interface ErrorEmailBody {
  _type: 'static';
  value: string;
}

export interface ErrorEmailAttachment {
  _type: 'link';
  fileName: string;
  link: string;
}

export interface ErrorEmailRequest {
  subject: ErrorEmailSubject;
  body: ErrorEmailBody;
  recipients: ErrorEmailRecipient[];
  sender: ErrorEmailSender;
  cc?: ErrorEmailRecipient[];
  bcc?: ErrorEmailRecipient[];
  headers?: string[];
  attachments?: ErrorEmailAttachment[];
  senderStyle?: 'reply-to' | 'from' | 'reply-to-from-specified';
}
