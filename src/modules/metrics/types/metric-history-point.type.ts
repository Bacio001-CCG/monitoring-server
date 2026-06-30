export type MetricHistoryPoint = {
  collectedAt: Date;
  memoryUsedPercent: string;
  memoryUsedBytes: number;
  primaryTemperatureC: string | null;
  uptimeSeconds: number;
};
