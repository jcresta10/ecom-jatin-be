"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Starting database seeding...');
    const user1 = await prisma.user.upsert({
        where: { email: 'user1@example.com' },
        update: {},
        create: {
            id: 'user-1',
            email: 'user1@example.com',
            name: 'John Doe',
        },
    });
    const user2 = await prisma.user.upsert({
        where: { email: 'user2@example.com' },
        update: {},
        create: {
            id: 'user-2',
            email: 'user2@example.com',
            name: 'Jane Smith',
        },
    });
    await prisma.product.upsert({
        where: { id: 'prod-1' },
        update: {},
        create: {
            id: 'prod-1',
            name: 'Laptop',
            description: 'High-performance laptop',
            price: 999.99,
            stock: 10,
        },
    });
    await prisma.product.upsert({
        where: { id: 'prod-2' },
        update: {},
        create: {
            id: 'prod-2',
            name: 'Mouse',
            description: 'Wireless mouse',
            price: 29.99,
            stock: 50,
        },
    });
    await prisma.product.upsert({
        where: { id: 'prod-3' },
        update: {},
        create: {
            id: 'prod-3',
            name: 'Keyboard',
            description: 'Mechanical keyboard',
            price: 79.99,
            stock: 30,
        },
    });
    console.log('✅ Seed data created successfully');
}
main()
    .then(() => {
    console.log('Database seeding completed!');
})
    .catch((e) => {
    console.error('❌ Database seeding failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map