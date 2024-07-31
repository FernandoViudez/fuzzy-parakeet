import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsDefined,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateFilmReqDto {
  @IsString()
  @IsDefined()
  @ApiProperty({
    required: true,
  })
  title: string;

  @IsNumber()
  @IsDefined()
  @ApiProperty({
    required: true,
  })
  episode_id: number;

  @IsString()
  @IsDefined()
  @ApiProperty({
    required: true,
  })
  opening_crawl: string;

  @IsString()
  @IsDefined()
  @ApiProperty({
    required: true,
  })
  director: string;

  @IsString()
  @IsDefined()
  @ApiProperty({
    required: true,
  })
  producer: string;

  @IsDateString()
  @IsDefined()
  @ApiProperty({
    required: true,
    example: new Date().toISOString(),
  })
  release_date: string;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    isArray: true,
    example: [],
  })
  species: string[];

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    isArray: true,
    example: [],
  })
  starships: string[];

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    isArray: true,
    example: [],
  })
  vehicles: string[];

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    isArray: true,
    example: [],
  })
  characters: string[];

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    isArray: true,
    example: [],
  })
  planets: string[];

  @IsString()
  @IsDefined()
  @ApiProperty({
    required: true,
  })
  url: string;

  @IsString()
  @IsDefined()
  @ApiProperty({
    required: true,
  })
  created: string;

  @IsString()
  @IsDefined()
  @ApiProperty({
    required: true,
  })
  edited: string;
}

export class CreateFilmResDto {
  @ApiProperty()
  @IsString()
  filmId: string;
}
