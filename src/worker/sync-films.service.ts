import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ExternalFilm } from '../common/types/external-film';
import { FindAllFilmsService } from '../film/service/find-all/find-all.service';
import { CONFIG_PROVIDER } from '../config/config';
import { ConfigService } from '@nestjs/config';
import { Order } from '../common/enum/order.enum';
import { WorkerConfig } from '../config/worker/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreateInBatchService } from './create-in-batch.service';
import { DeleteInBatchService } from './delete-in-batch.service';
import { UpdateAndSyncFilmsService } from './update.service';
import { Cron } from '@nestjs/schedule';
import { FilmDto } from '../common/dto/film.dto';

@Injectable()
export class SyncFilmsService {
  private readonly logger = new Logger(SyncFilmsService.name);
  private batchSize: number;

  constructor(
    @Inject(CONFIG_PROVIDER)
    private readonly configService: ConfigService<WorkerConfig>,
    private readonly findAllFilmsService: FindAllFilmsService,
    private readonly httpService: HttpService,
    private readonly createInBatchService: CreateInBatchService,
    private readonly deleteInBatchService: DeleteInBatchService,
    private readonly updateAndSyncService: UpdateAndSyncFilmsService,
  ) {
    this.batchSize = configService.get('batchSize');
  }

  // execute each 20 seconds just for testing quickly (or depending on the needs)
  @Cron('*/20 * * * * *')
  async execute() {
    this.logger.log(`# Running`);
    const startTime = performance.now();

    await this.syncFilms();

    this.logger.log(`# Finished. Took ${performance.now() - startTime}ms`);
  }

  async syncFilms() {
    const externalFilms = await this.getAllExternalFilms();

    let hasMorePages = false;
    let pageNumber = 1;
    let offsetId: number;
    do {
      const pageStartTime = performance.now();
      this.logger.log(`Getting films page ${pageNumber}`);

      const { films } = await this.findAllFilmsService.execute({
        order: Order.ASC,
        orderBy: 'episode_id',
        ...(offsetId && { offset: offsetId }),
        limit: this.batchSize,
      });
      offsetId = films[films.length - 1]?.episode_id;

      this.logger.log(`Found ${films.length} local films`);

      hasMorePages = films.length === this.batchSize;

      await this.processFilms(externalFilms, films);

      this.logger.log(
        `Page ${pageNumber++} sent. Took ${performance.now() - pageStartTime}ms`,
      );
    } while (hasMorePages);
  }

  private async getAllExternalFilms(): Promise<ExternalFilm[]> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<ExternalFilm[]>('https://swapi.dev/api/films'),
      );
      return (data as any).results;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException({
        error,
        message: 'Could not get external films.',
      });
    }
  }

  private async processFilms(
    externalFilms: ExternalFilm[],
    localFilms: FilmDto[],
  ) {
    const externalFilmsMap = new Map<string, ExternalFilm>();
    externalFilms.map((film) => {
      const filmUrlSplitted = film.url.split('/');
      const key = filmUrlSplitted[filmUrlSplitted.length - 2];
      externalFilmsMap.set(key, film);
    });

    const localFilmsMap = new Map<string, FilmDto>();
    localFilms.map((film) => {
      if (film.externalId) {
        localFilmsMap.set(film.externalId, film);
      }
    });

    // TODO: add option to delete film with no external id defined (local films)

    const extraFilms = Array.from(localFilmsMap.keys()).filter(
      (externalId) => !externalFilmsMap.has(externalId),
    );

    const missingFilms = Array.from(externalFilmsMap.keys()).filter(
      (externalId) => !localFilmsMap.has(externalId),
    );

    const matchingFilms = Array.from(localFilmsMap.keys()).filter(
      (externalId) => externalFilmsMap.has(externalId),
    );

    await this.updateAndSyncService.execute(
      matchingFilms,
      externalFilmsMap,
      localFilmsMap,
    );

    await this.deleteInBatchService.execute(extraFilms);

    await this.createInBatchService.execute(missingFilms, externalFilmsMap);
  }
}
