import React from 'react';

import { Card } from '@pfp/frontend-platform';
import { Control, FieldErrors } from 'react-hook-form';

import { TE_DEFAULT_PHONE_PREFIX } from '@app/constants';
import { PolicyHolderTypes, TerminationReasons } from '@app/src/types/TerminationEntity/TerminationEntity';

import { ControlledInputField, ControlledPhoneInputField, ControlledRadioGroupField } from '../../ui/form';
interface ContractCancellationFormData {
  contractNumber: string;
  insuranceCompany: string;
  contractTerminationReason: TerminationReasons;
  differentReason?: string;
  policyHolderType: PolicyHolderTypes;
  firstName?: string;
  lastName?: string;
  birthNumber?: string;
  ico?: string;
  companyName?: string;
  companyID?: string;
  street: string;
  town: string;
  zip: string;
  phoneNumber: string;
  email: string;
  overpaymentSendTo: 'bankAccount' | 'otherAccount' | 'address';
  bankAccount?: string;
  signature?: string;
}
interface PolicyHolderSectionProps {
  control: Control<ContractCancellationFormData>;
  errors: FieldErrors<ContractCancellationFormData>;
  tr: (key: string) => string;
  watchedPolicyHolderType: PolicyHolderTypes;
  FORM_FIELD_EMAIL_REGEX: RegExp;
  FORM_FIELD_PHONE_REGEX: RegExp;
  ZIP_CODE_REGEX: RegExp;
  disabled?: boolean;
  fieldOptions?: {
    horizontal?: boolean;
    required?: boolean;
    rules?: Record<string, any>;
  };
}
const PolicyHolderSection: React.FC<PolicyHolderSectionProps> = ({
  control,
  errors,
  tr,
  watchedPolicyHolderType,
  FORM_FIELD_EMAIL_REGEX,
  FORM_FIELD_PHONE_REGEX,
  ZIP_CODE_REGEX,
  disabled = false,
  fieldOptions = {
    horizontal: true,
    required: true,
    rules: { required: tr('contract-cancellation.validation.required') },
  },
}) => {
  return (
    <div className="contract-section">
      <div className="section-header">
        <h2>{tr('contract-cancellation.sections.policy-holder-info')}</h2>
      </div>
      <Card disabled={disabled}>
        <ControlledRadioGroupField
          control={control}
          disabled={disabled}
          error={errors.policyHolderType}
          horizontal={fieldOptions.horizontal}
          label={tr('contract-cancellation.fields.policy-holder-type')}
          name="policyHolderType"
          options={[
            { value: 'person', label: tr('contract-cancellation.policy-holder-types.person'), id: 'person' },
            {
              value: 'self-employed',
              label: tr('contract-cancellation.policy-holder-types.self-employed'),
              id: 'self-employed',
            },
          ]}
          required={fieldOptions.required}
          rules={fieldOptions.rules}
        />
        {/* Additional fields only show after policy holder type is selected */}
        {watchedPolicyHolderType && (
          <div className="mt-4">
            {watchedPolicyHolderType === 'person' && (
              <>
                <ControlledInputField
                  control={control}
                  disabled={disabled}
                  error={errors.firstName}
                  label={tr('contract-cancellation.fields.first-name')}
                  name="firstName"
                  placeholder={tr('contract-cancellation.placeholders.first-name')}
                  required={true}
                  rules={{
                    required:
                      watchedPolicyHolderType === 'person' || watchedPolicyHolderType === 'self-employed'
                        ? tr('contract-cancellation.validation.required')
                        : false,
                  }}
                />
                <ControlledInputField
                  control={control}
                  disabled={disabled}
                  error={errors.lastName}
                  label={tr('contract-cancellation.fields.last-name')}
                  name="lastName"
                  placeholder={tr('contract-cancellation.placeholders.last-name')}
                  required={true}
                  rules={{
                    required:
                      watchedPolicyHolderType === 'person' || watchedPolicyHolderType === 'self-employed'
                        ? tr('contract-cancellation.validation.required')
                        : false,
                  }}
                />
              </>
            )}
            {watchedPolicyHolderType === 'self-employed' && (
              <>
                <ControlledInputField
                  control={control}
                  disabled={disabled}
                  error={errors.companyName}
                  label={tr('contract-cancellation.placeholders.company-name')}
                  name="companyName"
                  placeholder={tr('contract-cancellation.placeholders.company-name')}
                  required={true}
                />
                <ControlledInputField
                  control={control}
                  disabled={disabled}
                  error={errors.ico}
                  label={tr('contract-cancellation.fields.company-id')}
                  name="ico"
                  placeholder={tr('contract-cancellation.placeholders.ico')}
                  required={true}
                />
              </>
            )}
            <ControlledPhoneInputField
              control={control}
              countryCode={TE_DEFAULT_PHONE_PREFIX}
              disabled={disabled}
              error={errors.phoneNumber}
              label={tr('contract-cancellation.fields.phone')}
              name="phoneNumber"
              placeholder={tr('contract-cancellation.placeholders.phone')}
              required={true}
              rules={{
                required: tr('contract-cancellation.validation.required'),
                pattern: {
                  value: FORM_FIELD_PHONE_REGEX,
                  message: tr('contract-cancellation.validation.phone'),
                },
              }}
            />
            <ControlledInputField
              control={control}
              disabled={disabled}
              error={errors.email}
              label={tr('contract-cancellation.fields.email')}
              name="email"
              placeholder={tr('contract-cancellation.placeholders.email')}
              required={true}
              rules={{
                required: tr('contract-cancellation.validation.required'),
                pattern: {
                  value: FORM_FIELD_EMAIL_REGEX,
                  message: tr('contract-cancellation.validation.email'),
                },
              }}
              type="email"
            />
          </div>
        )}
      </Card>
    </div>
  );
};
export { PolicyHolderSection };
