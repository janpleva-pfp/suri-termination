export const GA_BASE_URL = '/termination2025';

export const GA_URL_NAMES = {
  Shrnuti: 'shrnuti',
};

export const GA_URL_MAPPING = {
  [GA_URL_NAMES.Shrnuti]: {
    path: '/shrnuti',
    title: 'Shrnutí',
    label: 'Shrnutí',
  },
};

export const GA_EVENT_NAME = {
  POPUP: {
    OPEN: 'popup_open',
    CLOSE: 'popup_close',
  },
  TERMINATION: 'termination_send',
  SIGNATURE_VIEWED: 'signature_viewed',
  INFORMATION_EDIT_CLICK: 'information_edit_clicked',
  TERMINATION_TYPE: 'termination_type',
  BUTTON: 'button_click',
  TERMINATION_SAVED: 'termination_saved',
  TERMINATION_SIGNED: 'termination_signed',
  TERMINATION_SENT: 'termination_sent',
  DOWNLOAD: 'document_download',
  PAGE_VIEW: {
    SHRNUTI: 'cancelation_summary',
  },
};

export const EMPTY = 'prazdne';
