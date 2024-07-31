import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  FilmRepository,
  PreUpdateFilm,
} from '../../repository/film.repository';
import { UpdateFilmReqDto } from '../../dto/update.dto';

@Injectable()
export class UpdateFilmService {
  private readonly logger = new Logger(UpdateFilmService.name);

  constructor(
    @Inject(FilmRepository) private readonly filmRepository: FilmRepository,
  ) {}

  async execute(req: UpdateFilmReqDto): Promise<void> {
    const payload = this.prepareFilmUpdate(req);

    let affetedRecords: number;
    try {
      const [affected] = await this.filmRepository.update(payload, {
        filmId: req.filmId,
      });
      affetedRecords = affected;
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new BadRequestException('Film already exists');
      }

      this.logger.error(error);
      throw error;
    }

    if (affetedRecords !== 1) {
      throw new BadRequestException(
        `Error when updating film with id ${req.filmId}`,
      );
    }
  }

  private prepareFilmUpdate(req: UpdateFilmReqDto): PreUpdateFilm {
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
      ...(characters && { characters: JSON.stringify(characters) }),
      ...(created && { created }),
      ...(director && { director }),
      ...(edited && { edited }),
      ...(episode_id && { episode_id }),
      ...(opening_crawl && { opening_crawl }),
      ...(planets && { planets: JSON.stringify(planets) }),
      ...(producer && { producer }),
      ...(release_date && { release_date }),
      ...(species && { species: JSON.stringify(species) }),
      ...(starships && { starships: JSON.stringify(starships) }),
      ...(title && { title }),
      ...(url && { url }),
      ...(vehicles && { vehicles: JSON.stringify(vehicles) }),
    };
  }
}
