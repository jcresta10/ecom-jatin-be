import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);
  private queue: Array<{ orderId: string; attempt: number }> = [];
  private isProcessing = false;

  constructor(private prisma: PrismaService) {}

  async addOrderConfirmation(orderId: string): Promise<void> {
    this.queue.push({ orderId, attempt: 0 });
    this.logger.log(`Order ${orderId} added to confirmation queue`);
    this.processQueue();
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const job = this.queue.shift();
      if (job) {
        try {
          await this.confirmOrder(job.orderId);
          this.logger.log(`Order ${job.orderId} confirmed successfully`);
        } catch (error) {
          job.attempt++;
          if (job.attempt < 3) {
            this.queue.push(job);
            this.logger.warn(`Order ${job.orderId} confirmation failed, retrying...`);
          } else {
            this.logger.error(`Order ${job.orderId} confirmation failed after 3 attempts`);
          }
        }
      }
    }

    this.isProcessing = false;
  }

  private async confirmOrder(orderId: string): Promise<void> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update order status to CONFIRMED
    await this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'CONFIRMED' },
    });
    
    this.logger.log(`Order ${orderId} confirmed asynchronously and status updated`);
  }
}