import { Inject, Injectable, Logger } from '@nestjs/common';
import { FilmRepository } from '../film/repository/film.repository';
import { ExternalFilm } from '../common/types/external-film';

@Injectable()
export class CreateInBatchService {
  private readonly logger = new Logger(CreateInBatchService.name);

  constructor(
    @Inject(FilmRepository)
    private readonly filmRepository: FilmRepository,
  ) {}

  async execute(
    newFilmsIds: string[],
    externalFilmsMap: Map<string, ExternalFilm>,
  ) {
    const stats = {
      success: 0,
      failureCount: 0,
      failure: [],
    };
    this.logger.log('Begin create missing films process...');

    const promises = newFilmsIds.map(async (newExternalId) => {
      const externalFilmToAdd = externalFilmsMap.get(newExternalId);

      if (!externalFilmToAdd) {
        stats.failureCount++;
        stats.failure.push(newExternalId);
        this.logger.error(
          `Inconsistency data during creation process: Could not get external film with id ${newExternalId}`,
        );
        return;
      }

      try {
        await this.filmRepository.create({
          externalId: newExternalId,
          title: externalFilmToAdd.title,
          episode_id: externalFilmToAdd.episode_id,
          opening_crawl: externalFilmToAdd.opening_crawl,
          director: externalFilmToAdd.director,
          producer: externalFilmToAdd.producer,
          release_date: externalFilmToAdd.release_date,
          species: JSON.stringify(externalFilmToAdd.species),
          starships: JSON.stringify(externalFilmToAdd.starships),
          vehicles: JSON.stringify(externalFilmToAdd.vehicles),
          characters: JSON.stringify(externalFilmToAdd.characters),
          planets: JSON.stringify(externalFilmToAdd.planets),
          url: externalFilmToAdd.url,
          created: externalFilmToAdd.created,
          edited: externalFilmToAdd.edited,
        });
        stats.success++;
      } catch (error) {
        stats.failureCount++;
        stats.failure.push(newExternalId);

        if (error.name === 'SequelizeUniqueConstraintError') {
          this.logger.error(`Film with id ${newExternalId} already exists`);
          return;
        }

        this.logger.error(error);
        return;
      }
    });

    await Promise.all(promises);

    this.logger.log(`${stats.success} films created successfully`);
    this.logger.log(
      `${stats.failureCount} films creation FAILED. Failure externalIds: ${JSON.stringify(stats.failure)}`,
    );
  }
}
