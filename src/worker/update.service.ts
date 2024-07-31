import { Inject, Injectable, Logger } from '@nestjs/common';
import { ExternalFilm } from '../common/types/external-film';
import * as _ from 'lodash';
import { FilmRepository } from '../film/repository/film.repository';
import { Film } from '../film/schema/types/film.type';

@Injectable()
export class UpdateAndSyncFilmsService {
  private readonly logger = new Logger(UpdateAndSyncFilmsService.name);

  constructor(
    @Inject(FilmRepository) private readonly filmRepository: FilmRepository,
  ) {}

  async execute(
    matchingIds: string[],
    externalFilmsMap: Map<string, ExternalFilm>,
    localFilmsMap: Map<string, Film>,
  ) {
    this.logger.log('Beginning update matching films process');

    const stats = {
      success: 0,
      failureCount: 0,
      failure: [],
    };

    const promises = matchingIds.map(async (externalId) => {
      const externalFilm = externalFilmsMap.get(externalId);
      const localFilm = localFilmsMap.get(externalId);
      if (!_.isEqual(externalFilm, this.mapLocalFilmToExternal(localFilm))) {
        await this.updateFilm(externalId, externalFilm, stats);
        return;
      }

      this.logger.log(`Skipping ${externalId} due equality`);
    });

    await Promise.all(promises);

    this.logger.log(`${stats.success} films synced successfully`);
    this.logger.log(
      `${stats.failureCount} films sync FAILED. Failure externalIds: ${JSON.stringify(stats.failure)}`,
    );
  }

  private async updateFilm(
    externalId: string,
    externalFilm: ExternalFilm,
    stats: {
      success: number;
      failureCount: number;
      failure: string[];
    },
  ) {
    const [updatedCount] = await this.filmRepository.update(
      {
        title: externalFilm.title,
        episode_id: externalFilm.episode_id,
        opening_crawl: externalFilm.opening_crawl,
        director: externalFilm.director,
        producer: externalFilm.producer,
        release_date: externalFilm.release_date,
        species: JSON.stringify(externalFilm.species),
        starships: JSON.stringify(externalFilm.starships),
        vehicles: JSON.stringify(externalFilm.vehicles),
        characters: JSON.stringify(externalFilm.characters),
        planets: JSON.stringify(externalFilm.planets),
        url: externalFilm.url,
        created: externalFilm.created,
        edited: externalFilm.edited,
      },
      {
        externalId,
      },
    );

    if (updatedCount !== 1) {
      stats.failureCount++;
      stats.failure.push(externalId);
      this.logger.error(`Could not update film with id ${externalId}`);
      return;
    }
    this.logger.log(`Film with id ${externalId} successfully synced`);
    stats.success++;
  }

  private mapLocalFilmToExternal(localFilm: Film): ExternalFilm {
    return {
      created: localFilm.created,
      director: localFilm.director,
      edited: localFilm.edited,
      episode_id: localFilm.episode_id,
      opening_crawl: localFilm.opening_crawl,
      characters: JSON.parse(localFilm.characters),
      planets: JSON.parse(localFilm.planets),
      species: JSON.parse(localFilm.species),
      starships: JSON.parse(localFilm.starships),
      vehicles: JSON.parse(localFilm.vehicles),
      producer: localFilm.producer,
      release_date: localFilm.release_date,
      title: localFilm.title,
      url: localFilm.url,
    };
  }
}
