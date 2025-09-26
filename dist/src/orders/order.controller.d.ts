import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetOrdersDto } from './dto/get-orders.dto';
import type { Cache } from 'cache-manager';
export declare class OrdersController {
    private readonly ordersService;
    private cacheManager;
    constructor(ordersService: OrdersService, cacheManager: Cache);
    create(createOrderDto: CreateOrderDto): Promise<any>;
    findAll(query: GetOrdersDto): Promise<unknown>;
}
