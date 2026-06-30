import { ConfigService } from '@nestjs/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { DRIZZLE } from './database.constants';
import * as schema from './schema';

export type DrizzleDB = NodePgDatabase<typeof schema>;

export const drizzleProvider = {
  provide: DRIZZLE,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): DrizzleDB => {
    const connectionString = configService.get<string>('database.url');
    if (!connectionString) {
      throw new Error('DATABASE_URL is not set');
    }

    const pool = new Pool({ connectionString });

    return drizzle(pool, { schema });
  },
};
