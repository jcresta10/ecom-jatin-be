import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      ttl: 30000, // milliseconds (30 seconds)
      max: 100, // maximum number of items in cache
    }),
  ],
  exports: [CacheModule],
})
export class RedisModule {}