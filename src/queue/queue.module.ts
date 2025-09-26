import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { PrismaModule } from '../prisma/prisma.module';
import { OrderConfirmationProcessor } from './order-confirmation.processor';
import { PrismaService } from 'src/prisma/prisma.service';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'order-confirmation',
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
      },
    }),
  ],
  providers: [QueueService, OrderConfirmationProcessor, PrismaService],
  exports: [QueueService],
})
export class QueueModule {}