import React, { memo } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import FaviconGen from './faviconGen';
import styles from './index.module.scss';
interface Props {
  title?: string;
  description?: string;
  stepperClassName?: string;
  withoutStepper?: boolean;
  token: string | null;
  website: string;
  children?: React.ReactNode;
}
export const Layout: React.FC<Props> = (props) => {
  const { title, children, website } = props;
  const router = useRouter();
  const { t } = useTranslation('common');
  return (
    <>
      <Head>
        <title>{`${title ? `${title} | ` : ''}${t('gnvPageTitle')}`}</title>
        <FaviconGen website={website} />
        <meta content="noindex,nofollow" key="robots" name="robots" />
        <meta content="noindex,nofollow" key="googlebot" name="googlebot" />
      </Head>
      <div>
        <main className={styles.main}>{children}</main>
      </div>
    </>
  );
};
export default memo(Layout);
