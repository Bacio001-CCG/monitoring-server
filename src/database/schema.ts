import { relations } from 'drizzle-orm';
import {
  bigint,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const hosts = pgTable('hosts', {
  id: uuid('id').primaryKey().notNull(),
  hostId: varchar('host_id', { length: 255 }),
  fingerprint: varchar('fingerprint', { length: 64 }).notNull().unique(),
  hostname: varchar('hostname', { length: 255 }).notNull().default(''),
  platform: varchar('platform', { length: 128 }).notNull().default(''),
  kernelArch: varchar('kernel_arch', { length: 64 }).notNull().default(''),
  cpuModel: varchar('cpu_model', { length: 255 }).notNull().default(''),
  memoryTotalBytes: bigint('memory_total_bytes', { mode: 'number' })
    .notNull()
    .default(0),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const metricSnapshots = pgTable(
  'metric_snapshots',
  {
    id: uuid('id').primaryKey().notNull(),
    hostRefId: uuid('host_ref_id')
      .notNull()
      .references(() => hosts.id, { onDelete: 'cascade' }),
    collectedAt: timestamp('collected_at', {
      withTimezone: true,
      mode: 'date',
    }).notNull(),
    primaryTemperatureC: numeric('primary_temperature_c', {
      precision: 6,
      scale: 2,
    }),
    memoryUsedPercent: numeric('memory_used_percent', {
      precision: 6,
      scale: 2,
    })
      .notNull()
      .default('0'),
    memoryUsedBytes: bigint('memory_used_bytes', { mode: 'number' })
      .notNull()
      .default(0),
    memoryTotalBytes: bigint('memory_total_bytes', { mode: 'number' })
      .notNull()
      .default(0),
    cpuLogicalCores: integer('cpu_logical_cores').notNull().default(0),
    uptimeSeconds: bigint('uptime_seconds', { mode: 'number' })
      .notNull()
      .default(0),
    warnings: jsonb('warnings').$type<string[]>(),
    payload: jsonb('payload').$type<Record<string, unknown>>().notNull(),
    receivedAt: timestamp('received_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('idx_metric_snapshots_collected_at').on(table.collectedAt),
  ],
);

export const hostsRelations = relations(hosts, ({ many }) => ({
  metrics: many(metricSnapshots),
}));

export const metricSnapshotsRelations = relations(metricSnapshots, ({ one }) => ({
  host: one(hosts, {
    fields: [metricSnapshots.hostRefId],
    references: [hosts.id],
  }),
}));

export type Host = typeof hosts.$inferSelect;
export type NewHost = typeof hosts.$inferInsert;
export type MetricSnapshot = typeof metricSnapshots.$inferSelect;
export type NewMetricSnapshot = typeof metricSnapshots.$inferInsert;

export type MetricSnapshotWithHost = MetricSnapshot & {
  host: Host;
};
