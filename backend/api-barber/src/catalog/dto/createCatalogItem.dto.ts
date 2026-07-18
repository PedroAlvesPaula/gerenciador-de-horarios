import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsInt,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCatalogItemDto {
  @ApiProperty({
    example: 'Corte Degradê',
    description: 'O nome do serviço oferecido',
  })
  @IsString()
  @IsNotEmpty({ message: 'The name is required' })
  @Matches(/\S/, { message: 'The name cannot contain only spaces' })
  @MaxLength(100)
  name!: string;

  @ApiPropertyOptional({
    example: 'Corte navalhado com toalha quente',
    description: 'Detalhes do serviço',
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ example: 35.0, description: 'Preço em formato decimal' })
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 },
    { message: 'Price must be a number with at most 2 decimal places' },
  )
  @Min(0, { message: 'Price cannot be negative' })
  @Max(99_999_999.99, { message: 'Price exceeds the supported limit' })
  price!: number;

  @ApiProperty({ example: 40, description: 'Duração do serviço em minutos' })
  @IsInt({ message: 'Duration must be an integer number of minutes' })
  @Min(1, { message: 'Duration must be at least 1 minute' })
  @Max(1_440, { message: 'Duration cannot exceed 1440 minutes' })
  durationMinutes!: number;
}
