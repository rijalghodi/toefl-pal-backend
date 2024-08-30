import { NestFactory } from '@nestjs/core';

import { ValidationPipe } from '@/common/pipe/validation.pipe';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
