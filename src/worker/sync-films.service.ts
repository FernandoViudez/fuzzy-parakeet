import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ExternalFilm } from '../common/types/external-film';
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
import { FilmRepository } from '../film/repository/film.repository';
import { Op } from 'sequelize';
import { Film } from '../film/schema/types/film.type';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

@Injectable()
export class SyncFilmsService {
  private readonly logger = new Logger(SyncFilmsService.name);
  private batchSize: number;
  private missingFilmsSet = new Set<string>();
  private externalFilmsMap = new Map<string, ExternalFilm>();

  constructor(
    @Inject(CONFIG_PROVIDER)
    private readonly configService: ConfigService<WorkerConfig>,
    @Inject(FilmRepository)
    private readonly filmRepository: FilmRepository,
    private readonly httpService: HttpService,
    private readonly createInBatchService: CreateInBatchService,
    private readonly deleteInBatchService: DeleteInBatchService,
    private readonly updateAndSyncService: UpdateAndSyncFilmsService,
  ) {
    this.batchSize = configService.get('batchSize');
  }

  // // execute each 20 seconds just for testing quickly (or depending on the needs)
  @Cron(process.env.WORKER_CRON_EXECUTION_TIME)
  async execute() {
    this.logger.log(`# Running`);
    const startTime = performance.now();

    await this.syncFilms();

    this.logger.log(`# Finished. Took ${performance.now() - startTime}ms`);
  }

  async syncFilms() {
    const externalFilms = await this.getAllExternalFilms();

    this.missingFilmsSet = new Set();
    this.externalFilmsMap = new Map();
    externalFilms.map((film) => {
      const filmUrlSplitted = film.url.split('/');
      const key = filmUrlSplitted[filmUrlSplitted.length - 2];
      this.externalFilmsMap.set(key, film);
      this.missingFilmsSet.add(key);
    });

    let hasMorePages = false;
    let pageNumber = 1;
    let offsetId: Date;
    do {
      const pageStartTime = performance.now();
      this.logger.log(`Getting films page ${pageNumber}`);

      const films = await this.findAllFilmsByBatch(offsetId);
      offsetId = films[films.length - 1]?.createdAt;

      this.logger.log(`Found ${films.length} local films`);

      hasMorePages = films.length === this.batchSize;

      await this.processFilms(films);

      this.logger.log(
        `Page ${pageNumber++} sent. Took ${performance.now() - pageStartTime}ms`,
      );
    } while (hasMorePages);

    await this.createInBatchService.execute(
      Array.from(this.missingFilmsSet.values()),
      this.externalFilmsMap,
    );

    this.missingFilmsSet.clear();
    this.externalFilmsMap.clear();
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

  private async processFilms(localFilms: Film[]) {
    const localFilmsMap = new Map<string, Film>();
    const matchingIds = [];

    localFilms.forEach((film) => {
      if (film.externalId) {
        this.externalFilmsMap.has(film.externalId)
          ? matchingIds.push(film.externalId)
          : null;

        localFilmsMap.set(film.externalId, film);

        this.missingFilmsSet.delete(film.externalId);
      }
    });

    const extraFilms = localFilms.filter(
      (film) => !film.externalId || !this.externalFilmsMap.has(film.externalId),
    );

    await this.updateAndSyncService.execute(
      matchingIds,
      this.externalFilmsMap,
      localFilmsMap,
    );

    await this.deleteInBatchService.execute(extraFilms);
  }

  private async findAllFilmsByBatch(offsetId?: Date) {
    const query: any = {};

    if (offsetId) {
      query.createdAt = {
        [Op.gt]: offsetId,
      };
    }

    try {
      return await this.filmRepository.findAll(query, {
        order: [['createdAt', Order.ASC]],
        limit: this.batchSize,
      });
    } catch (error) {
      this.logger.error(error);
      return [];
    }
  }
}
