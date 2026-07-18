import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, Matches } from 'class-validator';
import { DATE_ONLY_PATTERN } from '../../common/utils/business-date-time';

export class GetAvailabilityDto {
  @ApiProperty({
    example: '2026-07-20',
    description: 'Data desejada no formato YYYY-MM-DD.',
  })
  @Matches(DATE_ONLY_PATTERN, {
    message: 'date must use the YYYY-MM-DD format.',
  })
  date!: string;

  @ApiProperty({
    example: '123e4567-e89b-42d3-a456-426614174000',
    description: 'ID do serviço no catálogo.',
  })
  @IsUUID('4', { message: 'Invalid catalog item ID.' })
  catalogItemId!: string;
}
