import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetOrdersDto } from './dto/get-orders.dto';
import { QueueService } from '../queue/queue.service';
export declare class OrdersService {
    private prisma;
    private queueService;
    constructor(prisma: PrismaService, queueService: QueueService);
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
    findAll(query: GetOrdersDto): Promise<{
        data: ({
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
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
