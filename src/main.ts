import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalValidationPipe } from './common/pipe/validation-pipe';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { WorkerModule } from './worker/worker.module';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

async function bootstrap() {
  if (process.env.ENABLE_SYNC_WORKER === 'true') {
    const worker = await NestFactory.create(WorkerModule);
    const configService = worker.get(ConfigService);
    await worker.listen(configService.get('port'));
    return;
  }

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new GlobalValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Conexa SWA api docs')
    .setDescription('Conexa SWA API description')
    .setVersion('1.0')
    .addTag('Conexa-SWA')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);
  await app.listen(configService.get('port'));
  console.log('App started in port: ', configService.get('port'));
}
bootstrap();
