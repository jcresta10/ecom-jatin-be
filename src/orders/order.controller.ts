import { Controller, Get, Post, Body, Query, Inject } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetOrdersDto } from './dto/get-orders.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Controller('orders')
export class OrdersController {

    private readonly CACHE_PREFIX = 'orders:';
  constructor(
    private readonly ordersService: OrdersService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    console.log('Creating order with data:', createOrderDto);
    const order = await this.ordersService.create(createOrderDto);
    
    // Invalidate cache when new order is created
    await this.invalidateOrdersCache();
    return order;
  }

 @Get()
  async findAll(@Query() query: GetOrdersDto) {
    try {
      // Create a stable cache key
      const queryHash = this.hashQuery(query);
      const cacheKey = `${this.CACHE_PREFIX}:${queryHash}`;
      console.log('Cache key:', cacheKey);
      const cached = await this.cacheManager.get(cacheKey);
      if (cached) {
        console.log('✅ Cache hit');
        return cached;
      }

    
      console.log('❌ Cache miss');
      const result = await this.ordersService.findAll(query);
      
      await this.cacheManager.set(cacheKey, result, 30000);
      console.log('💾 Cached new result');
      
      return result;
    } catch (error) {
      console.error('Cache error:', error);
      // Fallback to service if caching fails
      return await this.ordersService.findAll(query);
    }
  }

   private hashQuery(query: any): string {
    const crypto = require('crypto');
    const normalized = JSON.stringify(query, Object.keys(query).sort());
    return crypto.createHash('md5').update(normalized).digest('hex').substring(0, 8);
  }

  private async invalidateOrdersCache(): Promise<void> {
    try {
      const store: any = this.cacheManager.store;
      const redis = store.getClient ? store.getClient() : store.client;
      
      if (redis) {
        // Use the correct pattern matching our cache keys
        const pattern = `${this.CACHE_PREFIX}*`; // This will match "orders:*"
        const keys = await redis.keys(pattern);
        
        if (keys.length > 0) {
          await redis.del(keys);
          console.log(`✅ Invalidated ${keys.length} cache entries with pattern: ${pattern}`);
          console.log('Deleted keys:', keys);
        } else {
          console.log(`ℹ️ No cache entries found for pattern: ${pattern}`);
        }
      } else {
        console.warn('⚠️ Redis client not available, trying cache manager del()');
        await this.fallbackCacheInvalidation();
      }
    } catch (error) {
      console.error('❌ Cache invalidation error:', error);
    }
  }

   private async fallbackCacheInvalidation(): Promise<void> {
    try {
      await this.cacheManager.reset();
      console.log('⚠️ Cleared entire cache as fallback');
    } catch (error) {
      console.error('❌ Fallback cache invalidation failed:', error);
    }
  }
}