import { Properties } from '../Properties';
import { TrackingParams } from '../TrackingParams';

import { LinkBuilderData } from './LinkBuilderData';
export interface LinkBuilderState {
  type: string;
  website: string;
  affiliate: string;
  product: string;
  data: LinkBuilderData;
  properties: Properties;
  trackingParams: TrackingParams;
}
