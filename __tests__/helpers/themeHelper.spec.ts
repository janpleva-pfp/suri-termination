import { DEFAULT_PARENT_SETTINGS } from '@app/constants/main';
import { CalculatorTheme } from '@app/src/utils/helpers/themeHelper';

describe('CalculatorTheme.getContactInfoForWebsite', () => {
  it('Should return undefined when website undefined or input values are missing', () => {
    const website = 'suri.cz';

    expect(CalculatorTheme.getContactInfoForWebsite(undefined, null)).toBeUndefined();
    expect(CalculatorTheme.getContactInfoForWebsite(website, {} as any)).toBeUndefined();
  });
});

describe('CalculatorTheme.getWebsite', () => {
  it('Should return website or fallback website when input parameters are invalid', () => {
    const website = 'suri.cz';

    expect(CalculatorTheme.getWebsite(undefined)).toStrictEqual(DEFAULT_PARENT_SETTINGS.website);
    expect(CalculatorTheme.getWebsite(website)).toStrictEqual(website);
  });
});
