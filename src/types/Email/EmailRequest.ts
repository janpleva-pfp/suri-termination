import { TerminationEntity } from '../TerminationEntity/TerminationEntity';

export type EmailType =
  | 'linkToClient'
  | 'instructionsToClient'
  | 'terminateToInsurer'
  | 'completionToClient'
  | 'terminateToBackoffice'
  | 'transferNotifyToClient';

export type EmailRecipientType = 'client' | 'insurer' | 'clientService';

export interface EmailRecipient {
  email: string;
}

export interface EmailSender {
  email: string;
  name: string;
}

export interface EmailSubject {
  _type: 'static';
  value: string;
}

export interface EmailBody {
  _type: 'template';
  path?: string;
  parameters?: any;
}

export interface EmailAttachment {
  _type: 'link' | 'base64file' | 'template';
  fileName: string;
  link?: string;
  encodedFile?: string; // base64 encoded content for base64file type
  contentType?: string; // MIME type, e.g., 'application/pdf'
  securityHash?: string;
  path?: string;
  version?: string;
  type?: 'PDF' | 'XLS';
  parameters?: any;
}

export interface EmailObject {
  senderStyle?: 'reply-to';
  recipients: EmailRecipient[];
  bcc?: string[];
  sender: EmailSender;
  headers?: string[];
  subject: EmailSubject;
  body: EmailBody;
  attachments?: EmailAttachment[];
}

export interface EmailDataForCRM {
  contractNumber?: string;
  provider?: {
    companyIdentificationNumber?: string;
  };
  policyHolder?: {
    type?: string;
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
  };
}

export interface ObjectEmailRequest {
  objectType: 'terminate2025';
  emailType: EmailType;
  linkToObject?: boolean;
  securityHash: string;
  data: EmailDataForCRM;
  email: EmailObject;
}

export interface EmailSubmitParams {
  emailAction: EmailType;
  emailTo: EmailRecipientType;
  terminationData: TerminationEntity;
  pdfFileUrl?: string;
  insuranceCompanyEmail?: string;
  websiteEmail?: string;
}
