import { Inject, Injectable, Logger } from '@nestjs/common';
import { FilmRepository } from '../film/repository/film.repository';
import { Film } from '../film/schema/types/film.type';
import { CONFIG_PROVIDER } from '../config/config';
import { ConfigService } from '@nestjs/config';
import { WorkerConfig } from '../config/worker/config';

@Injectable()
export class DeleteInBatchService {
  private readonly logger = new Logger(DeleteInBatchService.name);

  constructor(
    @Inject(FilmRepository)
    private readonly filmRepository: FilmRepository,
    @Inject(CONFIG_PROVIDER)
    private readonly configService: ConfigService<WorkerConfig>,
  ) {}

  async execute(extraFilms: Film[]) {
    this.logger.log('Begin delete extra films process...');

    const stats = {
      success: 0,
      failureCount: 0,
      failure: [],
    };

    const promises = extraFilms.map(async (film) => {
      if (!film.externalId && !this.configService.get('deleteLocalFilms')) {
        return true;
      }

      const deletedCount = await this.filmRepository.delete({
        filmId: film.filmId,
      });

      if (deletedCount !== 1) {
        this.logger.error(`Error deleting extra film with id ${film.filmId}`);
        stats.failure.push(film.filmId);
        stats.failureCount++;
        return;
      }

      stats.success++;
    });

    await Promise.all(promises);

    this.logger.log(`${stats.success} films deleted successfully`);
    this.logger.log(
      `${stats.failureCount} films deletion FAILED. Failure externalIds: ${JSON.stringify(stats.failure)}`,
    );
  }
}
