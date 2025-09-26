import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function runMigrations() {
  try {
    console.log('Running Prisma migrations...');
    const { stdout, stderr } = await execAsync('npx prisma migrate deploy', {
      cwd: process.cwd()
    });
    
    if (stdout) console.log('Migration output:', stdout);
    if (stderr && !stderr.includes('Environment variables loaded')) {
      console.error('Migration stderr:', stderr);
    }
    
    console.log('✅ Migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error; // Prevent app startup if migrations fail
  }
}

async function runSeed() {
  try {
    console.log('Seeding database...');
    const { stdout, stderr } = await execAsync('npx prisma db seed', {
      cwd: process.cwd(),
    });

    if (stdout) console.log('Seed output:', stdout);
    if (stderr && !stderr.includes('Environment variables loaded')) {
      console.error('Seed stderr:', stderr);
    }

    console.log('✅ Seeding completed successfully');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error; // Prevent app startup if seeding fails
  }
}

async function bootstrap() {
  // Run migrations before starting the application
  await runMigrations();
  await runSeed();

  
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  //await app.listen(process.env.PORT || 3001);
  await app.listen(3001, '0.0.0.0'); // listen on all IPv4 interfaces

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();