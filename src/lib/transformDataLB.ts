// This should not be imported in any frontend code (components, pages, etc.)
// as it uses server-side only API calls

import { format } from 'date-fns';

import {
  SEVERITY_ERROR,
  SEVERITY_WARNING,
  TE_DEFAULT_PRODUCT,
  TE_DEFAULT_TYPE,
  TE_DEFAULT_WEBSITE,
} from '@app/constants';
import { sapiGetInsuranceCompaniesOptions } from '@app/server/api/sapiGetInsuranceCompaniesOptions';

import { logger } from '../pages/api/log';
import { ContractCancellationFormData, FinalStepDeciderResult } from '../types/Form/ContractCancellationForm';
import { InsuranceCompanyOption } from '../types/InsuranceCompanyContent';
import { CrmTerminationEntity, PDFEntity, TerminationEntity } from '../types/TerminationEntity/TerminationEntity';
import { finalStepDecider } from '../utils/finalStepDecider';

const defaultData: TerminationEntity = {
  type: TE_DEFAULT_TYPE,
  website: TE_DEFAULT_WEBSITE,
  affiliate: '',
  product: TE_DEFAULT_PRODUCT,
};
// Helper to pick value from formData, fallback to lbData, otherwise default
const pickValue = <T>(formValue: T | undefined, lbValue: T | undefined, defaultValue?: T): T | undefined =>
  formValue ?? lbValue ?? defaultValue;

export const prepareTerminationObject = async (
  formData: ContractCancellationFormData,
  lbData?: TerminationEntity,
): Promise<TerminationEntity> => {
  const insuranceCompaniesResponse = await sapiGetInsuranceCompaniesOptions();
  const insuranceCompaniesOption: InsuranceCompanyOption[] = insuranceCompaniesResponse.data || [];

  // Find insurance company in insuranceCompanies, where the key matches formData.insuranceCompany
  const insuranceCompany: InsuranceCompanyOption | undefined = insuranceCompaniesOption.find(
    (company) => company.contentKey === formData.insuranceCompany,
  );

  return {
    ...(formData.linkId && { linkId: formData.linkId }),
    // type: pickValue(lbData?.type, undefined, defaultData.type) || TE_DEFAULT_TYPE,
    type: TE_DEFAULT_TYPE,
    website: pickValue(lbData?.website, undefined, defaultData.website) || TE_DEFAULT_WEBSITE,
    affiliate: pickValue(lbData?.affiliate, undefined, defaultData.affiliate),
    product: pickValue(lbData?.product, undefined, defaultData.product) || TE_DEFAULT_PRODUCT,
    data: {
      contractNumber: pickValue(formData.contractNumber, lbData?.data?.contractNumber),
      contractTerminationReason: pickValue(formData.contractTerminationReason, lbData?.data?.contractTerminationReason),
      differentReason: pickValue(formData.differentReason, lbData?.data?.differentReason),
      overpaymentSendTo: pickValue(formData.overpaymentSendTo, lbData?.data?.overpaymentSendTo),
      policyHolder: {
        type: pickValue(formData.policyHolderType, lbData?.data?.policyHolder?.type),
        firstName: pickValue(formData.firstName, lbData?.data?.policyHolder?.firstName),
        lastName: pickValue(formData.lastName, lbData?.data?.policyHolder?.lastName),
        birthNumber: pickValue(formData.birthNumber, lbData?.data?.policyHolder?.birthNumber),
        companyName: pickValue(formData.companyName, lbData?.data?.policyHolder?.companyName),
        companyID: pickValue(formData.ico, formData.companyID, lbData?.data?.policyHolder?.companyID),
        street: pickValue(formData.street, lbData?.data?.policyHolder?.street),
        town: pickValue(formData.town, lbData?.data?.policyHolder?.town),
        zip: pickValue(formData.zip, lbData?.data?.policyHolder?.zip),
        bankAccount: pickValue(formData.bankAccount, lbData?.data?.policyHolder?.bankAccount),
        phoneNumber: pickValue(formData.phoneNumber, lbData?.data?.policyHolder?.phoneNumber),
        email: pickValue(formData.email, lbData?.data?.policyHolder?.email),
      },
      provider: {
        companyIdentificationNumber: pickValue(
          insuranceCompany?.id,
          lbData?.data?.provider?.companyIdentificationNumber,
        ),
        nameFull: pickValue(insuranceCompany?.name, lbData?.data?.provider?.nameFull, formData.insuranceCompany),
        contentKey: pickValue(insuranceCompany?.contentKey, lbData?.data?.provider?.contentKey),
      },
    },
    ...(lbData?.properties && { properties: lbData.properties }),
    /*  trackingParams: {
      ...(defaultData.trackingParams && { pfpUid: defaultData.trackingParams.pfpUid }),
    }, */
    ...(formData.signature && { signature: formData.signature }),
  };
};
export const prepareCRMTerminationObject = (
  lbData: TerminationEntity,
  deciderActions?: FinalStepDeciderResult,
  fileData?:
    | {
        fileUrl: string;
        fileTime: string;
      }
    | undefined,
): CrmTerminationEntity => {
  if (lbData.linkId === undefined) {
    throw new Error('Link ID is missing in link builder data.');
  }
  if (!deciderActions || !('terminationState' in deciderActions) || !deciderActions.terminationState) {
    deciderActions = finalStepDecider(lbData, lbData.properties?.agent ? 'agent' : 'client', 'client');
    logger.log(
      SEVERITY_WARNING,
      'Decider actions were not provided or incomplete. They have been determined automatically.',
      deciderActions,
    );
  }
  if (!deciderActions || !('terminationState' in deciderActions) || !deciderActions.terminationState) {
    logger.log(SEVERITY_ERROR, 'Decider actions could not be determined:', lbData, deciderActions);
    throw new Error('Unable to determine decider actions for the termination entity.');
  }
  return {
    ...lbData.data,
    type: TE_DEFAULT_TYPE,
    product: lbData.product || defaultData.product || TE_DEFAULT_PRODUCT,
    website: lbData.website || defaultData.website || TE_DEFAULT_WEBSITE,
    contractNumber: lbData.data?.contractNumber || '',
    contractTerminationReason: lbData.data?.contractTerminationReason || 'differentReason',
    needAttachment:
      lbData.data?.contractTerminationReason &&
      ['disabledVehicle', 'changeOfOwnerCar'].includes(lbData.data?.contractTerminationReason)
        ? 'vehicleRegistrationRecord'
        : lbData.data?.contractTerminationReason && ['vehicleStolen'].includes(lbData.data?.contractTerminationReason)
        ? 'policeProtocol'
        : undefined,
    ...(fileData && {
      terminationFileTime: fileData?.fileTime,
      terminationFileUrl: fileData?.fileUrl,
    }),
    ...(lbData.properties && { properties: lbData.properties }),
    terminationState: deciderActions.terminationState,
    linkId: lbData.linkId,
  };
};

export const preparePDFObject = async (formData: ContractCancellationFormData): Promise<PDFEntity> => {
  // Transform the incoming form data into the format expected by the termination entity
  const insuranceCompaniesResponse = await sapiGetInsuranceCompaniesOptions();
  const insuranceCompaniesOption: InsuranceCompanyOption[] = insuranceCompaniesResponse.data || [];
  const insuranceCompany: InsuranceCompanyOption | undefined = insuranceCompaniesOption.find(
    (company) => company.contentKey === formData.insuranceCompany,
  );
  return {
    name: TE_DEFAULT_TYPE,
    type: 'PDF',
    product: defaultData.product,
    website: defaultData.website,
    parameters: {
      signDate: (() => {
        return format(new Date(), 'dd. MM. yyyy');
      })(),
      ...(formData.signature && { signatureImg: formData.signature }),
      ...(formData.contractNumber && { contractNumber: formData.contractNumber }),
      ...(formData.contractTerminationReason && { contractTerminationReason: formData.contractTerminationReason }),
      ...(formData.differentReason && { differentReason: formData.differentReason }),
      ...(formData.overpaymentSendTo && { overpaymentSendTo: formData.overpaymentSendTo }),
      policyHolder: {
        ...(formData.policyHolderType && { type: formData.policyHolderType }),
        ...(formData.firstName && { firstName: formData.firstName }),
        ...(formData.lastName && { lastName: formData.lastName }),
        ...(formData.birthNumber && { birthNumber: formData.birthNumber }),
        ...(formData.companyName && { companyName: formData.companyName }),
        ...((formData.ico || formData.companyID) && { companyId: formData.ico || formData.companyID }),
        ...(formData.street && { street: formData.street }),
        ...(formData.town && { town: formData.town }),
        ...(formData.zip && { zip: formData.zip }),
        ...(formData.bankAccount && { bankAccount: formData.bankAccount }),
        ...(formData.phoneNumber && { phoneNumber: formData.phoneNumber }),
        ...(formData.email && { email: formData.email }),
      },
      provider: {
        ...(insuranceCompany && { companyIdentificationNumber: insuranceCompany.id }),
        ...(insuranceCompany && { nameFull: insuranceCompany.name }),
        ...(insuranceCompany && { contentKey: insuranceCompany.contentKey }),
      },
    },
  };
};
