import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '../../common/enum/role.enum';

export class RegisterDto {
  @IsEmail()
  @IsString()
  @ApiProperty({
    required: true,
  })
  email: string;

  @MinLength(8)
  @IsString()
  @ApiProperty({
    required: true,
    minLength: 8,
  })
  password: string;

  @IsNumber()
  @ApiProperty({
    required: true,
  })
  age: number;

  @IsString()
  @ApiProperty({
    required: true,
  })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  phone?: string;

  @ApiProperty({
    enum: Role,
    required: false,
    description:
      'Defaults to user if not provided. Option only allowed for admin users',
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
