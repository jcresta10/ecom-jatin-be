import { PrismaService } from '../prisma/prisma.service';
export declare class QueueService {
    private prisma;
    private readonly logger;
    private queue;
    private isProcessing;
    constructor(prisma: PrismaService);
    addOrderConfirmation(orderId: string): Promise<void>;
    private processQueue;
    private confirmOrder;
}
