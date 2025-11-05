// React and component imports
import { useEffect } from 'react';

import { getWebsiteFromDomain, ThemeProvider } from '@pfp/frontend-platform';
import { AppProps } from 'next/app';
import getConfig from 'next/config';
import Router, { useRouter, withRouter } from 'next/router';
// eslint-disable-next-line import/order
import { appWithTranslation } from 'next-i18next';

import { DEFAULT_MARKETING_IDS, MARKETING_IDS } from '@app/constants';
import devlogger from '@app/src/utils/devlogger';

import { AppStateProvider } from '../contexts';
import { useClientSide } from '../lib/hooks/useClientSide';

// Make logger globally available in development
if (typeof window !== 'undefined') {
  (window as any).devlogger = devlogger;
} else if (typeof global !== 'undefined') {
  (global as any).devlogger = devlogger;
}

// CSS imports in cascade order - must come after all JS imports
// eslint-disable-next-line import/order
import 'bootstrap/dist/css/bootstrap.min.css';
// eslint-disable-next-line import/order
import '@pfp/frontend-platform/dist/style.css';
// eslint-disable-next-line import/order
import TagManager from 'react-gtm-module';
import '../styles/app.scss';
import { Theme } from '../types';
import { getCookie, isStatisticsCookiesAllowed, sendPosthogEvent } from '../utils/helpers';
import { CalculatorTheme } from '../utils/helpers/themeHelper';

const { publicRuntimeConfig } = getConfig();
const BROWSER = typeof window !== 'undefined';
function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isProduction = publicRuntimeConfig.contentEnv === 'production';
  const isClient = useClientSide();

  let website = router?.query?.['website']?.toString();
  if (!website && BROWSER) {
    website = router.query['website']?.toString() || getWebsiteFromDomain();
  } else {
    website = website || 'suri.cz';
  }

  const marketingIds =
    (isProduction ? MARKETING_IDS?.[website ?? 'suri.cz'] : MARKETING_IDS?.SURI_STAGING) || DEFAULT_MARKETING_IDS;

  const googleClientId =
    CalculatorTheme.parseGaClientId(router.query['googleclientid']?.toString() || getCookie('_ga')) ||
    CalculatorTheme.getDefaultClientId(isProduction);
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      const urlWithoutQueryParams = url.split('?')[0];

      if (url !== '/') {
        if (isStatisticsCookiesAllowed()) {
          sendPosthogEvent('$pageview');
        }
      }
    };
    if (marketingIds) {
      TagManager.initialize({ gtmId: marketingIds.GTM });
    }
    if (router?.isReady) {
      Router.events.on('routeChangeComplete', (url: string) => handleRouteChange(url));
      return () => {
        Router.events.off('routeChangeComplete', handleRouteChange);
      };
    }
  }, [router?.isReady, marketingIds]);

  return (
    <AppStateProvider>
      {isClient ? (
        <ThemeProvider theme={website as Theme}>
          {/* check if is suri and display overlay */}
          {website === 'suri.cz' && <div className="bg-gradient-overlay" />}
          <Component {...pageProps} />
        </ThemeProvider>
      ) : (
        <Component {...pageProps} />
      )}
    </AppStateProvider>
  );
}
export default withRouter(appWithTranslation(MyApp));
