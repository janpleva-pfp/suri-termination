import React from 'react';

import { AsyncSelectField, RadioGroupField, SelectField, TextField } from '@pfp/frontend-platform';
import { Control, Controller, FieldError, useFormContext } from 'react-hook-form';

import { useClientSide } from '@app/src/lib/hooks/useClientSide';
// Wrapper for PFP TextField with react-hook-form
type ControlledInputFieldProps = {
  name: string;
  control: Control<any>;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  type?: 'text' | 'email' | 'tel' | 'password' | 'number';
  rules?: any;
  error?: FieldError;
};
export const ControlledInputField: React.FC<ControlledInputFieldProps> = React.memo(
  ({ name, control, label, placeholder, disabled = false, required = false, rules, error }) => {
    const { clearErrors, formState } = useFormContext();

    return (
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => {
          const hasError = !!fieldState.error || !!error;
          const errorMessage = fieldState.error?.message || error?.message;

          return (
            <TextField
              disabled={disabled}
              error={errorMessage}
              isRequired={required}
              label={label}
              name={name}
              onBlur={field.onBlur}
              onChange={(e: any) => {
                const inputValue = e.target?.value || e;
                field.onChange(inputValue);
                clearErrors(name);
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
// Wrapper for PFP SelectField with react-hook-form
type ControlledAsyncSelectFieldProps = {
  name: string;
  control: Control<any>;
  label: string;
  options: Array<{ value: string; label: string }>;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  rules?: any;
  error?: FieldError;
};
export const ControlledAsyncSelectField: React.FC<ControlledAsyncSelectFieldProps> = React.memo(
  ({ name, control, label, options, disabled = false, required = false, placeholder, rules, error }) => {
    const isClient = useClientSide();
    const { clearErrors, formState } = useFormContext();

    return (
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => {
          const selectedOption = options.find((option) => option.value === field.value) || null;
          const hasError = !!fieldState.error || !!error;
          const errorMessage = fieldState.error?.message || error?.message;

          return (
            <AsyncSelectField
              defaultOptions={options.length > 0 ? options : true}
              disabled={disabled}
              error={errorMessage}
              isRequired={required}
              label={label}
              loadingMessage="Loading..."
              name={name}
              noOptionsMessage="No options"
              onBlur={field.onBlur}
              onChange={(selectedOption: any) => {
                const value = selectedOption?.value || '';
                field.onChange(value);
                clearErrors(name);
              }}
              placeholder={placeholder}
              showError={hasError}
              value={selectedOption}
            />
          );
        }}
        rules={rules}
      />
    );
  },
);
// Wrapper for PFP RadioGroupField with react-hook-form
type ControlledRadioGroupFieldProps = {
  name: string;
  control: Control<any>;
  label: string;
  options: Array<{ value: string; label: string; id?: string }>;
  disabled?: boolean;
  required?: boolean;
  rules?: any;
  error?: FieldError;
  horizontal?: boolean;
};
export const ControlledRadioGroupField: React.FC<ControlledRadioGroupFieldProps> = React.memo(
  ({ name, control, label, options, disabled = false, rules, error, horizontal }) => {
    const isClient = useClientSide();
    const { clearErrors, formState } = useFormContext();

    return (
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => {
          const hasError = !!fieldState.error || !!error;
          const errorMessage = fieldState.error?.message || error?.message;

          return (
            <RadioGroupField
              disabled={disabled}
              isHorizontal={horizontal}
              label={label}
              name={name}
              onChange={(value: string | number | boolean) => {
                field.onChange(value);
                clearErrors(name);
              }}
              options={options}
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
// Wrapper for PFP TextAreaField with react-hook-form
type ControlledTextAreaFieldProps = {
  name: string;
  control: Control<any>;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  rules?: any;
  error?: FieldError;
};
export const ControlledTextAreaField: React.FC<ControlledTextAreaFieldProps> = React.memo(
  ({ name, control, label, placeholder, disabled = false, required = false, rules, error }) => {
    const { clearErrors, formState } = useFormContext();

    return (
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => {
          const hasError = !!fieldState.error || !!error;
          const errorMessage = fieldState.error?.message || error?.message;

          return (
            <TextField
              disabled={disabled}
              error={errorMessage}
              isRequired={required}
              label={label}
              name={name}
              onChange={(e: any) => {
                const inputValue = e.target?.value || e;
                field.onChange(inputValue);
                clearErrors(name);
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
// Wrapper for PFP AsyncSelectField with react-hook-form
type ControlledPFPAsyncSelectFieldProps = {
  name: string;
  control: Control<any>;
  label: string;
  options?: Array<{ value: string; label: string }>;
  loadOptions?: (inputValue: string) => Promise<Array<{ value: string; label: string }>>;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  rules?: any;
  error?: FieldError;
  noOptionsMessage?: string;
  loadingMessage?: string;
};
export const ControlledPFPAsyncSelectField: React.FC<ControlledPFPAsyncSelectFieldProps> = React.memo(
  ({
    name,
    control,
    label,
    options = [],
    loadOptions,
    disabled = false,
    required = false,
    placeholder,
    rules,
    error,
    noOptionsMessage = 'No options',
    loadingMessage = 'Loading...',
  }) => {
    const { clearErrors, formState } = useFormContext();

    return (
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => {
          const selectedOption = options.find((option) => option.value === field.value) || null;
          const hasError = !!fieldState.error || !!error;
          const errorMessage = fieldState.error?.message || error?.message;

          return (
            <AsyncSelectField
              defaultOptions={options.length > 0 ? options : true}
              disabled={disabled}
              error={errorMessage}
              invalid={hasError}
              isRequired={required}
              label={label}
              loadOptions={loadOptions}
              loadingMessage={loadingMessage}
              name={name}
              noOptionsMessage={noOptionsMessage}
              onBlur={field.onBlur}
              onChange={(selectedOption: any) => {
                const value = selectedOption?.value || '';
                field.onChange(value);
                clearErrors(name);
              }}
              placeholder={placeholder}
              showError={hasError}
              value={selectedOption}
            />
          );
        }}
        rules={rules}
      />
    );
  },
);

// Wrapper for PFP AsyncSelectField with react-hook-form
type ControlledSelectFieldProps = {
  name: string;
  control: Control<any>;
  label: string;
  options?: Array<{ value: string; label: string }>;
  loadOptions?: (inputValue: string) => Promise<Array<{ value: string; label: string }>>;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  rules?: any;
  error?: FieldError;
  noOptionsMessage?: string;
  loadingMessage?: string;
};
export const ControlledSelectField: React.FC<ControlledSelectFieldProps> = React.memo(
  ({
    name,
    control,
    label,
    options = [],
    disabled = false,
    required = false,
    placeholder,
    rules,
    error,
    noOptionsMessage = 'No options',
  }) => {
    const { clearErrors, formState } = useFormContext();

    return (
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => {
          const selectedOption = options.find((option) => option.value === field.value) || null;
          const hasError = !!fieldState.error || !!error;
          const errorMessage = fieldState.error?.message || error?.message;

          return (
            <SelectField
              disabled={disabled}
              error={errorMessage}
              invalid={hasError}
              isRequired={required}
              label={label}
              name={name}
              noOptionsMessage={noOptionsMessage}
              onBlur={field.onBlur}
              onChange={(selectedOption: any) => {
                const value = selectedOption?.value || '';
                field.onChange(value);
                clearErrors(name);
              }}
              options={options.length > 0 ? options : undefined}
              placeholder={placeholder}
              showError={hasError}
              value={selectedOption}
            />
          );
        }}
        rules={rules}
      />
    );
  },
);
