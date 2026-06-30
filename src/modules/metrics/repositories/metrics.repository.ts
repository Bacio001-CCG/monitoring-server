import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { desc, eq } from 'drizzle-orm';
import { DRIZZLE } from '../../../database/database.constants';
import type { DrizzleDB } from '../../../database/drizzle.provider';
import {
  Host,
  hosts,
  MetricSnapshot,
  metricSnapshots,
  MetricSnapshotWithHost,
  NewHost,
  NewMetricSnapshot,
} from '../../../database/schema';

@Injectable()
export class MetricsRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async findHostByFingerprint(fingerprint: string): Promise<Host | null> {
    const [host] = await this.db
      .select()
      .from(hosts)
      .where(eq(hosts.fingerprint, fingerprint))
      .limit(1);

    return host ?? null;
  }

  async saveHost(host: Omit<NewHost, 'id'> & { id?: string }): Promise<Host> {
    const id = host.id ?? randomUUID();

    await this.db
      .insert(hosts)
      .values({ ...host, id })
      .onConflictDoUpdate({
        target: hosts.fingerprint,
        set: {
          hostId: host.hostId,
          hostname: host.hostname,
          platform: host.platform,
          kernelArch: host.kernelArch,
          cpuModel: host.cpuModel,
          memoryTotalBytes: host.memoryTotalBytes,
          updatedAt: new Date(),
        },
      });

    const saved = await this.findHostByFingerprint(host.fingerprint);
    if (!saved) {
      throw new Error('failed to save host');
    }

    return saved;
  }

  async saveSnapshot(snapshot: NewMetricSnapshot): Promise<MetricSnapshot> {
    await this.db.insert(metricSnapshots).values(snapshot);

    const [saved] = await this.db
      .select()
      .from(metricSnapshots)
      .where(eq(metricSnapshots.id, snapshot.id))
      .limit(1);

    if (!saved) {
      throw new Error('failed to save metric snapshot');
    }

    return saved;
  }

  async findRecentSnapshots(
    limit: number,
    fingerprint?: string,
  ): Promise<MetricSnapshotWithHost[]> {
    const query = this.db
      .select({
        snapshot: metricSnapshots,
        host: hosts,
      })
      .from(metricSnapshots)
      .innerJoin(hosts, eq(metricSnapshots.hostRefId, hosts.id))
      .orderBy(desc(metricSnapshots.collectedAt))
      .limit(limit);

    const rows = fingerprint
      ? await query.where(eq(hosts.fingerprint, fingerprint))
      : await query;

    return rows.map(({ snapshot, host }) => ({
      ...snapshot,
      host,
    }));
  }

  findAllHosts(): Promise<Host[]> {
    return this.db.select().from(hosts).orderBy(hosts.hostname);
  }
}
