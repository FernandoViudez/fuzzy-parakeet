import { IsBoolean, IsNumber, IsString } from 'class-validator';

import { EnvConfig } from '../config';

export class WorkerConfig extends EnvConfig {
  @IsNumber()
  batchSize: number = parseInt(process.env.WORKER_BATCH_SIZE) || 10;

  @IsBoolean()
  deleteLocalFilms: boolean = process.env.WORKER_DELETE_LOCAL_FILMS === 'true';

  @IsString()
  cronExecutionTime: string =
    process.env.WORKER_CRON_EXECUTION_TIME || '*/20 * * * * *';
}
