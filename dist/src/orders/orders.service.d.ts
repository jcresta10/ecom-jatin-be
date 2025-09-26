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
    findAll(query: GetOrdersDto): Promise<{
        data: ({
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
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
