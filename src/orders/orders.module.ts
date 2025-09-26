import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './order.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { QueueModule } from '../queue/queue.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [PrismaModule, QueueModule, RedisModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}