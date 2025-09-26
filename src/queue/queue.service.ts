import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('order-confirmation') private readonly orderQueue: Queue,
  ) {}

  /**
   * Add an order confirmation job to the Redis queue
   * @param orderId Order ID to confirm
   */
  async addOrderConfirmation(orderId: string): Promise<void> {
    await this.orderQueue.add(
      'confirm-order',
      { orderId },
      {
        attempts: 3, // retry up to 3 times on failure
        backoff: {
          type: 'fixed',
          delay: 5000, // 5 seconds between retries
        },
        removeOnComplete: true, // remove job after success
        removeOnFail: false, // keep failed jobs for inspection
      },
    );
    this.logger.log(`Order ${orderId} added to Redis confirmation queue`);
  }
}
