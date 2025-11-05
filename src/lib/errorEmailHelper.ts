import crypto from 'crypto';

import { WEBSITE_PROPS } from '@app/constants/main';

import { ErrorEmailData, ErrorEmailRequest } from '../types/Email/ErrorEmail';

const ERROR_EMAIL_SENDER = 'alerting-noreply@google.com';
const ERROR_EMAIL_SUBJECT = 'Chyba v aplikaci výpověď';

/**
 * Generate unique hash for error to prevent duplicates
 */
export const generateErrorHash = (errorMessage: string, linkId?: string, context?: string): string => {
  const hashInput = `${errorMessage}-${linkId || 'no-link'}-${context || 'unknown'}`;
  return crypto.createHash('md5').update(hashInput).digest('hex');
};

/**
 * Format error email body as plain text
 */
export const formatErrorEmailBody = (errorData: ErrorEmailData): string => {
  const { errorMessage, errorContext, timestamp, linkId, contractNumber, website, linkBuilderData, pdfUrl } = errorData;

  let body = '';

  // Header
  body += '='.repeat(60) + '\n';
  body += 'CHYBA V APLIKACI VÝPOVĚĎ\n';
  body += '='.repeat(60) + '\n\n';

  // Basic Info
  body += 'ČAS: ' + timestamp + '\n';
  body += 'KONTEXT: ' + errorContext + '\n';
  body += 'CHYBOVÁ ZPRÁVA: ' + errorMessage + '\n\n';

  // Contract Details
  if (contractNumber || linkId) {
    body += '-'.repeat(60) + '\n';
    body += 'ÚDAJE O SMLOUVĚ\n';
    body += '-'.repeat(60) + '\n';
    if (contractNumber) body += 'Číslo smlouvy: ' + contractNumber + '\n';
    if (linkId) body += 'Link ID: ' + linkId + '\n';
    body += 'Website: ' + website + '\n';
    if (pdfUrl) body += 'PDF URL: ' + pdfUrl + '\n';
    body += '\n';
  }

  // Policyholder Details
  if (linkBuilderData?.data?.policyHolder) {
    const ph = linkBuilderData.data.policyHolder;
    body += '-'.repeat(60) + '\n';
    body += 'POJISTNÍK\n';
    body += '-'.repeat(60) + '\n';
    if (ph.type) body += 'Typ: ' + ph.type + '\n';
    if (ph.firstName || ph.lastName) body += 'Jméno: ' + (ph.firstName || '') + ' ' + (ph.lastName || '') + '\n';
    if (ph.companyName) body += 'Firma: ' + ph.companyName + '\n';
    if (ph.email) body += 'Email: ' + ph.email + '\n';
    if (ph.phoneNumber) body += 'Telefon: ' + ph.phoneNumber + '\n';
    if (ph.street) body += 'Ulice: ' + ph.street + '\n';
    if (ph.town) body += 'Město: ' + ph.town + '\n';
    if (ph.zip) body += 'PSČ: ' + ph.zip + '\n';
    body += '\n';
  }

  // Provider Details
  if (linkBuilderData?.data?.provider) {
    const provider = linkBuilderData.data.provider;
    body += '-'.repeat(60) + '\n';
    body += 'POJIŠŤOVNA\n';
    body += '-'.repeat(60) + '\n';
    if (provider.nameFull) body += 'Název: ' + provider.nameFull + '\n';
    if (provider.companyIdentificationNumber) body += 'IČO: ' + provider.companyIdentificationNumber + '\n';
    body += '\n';
  }

  // Full LinkBuilder Data as JSON
  if (linkBuilderData) {
    body += '-'.repeat(60) + '\n';
    body += 'KOMPLETNÍ DATA (JSON)\n';
    body += '-'.repeat(60) + '\n';
    body += JSON.stringify(linkBuilderData, null, 2) + '\n\n';
  }

  body += '='.repeat(60) + '\n';
  body += 'KONEC CHYBOVÉ ZPRÁVY\n';
  body += '='.repeat(60) + '\n';

  return body;
};

/**
 * Prepare error email request for pdf-service
 */
export const prepareErrorEmailRequest = (errorData: ErrorEmailData): ErrorEmailRequest | null => {
  const recipientEmail = WEBSITE_PROPS[errorData.website]?.email;

  if (!recipientEmail) {
    devlogger.error('No recipient email found for website:', errorData.website);
    return null;
  }

  const emailRequest: ErrorEmailRequest = {
    subject: {
      _type: 'static',
      value: ERROR_EMAIL_SUBJECT,
    },
    body: {
      _type: 'static',
      value: formatErrorEmailBody(errorData),
    },
    recipients: [
      {
        email: 'plevahonza@gmail.com', //recipientEmail,
      },
    ],
    sender: {
      email: ERROR_EMAIL_SENDER,
      name: 'Alerting System',
    },
    senderStyle: 'from',
  };

  // Add PDF attachment if available
  if (errorData.pdfUrl) {
    emailRequest.attachments = [
      {
        _type: 'link',
        fileName: `vypoved-${errorData.contractNumber || 'error'}.pdf`,
        link: errorData.pdfUrl,
      },
    ];
  }

  return emailRequest;
};
