//import { AppStateProvider } from '@app/src/contexts';
import { useEffect, useState } from 'react';

import { Button, DownloadSuriApp, FileLink } from '@pfp/frontend-platform';
import type { NextPage } from 'next';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

import { WEBSITE_PROPS } from '@app/constants/main';
import no1 from '@app/public/img/nums/no1.svg';
import no2 from '@app/public/img/nums/no2.svg';
import no3 from '@app/public/img/nums/no3.svg';
import { AppStateContextProps, useAppState } from '@app/src/contexts/appStateContext';
import { FinalStepDeciderResult } from '@app/src/types/Form/ContractCancellationForm';
import { finalStepDecider } from '@app/src/utils/finalStepDecider';
import { sendGaHit } from '@app/src/utils/helpers/gaHelper';
import { ErrorCard } from '@src/components/ui/error/ErrorCard';

const DocumentNeeded = (state: AppStateContextProps) => {
  const { t } = useTranslation('common');

  return (
    <>
      <h2 className="unstyled h2 mb-2">{t('contract-cancellation.finalScreen.documentsNeeded.title')}</h2>
      <p className="txt-20 txt-bold">{t('contract-cancellation.finalScreen.documentsNeeded.requirements')}</p>
      <div
        className="d-flex flex-column align-items-start text-start mx-auto mb-4"
        style={{ width: 'fit-content', maxWidth: '400px' }}
      >
        <div className="d-flex flex-row align-items-center justify-content-center mb-2 gap-3">
          <img alt="1." height={36} src={no1.src} width={36} />
          <p
            className="txt-18 mb-1"
            dangerouslySetInnerHTML={{
              __html: t('contract-cancellation.finalScreen.documentsNeeded.step1', {
                link: `<a href="mailto:${state.appState.linkBuilderData?.data?.policyHolder?.email}"
              target="_blank"
              class="txt-semibold"
              rel="noopener noreferrer">${state.appState.linkBuilderData?.data?.policyHolder?.email}</a>`,
              }),
            }}
          />
        </div>
        <div className="d-flex flex-row align-items-center justify-content-center mb-2 gap-3">
          <img alt="2." height={36} src={no2.src} width={36} />
          <p className="txt-18 mb-1">{t('contract-cancellation.finalScreen.documentsNeeded.step2')}</p>
        </div>
        <div className="d-flex flex-row align-items-center justify-content-center mb-2 gap-3">
          <img alt="3." height={36} src={no3.src} width={36} />
          <p
            className="txt-18 mb-1"
            dangerouslySetInnerHTML={{ __html: t('contract-cancellation.finalScreen.documentsNeeded.step3') }}
          />
        </div>
      </div>
      <FileLink className="mb-4 d-block" href={state.appState.pdf?.pdfData} target="_blank">
        {t('contract-cancellation.signature.download-pdf')}
      </FileLink>
    </>
  );
};
const AutoDocumentNeeded = (state: AppStateContextProps) => {
  const { t } = useTranslation('common');

  return (
    <>
      <h2 className="unstyled h2 mb-2">{t('contract-cancellation.finalScreen.autoDocumentsNeeded.title')}</h2>
      <p className="txt-20 txt-bold">{t('contract-cancellation.finalScreen.autoDocumentsNeeded.requirements')}</p>
      <div
        className="d-flex flex-column align-items-start text-start mx-auto mb-4"
        style={{ width: 'fit-content', maxWidth: '400px' }}
      >
        <div className="d-flex flex-row align-items-center justify-content-center mb-2 gap-3">
          <img alt="1." height={36} src={no1.src} width={36} />
          <p
            className="txt-18 mb-1"
            dangerouslySetInnerHTML={{
              __html: t('contract-cancellation.finalScreen.autoDocumentsNeeded.step1', {
                link: `<a href="mailto:${state.appState.linkBuilderData?.data?.policyHolder?.email}"
              target="_blank"
              class="txt-semibold"
              rel="noopener noreferrer">${state.appState.linkBuilderData?.data?.policyHolder?.email}</a>`,
              }),
            }}
          />
        </div>
        <div className="d-flex flex-row align-items-center justify-content-center mb-2 gap-3">
          <img alt="2." height={36} src={no2.src} width={36} />
          <p className="txt-18 mb-1">{t('contract-cancellation.finalScreen.autoDocumentsNeeded.step2')}</p>
        </div>
        <div className="d-flex flex-row align-items-center justify-content-center mb-2 gap-3">
          <img alt="3." height={36} src={no3.src} width={36} />
          <p
            className="txt-18 mb-1"
            dangerouslySetInnerHTML={{
              __html: t('contract-cancellation.finalScreen.autoDocumentsNeeded.step3', {
                email: `<a href="mailto:${WEBSITE_PROPS[state?.website]?.email}"
              target="_blank"
              class="txt-semibold"
              rel="noopener noreferrer">${WEBSITE_PROPS[state?.website]?.email}</a>`,
              }),
            }}
          />
        </div>
      </div>
    </>
  );
};
const AutoFinalization = (state: AppStateContextProps) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  return (
    <div className="mb-5">
      <h2 className="unstyled h2 mb-2">{t('contract-cancellation.finalScreen.autoFinalization.title')}</h2>
      <p
        className="txt-18"
        dangerouslySetInnerHTML={{
          __html: t('contract-cancellation.finalScreen.autoFinalization.subTitle', {
            link: `<a href="mailto:${state.appState.linkBuilderData?.data?.policyHolder?.email}"
              target="_blank"
              class="txt-semibold"
              rel="noopener noreferrer">${state.appState.linkBuilderData?.data?.policyHolder?.email}</a>`,
          }),
        }}
      />
      <Button
        chevronSize={20}
        onClick={() => {
          router.push('/');
        }}
        variant="bordered"
        withChevronRight
      >
        {String(t('contract-cancellation.finalScreen.autoFinalization.button')).replace(/&nbsp;/g, '\u00A0')}
      </Button>
    </div>
  );
};
const UserFinalization = (state: AppStateContextProps) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  return (
    <>
      <h2 className="unstyled h2 mb-2">{t('contract-cancellation.finalScreen.userFinalization.title')}</h2>
      <p className="txt-20 txt-bold">{t('contract-cancellation.finalScreen.userFinalization.requirements')}</p>
      <div
        className="d-flex flex-column align-items-start text-start mx-auto mb-4"
        style={{ width: 'fit-content', maxWidth: '400px' }}
      >
        <div className="d-flex flex-row align-items-center justify-content-center mb-2 gap-3">
          <img alt="1." height={36} src={no1.src} width={36} />
          <p
            className="txt-18 mb-1"
            dangerouslySetInnerHTML={{
              __html: t('contract-cancellation.finalScreen.userFinalization.step1', {
                link: `<a href="mailto:${state.appState.linkBuilderData?.data?.policyHolder?.email}"
              target="_blank"
              class="txt-semibold"
              rel="noopener noreferrer">${state.appState.linkBuilderData?.data?.policyHolder?.email}</a>`,
              }),
            }}
          />
        </div>
        <div className="d-flex flex-row align-items-center justify-content-center mb-2 gap-3">
          <img alt="2." height={36} src={no2.src} width={36} />
          <p
            className="txt-18 mb-1"
            dangerouslySetInnerHTML={{
              __html: t('contract-cancellation.finalScreen.userFinalization.step2', {
                websiteName: WEBSITE_PROPS[state?.website]?.name,
              }),
            }}
          />
        </div>
      </div>
      <FileLink className="mb-4 d-block" href={state.appState.pdf?.pdfData} target="_blank">
        {t('contract-cancellation.signature.download-pdf')}
      </FileLink>
    </>
  );
};
const AgentFinalPage = ({ state, resultType }: { state: AppStateContextProps; resultType: FinalStepDeciderResult }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  return (
    <div className="mb-5">
      <h2 className="unstyled h2 mb-2">{t('contract-cancellation.finalScreen.agentFinalScreen.title')}</h2>
      <p className="txt-18">{t('contract-cancellation.finalScreen.agentFinalScreen.subTitle')}</p>
      {resultType && 'terminationState' in resultType && (
        <div className="mt-4 mb-4">
          <strong>{t('contract-cancellation.terminationResult.title')}</strong>
          <br />
          <span>{t('contract-cancellation.terminationResult.' + resultType.terminationState)}</span>
        </div>
      )}
      {resultType &&
        'emailActions' in resultType &&
        resultType.emailActions.map((action, index) => (
          <div className="mt-2 mb-4" key={index}>
            <strong>{t('contract-cancellation.emailActions.' + action.emailAction)}</strong>
            <br />
            {t('contract-cancellation.emailTo.title')} {t('contract-cancellation.emailTo.' + action.emailTo)}
          </div>
        ))}
      <Button
        chevronSize={20}
        onClick={() => {
          router.push('/');
        }}
        variant="bordered"
        withChevronRight
      >
        {String(t('contract-cancellation.finalScreen.agentFinalScreen.button')).replace(/&nbsp;/g, '\u00A0')}
      </Button>
    </div>
  );
};
const SuccessPage: NextPage = () => {
  const { t } = useTranslation('common');
  let state = useAppState();
  const router = useRouter();
  const realTarget = state.appState.linkBuilderData?.properties?.agent ? 'agent' : 'client';
  const [resultType, setResultType] = useState<FinalStepDeciderResult | undefined>();
  const [target, setTarget] = useState<'agent' | 'client'>();

  useEffect(() => {
    if (!state.appState.linkBuilderData) {
      router.push('/');
      return;
    }
    setTarget(router.query['target'] === 'agent' ? 'agent' : 'client');
    setResultType(
      finalStepDecider(
        state.appState.linkBuilderData,
        realTarget,
        router.query['target'] === 'agent' ? 'agent' : 'client',
      ),
    );
  }, [router.isReady]);
  useEffect(() => {
    if (!resultType) {
      return;
    }
    sendGaHit(state.appState.linkBuilderData?.trackingParams || {}, 'page_view', {
      lbData: state.appState.linkBuilderData,
    });
  }, [resultType]);

  return (
    (resultType && (
      <div className="container-sm px-md-0 position-relative mt-5 mx-auto">
        <div className="text-center mb-5">
          {target === 'agent' ? (
            <AgentFinalPage resultType={resultType} state={state} />
          ) : resultType && 'result' in resultType ? (
            resultType.result === 'documentsNeeded' ? (
              <DocumentNeeded {...state} />
            ) : resultType.result === 'autoFinalization' ? (
              <AutoFinalization {...state} />
            ) : resultType.result === 'userFinalization' ? (
              <UserFinalization {...state} />
            ) : resultType.result === 'documentsForAuto' ? (
              <AutoDocumentNeeded {...state} />
            ) : null
          ) : null}
          {resultType && 'result' in resultType && state.isSuri && (
            <DownloadSuriApp>
              <div className="text-start">
                <p className="txt-18 txt-bold">{t('contract-cancellation.finalScreen.appCard.title')}</p>
                <p className="txt-18">{t('contract-cancellation.finalScreen.appCard.message')}</p>
              </div>
            </DownloadSuriApp>
          )}
          {resultType && 'error' in resultType && (
            <ErrorCard
              linkid={state?.appState.linkBuilderData?.linkId}
              phoneInfo={WEBSITE_PROPS[state?.website]?.phoneInfo}
              router={router}
              website={state?.website}
            />
          )}
        </div>
      </div>
    )) ||
    (!resultType && (
      <div className="container-sm px-md-0 position-relative mt-5 mx-auto">
        <div className="text-center mb-5">
          <SkeletonTheme baseColor="#FFF" borderRadius={32} highlightColor="var(--clrOrangeLight)">
            <Skeleton className="mb-4" count={1} duration={1} height={40} />
            <Skeleton className="mb-4" count={1} duration={2} height={40} />
            <Skeleton className="mb-4" count={1} duration={3} height={40} />
          </SkeletonTheme>
        </div>
      </div>
    ))
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'cs', ['common'])),
    },
  };
};

export default SuccessPage;
