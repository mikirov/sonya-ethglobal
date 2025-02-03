import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { config } from 'dotenv';

async function bootstrap() {
  // Load environment variables from .env file
  config();

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Wallet Verification API')
    .setDescription('API to verify signed messages and token balances')
    .setVersion('1.0')
    .addTag('Verification')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  // Get the port from .env or default to 3006
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3006;
  // Determine the host based on NODE_ENV: localhost for development, all interfaces for production
  const host = process.env.NODE_ENV === 'development' ? '127.0.0.1' : '0.0.0.0';

  await app.listen(port, host);
  console.log(`Application is running on: http://${host}:${port}`);
}

bootstrap();