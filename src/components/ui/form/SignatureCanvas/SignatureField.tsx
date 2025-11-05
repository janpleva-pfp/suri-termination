import React, { useEffect, useRef, useState } from 'react';

import { LabelTitle } from '@pfp/frontend-platform';
import { Button, Form } from 'react-bootstrap';
import SignatureCanvas from 'react-signature-canvas';

import styles from './index.module.scss';
type SignatureFieldProps = {
  name: string;
  label: string;
  value?: string;
  onChange: (signature: string) => void;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  width?: number;
  height?: number;
  clearButtonText?: string;
  onEditClick?: () => void;
  editButtonText?: string;
  showEditButton?: boolean;
  tr: (key: string) => string;
};
export const SignatureField: React.FC<SignatureFieldProps> = ({
  name,
  label,
  value,
  onChange,
  disabled = false,
  error,
  required = false,
  width = 500,
  height = 200,
  clearButtonText = 'Clear Signature',
  tr,
  onEditClick,
  /*  editButtonText = 'Edit',
  showEditButton = false, */
}) => {
  const signatureRef = useRef<SignatureCanvas>(null);
  const [canvasSize, setCanvasSize] = useState({ width, height });
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const calculatedWidth = containerWidth - 2;
        setCanvasSize({ width: calculatedWidth, height });
      }
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [width, height]);
  useEffect(() => {
    return () => {
      onChange(''); // Clear signature on unmount
    };
  }, []);
  useEffect(() => {
    if (signatureRef.current && signatureRef.current.getCanvas().width !== canvasSize.width) {
      signatureRef.current.getCanvas().width = canvasSize.width;
      signatureRef.current.getCanvas().height = canvasSize.height;
    }
  }, [canvasSize]);
  const handleSignatureEnd = () => {
    if (signatureRef.current && !disabled) {
      const dataURL = signatureRef.current.toDataURL();
      onChange(dataURL);
    }
  };
  const handleClear = () => {
    if (signatureRef.current && !disabled) {
      signatureRef.current.clear();
      onChange('');
    }
  };
  /*   const handleEdit = () => {
    if (signatureRef.current && !disabled) {
      const dataURL = signatureRef.current.toDataURL();
      onChange(dataURL);
    }
    onEditClick?.();
  }; */
  return (
    <Form.Group>
      <LabelTitle className="mb-2">
        {label} {required && '*'}
      </LabelTitle>

      <div
        className={styles.signatureCanvas}
        ref={containerRef}
        style={{ width: '100%', ...(error ? { borderColor: 'var(--clrRed)' } : {}) }}
      >
        <SignatureCanvas
          canvasProps={{
            width: canvasSize.width,
            height: canvasSize.height,
            style: { display: 'block' },
          }}
          clearOnResize={false}
          onEnd={handleSignatureEnd}
          penColor={disabled ? '#6c757d' : '#000000'}
          ref={signatureRef}
        />
      </div>
      <p className="mt-4">{tr('contract-cancellation.signature.canvas-info')}</p>
      <div className="d-flex item-center justify-content-center gap-2 mt-2">
        <Button
          className="text-decoration-none txt-semibold mb-0 pb-0"
          disabled={disabled}
          onClick={handleClear}
          style={{ color: 'var(--clrPrimary)' }}
          type="button"
          variant="link"
        >
          {clearButtonText}
        </Button>
        {/* {showEditButton && (
          <Button variant="link" type="button" onClick={handleEdit} disabled={disabled}>
            {editButtonText}
          </Button>
        )} */}
      </div>
      {error && (
        <Form.Control.Feedback style={{ display: 'block' }} type="invalid">
          {error}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};
