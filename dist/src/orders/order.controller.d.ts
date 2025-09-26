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
            email: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        };
        orderItems: ({
            product: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string;
                price: number;
                stock: number;
            };
        } & {
            id: string;
            price: number;
            quantity: number;
            productId: string;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalAmount: number;
        userId: string;
    }>;
    findAll(query: GetOrdersDto): Promise<unknown>;
}
