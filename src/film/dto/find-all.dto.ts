import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Order } from '../../common/enum/order.enum';
import { FilmDto } from '../../common/dto/film.dto';
import { Type } from 'class-transformer';

export class FindAllReqDto {
  @ApiProperty({
    description: 'how many records to skip',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  offset?: number;

  @ApiProperty({
    required: false,
    description: 'Limit of records. Default: 20',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    description: 'Order records by provided field',
    required: false,
  })
  @IsString()
  @IsOptional()
  orderBy?: string;

  @ApiProperty({
    description: 'Order records asc or desc',
    type: Order,
    required: false,
    enum: Order,
  })
  @IsEnum(Order)
  @IsOptional()
  order?: Order;
}

export class FindAllResDto {
  @ApiProperty({
    type: 'array',
    items: {
      allOf: [{ $ref: getSchemaPath(FilmDto) }],
    },
  })
  films: FilmDto[];

  @ApiProperty({
    description: 'Limit of records. Default: 20',
  })
  limit: number;

  @ApiProperty({
    description: 'Skipping records. Default: 0',
  })
  offset: number;
}
