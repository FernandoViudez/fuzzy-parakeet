import { IsBoolean, IsNumber, IsString, ValidateNested } from 'class-validator';
import { SqlConfig } from './sequelize/config';
import { Type } from 'class-transformer';

export const CONFIG_PROVIDER = 'CONFIG_PROVIDER';

export class EnvConfig {
  @IsNumber()
  port = parseInt(process.env.PORT) || 3000;

  @IsBoolean()
  enableWorker = process.env.ENABLE_SYNC_WORKER === 'true';

  @IsString()
  jwtSecret = process.env.JWT_SECRET || 'my-super-duper-secret-key';

  @IsNumber()
  jwtExpiresIn = parseInt(process.env.JWT_EXPIRES_IN_SECONDS) || 1000000;

  @Type(() => SqlConfig)
  @ValidateNested()
  sql = new SqlConfig();
}
