import { AppHttpResponse } from '../api/AppHttpResponse';

import { TerminationEntity } from './TerminationEntity';

export interface FetchTerminationEntityResponse extends AppHttpResponse {
  data: TerminationEntity;
}
