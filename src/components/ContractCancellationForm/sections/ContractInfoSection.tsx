import React from 'react';

import { Card } from '@pfp/frontend-platform';
import { Control, FieldErrors } from 'react-hook-form';

import { ContractCancellationFormData } from '@app/src/types/Form/ContractCancellationForm';

import { ControlledDigitsOnlyInputField, ControlledSelectField, ControlledTextAreaField } from '../../ui/form';
interface ContractInfoSectionProps {
  control: Control<ContractCancellationFormData>;
  errors: FieldErrors<ContractCancellationFormData>;
  tr: (key: string) => string;
  terminationReasonOptions: Array<{ value: string; label: string }>;
  insuranceCompanyOptions: Array<{ value: string; label: string }>;
  watchedTerminationReason: string;
  DIGITS_ONLY_REGEX: RegExp;
  disabled?: boolean;
}
const ContractInfoSection: React.FC<ContractInfoSectionProps> = ({
  control,
  errors,
  tr,
  terminationReasonOptions,
  insuranceCompanyOptions,
  watchedTerminationReason,
  DIGITS_ONLY_REGEX,
  disabled = false,
}) => {
  return (
    <div className="contract-section">
      <div className="section-header">
        <h2>{tr('contract-cancellation.sections.contract-info')}</h2>
      </div>
      <Card disabled={disabled}>
        <div data-field="insuranceCompany" id="insuranceCompany">
          <ControlledSelectField
            control={control}
            disabled={disabled}
            error={errors.insuranceCompany}
            label={tr('contract-cancellation.fields.insurance-company')}
            name="insuranceCompany"
            options={insuranceCompanyOptions}
            placeholder={tr('contract-cancellation.placeholders.insurance-company')}
            required={true}
            rules={{ required: tr('contract-cancellation.validation.required') }}
          />
        </div>
        <div data-field="contractTerminationReason" id="contractTerminationReason">
          <ControlledSelectField
            control={control}
            disabled={disabled}
            error={errors.contractTerminationReason}
            label={tr('contract-cancellation.fields.termination-reason')}
            name="contractTerminationReason"
            options={terminationReasonOptions}
            placeholder={tr('contract-cancellation.placeholders.select-reason')}
            required={true}
            rules={{ required: tr('contract-cancellation.validation.required') }}
          />
        </div>
        {watchedTerminationReason === 'differentReason' && (
          <ControlledTextAreaField
            control={control}
            disabled={disabled}
            error={errors.differentReason}
            label={tr('contract-cancellation.fields.different-reason')}
            name="differentReason"
            placeholder={tr('contract-cancellation.placeholders.different-reason')}
            required={true}
            rows={3}
            rules={{
              required:
                watchedTerminationReason === 'differentReason'
                  ? tr('contract-cancellation.validation.required')
                  : false,
            }}
          />
        )}
        <ControlledDigitsOnlyInputField
          control={control}
          disabled={disabled}
          error={errors.contractNumber}
          label={tr('contract-cancellation.fields.contract-number')}
          name="contractNumber"
          placeholder={tr('contract-cancellation.placeholders.contract-number')}
          required={true}
          rules={{
            required: tr('contract-cancellation.validation.required'),
            pattern: {
              value: DIGITS_ONLY_REGEX,
              message: tr('contract-cancellation.validation.digits-only'),
            },
          }}
        />
      </Card>
    </div>
  );
};
export { ContractInfoSection };
