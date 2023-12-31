import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
export class UserDto {
  @IsNotEmpty()
  @IsString()
  firstName?: string;

  @IsNotEmpty()
  @IsString()
  lastName?: string;

  @IsNotEmpty()
  @IsString()
  area?: string;

  @IsNotEmpty()
  @IsString()
  country?: string;

  @IsNotEmpty()
  @IsString()
  region?: string;

  @IsNotEmpty()
  @IsString()
  dob?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
