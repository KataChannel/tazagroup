import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';
import * as bodyParser from 'body-parser';
import * as admin from 'firebase-admin';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use('/images', express.static(join(__dirname, '../sandbox/images')));
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  // Lấy Service Account từ biến môi trường
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log('✅ Firebase initialized with Service Account from ENV');
  } else {
    console.error('❌ GOOGLE_APPLICATION_CREDENTIALS_JSON is missing!');
  }

  await app.listen(process.env.PORT ?? 3331);
}

bootstrap();
