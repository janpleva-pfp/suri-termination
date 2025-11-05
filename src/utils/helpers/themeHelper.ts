/* eslint-disable no-undef */
import getConfig from 'next/config';
import { pathOr } from 'ramda';
import { v4 as uuidV4 } from 'uuid';

import {
  AFFILIATES,
  DEFAULT_MARKETING_IDS,
  DEFAULT_PARENT_SETTINGS,
  EMPTY,
  GOOGLE_CLIENT_ID_REGEX,
  MARKETING_IDS,
  WEBSITES,
} from '@app/constants';
import { ParentSettingsIn, PaymentGatewayInfoContentOut } from '@app/sdk/bo';
import { getCookie } from '@app/src/utils/helpers/gaHelper';

const { publicRuntimeConfig } = getConfig();

export class CalculatorTheme {
  static get apiBaseUrl(): string {
    return publicRuntimeConfig?.apiBaseUrl;
  }

  static get stompBaseUrl(): string {
    return publicRuntimeConfig?.apiBaseUrl;
  }

  static getWebsite(website: string | undefined): string {
    return website || DEFAULT_PARENT_SETTINGS.website;
  }

  static getContactInfoForWebsite(
    website: string | undefined,
    contentPaymentGatewayInfoOut: PaymentGatewayInfoContentOut | null,
  ): { infoEmail: string; infoPhone: string; name: string } | undefined {
    if (!website) {
      return undefined;
    }

    return pathOr<{ infoEmail: string; infoPhone: string; name: string } | undefined>(
      pathOr(undefined, ['websites', 'default'], contentPaymentGatewayInfoOut),
      ['websites', website],
      contentPaymentGatewayInfoOut,
    );
  }

  static getLogoUrl(website: string | undefined): string | undefined {
    if (!website) {
      return undefined;
    }

    switch (website) {
      case WEBSITES.SURI:
        return `/img/logo-suri_cz.svg`;
      case WEBSITES.POVCOM:
        return `/img/logo-povcom.svg`;
      case WEBSITES.SROVNATOR:
        return `/img/logo-srovnator.svg`;
      default:
        return undefined;
    }
  }

  static getConsentUrl(website: string | undefined): string | undefined {
    const defaultUrl = `https://www.srovnator.cz/informace-o-zpracovani-osobnich-udaju/`;

    if (!website) {
      return defaultUrl;
    }
    switch (website) {
      case WEBSITES.SURI:
        return `https://www.suri.cz/informace-o-zpracovani-osobnich-udaju/`;
      case WEBSITES.POVCOM:
        return `https://www.povinne-ruceni.com/informace-o-zpracovani-osobnich-udaju/`;
      default:
        return defaultUrl;
    }
  }

  static getConditionsUrl(website: string | undefined): string | undefined {
    const defaultUrl = `https://www.srovnator.cz/vseobecne-obchodni-podminky/`;

    if (!website) {
      return defaultUrl;
    }
    switch (website) {
      case WEBSITES.SURI:
        return `https://www.suri.cz/vseobecne-obchodni-podminky/`;
      case WEBSITES.POVCOM:
        return `https://www.povinne-ruceni.com/vseobecne-obchodni-podminky/`;
      default:
        return defaultUrl;
    }
  }

  static parseGaClientId = (clientId?: string): string | undefined => {
    return clientId?.replace(GOOGLE_CLIENT_ID_REGEX, '');
  };

  static getDefaultClientId = (isProduction: boolean): string => {
    return isProduction ? '' : `${EMPTY}-client-id-${uuidV4()}`;
  };

  static parseGaSessionId = (sessionId?: string): string | undefined => {
    return sessionId?.split('.')?.[2];
  };

  static getDefaultSessionId = (isProduction: boolean): string => {
    return isProduction ? '' : `${EMPTY}-session-id-${uuidV4()}`;
  };

  static isEmailValid = (email?: string): boolean => {
    const emailRegexp = /\S+@\S+\.\S+/;
    return emailRegexp.test(email || '');
  };

  static getParentIfExistsInCookies(parameter: string, parameterName?: string): {} | undefined {
    return getCookie(parameter) && { [parameterName || parameter]: getCookie(parameter) };
  }

  static getSessionIdFromCookies = (marketingIds: any): string | undefined => {
    return getCookie(`_ga_${marketingIds.GID}`) && this.parseGaSessionId(getCookie(`_ga_${marketingIds.GID}`));
  };

  static getParentSettingsFromCookies(marketingIds: any): Partial<ParentSettingsIn> {
    return {
      ...this.getParentIfExistsInCookies('affiliate'),
      ...(getCookie('_ga') && { googleClientId: this.parseGaClientId(getCookie('_ga')) }),
      ...(getCookie(`_ga_${marketingIds.GID}`) && {
        googleSessionId: this.parseGaSessionId(getCookie(`_ga_${marketingIds.GID}`)),
      }),
      ...this.getParentIfExistsInCookies('gclid', 'gclid'),
      ...this.getParentIfExistsInCookies('pfp-uid', 'pfpUid'),
      ...this.getParentIfExistsInCookies('utm_campaign', 'utmCampaign'),
      ...this.getParentIfExistsInCookies('utm_medium', 'utmMedium'),
      ...this.getParentIfExistsInCookies('utm_source', 'utmSource'),
    };
  }

  static getWebsiteFromDomain(): string {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname?.replace(/^car\./, '');
      for (const [key, website] of Object.entries(WEBSITES)) {
        if (hostname.endsWith(website) || hostname.includes(`.${website}`)) {
          return WEBSITES[key];
        }
      }
    }

    return DEFAULT_PARENT_SETTINGS.website;
  }

  static getParentSettingsOrDefault(query: NodeJS.Dict<string | string[]>, isProduction: boolean): ParentSettingsIn {
    const getQueryParameter = (parameter: string) => {
      return query[parameter]?.toString();
    };

    const website = getQueryParameter('website') || this.getWebsiteFromDomain();
    const marketingIds =
      (isProduction ? MARKETING_IDS?.[website] : MARKETING_IDS?.SURI_STAGING) || DEFAULT_MARKETING_IDS;
    const email = getQueryParameter('email');
    return {
      ...DEFAULT_PARENT_SETTINGS,
      affiliate: getQueryParameter('affiliate'),
      email: this.isEmailValid(email) ? email : '',
      experimentId: getQueryParameter('idexp'),
      experimentVariant: getQueryParameter('varexp'),
      gclid: getQueryParameter('gclid'),
      googleClientId:
        this.parseGaClientId(getQueryParameter('googleclientid')) || this.getDefaultClientId(isProduction),
      googleSessionId:
        this.parseGaSessionId(query['googleSessionId']?.toString()) || this.getDefaultSessionId(isProduction),
      linkId: getQueryParameter('linkid') || getQueryParameter('linkId'),
      pfpUid: getQueryParameter('pfp-uid'),
      regPlate: getQueryParameter('regPlate'),
      subProductName: getQueryParameter('subproductname') || 'tplcic',
      utmCampaign: getQueryParameter('utm-campaign'),
      utmMedium: getQueryParameter('utm-medium'),
      utmSource: getQueryParameter('utm-source'),
      website,
      type: getQueryParameter('type'),
      manufacturer: getQueryParameter('manufacturer'),
      model: getQueryParameter('model'),
      seats: getQueryParameter('seats'),
      capacity: getQueryParameter('capacity'),
      power: getQueryParameter('power'),
      yearOfConstruction: getQueryParameter('yearOfConstruction'),
      firstRegistered: getQueryParameter('firstRegistered'),
      weight: getQueryParameter('weight'),
      carValue: getQueryParameter('carValue'),
      mileage: getQueryParameter('mileage'),
      fuel: getQueryParameter('fuel'),

      // Never as query parameter
      crmNoOpp: false,

      // Rewrite query parameters when they're defined in cookies
      ...this.getParentSettingsFromCookies(marketingIds),
    };
  }
}

export const isSuriAndSauto = (parentSettings?: ParentSettingsIn) =>
  parentSettings?.affiliate === AFFILIATES.SAUTO && parentSettings?.website === WEBSITES.SURI;
