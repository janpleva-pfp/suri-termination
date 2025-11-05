import { NextRouter } from 'next/router';
import { path } from 'ramda';
import { v4 as uuidV4 } from 'uuid';

import { DEFAULT_MARKETING_IDS, DEFAULT_PARENT_SETTINGS, MARKETING_IDS } from '@app/constants';
import { ParentSettingsIn } from '@app/sdk/bo';
import { AppState } from '@src/contexts';

import { sendNoSessionIdEventIfNecessary } from './gaHelper';
import { CalculatorTheme } from './themeHelper';
/*
 * AppState getters
 */
export const getTerminationState = (appState: AppState) => path(['formData', 'termination'], appState);
export const getInitialParentSettings = (
  router: NextRouter,
  isProduction: boolean,
  currentParentSettings?: ParentSettingsIn,
) => {
  let parentSettings: ParentSettingsIn = {} as ParentSettingsIn;
  parentSettings = CalculatorTheme.getParentSettingsOrDefault(router.query, isProduction);
  const marketingIds =
    (isProduction
      ? MARKETING_IDS?.[parentSettings?.website || DEFAULT_PARENT_SETTINGS.website]
      : MARKETING_IDS?.SURI_STAGING) || DEFAULT_MARKETING_IDS;

  // debugging event logging a case where we receive the googleClientId but not the googleSessionId
  sendNoSessionIdEventIfNecessary(router.query, parentSettings, marketingIds.GID);

  // avoid change of pfpUid when next calculation is initialized
  parentSettings.pfpUid = currentParentSettings?.pfpUid || parentSettings.pfpUid || uuidV4();

  return parentSettings;
};
