import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from '@nestjs/common';

@Processor('order-confirmation')
export class OrderConfirmationProcessor {
  private readonly logger = new Logger(OrderConfirmationProcessor.name);

  constructor(private readonly prisma: PrismaService) {}

  @Process('confirm-order')
  async handleOrder(job: Job<{ orderId: string }>) {
    const { orderId } = job.data;
    try {
      // Simulate processing delay (optional)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update order status to CONFIRMED
      await this.prisma.order.update({
        where: { id: orderId },
        data: { status: 'CONFIRMED' },
      });

      this.logger.log(`Order ${orderId} confirmed successfully`);
    } catch (error) {
      this.logger.error(
        `Failed to confirm order ${orderId}: ${error.message}`,
      );
      throw error; // Throw to let Bull handle retry
    }
  }
}
