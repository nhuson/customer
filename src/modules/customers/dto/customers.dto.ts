import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsEmail, IsOptional, Length } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(0, 30)
  username: string;

  @ApiProperty()
  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  avatar?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Length(0, 80)
  bio?: string;

  @ApiPropertyOptional()
  @IsOptional()
  dob?: Date;
}

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}
