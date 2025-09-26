import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: await redisStore({
          host: process.env.REDIS_HOST || 'localhost',
          ttl: 30, // <-- seconds (belongs inside redisStore config)
        }),
      }),
    }),
  ],
  exports: [CacheModule],
})
export class RedisModule {}
