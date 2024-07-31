import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { CONFIG_PROVIDER, EnvConfig } from './config/config';
import { UserModel } from './auth/schema/user.model';
import { createSequelizeConfig } from './common/helpers/create-sequelize-config';
import { AuthModule } from './auth/auth.module';
import { FilmModel } from './film/schema/film.model';
import { FilmModule } from './film/film.module';

@Module({
  imports: [
    ConfigModule.forRoot(EnvConfig),
    SequelizeModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          ...createSequelizeConfig(configService.get('sql')),
          models: [UserModel, FilmModel],
        };
      },
      inject: [CONFIG_PROVIDER],
    }),
    AuthModule,
    FilmModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
