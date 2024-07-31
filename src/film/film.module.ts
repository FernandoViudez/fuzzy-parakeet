import { Module } from '@nestjs/common';
import { FilmRepository } from './repository/film.repository';
import { FilmSqlRepository } from './repository/film-sql.repository';
import { FilmController } from './controller/film.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { FilmModel } from './schema/film.model';
import { CreateFilmService } from './service/create/create.service';
import { FindAllFilmsService } from './service/find-all/find-all.service';
import { FindOneFilmService } from './service/find-by-id/find-by-id.service';
import { UpdateFilmService } from './service/update/update.service';
import { DeleteFilmService } from './service/soft-delete/soft-delete.service';

const repository = {
  provide: FilmRepository,
  useClass: FilmSqlRepository,
};

const services = [
  FindAllFilmsService,
  FindOneFilmService,
  CreateFilmService,
  UpdateFilmService,
  DeleteFilmService,
];

@Module({
  imports: [SequelizeModule.forFeature([FilmModel])],
  controllers: [FilmController],
  providers: [...services, repository],
  exports: [...services, repository],
})
export class FilmModule {}
