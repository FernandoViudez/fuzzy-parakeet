import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class ValidationError {
  @ApiProperty({
    isArray: true,
    example: [],
  })
  @IsArray()
  @IsString()
  message: string[];

  @ApiProperty()
  @IsString()
  error: string;

  @ApiProperty()
  @IsNumber()
  statusCode: number;
}
