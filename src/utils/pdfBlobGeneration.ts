import { apiRequest } from '../pages/api';
import { ContractCancellationFormData } from '../types/Form/ContractCancellationForm';

export const generatePdfBlob = async (
  pdfResponse: Record<string, any>,
): Promise<{
  downloadUrl?: string;
  status: number;
}> => {
  // Create downloadable PDF link
  if (pdfResponse.status === 200 && pdfResponse.data?.pdfData) {
    try {
      // Decode base64 to binary and create blob URL
      const base64 = pdfResponse.data.pdfData;
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const downloadUrl = URL.createObjectURL(blob);
      return { downloadUrl, status: 200 };
    } catch (blobError) {
      const downloadUrl = `data:application/pdf;base64,${pdfResponse.data.pdfData}`;
      return {
        downloadUrl,
        status: 200,
      };
    }
  } else {
    devlogger.error('PDF response missing data:', pdfResponse);
    return { status: 400 };
  }
};

// Function to generate PDF and create download link
export const generatePDFFile = async (data: ContractCancellationFormData, linkId: string) => {
  const pdfResponse = await apiRequest({
    action: 'pdfGenerate',
    data,
    linkId: linkId,
    target: 'client',
  });
  const pdfBlob = await generatePdfBlob(pdfResponse);
  return pdfResponse.status === 200 && pdfResponse.data?.pdfData
    ? {
        downloadBlob: pdfBlob.downloadUrl || null,
        ...(pdfResponse.data.fileOutsideUrl ? { fileOutsideUrl: pdfResponse.data.fileOutsideUrl } : {}),
      }
    : null;
};
