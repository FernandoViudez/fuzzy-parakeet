import { IsNumber } from 'class-validator';

import { EnvConfig } from '../config';

export class WorkerConfig extends EnvConfig {
  @IsNumber()
  batchSize: number = parseInt(process.env.WORKER_BATCH_SIZE) || 10;
}
