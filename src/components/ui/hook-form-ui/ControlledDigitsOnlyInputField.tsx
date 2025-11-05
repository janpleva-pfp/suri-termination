import React from 'react';

import { TextField } from '@pfp/frontend-platform';
import { Control, Controller, FieldError } from 'react-hook-form';

import { useClientSide } from '@app/src/lib/hooks/useClientSide';
// Custom controlled input field that only allows digits
type ControlledDigitsOnlyInputFieldProps = {
  name: string;
  control: Control<any>;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  rules?: any;
  error?: FieldError;
};
export const ControlledDigitsOnlyInputField: React.FC<ControlledDigitsOnlyInputFieldProps> = React.memo(
  ({ name, control, label, placeholder, disabled = false, required = false, rules, error }) => {
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
            <TextField
              disabled={disabled}
              error={errorMessage}
              label={label}
              name={name}
              onChange={(e: any) => {
                // Only allow digits - handle both event object and direct value
                const inputValue = e.target?.value || e;
                const value = String(inputValue).replace(/[^\d]/g, '');
                field.onChange(value);
              }}
              placeholder={placeholder}
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
