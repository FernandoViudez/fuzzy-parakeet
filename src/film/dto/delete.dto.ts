import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDefined } from 'class-validator';

export class DeleteFilmReqDto {
  @IsString()
  @IsDefined()
  @ApiProperty({
    required: true,
  })
  filmId: string;
}
