import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  Host,
  MetricSnapshot,
  MetricSnapshotWithHost,
  NewMetricSnapshot,
} from '../../database/schema';
import { CreateMetricDto } from './dto/create-metric.dto';
import { MetricsRepository } from './repositories/metrics.repository';

@Injectable()
export class MetricsService {
  constructor(private readonly metricsRepository: MetricsRepository) {}

  async ingest(dto: CreateMetricDto): Promise<MetricSnapshot> {
    const host = await this.upsertHost(dto);
    const snapshot = this.toSnapshot(dto, host);

    return this.metricsRepository.saveSnapshot(snapshot);
  }

  findRecent(
    limit = 50,
    fingerprint?: string,
  ): Promise<MetricSnapshotWithHost[]> {
    return this.metricsRepository.findRecentSnapshots(limit, fingerprint);
  }

  findHosts(): Promise<Host[]> {
    return this.metricsRepository.findAllHosts();
  }

  private async upsertHost(dto: CreateMetricDto): Promise<Host> {
    const fingerprint = dto.identity.fingerprint;
    const existing = await this.metricsRepository.findHostByFingerprint(
      fingerprint,
    );

    return this.metricsRepository.saveHost({
      ...(existing ? { id: existing.id } : {}),
      fingerprint,
      hostId: dto.identity.host_id ?? dto.host.host_id ?? null,
      hostname: dto.host.hostname ?? '',
      platform: dto.host.platform ?? '',
      kernelArch: dto.host.kernel_arch ?? '',
      cpuModel: dto.cpu.model_name ?? '',
      memoryTotalBytes: dto.memory.total_bytes ?? 0,
    });
  }

  private toSnapshot(
    dto: CreateMetricDto,
    host: Host,
  ): NewMetricSnapshot {
    return {
      id: randomUUID(),
      hostRefId: host.id,
      collectedAt: new Date(dto.collected_at),
      primaryTemperatureC:
        dto.primary_temperature_c != null
          ? String(dto.primary_temperature_c)
          : null,
      memoryUsedPercent: String(dto.memory.used_percent ?? 0),
      memoryUsedBytes: dto.memory.used_bytes ?? 0,
      memoryTotalBytes: dto.memory.total_bytes ?? 0,
      cpuLogicalCores: dto.cpu.logical_cores ?? 0,
      uptimeSeconds: dto.host.uptime_seconds ?? 0,
      warnings: dto.warnings?.length ? dto.warnings : null,
      payload: dto as unknown as Record<string, unknown>,
    };
  }
}
