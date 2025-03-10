import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';
import * as bodyParser from 'body-parser';
declare const module: any;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use('/images', express.static(join(__dirname, '../sandbox/images')));
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  await app.listen(process.env.PORT ?? 3331);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();