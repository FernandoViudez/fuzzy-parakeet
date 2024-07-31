import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiResponse,
  ApiResponseOptions,
} from '@nestjs/swagger';
import { ValidationError } from '../dto/class-validator.error';

export function ApiResponseOk({
  options,
  type,
  extraModels = [],
  addAuth = true,
}: {
  options: ApiResponseOptions;
  type: any;
  extraModels?: any[];
  addAuth?: boolean;
}) {
  const decorators = [
    ApiResponse({
      description: 'Validation error',
      status: 400,
      type: ValidationError,
    }),
    ApiResponse({
      ...options,
      status: 200,
      type,
    }),
    ApiResponse({
      description:
        'Unhandled errors. Commonly refers to data incosistency or any connection with microservice error. Should not affect the server',
      status: 500,
    }),
    ApiExtraModels(...extraModels),
  ];

  if (addAuth) {
    decorators.push(
      ApiResponse({
        description: 'Unauthorized',
        status: 401,
        example: {
          message: 'Unauthorized',
          statusCode: 401,
        },
      }),
    );
  }

  return applyDecorators(...decorators);
}
