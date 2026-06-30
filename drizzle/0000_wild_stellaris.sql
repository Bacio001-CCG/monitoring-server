CREATE TABLE "hosts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"host_id" varchar(255),
	"fingerprint" varchar(64) NOT NULL,
	"hostname" varchar(255) DEFAULT '' NOT NULL,
	"platform" varchar(128) DEFAULT '' NOT NULL,
	"kernel_arch" varchar(64) DEFAULT '' NOT NULL,
	"cpu_model" varchar(255) DEFAULT '' NOT NULL,
	"memory_total_bytes" bigint DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "hosts_fingerprint_unique" UNIQUE("fingerprint")
);
--> statement-breakpoint
CREATE TABLE "metric_snapshots" (
	"id" uuid PRIMARY KEY NOT NULL,
	"host_ref_id" uuid NOT NULL,
	"collected_at" timestamp with time zone NOT NULL,
	"primary_temperature_c" numeric(6, 2),
	"memory_used_percent" numeric(6, 2) DEFAULT '0' NOT NULL,
	"memory_used_bytes" bigint DEFAULT 0 NOT NULL,
	"memory_total_bytes" bigint DEFAULT 0 NOT NULL,
	"cpu_logical_cores" integer DEFAULT 0 NOT NULL,
	"uptime_seconds" bigint DEFAULT 0 NOT NULL,
	"warnings" jsonb,
	"payload" jsonb NOT NULL,
	"received_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "metric_snapshots" ADD CONSTRAINT "metric_snapshots_host_ref_id_hosts_id_fk" FOREIGN KEY ("host_ref_id") REFERENCES "public"."hosts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_metric_snapshots_collected_at" ON "metric_snapshots" USING btree ("collected_at");