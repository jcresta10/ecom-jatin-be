"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
async function runMigrations() {
    try {
        console.log('Running Prisma migrations...');
        const { stdout, stderr } = await execAsync('npx prisma migrate deploy', {
            cwd: process.cwd()
        });
        if (stdout)
            console.log('Migration output:', stdout);
        if (stderr && !stderr.includes('Environment variables loaded')) {
            console.error('Migration stderr:', stderr);
        }
        console.log('✅ Migrations completed successfully');
    }
    catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    }
}
async function bootstrap() {
    await runMigrations();
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.enableCors();
    await app.listen(3001, '0.0.0.0');
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
//# sourceMappingURL=main.js.map