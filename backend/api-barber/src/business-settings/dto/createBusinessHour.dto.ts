import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsUUID, Matches, Max, Min } from 'class-validator';
import { TIME_PATTERN } from '../../common/utils/business-date-time';

export class CreateBusinessHourDto {
  @ApiPropertyOptional({
    description: 'UUID gerado pelo cliente para idempotência',
  })
  @IsOptional()
  @IsUUID('4', { message: 'ID do horário inválido' })
  id?: string;

  @ApiProperty({
    example: 1,
    minimum: 0,
    maximum: 6,
    description: 'Dia da semana (0 = domingo e 6 = sábado).',
  })
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek!: number;

  @ApiProperty({ example: '09:00' })
  @Matches(TIME_PATTERN, { message: 'openTime must use the HH:mm format.' })
  openTime!: string;

  @ApiProperty({ example: '19:00' })
  @Matches(TIME_PATTERN, { message: 'closeTime must use the HH:mm format.' })
  closeTime!: string;

  @ApiPropertyOptional({ example: '12:00', nullable: true })
  @IsOptional()
  @Matches(TIME_PATTERN, { message: 'breakStart must use the HH:mm format.' })
  breakStart?: string | null;

  @ApiPropertyOptional({ example: '13:00', nullable: true })
  @IsOptional()
  @Matches(TIME_PATTERN, { message: 'breakEnd must use the HH:mm format.' })
  breakEnd?: string | null;
}
