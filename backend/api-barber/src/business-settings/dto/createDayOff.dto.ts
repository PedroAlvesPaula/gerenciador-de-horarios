import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator';
import { DATE_ONLY_PATTERN } from '../../common/utils/business-date-time';

export class CreateDayOffDto {
  @ApiPropertyOptional({
    description: 'UUID gerado pelo cliente para idempotência',
  })
  @IsOptional()
  @IsUUID('4', { message: 'ID da folga inválido' })
  id?: string;

  @ApiProperty({
    example: '2026-12-25',
    description: 'Data da folga no formato YYYY-MM-DD.',
  })
  @Matches(DATE_ONLY_PATTERN, {
    message: 'date must use the YYYY-MM-DD format.',
  })
  date!: string;

  @ApiPropertyOptional({ example: 'Feriado de Natal' })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  reason?: string;
}
