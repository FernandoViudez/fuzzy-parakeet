import {
  ArgumentMetadata,
  Logger,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';

export class GlobalValidationPipe extends ValidationPipe {
  private readonly logger = new Logger(GlobalValidationPipe.name);
  constructor(options?: ValidationPipeOptions) {
    super({
      forbidNonWhitelisted: false,
      whitelist: true,
      transform: true,
      ...options,
    });
  }
  async transform(value: unknown, metadata: ArgumentMetadata) {
    return super.transform(value, metadata);
  }
}
