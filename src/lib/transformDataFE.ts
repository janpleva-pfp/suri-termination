import { ContractCancellationFormData } from '../types/Form/ContractCancellationForm';
import { TerminationEntity } from '../types/TerminationEntity/TerminationEntity';

const normalizeInsuranceCompanyKey = (key: string | null | undefined): string => {
  if (!key) return '';
  if (key == 'GCP' || key == 'gcp' || key == 'generali') return 'cp';
  return key;
};

export const transformTerminationEntityToFormData = (
  terminationEntity: TerminationEntity,
): Partial<ContractCancellationFormData> => {
  const { data } = terminationEntity;

  return {
    // Contract information
    contractNumber: data?.contractNumber || '',
    insuranceCompany: normalizeInsuranceCompanyKey(data?.provider?.contentKey),
    ...(data?.contractTerminationReason && { contractTerminationReason: data?.contractTerminationReason }),
    differentReason: data?.differentReason || '',

    // Policy holder information
    policyHolderType: data?.policyHolder?.type == 'company' ? 'self-employed' : data?.policyHolder?.type || '',
    firstName: data?.policyHolder?.firstName || '',
    lastName: data?.policyHolder?.lastName || '',
    birthNumber: data?.policyHolder?.birthNumber || '',
    ico: data?.policyHolder?.companyID || '',
    companyName: data?.policyHolder?.companyName || '',
    companyID: data?.policyHolder?.companyID || '',
    street: data?.policyHolder?.street || '',
    town: data?.policyHolder?.town || '',
    zip: data?.policyHolder?.zip || '',
    phoneNumber: data?.policyHolder?.phoneNumber || '',
    email: data?.policyHolder?.email || '',

    // Refund information
    ...(data?.overpaymentSendTo && {
      overpaymentSendTo: data?.overpaymentSendTo as 'bankAccount' | 'otherAccount' | 'address',
    }),
    bankAccount: data?.policyHolder?.bankAccount || '',

    // Signature (if exists)
    signature: terminationEntity.signature || '',
  };
};
