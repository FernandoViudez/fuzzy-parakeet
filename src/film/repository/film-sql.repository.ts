import { InjectModel } from '@nestjs/sequelize';
import { BaseSequelizeRepository } from '../../common/repository/base-sql.repository';
import { Injectable } from '@nestjs/common';
import { FilmModel } from '../schema/film.model';
import { FilmRepository } from './film.repository';

@Injectable()
export class FilmSqlRepository
  extends BaseSequelizeRepository<FilmModel>
  implements FilmRepository
{
  constructor(@InjectModel(FilmModel) model: typeof FilmModel) {
    super(model);
  }
}
