import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { OrderConfirmationProcessor } from './order-confirmation.processor';
import { PrismaService } from 'src/prisma/prisma.service';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'order-confirmation',
      redis: process.env.REDIS_URL,
    }),
  ],
  providers: [QueueService, OrderConfirmationProcessor, PrismaService],
  exports: [QueueService],
})
export class QueueModule {}