import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalValidationPipe } from './common/pipe/validation-pipe';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { WorkerModule } from './worker/worker.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const enableWorker = configService.get('enableWorker');

  if (enableWorker) {
    const worker = await NestFactory.createMicroservice(WorkerModule);
    await worker.listen();
    return;
  }

  app.useGlobalPipes(new GlobalValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Conexa SWA api docs')
    .setDescription('Conexa SWA API description')
    .setVersion('1.0')
    .addTag('Conexa-SWA')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);
  await app.listen(configService.get('port'));
  console.log('App started in port: ', configService.get('port'));
}
bootstrap();
