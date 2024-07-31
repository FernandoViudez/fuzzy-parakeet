import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class SqlConfig {
  @IsString()
  @IsOptional()
  dialect?: string = process.env.SQL_DB_DIALECT || 'mssql';

  @IsString()
  @IsOptional()
  host?: string = process.env.SQL_DB_HOST;

  @IsNumber()
  @IsOptional()
  port?: number = process.env.SQL_DB_PORT
    ? parseInt(process.env.SQL_DB_PORT)
    : undefined;

  @IsString()
  @IsOptional()
  username?: string = process.env.SQL_DB_USERNAME;

  @IsString()
  @IsOptional()
  database?: string = process.env.SQL_DB_DATABASE;

  @IsString()
  @IsOptional()
  password?: string = process.env.SQL_DB_PASSWORD;

  @IsString()
  @IsOptional()
  connectionString?: string = process.env.SQL_CONNECTION_STRING;

  @IsBoolean()
  @IsOptional()
  disableSsl?: boolean = process.env.SQL_DISABLE_SSL === 'true';
}
