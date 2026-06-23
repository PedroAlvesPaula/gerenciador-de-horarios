import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty({ message: 'Street name is required' })
  street!: string;

  @IsString()
  @IsNotEmpty({ message: 'Number is required' })
  number!: string;

  @IsString()
  @IsOptional()
  complement?: string;

  @IsString()
  @IsNotEmpty({ message: 'Neighborhood is required' })
  neighborhood!: string;

  @IsString()
  @IsNotEmpty({ message: 'City is required' })
  city!: string;

  @IsString()
  @Length(2, 2, { message: 'State must be exactly 2 characters (e.g., MG)' })
  @IsNotEmpty({ message: 'State is required' })
  state!: string;

  @IsString()
  @IsOptional()
  zipCode?: string;
}
