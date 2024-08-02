import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { FilmModule } from '../film/film.module';
import { WorkerConfig } from '../config/worker/config';
import { HttpModule } from '@nestjs/axios';
import { SyncFilmsService } from './sync-films.service';
import { UpdateAndSyncFilmsService } from './update.service';
import { CreateInBatchService } from './create-in-batch.service';
import { DeleteInBatchService } from './delete-in-batch.service';
import { ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { createSequelizeConfig } from '../common/helpers/create-sequelize-config';
import { CONFIG_PROVIDER } from '../config/config';
import { FilmModel } from '../film/schema/film.model';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot(WorkerConfig),
    SequelizeModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          ...createSequelizeConfig(configService.get('sql')),
          models: [FilmModel],
        };
      },
      inject: [CONFIG_PROVIDER],
    }),
    ScheduleModule.forRoot(),
    FilmModule,
    HttpModule.register({
      timeout: 10000,
    }),
  ],
  controllers: [],
  providers: [
    SyncFilmsService,
    UpdateAndSyncFilmsService,
    CreateInBatchService,
    DeleteInBatchService,
  ],
})
export class WorkerModule {
  constructor(private readonly syncFilmsService: SyncFilmsService) {
    syncFilmsService.syncFilms();
  }
}
