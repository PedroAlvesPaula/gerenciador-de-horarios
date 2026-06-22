import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateCatalogItemDto {
  @IsString()
  @IsNotEmpty({ message: 'The name is required' })
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0, { message: 'Price cannot be negative' })
  price!: number;

  @IsNumber()
  @Min(1, { message: 'Duration must be at least 1 minute' })
  durationMinutes!: number;
}
