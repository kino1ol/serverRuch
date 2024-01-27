import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const cors = {
    origin: ['http:localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
  }

  app.useGlobalPipes(new I18nValidationPipe({
    transform: true,
  }));

  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      errorFormatter: errors => errors.map((err => ({
        property:err.property,
        message: Object.values(err.constraints)[0]
      })))
    }),
  );

  app.enableCors(cors)

  await app.listen(5552);
}
bootstrap();
