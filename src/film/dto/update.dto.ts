import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsDefined,
  IsDateString,
} from 'class-validator';

export class UpdateFilmReqDto {
  @IsString()
  @IsDefined()
  @ApiProperty({
    required: true,
  })
  filmId: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  title?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  episode_id?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  opening_crawl?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  director?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  producer?: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  release_date?: string;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    isArray: true,
    example: [],
  })
  @IsOptional()
  species?: string[];

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    isArray: true,
    example: [],
  })
  @IsOptional()
  starships?: string[];

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    isArray: true,
    example: [],
  })
  @IsOptional()
  vehicles?: string[];

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    isArray: true,
    example: [],
  })
  @IsOptional()
  characters?: string[];

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    isArray: true,
    example: [],
  })
  @IsOptional()
  planets?: string[];

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  url?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  created?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  edited?: string;
}
