import { useEffect } from 'react';

import { getWebsiteFromDomain } from '@pfp/frontend-platform';
import type { GetServerSideProps, NextPage } from 'next';
// eslint-disable-next-line import/order
import { useRouter } from 'next/router';

import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { sapiGetInsuranceCompaniesOptions } from '@app/server/api/sapiGetInsuranceCompaniesOptions';
import devlogger from '@app/src/utils/devlogger';
import { Layout } from '@src/components';

import { ContractCancellationForm } from '../components/ContractCancellationForm/ContractCancellationForm';
import { useAppState } from '../contexts';
import { ActionType } from '../contexts/appStateContext';
import { InsuranceCompanyOption } from '../types';
import { getInitialParentSettings } from '../utils/helpers';

interface ContractCancellationPageProps {
  insuranceCompanies?: InsuranceCompanyOption[];
}
const ContractCancellationPage: NextPage<ContractCancellationPageProps> = (props) => {
  const { t } = useTranslation('common');

  // Helper function to safely use translations
  const tr = (key: string): string => t(key) as string;
  const router = useRouter();
  const state = useAppState();
  const { dispatch } = state;
  const appState = state.appState;
  useEffect(() => {
    if (!router.isReady) return;
    const linkIdFromQuery = router.query?.linkid?.toString() || router.query?.linkId?.toString();
    const hasNewLinkId = !!linkIdFromQuery && linkIdFromQuery !== appState.formData?.parentSettings?.linkId;
    const isProduction = process.env.CONTENT_ENV === 'production';
    const parentSettings = getInitialParentSettings(router, isProduction, appState.formData?.parentSettings);
    dispatch({
      type: ActionType.UpdateParentSettings,
      payload: {
        formData: {
          parentSettings,
        },
      },
    });
  }, [router.isReady]);

  const website = router.query['website']?.toString() || (getWebsiteFromDomain() as string);
  return (
    <Layout title={tr('contract-cancellation.page-title')} token={null} website={website}>
      <ContractCancellationForm insuranceCompanies={props.insuranceCompanies} token={null} />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const insuranceCompanies = await sapiGetInsuranceCompaniesOptions();

    return {
      props: {
        ...(insuranceCompanies.data && { insuranceCompanies: insuranceCompanies.data }),
        ...(await serverSideTranslations(context.locale ?? 'cs', ['common'])),
      },
    };
  } catch (error: any) {
    devlogger.error('Failed to fetch insurance companies during SSR:', {
      error: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    // Return minimal props to allow page to render
    // The form can handle missing insurance companies gracefully
    return {
      props: {
        insuranceCompanies: [],
        ...(await serverSideTranslations(context.locale ?? 'cs', ['common'])),
      },
    };
  }
};
export default ContractCancellationPage;
