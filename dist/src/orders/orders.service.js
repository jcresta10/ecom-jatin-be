"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const queue_service_1 = require("../queue/queue.service");
let OrdersService = class OrdersService {
    constructor(prisma, queueService) {
        this.prisma = prisma;
        this.queueService = queueService;
    }
    async create(createOrderDto) {
        return await this.prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({
                where: { id: createOrderDto.userId },
            });
            if (!user) {
                throw new common_1.NotFoundException(`User ${createOrderDto.userId} not found. Please ensure the user exists before creating an order.`);
            }
            let totalAmount = 0;
            const productUpdates = [];
            for (const item of createOrderDto.items) {
                const product = await tx.product.findUnique({
                    where: { id: item.productId },
                });
                if (!product) {
                    throw new common_1.NotFoundException(`Product ${item.productId} not found`);
                }
                if (product.stock < item.quantity) {
                    throw new Error(`Insufficient stock for product ${product.name}`);
                }
                totalAmount += product.price * item.quantity;
                productUpdates.push(tx.product.update({
                    where: { id: item.productId },
                    data: { stock: product.stock - item.quantity },
                }));
            }
            const orderItemsData = await Promise.all(createOrderDto.items.map(async (item) => {
                const product = await tx.product.findUnique({
                    where: { id: item.productId },
                });
                return {
                    productId: item.productId,
                    quantity: item.quantity,
                    price: product.price,
                };
            }));
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
            await Promise.all(productUpdates);
            await this.queueService.addOrderConfirmation(order.id);
            return order;
        });
    }
    async findAll(query) {
        const { page = 1, limit = 10, search } = query;
        const skip = (page - 1) * limit;
        const searchConditions = [];
        if (search) {
            searchConditions.push({ user: { name: { contains: search, mode: 'insensitive' } } }, { user: { email: { contains: search, mode: 'insensitive' } } }, { orderItems: { some: { product: { name: { contains: search, mode: 'insensitive' } } } } });
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
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        queue_service_1.QueueService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map