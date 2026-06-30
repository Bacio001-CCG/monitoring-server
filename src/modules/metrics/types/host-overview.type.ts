import { Host, MetricSnapshot } from '../../../database/schema';

export type HostOverview = {
  host: Host;
  latest: MetricSnapshot | null;
};
