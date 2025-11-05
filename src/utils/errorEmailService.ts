import { WEBSITES } from '@app/constants/main';
import { generateErrorHash } from '@app/src/lib/errorEmailHelper';
import { apiRequest } from '@app/src/pages/api';

import { ErrorContext, ErrorEmailData } from '../types/Email/ErrorEmail';
import { TerminationEntity } from '../types/TerminationEntity/TerminationEntity';

// Session-based tracking of sent errors
const sentErrorHashes = new Set<string>();

export const hasErrorBeenSent = (errorHash: string): boolean => {
  return sentErrorHashes.has(errorHash);
};

export const markErrorAsSent = (errorHash: string): void => {
  sentErrorHashes.add(errorHash);
};

export const clearSentErrors = (): void => {
  sentErrorHashes.clear();
};

/**
 * Send error email if not already sent in this session
 */
export const sendErrorEmailIfNeeded = async (
  error: Error | string,
  context: ErrorContext,
  linkBuilderData?: TerminationEntity,
  pdfUrl?: string,
): Promise<void> => {
  const errorMessage = typeof error === 'string' ? error : error.message;

  // Generate hash to prevent duplicates
  const errorHash = generateErrorHash(errorMessage, linkBuilderData?.linkId, context);

  if (hasErrorBeenSent(errorHash)) {
    return;
  }

  // Prepare error data
  const errorData: ErrorEmailData = {
    errorMessage,
    errorContext: context,
    timestamp: new Date().toISOString(),
    linkId: linkBuilderData?.linkId,
    contractNumber: linkBuilderData?.data?.contractNumber,
    website: linkBuilderData?.website || WEBSITES.SURI,
    linkBuilderData,
    pdfUrl,
  };
  try {
    const response = await apiRequest({
      action: 'sendErrorEmail',
      errorData,
    });

    if (response.status === 200) {
      markErrorAsSent(errorHash);
    } else {
      devlogger.error('Failed to send error email:', response);
    }
  } catch (emailError) {
    devlogger.error('Exception while sending error email:', emailError);
    // Don't throw - we don't want error email failures to break the app
  }
};
