import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetOrdersDto } from './dto/get-orders.dto';
import { QueueService } from '../queue/queue.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private queueService: QueueService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    return await this.prisma.$transaction(async (tx) => {
      // First, verify that the user exists
      const user = await tx.user.findUnique({
        where: { id: createOrderDto.userId },
      });

      if (!user) {
        throw new NotFoundException(`User ${createOrderDto.userId} not found. Please ensure the user exists before creating an order.`);
      }

      // Calculate total and check stock
      let totalAmount = 0;
      const productUpdates = [];

      for (const item of createOrderDto.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new NotFoundException(`Product ${item.productId} not found`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ${product.name}`);
        }

        totalAmount += product.price * item.quantity;
        productUpdates.push(
          tx.product.update({
            where: { id: item.productId },
            data: { stock: product.stock - item.quantity },
          }),
        );
      }

      // Get product prices for order items
      const orderItemsData = await Promise.all(
        createOrderDto.items.map(async (item) => {
          const product = await tx.product.findUnique({
            where: { id: item.productId },
          });
          return {
            productId: item.productId,
            quantity: item.quantity,
            price: product!.price,
          };
        }),
      );

      // Create order
      const order = await tx.order.create({
        data: {
          userId: createOrderDto.userId,
          totalAmount,
          orderItems: {
            create: orderItemsData,
          },
        },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
          user: true,
        },
      });

      // Update product stock
      await Promise.all(productUpdates);

      // Add to queue for async processing
      await this.queueService.addOrderConfirmation(order.id);

      return order;
    });
  }

  async findAll(query: GetOrdersDto) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    // Build search conditions
    const searchConditions: any[] = [];
    if (search) {
      searchConditions.push(
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { orderItems: { some: { product: { name: { contains: search, mode: 'insensitive' } } } } },
      );
    }

    const where = searchConditions.length > 0 ? { OR: searchConditions } : {};

    const [orders, total] = await Promise.all([
       this.prisma.order.findMany({
            where,
            skip: skip,
            take: Number(limit),
            include: {
            user: true,
            orderItems: {
                include: { product: true },
            },
            },
            orderBy: { createdAt: 'desc' },
        }),
        this.prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}