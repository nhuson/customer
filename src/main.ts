import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: process.env.NODE_ENV === 'development' || !process.env.NODE_ENV ? ['log', 'debug', 'error', 'verbose', 'warn'] : ['error', 'warn']
  });

  app.setGlobalPrefix('api/v1');
  app.enableCors();
  app.use(bodyParser.json({ limit: '20mb' }));
  app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));
  app.useGlobalPipes(new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true }));

  const config = new DocumentBuilder()
    .setTitle('The Customer Api')
    .setDescription('The Customer Backend apis documentation')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'authorization')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { docExpansion: 'none' }
  });

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Api docs is running on: ${await app.getUrl()}/api/docs`);
}
bootstrap();
