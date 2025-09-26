import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  //await app.listen(process.env.PORT || 3001);
  await app.listen(3001, '0.0.0.0'); // listen on all IPv4 interfaces

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();