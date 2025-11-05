import crypto from 'crypto';

import { SEVERITY_INFO } from '@app/constants';
import { WEBSITES, WEBSITE_PROPS } from '@app/constants/main';
import { InsuranceCompaniesMap } from '@app/src/types/InsuranceCompanyContent';

import { logger } from '../pages/api/log';
import {
  EmailAttachment,
  EmailObject,
  EmailRecipient,
  EmailRecipientType,
  EmailSubject,
  EmailType,
  ObjectEmailRequest,
} from '../types/Email/EmailRequest';
import { TerminationEntity } from '../types/TerminationEntity/TerminationEntity';

import { prepareCRMTerminationObject } from './transformDataLB';

const EMAIL_SALT = process.env.EMAIL_SALT || '';

/**
 * Generate SHA-256 hash in hexadecimal format
 */
export const generateSecurityHash = (content: string): string => {
  return crypto
    .createHash('sha256')
    .update(content + EMAIL_SALT)
    .digest('hex');
};

/**
 * Get email subject based on email type and contract number
 */
export const getEmailSubject = (emailType: EmailType, contractNumber?: string): EmailSubject => {
  const subjects: Record<EmailType, string> = {
    linkToClient: 'Výpověď pojištění vašeho vozidla',
    instructionsToClient: `Výpověď pojistné smlouvy č. ${contractNumber || ''}`,
    transferNotifyToClient: `Výpověď pojistné smlouvy č. ${contractNumber || ''}`,
    completionToClient: `Potvrzení výpovědi pojistné smlouvy č. ${contractNumber || ''}`,
    terminateToBackoffice: `výpověď č. ${contractNumber || ''}`,
    terminateToInsurer: `výpověď pojistné smlouvy č. ${contractNumber || ''}`,
  };

  return {
    _type: 'static',
    value: subjects[emailType],
  };
};

/**
 * Get recipient email address based on recipient type
 */
export const getRecipientEmail = (
  recipientType: EmailRecipientType,
  terminationData: TerminationEntity,
  insuranceCompanies?: InsuranceCompaniesMap,
): string | null => {
  switch (recipientType) {
    case 'client':
      return terminationData.data?.policyHolder?.email || null;
    case 'insurer':
      // if not production, do not send to insurer
      // send to info email from constants
      if (process.env.CONTENT_ENV !== 'production') {
        return 'testing@renomia.cz';
      }

      if (!insuranceCompanies || !terminationData.data?.provider?.companyIdentificationNumber) {
        return null;
      }
      const insuranceCompany = Object.values(insuranceCompanies).find(
        (ic) => ic.companyIdentificationNumber === terminationData.data?.provider?.companyIdentificationNumber,
      );
      return insuranceCompany?.email || null;
    case 'clientService':
      if (process.env.CONTENT_ENV !== 'production') {
        return 'testing@renomia.cz';
      }
      const website = terminationData.website || WEBSITES.SURI;
      return WEBSITE_PROPS[website]?.email || null;
    default:
      return null;
  }
};

/**
 * Get sender email and name based on website
 */
export const getSenderInfo = (website: string): { email: string; name: string } => {
  const websiteEmail = WEBSITE_PROPS[website]?.email || WEBSITE_PROPS[WEBSITES.SURI].email;
  const websiteName = website.replace('.cz', '').replace('.com', '');

  return {
    email: websiteEmail,
    name: websiteName.charAt(0).toUpperCase() + websiteName.slice(1),
  };
};

/**
 * Prepare email object for API request
 */
export const prepareEmailObject = async (
  emailType: EmailType,
  recipientType: EmailRecipientType,
  terminationData: TerminationEntity,
  pdfBase64Content?: string,
  insuranceCompanies?: InsuranceCompaniesMap,
): Promise<ObjectEmailRequest | null> => {
  const recipientEmail = getRecipientEmail(recipientType, terminationData, insuranceCompanies);

  if (!recipientEmail) {
    devlogger.error('No recipient email found for type:', recipientType);
    return null;
  }

  const recipients: EmailRecipient[] = [{ email: recipientEmail }];
  const sender = getSenderInfo(terminationData.website || WEBSITES.SURI);
  const subject = getEmailSubject(emailType, terminationData.data?.contractNumber);

  // Generate security hash: toHex(sha256(toAddress + salt))
  const securityHash = generateSecurityHash(recipientEmail);
  //convert lb data to CRMTerminationEntity
  const emailParams = prepareCRMTerminationObject(terminationData);
  // Prepare email object
  logger.log(SEVERITY_INFO, 'Preparing email object', emailParams);
  const emailObject: EmailObject = {
    senderStyle: 'reply-to',
    recipients,
    sender,
    subject,
    body: {
      _type: 'template',
      path: 'pfp/email/terminate/' + emailType,
      parameters: {
        ...emailParams,
        emailTerminateType: emailType,
        type: terminationData.type || 'terminate2025',
        terminateFinisher:
          emailParams.terminationState !== 'clientSelf' && terminationData.properties?.agent ? 'backoffice' : 'client',
        terminateLink: terminationData.linkId
          ? `https://terminate.${
              process.env.CONTENT_ENV === 'production' ? terminationData.website : 'stage.' + terminationData.website
            }?linkId=${terminationData.linkId}`
          : undefined,
        ...(terminationData.properties && { properties: terminationData.properties }),
      },
    },
  };
  // Add PDF attachment if provided (as base64)

  if (pdfBase64Content) {
    const attachments: EmailAttachment[] = [
      {
        _type: 'base64file',
        contentType: 'application/pdf',
        fileName: `vypoved-${terminationData.data?.contractNumber || 'smlouvy'}.pdf`,
        encodedFile: pdfBase64Content,
        securityHash: generateSecurityHash(pdfBase64Content),
      },
    ];
    emailObject.attachments = attachments;
  }

  // Prepare data for CRM
  const dataForCRM = {
    contractNumber: terminationData.data?.contractNumber,
    provider: terminationData.data?.provider,
    policyHolder: terminationData.data?.policyHolder,
  };

  return {
    objectType: 'terminate2025',
    emailType,
    linkToObject: true,
    securityHash,
    data: dataForCRM,
    email: emailObject,
  };
};
