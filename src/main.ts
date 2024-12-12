import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*', // или используйте '*' для всех доменов
    methods: 'GET,POST,OPTIONS,DELETE, PUT', // Разрешенные методы, включая OPTIONS
    allowedHeaders: 'Content-Type, Authorization', // Разрешенные заголовки
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
