import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreateFilmReqDto, CreateFilmResDto } from '../../dto/create.dto';
import {
  FilmRepository,
  PreCreationFilm,
} from '../../repository/film.repository';
import { Film } from '../../schema/types/film.type';

@Injectable()
export class CreateFilmService {
  private readonly logger = new Logger(CreateFilmService.name);

  constructor(
    @Inject(FilmRepository) private readonly filmRepository: FilmRepository,
  ) {}

  async execute(req: CreateFilmReqDto): Promise<CreateFilmResDto> {
    let newFilm: Film;
    const payload = this.prepareFilmCreation(req);

    try {
      newFilm = await this.filmRepository.create(payload);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new BadRequestException('Film already exists');
      }

      this.logger.error(error);
      throw error;
    }

    return {
      filmId: newFilm.filmId,
    };
  }

  private prepareFilmCreation(req: CreateFilmReqDto): PreCreationFilm {
    const {
      characters,
      created,
      director,
      edited,
      episode_id,
      opening_crawl,
      planets,
      producer,
      release_date,
      species,
      starships,
      title,
      url,
      vehicles,
    } = req;
    return {
      characters: JSON.stringify(characters),
      created,
      director,
      edited,
      episode_id,
      opening_crawl,
      planets: JSON.stringify(planets),
      producer,
      release_date,
      species: JSON.stringify(species),
      starships: JSON.stringify(starships),
      title,
      url,
      vehicles: JSON.stringify(vehicles),
    };
  }
}
