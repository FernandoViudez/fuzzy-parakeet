import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class FilmDto {
  @ApiProperty()
  @IsString()
  filmId: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  externalId?: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNumber()
  episode_id: number;

  @ApiProperty()
  @IsString()
  opening_crawl: string;

  @ApiProperty()
  @IsString()
  director: string;

  @ApiProperty()
  @IsString()
  producer: string;

  @ApiProperty()
  @IsString()
  release_date: string;

  @ApiProperty({
    isArray: true,
    example: [],
  })
  @IsString()
  species: string[];

  @ApiProperty({
    isArray: true,
    example: [],
  })
  @IsString()
  starships: string[];

  @ApiProperty({
    isArray: true,
    example: [],
  })
  @IsString()
  vehicles: string[];

  @ApiProperty({
    isArray: true,
    example: [],
  })
  @IsString()
  characters: string[];

  @ApiProperty({
    isArray: true,
    example: [],
  })
  @IsString()
  planets: string[];

  @ApiProperty()
  @IsString()
  url: string;

  @ApiProperty()
  @IsString()
  created: string;

  @ApiProperty()
  @IsString()
  edited: string;

  @ApiProperty({
    type: Date,
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    type: Date,
    required: false,
  })
  @IsDate()
  @IsOptional()
  deletedAt?: Date;

  @ApiProperty({
    type: Date,
  })
  @IsDate()
  updatedAt: Date;
}
