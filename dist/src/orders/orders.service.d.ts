import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetOrdersDto } from './dto/get-orders.dto';
import { QueueService } from '../queue/queue.service';
export declare class OrdersService {
    private prisma;
    private queueService;
    constructor(prisma: PrismaService, queueService: QueueService);
    create(createOrderDto: CreateOrderDto): Promise<any>;
    findAll(query: GetOrdersDto): Promise<{
        data: any;
        meta: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
}
