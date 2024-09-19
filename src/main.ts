import { NestFactory } from '@nestjs/core';

import { ValidationPipe } from '@/common/pipe/validation.pipe';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const allowedOrigins = (process.env.CORS_ORIGINS || '').split(',');

  app.enableCors({
    origin: allowedOrigins,
    methods: process.env.CORS_METHODS || 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: process.env.CORS_CREDENTIALS === 'true',
  });
  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
