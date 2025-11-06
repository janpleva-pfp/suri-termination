import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Button, getBrandConsent, getWebsiteFromDomain } from '@pfp/frontend-platform';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Alert, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

import { TE_DEFAULT_PHONE_PREFIX } from '@app/constants/termination';
import { transformTerminationEntityToFormData } from '@app/src/lib/transformDataFE';
import { apiRequest } from '@app/src/pages/api';
import {
  ContractCancellationFormData,
  ContractCancellationFormProps,
  FinalStepDeciderResult,
  SubmitAndRedirectParams,
} from '@app/src/types/Form/ContractCancellationForm';
import { TerminationEntity } from '@app/src/types/TerminationEntity/TerminationEntity';
import { sendErrorEmailIfNeeded } from '@app/src/utils/errorEmailService';
import { finalStepDecider } from '@app/src/utils/finalStepDecider';
import { sendGaHit } from '@app/src/utils/helpers';
import { generatePDFFile } from '@app/src/utils/pdfBlobGeneration';
import { FORM_FIELD_BANK_ACCOUNT_REGEX, FORM_FIELD_EMAIL_REGEX, FORM_FIELD_PHONE_REGEX } from '@constants/form';
import { blobUrlToBase64 } from '@lib/blobHelper';

import { ActionType, useAppState } from '../../contexts/appStateContext';

import terminationReasonsData from './data/terminationReasons.json';
import { ContractInfoSection, PolicyHolderSection, RefundInfoSection, SignatureSection } from './sections';
// Form data interface

const ContractCancellationForm: React.FC<ContractCancellationFormProps> = ({ insuranceCompanies }) => {
  const router = useRouter();
  const state = useAppState();
  /*
   *
   * States
   *
   */
  // Form submission states
  const [contractCancellationRequestId, setContractCancellationRequestId] = useState<string | null>(null);
  const { t } = useTranslation('common');
  const [target, setTarget] = useState<'client' | 'agent'>('client');
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'loading' | 'edit' | 'signature_required' | 'success' | 'error'
  >('idle');

  //Pdf generation states
  const [loaded, setLoaded] = useState(false);
  const [showSignatureSection, setShowSignatureSection] = useState(false);
  const [pdfDownloadUrl, setPdfDownloadUrl] = useState<string | null>(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [triggerSubmitAndRedirect, setTriggerSubmitAndRedirect] = useState<SubmitAndRedirectParams>();
  const [triggerAgentFinalization, setTriggerAgentFinalization] = useState<ContractCancellationFormData | null>(null);

  /*
   *
   * Constants and Memoized Values
   *
   */
  const { dispatch } = useAppState();

  // Memoize form default values to prevent object recreation on every render
  const defaultFormValues = useMemo(
    (): ContractCancellationFormData => ({
      contractNumber: '',
      insuranceCompany: '',
      contractTerminationReason: 'anniversaryOfInsuranceContract' as any,
      differentReason: '',
      policyHolderType: '' as any, // Start empty so additional fields are hidden
      firstName: '',
      lastName: '',
      birthNumber: '',
      ico: '',
      companyName: '',
      companyID: '',
      street: '',
      town: '',
      zip: '',
      phoneNumber: '',
      email: '',
      overpaymentSendTo: 'bankAccount',
      bankAccount: '',
    }),
    [],
  );

  const {
    control,
    watch,
    formState: { errors },
    setValue,
    unregister,
    clearErrors,
    trigger,
  } = useForm<ContractCancellationFormData>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: defaultFormValues,
  });
  const DIGITS_ONLY_REGEX = /^\d+$/;
  const ZIP_CODE_REGEX = /^\d{5}$/;
  const [statusText, setStatusText] = useState('contract-cancellation.messages.submit-error');

  // Optimized watching: Use selective watching instead of multiple watch calls
  // This creates a single subscription for all watched fields, reducing re-renders
  const watchedFields = watch(['contractTerminationReason', 'policyHolderType', 'overpaymentSendTo', 'signature']);
  const [watchedTerminationReason, watchedPolicyHolderType, watchedOverpaymentSendTo, watchedSignature] = watchedFields;

  // Store blob URLs in a ref to track all created URLs for cleanup
  const blobUrlsRef = useRef<Set<string>>(new Set());

  // Enhanced cleanup function for all blob URLs
  const cleanupBlobUrls = useCallback(() => {
    blobUrlsRef.current.forEach((url) => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    blobUrlsRef.current.clear();
  }, []);

  // Enhanced function to track and manage blob URLs
  const addBlobUrl = useCallback((url: string) => {
    if (url.startsWith('blob:')) {
      blobUrlsRef.current.add(url);
    }
    return url;
  }, []);

  // Cleanup function for blob URLs
  useEffect(() => {
    return () => {
      cleanupBlobUrls();
    };
  }, [cleanupBlobUrls]);

  // Cleanup specific PDF URL when it changes
  useEffect(() => {
    return () => {
      if (pdfDownloadUrl && pdfDownloadUrl.startsWith('blob:')) {
        URL.revokeObjectURL(pdfDownloadUrl);
      }
    };
  }, [pdfDownloadUrl]);

  // On mount, check for linkId in URL or props and load data
  const hasLoadedRef = React.useRef(false); // To prevent double loading in Strict Mode

  useEffect(() => {
    if (!router.isReady || hasLoadedRef.current) {
      return;
    }
    hasLoadedRef.current = true;

    const routerLinkId = router.query.linkId?.toString();
    if (routerLinkId) {
      setContractCancellationRequestId(routerLinkId);
    }
    setTarget(router.query.target?.toString() === 'agent' ? 'agent' : 'client');

    if (typeof routerLinkId === 'undefined' || !routerLinkId) {
      devlogger.warn('No linkId found in URL or props');

      sendGaHit(state.appState.formData?.parentSettings || {}, 'page_view');
      setLoaded(true);
      return;
    }

    apiRequest({ action: 'lbGetTermination', linkId: routerLinkId }).then((response) => {
      if (response.status !== 200 || !response.data) {
        devlogger.error('Failed to fetch termination data:', response.error);
        setStatusText('contract-cancellation.messages.load-error');
        setSubmitStatus('idle');
        setLoaded(true);
        return;
      }
      devlogger.log('Fetched termination data:', response.data);
      // Populate form with fetched data
      const formData = { ...defaultFormValues, ...transformTerminationEntityToFormData(response.data.data) };
      populateFormWithData(formData);
      let lbData = response.data.data as TerminationEntity;
      // Save to AppState
      dispatch({
        type: ActionType.UpdateStore,
        payload: {
          linkBuilderData: lbData,
        },
      });
      sendGaHit(lbData.trackingParams || {}, 'page_view', { lbData });
      // Agent should not see signature section
      if (router.query.target?.toString() === 'agent') {
        setSubmitStatus('idle');
        setLoaded(true);
        return;
      }
      setTimeout(() => {
        trigger().then(async (isValid) => {
          if (!isValid) {
            setLoaded(true);
            setSubmitStatus('idle');
          }
          const pdfFile = await generatePDFFile(formData, routerLinkId);
          setLoaded(true);
          if (pdfFile?.downloadBlob) {
            const trackedUrl = addBlobUrl(pdfFile.downloadBlob);
            setPdfDownloadUrl(trackedUrl);
            setSubmitStatus('signature_required');
            setShowSignatureSection(true);
          } else {
            setLoaded(true);
            setSubmitStatus('error');
            setStatusText('contract-cancellation.messages.pdf-generation-error');
            sendErrorEmailIfNeeded('PDF generation failed on load', 'pdf-generation', state.appState.linkBuilderData);
            return;
          }
        });
      }, 100); // Enforcing form to be populated before validation
    });
  }, [router.isReady]);

  // Reset form when user clicks "Edit Form"
  useEffect(() => {
    if (submitStatus === 'edit') {
      // When user clicks "Edit Form", reset to idle state and hide signature section
      setShowSignatureSection(false);
      setSubmitStatus('idle');
    }
  }, [submitStatus]);

  // Ensure signature field is unregistered & cleared while the signature section is hidden.
  useEffect(() => {
    if (!showSignatureSection) {
      // Unregister prevents React Hook Form from validating the field when it's not mounted/visible.
      unregister('signature');
      clearErrors('signature');
      setValue('signature', '');
    }
    // When the signature section is shown, the Controller inside SignatureSection will re-register the field.
  }, [showSignatureSection, unregister, clearErrors, setValue]);

  // Ref for signature section
  const signatureSectionRef = useRef<HTMLDivElement>(null);

  // Scroll to signature section when it becomes visible and loaded
  useEffect(() => {
    if (showSignatureSection && loaded && signatureSectionRef.current) {
      setTimeout(() => {
        signatureSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [showSignatureSection, loaded]);

  // Trigger form submission and redirection
  useEffect(() => {
    if (triggerSubmitAndRedirect && Object.keys(triggerSubmitAndRedirect).length > 0) {
      submitAndRedirect(triggerSubmitAndRedirect);
    }
  }, [triggerSubmitAndRedirect]);

  // Trigger agent finalization after state is updated
  useEffect(() => {
    if (triggerAgentFinalization && state.appState.linkBuilderData?.data) {
      finalizeForm(triggerAgentFinalization);
      setTriggerAgentFinalization(null); // Reset trigger
    }
  }, [triggerAgentFinalization, state.appState.linkBuilderData]);

  /*
   *
   * Supporting form functions
   *
   */
  // Helper function to safely use translations - memoized
  const tr = useCallback((key: string, params?: Record<string, any>): string => t(key, params) as string, [t]);

  // Helper function to scroll to the first error field
  const scrollToFirstError = useCallback(() => {
    const firstErrorKey = Object.keys(errors)[0];
    if (!firstErrorKey) return;

    const selectors = [
      `[data-field="${firstErrorKey}"]`,
      `#${firstErrorKey}`,
      `[name="${firstErrorKey}"]`,
    ];

    let errorElement: HTMLElement | null = null;
    for (const selector of selectors) {
      errorElement = document.querySelector(selector);
      if (errorElement) break;
    }

    if (errorElement) {
      const elementPosition = errorElement.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - 100;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });

      setTimeout(() => {
        const focusable = errorElement?.querySelector('[role="combobox"], input, textarea, select, [tabindex]');
        if (focusable) {
          (focusable as HTMLElement).focus();
        } else {
          errorElement?.focus();
        }
      }, 300);
    }
  }, [errors]);

  // Custom submit handler that validates only relevant fields - memoized
  const handleFormSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      // If signature section is not visible, validate all fields except signature
      if (!showSignatureSection) {
        const fieldsToValidate = [
          'contractNumber',
          'insuranceCompany',
          'contractTerminationReason',
          'policyHolderType',
          'firstName',
          'lastName',
          'street',
          'town',
          'zip',
          'phoneNumber',
          'email',
          'overpaymentSendTo',
        ];
        // Add conditional fields based on form state
        if (watch('contractTerminationReason') === 'differentReason') {
          fieldsToValidate.push('differentReason');
        }
        if (watch('policyHolderType') === 'person') {
          fieldsToValidate.push('birthNumber');
        }
        if (watch('policyHolderType') === 'self-employed') {
          fieldsToValidate.push('ico', 'companyName', 'companyID');
        }
        if (watch('overpaymentSendTo') === 'bankAccount' || watch('overpaymentSendTo') === 'otherAccount') {
          fieldsToValidate.push('bankAccount');
        }
        const isValid = await trigger(fieldsToValidate as any);
        if (!isValid) {
          setSubmitStatus('idle');
          // Scroll to the first error field
          setTimeout(() => scrollToFirstError(), 100);
          return;
        }
      } else {
        const isValid = await trigger();
        if (!isValid) {
          setSubmitStatus('idle');
          // Scroll to the first error field
          setTimeout(() => scrollToFirstError(), 100);
          return;
        }
      }
      // Submit the form data
      const data = watch();
      onSubmit(data);
    },
    [showSignatureSection, watch, trigger, state.appState.linkBuilderData, contractCancellationRequestId, scrollToFirstError],
  ); // onSubmit will be defined later

  // Form submission handler - executes after handleFormSubmit validates the form
  const onSubmit = async (data: ContractCancellationFormData) => {
    setSubmitStatus('loading');

    // If signature section is visible, we are in the final step
    // so we can safely skip the rest of the submission and finalize the process
    if (showSignatureSection) {
      finalizeForm(data);
      return;
    }

    // If we reach here, we are submitting the form for the first time
    try {
      // No linkId in URL and no existing session - create new one
      const linkBuilderResponse = await apiRequest({
        action: contractCancellationRequestId ? 'lbEditTermination' : 'lbNewTermination',
        ...(contractCancellationRequestId && { linkId: contractCancellationRequestId }),
        target: 'client',
        data,
        lbData: state.appState.linkBuilderData,
      });

      if (linkBuilderResponse.status !== 200) {
        setSubmitStatus('error');
        // Send error email
        await sendErrorEmailIfNeeded(
          'Failed to create/update termination in LinkBuilder',
          contractCancellationRequestId ? 'lb-update' : 'lb-create',
          state.appState.linkBuilderData,
        );
        return;
      }
      const LBData = linkBuilderResponse.data;
      if (LBData.id) setContractCancellationRequestId(LBData.id);
      dispatch({ type: ActionType.UpdateStore, payload: { linkBuilderData: LBData.data } });

      router.replace(
        {
          pathname: router.pathname,
          query: { ...router.query, linkId: LBData.id },
        },
        undefined,
        { shallow: true },
      );

      setGeneratingPDF(true);
      const pdfFile = await generatePDFFile(data, LBData.id);
      setGeneratingPDF(false);

      if (pdfFile?.downloadBlob) {
        const trackedUrl = addBlobUrl(pdfFile.downloadBlob);
        setPdfDownloadUrl(trackedUrl);
        dispatch({
          type: ActionType.UpdateStore,
          payload: {
            pdf: { ...(pdfFile.fileOutsideUrl && { fileOutsideUrl: pdfFile.fileOutsideUrl }), pdfData: trackedUrl },
          },
        });
      } else {
        setSubmitStatus('error');
        devlogger.error('No PDF file generated', pdfFile);
        // Send error email for PDF generation failure (no PDF URL to attach)
        await sendErrorEmailIfNeeded('PDF generation failed', 'pdf-generation', LBData.data);
        return;
      }
      // Check if this is an agent submission after state is updated
      if (router.query.target?.toString() === 'agent') {
        setTriggerAgentFinalization(data);
        return;
      }
      setShowSignatureSection(true);
      setSubmitStatus('signature_required');
      return;
    } catch (error) {
      setSubmitStatus('error');
      devlogger.error('Error in form submission:', error);
      // Send error email with PDF if available
      await sendErrorEmailIfNeeded(
        error as Error,
        'form-submit',
        state.appState.linkBuilderData,
        state.appState.pdf?.fileOutsideUrl,
      );
      return;
    }
  };
  // Include dependencies for useCallback

  // Finalize the form after signature is provided - memoized
  const finalizeForm = useCallback(
    async (data: ContractCancellationFormData) => {
      setSubmitStatus('loading');
      let pdfFileUrl = null;
      pdfFileUrl = await generatePDFFile(data, contractCancellationRequestId!);
      if (pdfFileUrl?.downloadBlob) {
        dispatch({
          type: ActionType.UpdateStore,
          payload: {
            pdf: {
              ...(pdfFileUrl.fileOutsideUrl && { fileOutsideUrl: pdfFileUrl.fileOutsideUrl }),
              pdfData: pdfFileUrl.downloadBlob,
            },
          },
        });
      } else {
        devlogger.error('Error generating signed PDF file:', pdfFileUrl);
        setStatusText('contract-cancellation.messages.pdf-generation-error');
        setSubmitStatus('error');
        // Send error email for final PDF generation failure
        await sendErrorEmailIfNeeded('Final PDF generation failed', 'pdf-generation', state.appState.linkBuilderData);
        return;
      }

      if (!state.appState.linkBuilderData?.data) {
        devlogger.error('No linkBuilderData in state');
        setSubmitStatus('error');
        await sendErrorEmailIfNeeded(
          'No linkBuilderData in state during finalization',
          'form-submit',
          state.appState.linkBuilderData,
          state.appState.pdf?.fileOutsideUrl,
        );
        return;
      }

      // Decide final step based on current data
      // if data in linkBuilder have agent property, the agent paths should be used
      let deciderActions: FinalStepDeciderResult;
      if (target === 'agent') {
        await setTriggerSubmitAndRedirect({
          routerParams: { pathname: '/shrnuti', query: { target: 'agent' } },
          deciderActions: {
            result: 'autoFinalization',
            terminationState: 'sentForSignature',
            emailActions: [{ emailAction: 'linkToClient', emailTo: 'client' }],
          },
        });
        return;
      }
      const realTarget = state.appState.linkBuilderData.properties?.agent ? 'agent' : 'client';
      deciderActions = finalStepDecider(state.appState.linkBuilderData, realTarget, target);
      // Normalize router.query (which can contain string | string[] | undefined) to Record<string, string>
      const normalizedQuery: Record<string, string> = Object.entries(router.query || {}).reduce((acc, [key, val]) => {
        if (val === undefined) return acc;
        acc[key] = Array.isArray(val) ? val[0] : val;
        return acc;
      }, {} as Record<string, string>);
      setTriggerSubmitAndRedirect({
        routerParams: { pathname: '/shrnuti', query: normalizedQuery },
        deciderActions,
      });
      return;
    },
    [state.appState.linkBuilderData, router],
  ); // Include dependencies for useCallback

  const submitAndRedirect = async ({
    routerParams = { pathname: '/shrnuti' },
    deciderActions,
  }: SubmitAndRedirectParams) => {
    try {
      const crmResponse = await apiRequest({
        action: 'crmCreateTermination',
        lbData: state.appState.linkBuilderData,
        deciderActions: deciderActions!,
        ...(state.appState.pdf?.fileOutsideUrl && {
          fileData: {
            fileUrl: state.appState.pdf.fileOutsideUrl || '',
            fileTime: new Date().toISOString(),
          },
        }),
      });

      if (crmResponse.status !== 200) {
        devlogger.error('CRM update failed:', crmResponse);
        // Send error email for CRM failure
        await sendErrorEmailIfNeeded(
          'CRM termination update failed',
          'crm-update',
          state.appState.linkBuilderData,
          state.appState.pdf?.fileOutsideUrl,
        );
        setSubmitStatus('error');
        setStatusText('contract-cancellation.messages.submit-error');
        return;
      }
    } catch (error) {
      devlogger.error('Exception during CRM update:', error);
      await sendErrorEmailIfNeeded(
        error as Error,
        'crm-update',
        state.appState.linkBuilderData,
        state.appState.pdf?.fileOutsideUrl,
      );
      setSubmitStatus('error');
      setStatusText('contract-cancellation.messages.submit-error');
      return;
    }

    if (!deciderActions) {
      devlogger.error('No deciderActions provided for submitAndRedirect');
      return;
    }
    if ('result' in deciderActions && 'emailActions' in deciderActions && 'terminationState' in deciderActions) {
      // Send emails based on decider actions
      if (deciderActions.emailActions && deciderActions.emailActions.length > 0) {
        // Convert PDF blob URL to base64 once if available
        let pdfBase64Content: string | undefined;
        if (state.appState.pdf?.pdfData) {
          try {
            pdfBase64Content = await blobUrlToBase64(state.appState.pdf.pdfData);
          } catch (error) {
            setStatusText('contract-cancellation.messages.pdf-generation-error');
            setSubmitStatus('error');
            devlogger.error('Error converting PDF blob to base64:', error);
            // Send error email for PDF conversion failure
            await sendErrorEmailIfNeeded(
              'Failed to convert PDF blob to base64 for email',
              'email-send',
              state.appState.linkBuilderData,
              state.appState.pdf?.fileOutsideUrl,
            );
            return;
          }
        }

        for (const emailAction of deciderActions.emailActions) {
          try {
            console.log('Sending email action:', emailAction, state.appState.linkBuilderData);
            const emailResponse = await apiRequest({
              action: 'emailSubmit',
              emailAction: emailAction.emailAction,
              emailTo: emailAction.emailTo,
              terminationData: state.appState.linkBuilderData,
              pdfBase64Content,
            });

            if (emailResponse.status !== 200) {
              devlogger.error('Failed to send email:', emailAction, emailResponse);
              // Send error email for email sending failure
              await sendErrorEmailIfNeeded(
                `Email sending failed: ${emailAction.emailAction} to ${emailAction.emailTo}`,
                'email-send',
                state.appState.linkBuilderData,
                state.appState.pdf?.fileOutsideUrl,
              );
              // Show error but continue with other emails
              setStatusText('contract-cancellation.messages.email-send-error');
            }
          } catch (error) {
            devlogger.error('Error sending email:', emailAction, error);
            // Send error email for email sending exception
            await sendErrorEmailIfNeeded(
              error as Error,
              'email-send',
              state.appState.linkBuilderData,
              state.appState.pdf?.fileOutsideUrl,
            );
            setStatusText('contract-cancellation.messages.email-send-error');
          }
        }
      }
    } else {
      setStatusText('contract-cancellation.messages.submit-error');
      setSubmitStatus('error');
      return;
    }
    router.push(routerParams);
  };

  // Helper function to populate form with existing data - memoized to prevent recreation
  const populateFormWithData = useCallback(
    (formData: Partial<ContractCancellationFormData>, reassignEmpty = true) => {
      Object.entries(formData).forEach(([key, value]) => {
        // Remove +420 prefix from phoneNumber if present
        if (key === 'phoneNumber' && typeof value === 'string' && value.startsWith(TE_DEFAULT_PHONE_PREFIX)) {
          // Escape '+' for regex
          const escapedPrefix = TE_DEFAULT_PHONE_PREFIX.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          value = value.replace(new RegExp(`^${escapedPrefix}\\s?`), '');
        }
        if (reassignEmpty || (value !== null && value !== undefined && value !== '')) {
          setValue(key as keyof ContractCancellationFormData, value, {
            shouldValidate: true, // Validate on initial load
            shouldDirty: false, // Don't mark as dirty on initial load
            shouldTouch: false, // Don't mark as touched on initial load
          });
        }
      });
    },
    [setValue],
  );
  /*
   *
   * Memoized computed values for better performance
   *
   */
  const terminationReasonOptions = useMemo(
    () =>
      terminationReasonsData.map((reason) => ({
        value: reason.value,
        label: tr(reason.translationKey),
      })),
    [tr],
  );

  const insuranceCompanyOptions = useMemo(
    () =>
      insuranceCompanies
        ? Object.values(insuranceCompanies)
            .map((company) => {
              if (!company.name || !company.contentKey) {
                return null;
              }
              return {
                value: company.contentKey,
                label: company.name,
              };
            })
            .filter((option): option is { value: string; label: string } => option !== null)
        : [],
    [insuranceCompanies, tr],
  );
  return (
    <Container className="container-sm px-0 my-5">
      {!loaded ? (
        <SkeletonTheme baseColor="#FFF" borderRadius={32} highlightColor="var(--clrOrangeLight)">
          <Skeleton className="mb-4" count={1} height={40} />
          <Skeleton className="mb-4" count={1} height={240} />
          <Skeleton className="mb-4" count={1} height={40} />
          <Skeleton className="mb-4" count={1} height={540} />
          <Skeleton className="mb-4" count={1} height={40} />
          <Skeleton className="mb-4" count={1} height={540} />
        </SkeletonTheme>
      ) : (
        <div className="mx-auto px-4">
          {submitStatus === 'error' && (
            <Alert className="mb-4" variant="danger">
              {tr(statusText)}
            </Alert>
          )}
          <Form onSubmit={handleFormSubmit}>
            {/* Section 1: Údaje o smlouvě */}
            {insuranceCompanyOptions && (
              <ContractInfoSection
                DIGITS_ONLY_REGEX={DIGITS_ONLY_REGEX}
                control={control}
                disabled={showSignatureSection || submitStatus === 'loading' || submitStatus === 'success'}
                errors={errors}
                insuranceCompanyOptions={insuranceCompanyOptions}
                terminationReasonOptions={terminationReasonOptions}
                tr={tr}
                watchedTerminationReason={watchedTerminationReason}
              />
            )}
            {/* Section 2: Údaje o pojistníkovi */}
            <PolicyHolderSection
              FORM_FIELD_EMAIL_REGEX={FORM_FIELD_EMAIL_REGEX}
              FORM_FIELD_PHONE_REGEX={FORM_FIELD_PHONE_REGEX}
              ZIP_CODE_REGEX={ZIP_CODE_REGEX}
              control={control}
              disabled={showSignatureSection || submitStatus === 'loading' || submitStatus === 'success'}
              errors={errors}
              tr={tr}
              watchedPolicyHolderType={watchedPolicyHolderType}
            />
            {/* Section 3: Vyřízení přeplatku */}
            <RefundInfoSection
              BANK_ACCOUNT_REGEX={FORM_FIELD_BANK_ACCOUNT_REGEX}
              ZIP_CODE_REGEX={ZIP_CODE_REGEX}
              control={control}
              disabled={showSignatureSection || submitStatus === 'loading' || submitStatus === 'success'}
              errors={errors}
              tr={tr}
              watchedOverpaymentSendTo={watchedOverpaymentSendTo}
            />
            {showSignatureSection && (
              <div className="d-flex justify-content-end mt-4">
                <Button
                  chevronSize={20}
                  disabled={submitStatus === 'loading'}
                  onClick={() => {
                    setShowSignatureSection(false);
                    setSubmitStatus('idle');
                  }}
                  size="large"
                  type="button"
                  variant="bordered"
                  withChevronRight
                >
                  {tr('contract-cancellation.buttons.edit-form')}
                </Button>
              </div>
            )}
            {/* Section 4: Podpis */}
            {showSignatureSection && (
              <>
                <div className="signature-section-active" ref={signatureSectionRef}>
                  <SignatureSection
                    control={control}
                    disabled={submitStatus === 'loading'}
                    errors={errors}
                    generatingPDF={generatingPDF}
                    onEditClick={() => setSubmitStatus('edit')}
                    tr={tr}
                    urlBlob={pdfDownloadUrl}
                  />
                </div>
              </>
            )}
            <Container className="contract-section px-0">
              <Row className="mt-4 mx-0 px-0">
                <Col className="txt-14 px-0">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: tr('contract-cancellation.sections.privacy-policy-description', {
                        link:
                          '<a href="' +
                          getBrandConsent(getWebsiteFromDomain()) +
                          '" target="_blank" rel="noopener noreferrer">',
                        endLink: '</a>',
                      }),
                    }}
                  />
                </Col>
                <Col className="text-center text-sm-end mt-3 mt-sm-0" sm="5" xs="12">
                  <Button
                    chevronSize={20}
                    disabled={submitStatus === 'loading' || (showSignatureSection && !watchedSignature)}
                    type="submit"
                    variant="primary"
                    withChevronRight={submitStatus !== 'signature_required'}
                  >
                    {submitStatus === 'loading'
                      ? tr('contract-cancellation.buttons.submitting')
                      : showSignatureSection
                      ? watchedSignature
                        ? tr('contract-cancellation.buttons.save')
                        : tr('contract-cancellation.buttons.please-sign')
                      : submitStatus === 'edit'
                      ? tr('contract-cancellation.buttons.save')
                      : tr('contract-cancellation.buttons.save')}
                  </Button>
                </Col>
              </Row>
            </Container>
          </Form>
        </div>
      )}
    </Container>
  );
};
export { ContractCancellationForm };
