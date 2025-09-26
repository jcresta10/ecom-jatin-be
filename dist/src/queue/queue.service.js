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
var QueueService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let QueueService = QueueService_1 = class QueueService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(QueueService_1.name);
        this.queue = [];
        this.isProcessing = false;
    }
    async addOrderConfirmation(orderId) {
        this.queue.push({ orderId, attempt: 0 });
        this.logger.log(`Order ${orderId} added to confirmation queue`);
        this.processQueue();
    }
    async processQueue() {
        if (this.isProcessing || this.queue.length === 0)
            return;
        this.isProcessing = true;
        while (this.queue.length > 0) {
            const job = this.queue.shift();
            if (job) {
                try {
                    await this.confirmOrder(job.orderId);
                    this.logger.log(`Order ${job.orderId} confirmed successfully`);
                }
                catch (error) {
                    job.attempt++;
                    if (job.attempt < 3) {
                        this.queue.push(job);
                        this.logger.warn(`Order ${job.orderId} confirmation failed, retrying...`);
                    }
                    else {
                        this.logger.error(`Order ${job.orderId} confirmation failed after 3 attempts`);
                    }
                }
            }
        }
        this.isProcessing = false;
    }
    async confirmOrder(orderId) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        await this.prisma.order.update({
            where: { id: orderId },
            data: { status: 'CONFIRMED' },
        });
        this.logger.log(`Order ${orderId} confirmed asynchronously and status updated`);
    }
};
exports.QueueService = QueueService;
exports.QueueService = QueueService = QueueService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QueueService);
//# sourceMappingURL=queue.service.js.map