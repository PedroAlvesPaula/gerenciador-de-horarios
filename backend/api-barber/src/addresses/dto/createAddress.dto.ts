import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiProperty({
    example: 'Rua das Flores',
    description: 'O nome da rua do endereço',
  })
  @IsString()
  @IsNotEmpty({ message: 'O nome da rua é obrigatório' })
  street!: string;

  @ApiProperty({
    example: '123A',
    description: 'O número da residência ou prédio',
  })
  @IsString()
  @IsNotEmpty({ message: 'O número é obrigatório' })
  number!: string;

  @ApiPropertyOptional({
    example: 'Apto 42, Bloco B',
    description:
      'Detalhes adicionais do endereço, como apartamento, sala ou bloco',
  })
  @IsString()
  @IsOptional()
  complement?: string;

  @ApiProperty({
    example: 'Centro',
    description: 'O bairro ou distrito',
  })
  @IsString()
  @IsNotEmpty({ message: 'O bairro é obrigatório' })
  neighborhood!: string;

  @ApiProperty({
    example: 'Ouro Preto',
    description: 'O nome da cidade',
  })
  @IsString()
  @IsNotEmpty({ message: 'A cidade é obrigatória' })
  city!: string;

  @ApiProperty({
    example: 'MG',
    description: 'A sigla do estado (UF) - deve ter exatamente 2 caracteres',
    minLength: 2,
    maxLength: 2,
  })
  @IsString()
  @Length(2, 2, {
    message: 'O estado deve ter exatamente 2 caracteres (ex: MG)',
  })
  @IsNotEmpty({ message: 'O estado é obrigatório' })
  state!: string;

  @ApiPropertyOptional({
    example: '35400-000',
    description: 'O código postal ou CEP',
  })
  @IsString()
  @IsOptional()
  zipCode?: string;
}
