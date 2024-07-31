import { Inject, Injectable } from '@nestjs/common';
import { FilmRepository } from '../../repository/film.repository';
import { FindAllReqDto, FindAllResDto } from '../../dto/find-all.dto';
import {
  DEFAULT_LIMIT,
  DEFAULT_OFFSET,
} from '../../../common/constants/defaults';
import { FilmModel } from '../../schema/film.model';
import { QueryOptions } from '../../../common/types/sequelize.type';
import { mapFilmToResponse } from '../../../common/helpers/map-film';

@Injectable()
export class FindAllFilmsService {
  constructor(
    @Inject(FilmRepository) private readonly filmRepository: FilmRepository,
  ) {}

  async execute(req: FindAllReqDto): Promise<FindAllResDto> {
    const options: QueryOptions<FilmModel> = {
      limit: req.limit || DEFAULT_LIMIT,
      offset: req.offset || DEFAULT_OFFSET,
      order: req.order
        ? [[(req.orderBy as keyof FilmModel) || 'createdAt', req.order]]
        : [],
    };

    const films = await this.filmRepository.findAll({}, options);

    // TODO: add total count of records to response params in order to create pagination in frontend
    return {
      films: films.map((film) => mapFilmToResponse(film)),
      limit: options.limit,
      offset: options.offset,
    };
  }
}
