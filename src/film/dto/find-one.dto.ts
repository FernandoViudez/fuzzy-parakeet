import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, ValidateIf } from 'class-validator';

export class FindOneReqDto {
  @ApiProperty({
    required: false,
    description: 'Field to search by, required if title not provided',
  })
  @IsDefined()
  @IsString()
  @ValidateIf((o) => !o.title)
  filmId?: string;

  @ApiProperty({
    required: false,
    description: 'Field to search by, required if filmId not provided',
  })
  @IsString()
  @IsDefined()
  @ValidateIf((o) => !o.filmId)
  title?: string;
}
