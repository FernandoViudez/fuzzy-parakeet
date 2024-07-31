import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsEmail()
  @IsDefined()
  @ApiProperty({
    required: true,
  })
  email: string;

  @IsString()
  @IsDefined()
  @ApiProperty({
    required: true,
  })
  password: string;
}
