import { Transform, type TransformFnParams } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

const trimAndUppercase = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim().toUpperCase() : value;

export class CreateAddressDto {
  @ApiProperty({
    example: 'Rua das Flores',
    description: 'O nome da rua do endereço',
  })
  @Transform(trimString)
  @IsString()
  @IsNotEmpty({ message: 'O nome da rua é obrigatório' })
  @MinLength(3, { message: 'O nome da rua deve ter pelo menos 3 caracteres' })
  @MaxLength(120, {
    message: 'O nome da rua deve ter no máximo 120 caracteres',
  })
  street!: string;

  @ApiProperty({
    example: '123A',
    description: 'O número da residência ou prédio',
  })
  @Transform(trimString)
  @IsString()
  @IsNotEmpty({ message: 'O número é obrigatório' })
  @MaxLength(20, { message: 'O número deve ter no máximo 20 caracteres' })
  number!: string;

  @ApiPropertyOptional({
    example: 'Apto 42, Bloco B',
    description:
      'Detalhes adicionais do endereço, como apartamento, sala ou bloco',
  })
  @Transform(trimString)
  @IsString()
  @IsOptional()
  @MaxLength(100, {
    message: 'O complemento deve ter no máximo 100 caracteres',
  })
  complement?: string;

  @ApiProperty({
    example: 'Centro',
    description: 'O bairro ou distrito',
  })
  @Transform(trimString)
  @IsString()
  @IsNotEmpty({ message: 'O bairro é obrigatório' })
  @MinLength(2, { message: 'O bairro deve ter pelo menos 2 caracteres' })
  @MaxLength(80, { message: 'O bairro deve ter no máximo 80 caracteres' })
  neighborhood!: string;

  @ApiProperty({
    example: 'Ouro Preto',
    description: 'O nome da cidade',
  })
  @Transform(trimString)
  @IsString()
  @IsNotEmpty({ message: 'A cidade é obrigatória' })
  @MinLength(2, { message: 'A cidade deve ter pelo menos 2 caracteres' })
  @MaxLength(80, { message: 'A cidade deve ter no máximo 80 caracteres' })
  city!: string;

  @ApiProperty({
    example: 'MG',
    description: 'A sigla do estado (UF) - deve ter exatamente 2 caracteres',
    minLength: 2,
    maxLength: 2,
  })
  @Transform(trimAndUppercase)
  @IsString()
  @Length(2, 2, {
    message: 'O estado deve ter exatamente 2 caracteres (ex: MG)',
  })
  @Matches(/^[A-Z]{2}$/, {
    message: 'O estado deve conter uma sigla válida com duas letras',
  })
  @IsNotEmpty({ message: 'O estado é obrigatório' })
  state!: string;

  @ApiPropertyOptional({
    example: '35400-000',
    description: 'O código postal ou CEP',
  })
  @Transform(trimString)
  @IsString()
  @IsOptional()
  @Matches(/^\d{5}-?\d{3}$/, {
    message: 'O CEP deve estar no formato 00000-000 ou 00000000',
  })
  zipCode?: string;
}
