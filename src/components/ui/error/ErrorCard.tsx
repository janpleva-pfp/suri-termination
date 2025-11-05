import React from 'react';

import { Button, Card } from '@pfp/frontend-platform';
import { NextRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import { WEBSITE_PROPS } from '@app/constants/main';

export const ErrorCard = React.memo(
  (data: { phoneInfo: string; website: string; router: NextRouter; linkid?: string }) => {
    const { t } = useTranslation('common');
    return (
      <Card>
        <h1 className="h2 unstyled">{t('contract-cancellation.errorCard.title')}</h1>
        <p>{t('contract-cancellation.errorCard.text')}</p>
        <p className="mb-0">
          <a className="h2 unstyled" href={`tel:${WEBSITE_PROPS[data.website].phoneInfo.replace(/\s+/g, '')}`}>
            {WEBSITE_PROPS[data.website].phoneInfo}
          </a>
        </p>
        <p className="mt-2">
          {t('contract-cancellation.errorCard.availability.working-days')}
          <br />
          {t('contract-cancellation.errorCard.availability.weekend')}
        </p>
        <Button
          className="mx-auto"
          onClick={() => {
            if (data.linkid) {
              data.router.push(`/?linkId=${data.linkid}`);
            } else {
              window.location.reload();
            }
          }}
          variant="primary"
        >
          {t('contract-cancellation.errorCard.button')}
        </Button>
      </Card>
    );
  },
);
