import { Global, Module } from '@nestjs/common';
import { DRIZZLE } from './database.constants';
import { drizzleProvider } from './drizzle.provider';

@Global()
@Module({
  providers: [drizzleProvider],
  exports: [DRIZZLE],
})
export class DatabaseModule {}
