import { ParsedUrlQuery } from 'querystring';

import { getWebsiteFromDomain } from '@pfp/frontend-platform';
import cookie from 'cookie';
import { RouteType } from 'next/dist/lib/load-custom-routes';
import posthog from 'posthog-js';

import {
  DEFAULT_MARKETING_IDS,
  DEFAULT_PARENT_SETTINGS,
  EMPTY,
  LOCALSTORAGE_LAST_STEP_KEY,
  LOCALSTORAGE_LAST_UPDATE_KEY,
  MARKETING_IDS,
} from '@app/constants';
import { GA_BASE_URL, GA_URL_MAPPING } from '@app/constants/ga';
import { ParentSettingsIn } from '@app/sdk/bo';

import { CalculatorTheme } from './themeHelper';

const isValidDomain = (domain: string): boolean => {
  return /^[a-zA-Z0-9.-]+$/.test(domain);
};

export const getCookie = (name: string) => {
  if (typeof window !== 'undefined') {
    const cookies = cookie.parse(document?.cookie) || {};

    return cookies[name];
  }

  return '';
};

export const isStatisticsCookiesAllowed = (): boolean => {
  let cookieConsent = '';
  try {
    cookieConsent = cookie.parse(document.cookie)?.CookieScriptConsent;
    const cookieCategories = JSON.parse(cookieConsent)?.categories;
    return cookieCategories ? cookieCategories.includes('targeting') : false;
  } catch (err) {
    return false;
  }
};

export const removeCookie = (cookieName: string, domain: string): void => {
  const options: cookie.CookieSerializeOptions = {
    path: '/',
    expires: new Date(0),
  };

  if (domain && isValidDomain(domain || '')) {
    options.domain = domain;
  }

  document.cookie = cookie.serialize(cookieName, '', options);
};

export const removeGaCookies = (domain?: string): void => {
  const cookies = cookie.parse(document.cookie || '');
  Object.keys(cookies)
    .filter((k) => k.startsWith('_ga') || k.startsWith('_gi'))
    .forEach((k) => removeCookie(k, domain || ''));
};

export const getGaLocationProps = (website: string): { path: string; title: string; origin: string } => {
  const url = location?.pathname;
  const urlWithoutQueryParams = url.split('?')[0];
  const path = GA_URL_MAPPING[urlWithoutQueryParams]?.path || urlWithoutQueryParams;
  const title = GA_URL_MAPPING[urlWithoutQueryParams]?.title || '';
  const origin = 'https://www.' + website;

  return { path, title, origin };
};

/**
 * Sends a Google Analytics hit by pushing an event to the `window.dataLayer`.
 *
 * @param parentSettings - The parent settings object containing website, Google client ID, and session ID.
 * @param eventName - Optional. The name of the event to send. Defaults to `'page_view'` if not provided.
 * @param additionalProps - Optional. Additional properties to include in the event data.
 *
 * @remarks
 * This function constructs the event data using location properties and parent settings,
 * then pushes it to the Google Analytics data layer for tracking.
 */
export const sendGaHit = (parentSettings: ParentSettingsIn, eventName?: string, additionalProps?: any) => {
  const { website = getWebsiteFromDomain(), googleClientId = '', googleSessionId = '' } = parentSettings;
  const { path, title, origin } = getGaLocationProps(website);

  (<any>window)?.dataLayer?.push({
    event: eventName || 'page_view',
    ...mapGaEventData({
      page_location: origin + path,
      page_referrer: origin + GA_BASE_URL,
      page_title: title,
      client_id: googleClientId,
      session_id: googleSessionId,
      ...additionalProps,
    }),
  });
};

export const mapGaEventData = (body: any) => {
  const { location, referrer, sessionId, title, ...rest } = body;

  const sanitizedRest = Object.keys(rest).reduce((accumulator: any, key: string) => {
    const sanitizedKey = key.replace(/-/g, '_');
    accumulator[sanitizedKey] = rest[key];
    return accumulator;
  }, {});

  return {
    page_location: location,
    page_referrer: referrer,
    page_title: title,
    session_id: sessionId,
    ...sanitizedRest,
  };
};

export const sendNoSessionIdEventIfNecessary = (
  query: ParsedUrlQuery,
  parentSettings: ParentSettingsIn,
  gid: string,
) => {
  if ((query?.['googleclientid'] || getCookie('_ga')) && !(getCookie(`_ga_${gid}`) || query?.['googleSessionId'])) {
    sendGaHit(parentSettings, 'no_session_id', {
      ...query,
      userAgent: navigator?.userAgent,
    });
  }
};

export const sendPosthogEvent = (payload: any) => {
  if (!isStatisticsCookiesAllowed()) {
    return;
  }

  posthog?.capture(payload);
};

export const getSessionId = (isProduction: boolean, parentSettings?: ParentSettingsIn): string | undefined => {
  if (!parentSettings?.googleSessionId || parentSettings?.googleSessionId?.includes(EMPTY)) {
    const marketingIds =
      (isProduction
        ? MARKETING_IDS?.[parentSettings?.website || DEFAULT_PARENT_SETTINGS.website]
        : MARKETING_IDS?.SURI_STAGING) || DEFAULT_MARKETING_IDS;
    return CalculatorTheme.getSessionIdFromCookies(marketingIds);
  }
  return parentSettings?.googleSessionId;
};

export const handleRouteChange = (
  url: string,
  website: string,
  googleClientId: string,
  sentPageViews: Set<RouteType>,
  setSentPageViews: (sentPageViews: Set<RouteType>) => void,
  sessionId?: string,
) => {
  const urlWithoutQueryParams = url.split('?')[0];

  if (url !== '/' && !sentPageViews.has(url as RouteType)) {
    sendGaHit({ website, googleClientId, googleSessionId: sessionId } as ParentSettingsIn);
    if (isStatisticsCookiesAllowed()) {
      sendPosthogEvent('$pageview');
    }

    setSentPageViews(sentPageViews.add(url as RouteType));
  }

  localStorage.setItem(LOCALSTORAGE_LAST_STEP_KEY, urlWithoutQueryParams);
  localStorage.setItem(LOCALSTORAGE_LAST_UPDATE_KEY, `${Date.now()}`);
};
