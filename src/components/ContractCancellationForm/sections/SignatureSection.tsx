import React from 'react';

import { Card, FileLink } from '@pfp/frontend-platform';
import { Control, FieldErrors } from 'react-hook-form';

import { ContractCancellationFormData } from '@app/src/types/Form/ContractCancellationForm';

import { ControlledSignatureField } from '../../ui/form';
interface SignatureSectionProps {
  control: Control<ContractCancellationFormData>;
  errors: FieldErrors<ContractCancellationFormData>;
  tr: (key: string) => string;
  onEditClick?: () => void;
  onChange?: () => void;
  urlBlob?: string | null;
  generatingPDF?: boolean;
  disabled?: boolean;
}
const SignatureSection: React.FC<SignatureSectionProps> = ({
  control,
  errors,
  tr,
  onEditClick,
  onChange,
  urlBlob,
  disabled = false,
  generatingPDF = false,
}) => {
  return (
    <div className="contract-section">
      <div className="section-header">
        <h2>{tr('contract-cancellation.signature.title')}</h2>
      </div>
      <Card disabled={disabled} style={{ opacity: disabled ? 0.6 : 1, pointerEvents: disabled ? 'none' : 'auto' }}>
        <div className="d-flex mb-3 align-items-center">
          <FileLink className={!urlBlob || generatingPDF ? 'opacity-50' : ''} href={urlBlob || '#'} target="_blank">
            {tr('contract-cancellation.signature.download-pdf')}
          </FileLink>
          {generatingPDF && (
            <svg
              height="20"
              preserveAspectRatio="xMidYMid"
              style={{ shapeRendering: 'auto', display: 'block', background: 'rgb(255, 255, 255)' }}
              viewBox="0 0 100 100"
              width="30"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <g>
                <path
                  d="M24.3 30C11.4 30 5 43.3 5 50s6.4 20 19.3 20c19.3 0 32.1-40 
                  51.4-40 C88.6 30 95 43.3 95 50s-6.4 20-19.3 20C56.4 70 43.6 30 24.3 30z"
                  fill="none"
                  stroke="var(--clrPrimary)"
                  strokeDasharray="42.76482137044271 42.76482137044271"
                  strokeLinecap="round"
                  strokeWidth={8}
                  transform="scale(0.8) translate(10, 10)"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    dur="1s"
                    keyTimes="0;1"
                    repeatCount="indefinite"
                    values="0;256.58892822265625"
                  />
                </path>
                <g />
              </g>
            </svg>
          )}
        </div>
        <ControlledSignatureField
          clearButtonText={tr('contract-cancellation.signature.clear')}
          control={control}
          error={errors.signature}
          label={tr('contract-cancellation.signature.label')}
          name="signature"
          onChange={onChange}
          onEditClick={onEditClick}
          required
          rules={{ required: tr('contract-cancellation.validation.required') }}
          showEditButton
          tr={tr}
        />
      </Card>
    </div>
  );
};
export { SignatureSection };
