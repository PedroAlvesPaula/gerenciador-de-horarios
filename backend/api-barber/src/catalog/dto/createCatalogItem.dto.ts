import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
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
  name!: string;

  @ApiPropertyOptional({
    example: 'Corte navalhado com toalha quente',
    description: 'Detalhes do serviço',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 35.0, description: 'Preço em formato decimal' })
  @IsNumber()
  @Min(0, { message: 'Price cannot be negative' })
  price!: number;

  @ApiProperty({ example: 40, description: 'Duração do serviço em minutos' })
  @IsNumber()
  @Min(1, { message: 'Duration must be at least 1 minute' })
  durationMinutes!: number;
}
