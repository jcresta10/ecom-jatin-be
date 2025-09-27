  import { Module } from '@nestjs/common';
  import { CacheModule } from '@nestjs/cache-manager';
  import { redisStore } from 'cache-manager-ioredis-yet';

  @Module({
    imports: [
      CacheModule.register({
        store: redisStore,
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
        username: process.env.REDIS_USERNAME || 'default',
        password: process.env.REDIS_PASSWORD || '',
        ttl: 3000, 
        max: 100, // maximum number of items in cache
        retryDelayOnFailover: 100,
        enableReadyCheck: true,
        maxRetriesPerRequest: 3,
        lazyConnect: true,
      }),
    ],
    exports: [CacheModule],
  })
  export class RedisModule {}