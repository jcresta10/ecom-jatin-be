import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetOrdersDto } from './dto/get-orders.dto';
import type { Cache } from 'cache-manager';
export declare class OrdersController {
    private readonly ordersService;
    private cacheManager;
    constructor(ordersService: OrdersService, cacheManager: Cache);
    create(createOrderDto: CreateOrderDto): Promise<{
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            email: string;
        };
        orderItems: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                price: number;
                name: string;
                description: string;
                stock: number;
            };
        } & {
            id: string;
            quantity: number;
            price: number;
            productId: string;
            orderId: string;
        })[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalAmount: number;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    findAll(query: GetOrdersDto): Promise<unknown>;
}
