import { Transform, type TransformFnParams } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ItemCategory } from '@prisma/client';

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class CreateInventoryItemDto {
  @ApiPropertyOptional({
    description: 'UUID gerado pelo cliente para idempotência',
  })
  @IsOptional()
  @IsUUID('4', { message: 'ID do item inválido' })
  id?: string;

  @ApiProperty({ example: 'Lâminas (Caixa)' })
  @Transform(trimString)
  @IsString({ message: 'O nome deve ser um texto' })
  @IsNotEmpty({ message: 'Informe o nome do item' })
  @Matches(/\S/, { message: 'O nome não pode conter apenas espaços' })
  @MinLength(2, { message: 'O nome deve ter pelo menos 2 caracteres' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres' })
  name!: string;

  @ApiProperty({ enum: ItemCategory, example: ItemCategory.DESCARTAVEIS })
  @IsEnum(ItemCategory, { message: 'Categoria de estoque inválida' })
  category!: ItemCategory;

  @ApiProperty({ example: 3, minimum: 0, maximum: 1_000_000 })
  @IsInt({ message: 'O mínimo recomendado deve ser um número inteiro' })
  @Min(0, { message: 'O mínimo recomendado não pode ser negativo' })
  @Max(1_000_000, { message: 'O mínimo recomendado excede o limite' })
  minRecommended!: number;

  @ApiPropertyOptional({
    example: 10,
    default: 0,
    minimum: 0,
    maximum: 1_000_000,
  })
  @IsOptional()
  @IsInt({ message: 'A quantidade deve ser um número inteiro' })
  @Min(0, { message: 'A quantidade não pode ser negativa' })
  @Max(1_000_000, { message: 'A quantidade excede o limite' })
  quantity?: number;
}
