import React from 'react';

import { Card } from '@pfp/frontend-platform';
import { Control, FieldErrors } from 'react-hook-form';

import { ContractCancellationFormData } from '@app/src/types/Form/ContractCancellationForm';

import { ControlledDigitsOnlyInputField, ControlledInputField, ControlledRadioGroupField } from '../../ui/form';
interface RefundInfoSectionProps {
  control: Control<ContractCancellationFormData>;
  errors: FieldErrors<ContractCancellationFormData>;
  tr: (key: string) => string;
  watchedOverpaymentSendTo: 'bankAccount' | 'otherAccount' | 'address';
  ZIP_CODE_REGEX: RegExp;
  BANK_ACCOUNT_REGEX: RegExp;
  disabled?: boolean;
}
const RefundInfoSection: React.FC<RefundInfoSectionProps> = ({
  control,
  errors,
  tr,
  watchedOverpaymentSendTo,
  ZIP_CODE_REGEX,
  BANK_ACCOUNT_REGEX,
  disabled = false,
}) => {
  return (
    <div className="contract-section">
      <div className="section-header">
        <h2 className="mb-2 unstyled h2">{tr('contract-cancellation.sections.returnInfo.title')}</h2>
        <p className="txt-18">{tr('contract-cancellation.sections.returnInfo.subTitle')}</p>
      </div>
      <Card disabled={disabled}>
        <div data-field="overpaymentSendTo" id="overpaymentSendTo">
          <ControlledRadioGroupField
            control={control}
            disabled={disabled}
            error={errors.overpaymentSendTo}
            label={tr('contract-cancellation.fields.overpaymentSendTo')}
            name="overpaymentSendTo"
            options={[
              {
                value: 'bankAccount',
                label: tr('contract-cancellation.overpaymentSendTo.same-account'),
                id: 'bankAccount',
              },
              {
                value: 'otherAccount',
                label: tr('contract-cancellation.overpaymentSendTo.other-account'),
                id: 'otherAccount',
              },
              { value: 'address', label: tr('contract-cancellation.overpaymentSendTo.address'), id: 'address' },
            ]}
            required={true}
            rules={{ required: tr('contract-cancellation.validation.required') }}
          />
        </div>
        {watchedOverpaymentSendTo === 'otherAccount' && (
          <ControlledInputField
            control={control}
            disabled={disabled}
            error={errors.bankAccount}
            label={tr('contract-cancellation.fields.bankAccount')}
            name="bankAccount"
            placeholder={tr('contract-cancellation.placeholders.bankAccount')}
            required={true}
            rules={{
              pattern: {
                value: BANK_ACCOUNT_REGEX,
                message: tr('contract-cancellation.validation.bank-account-format'),
              },
              required:
                watchedOverpaymentSendTo === 'otherAccount' ? tr('contract-cancellation.validation.required') : false,
            }}
          />
        )}
        {watchedOverpaymentSendTo === 'address' && (
          <>
            <ControlledInputField
              control={control}
              disabled={disabled}
              error={errors.street}
              label={tr('contract-cancellation.fields.street')}
              name="street"
              placeholder={tr('contract-cancellation.placeholders.street')}
              required={true}
              rules={{
                required:
                  watchedOverpaymentSendTo === 'address' ? tr('contract-cancellation.validation.required') : false,
              }}
            />
            <ControlledInputField
              control={control}
              disabled={disabled}
              error={errors.town}
              label={tr('contract-cancellation.fields.town')}
              name="town"
              placeholder={tr('contract-cancellation.placeholders.town')}
              required={true}
              rules={{
                required:
                  watchedOverpaymentSendTo === 'address' ? tr('contract-cancellation.validation.required') : false,
              }}
            />
            <ControlledDigitsOnlyInputField
              control={control}
              disabled={disabled}
              error={errors.zip}
              label={tr('contract-cancellation.fields.zip-code')}
              name="zip"
              placeholder={tr('contract-cancellation.placeholders.zip-code')}
              required={true}
              rules={{
                required:
                  watchedOverpaymentSendTo === 'address' ? tr('contract-cancellation.validation.required') : false,
                pattern: {
                  value: ZIP_CODE_REGEX,
                  message: tr('contract-cancellation.validation.zip-code-5-digits'),
                },
              }}
            />
          </>
        )}
      </Card>
    </div>
  );
};
export { RefundInfoSection };
