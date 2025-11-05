import React from 'react';

import { PhoneNumberField } from '@pfp/frontend-platform';
import { Control, Controller, FieldError } from 'react-hook-form';

import { useClientSide } from '@app/src/lib/hooks/useClientSide';

// Phone input field with country code prefix
type ControlledPhoneInputFieldProps = {
  name: string;
  control: Control<any>;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  rules?: any;
  error?: FieldError;
  countryCode?: string;
};
export const ControlledPhoneInputField: React.FC<ControlledPhoneInputFieldProps> = React.memo(
  ({ name, control, label, placeholder, disabled = false, required = false, rules, error, countryCode = '+420' }) => {
    const isClient = useClientSide();

    return (
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => {
          const hasError = !!fieldState.error || !!error;
          const errorMessage = fieldState.error?.message || error?.message;
          if (!isClient) {
            return <></>;
          }
          return (
            <PhoneNumberField
              disabled={disabled}
              error={errorMessage}
              isRequired={required}
              label={label}
              name={name}
              onBlur={field.onBlur}
              onChange={(value: string) => field.onChange(value)}
              placeholder={placeholder}
              selectOptions={[{ value: '+420', label: '+420' }]}
              showError={hasError}
              value={field.value || ''}
            />
          );
        }}
        rules={rules}
      />
    );
  },
);
