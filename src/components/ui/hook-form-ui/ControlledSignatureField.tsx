import React from 'react';

import { Control, Controller, FieldError, useFormContext } from 'react-hook-form';

import { SignatureField } from '../form/SignatureCanvas/SignatureField';
// Controlled version for react-hook-form integration
type ControlledSignatureFieldProps = {
  name: string;
  control: Control<any>;
  label: string;
  disabled?: boolean;
  required?: boolean;
  width?: number;
  height?: number;
  clearButtonText?: string;
  onEditClick?: () => void;
  onChange?: (value: any) => void;
  editButtonText?: string;
  showEditButton?: boolean;
  tr: (key: string) => string;
  rules?: any;
  error?: FieldError;
};
export const ControlledSignatureField: React.FC<ControlledSignatureFieldProps> = React.memo(
  ({
    name,
    control,
    label,
    disabled = false,
    required = false,
    width = 500,
    height = 200,
    clearButtonText = 'Clear Signature',
    onEditClick,
    onChange,
    editButtonText = 'Edit',
    showEditButton = false,
    rules,
    tr,
    error,
  }) => {
    const { clearErrors, formState } = useFormContext();

    return (
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <SignatureField
            clearButtonText={clearButtonText}
            disabled={disabled}
            editButtonText={editButtonText}
            error={error?.message}
            height={height}
            label={label}
            name={name}
            onChange={(value: any) => {
              field.onChange(value);
              if (onChange) onChange(value);
              clearErrors(name);
            }}
            onEditClick={onEditClick}
            required={required}
            showEditButton={showEditButton}
            tr={tr}
            value={field.value || ''}
            width={width}
          />
        )}
        rules={rules}
      />
    );
  },
);
