import { DynamicModule, Global, Module } from '@nestjs/common';
import {
  ConfigService,
  ConfigModule as NestConfigModule,
} from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { CONFIG_PROVIDER, EnvConfig } from './config';

@Global()
@Module({})
export class ConfigModule {
  static forRoot(service: typeof EnvConfig): DynamicModule {
    const validate = (config: typeof process.env) => {
      process.env = { ...config };
      const loadedConfig = new service();

      const validatedConfig = plainToInstance(service, loadedConfig, {
        enableImplicitConversion: true,
      });
      const errors = validateSync(validatedConfig, {
        skipMissingProperties: false,
      });
      if (errors.length > 0) throw new Error(errors.toString());

      return validatedConfig;
    };

    const envFilePath = [`.env`];

    return {
      module: ConfigModule,
      imports: [
        NestConfigModule.forRoot({
          envFilePath,
          validate,
          cache: true,
        }),
      ],
      providers: [
        {
          provide: CONFIG_PROVIDER,
          useClass: ConfigService,
        },
      ],
      exports: [CONFIG_PROVIDER],
    };
  }
}
