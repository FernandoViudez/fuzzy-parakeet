import { Inject, Injectable, Logger } from '@nestjs/common';
import { FilmRepository } from '../film/repository/film.repository';

@Injectable()
export class DeleteInBatchService {
  private readonly logger = new Logger(DeleteInBatchService.name);

  constructor(
    @Inject(FilmRepository)
    private readonly filmRepository: FilmRepository,
  ) {}

  // TODO: add option to delete also local films without external ids (created by a normal user)
  async execute(extraFilms: string[]) {
    this.logger.log('Begin delete extra films process...');

    const stats = {
      success: 0,
      failureCount: 0,
      failure: [],
    };

    const promises = extraFilms.map(async (externalId) => {
      const deletedCount = await this.filmRepository.delete({
        externalId,
      });

      if (deletedCount !== 1) {
        this.logger.error(`Error deleting extra film with id ${externalId}`);
        stats.failure.push(externalId);
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
