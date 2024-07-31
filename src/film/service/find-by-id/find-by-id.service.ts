import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FilmRepository } from '../../repository/film.repository';
import { FindOneReqDto } from '../../dto/find-one.dto';
import { Op } from 'sequelize';
import { FilmDto } from '../../../common/dto/film.dto';
import { mapFilmToResponse } from '../../../common/helpers/map-film';

@Injectable()
export class FindOneFilmService {
  constructor(
    @Inject(FilmRepository) private readonly filmRepository: FilmRepository,
  ) {}

  async execute(req: FindOneReqDto): Promise<FilmDto> {
    const { filmId, title } = req;

    const film = await this.filmRepository.findOne({
      ...(filmId ? { filmId } : {}),
      ...(title ? { title: { [Op.substring]: title } as any } : {}),
    });

    if (!film) {
      throw new NotFoundException(`Film not found with id: ${filmId || title}`);
    }

    return mapFilmToResponse(film);
  }
}
