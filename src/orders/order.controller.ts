import { Controller, Get, Post, Body, Query, Inject } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetOrdersDto } from './dto/get-orders.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    console.log('Creating order with data:', createOrderDto);
    const order = await this.ordersService.create(createOrderDto);
    
    // Invalidate cache when new order is created
    const keys = await this.cacheManager.store.keys();
    const orderKeys = keys.filter(key => key.startsWith('orders:'));
    for (const key of orderKeys) {
      await this.cacheManager.del(key);
    }
    
    return order;
  }

  @Get()
  async findAll(@Query() query: GetOrdersDto) {
    const cacheKey = `orders:${JSON.stringify(query)}`;
    
    // Try to get from cache
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      console.log('Returning cached orders');
      return cached;
    }

    // If not in cache, get from database
    const result = await this.ordersService.findAll(query);
    
    // Store in cache with 30 second TTL
    await this.cacheManager.set(cacheKey, result, 30000);
    
    return result;
  }
}