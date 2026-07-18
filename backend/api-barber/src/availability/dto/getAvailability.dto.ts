import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsUUID,
  Matches,
} from 'class-validator';
import { DATE_ONLY_PATTERN } from '../../common/utils/business-date-time';

const normalizeCatalogItemIds = ({ value }: TransformFnParams): unknown => {
  const values = Array.isArray(value) ? value : [value];

  return values
    .flatMap((item: unknown) =>
      typeof item === 'string' ? item.split(',') : [],
    )
    .map((item: string) => item.trim())
    .filter(Boolean);
};

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
    type: [String],
    example: [
      '123e4567-e89b-42d3-a456-426614174000',
      '123e4567-e89b-42d3-a456-426614174001',
    ],
    description: 'IDs dos serviços, repetidos ou separados por vírgula.',
  })
  @Transform(normalizeCatalogItemIds)
  @IsArray()
  @ArrayMinSize(1, { message: 'Select at least one catalog item.' })
  @ArrayMaxSize(20, { message: 'Select at most 20 catalog items.' })
  @ArrayUnique({ message: 'Catalog item IDs cannot be repeated.' })
  @IsUUID('4', { each: true, message: 'Invalid catalog item ID.' })
  catalogItemIds!: string[];
}
