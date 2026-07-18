import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({
    example: '00/00/0000',
    description: 'Quando o serviço foi criado',
  })
  @IsDateString({}, { message: 'Invalid date format. Use ISO 8601 string.' })
  @IsNotEmpty({ message: 'Appointment date is required' })
  scheduledAt!: string;

  @ApiProperty({
    type: [String],
    example: [
      '123e4567-e89b-42d3-a456-426614174000',
      '123e4567-e89b-42d3-a456-426614174001',
    ],
    description: 'Os serviços que serão prestados',
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'Select at least one catalog item' })
  @ArrayMaxSize(20, { message: 'Select at most 20 catalog items' })
  @ArrayUnique({ message: 'Catalog item IDs cannot be repeated' })
  @IsUUID('4', { each: true, message: 'Invalid catalog item ID' })
  catalogItemIds!: string[];

  @ApiProperty({
    example: 'endereço',
    description: 'Onde o serviço sera prestado',
  })
  @IsUUID('4', { message: 'Invalid address ID' })
  @IsOptional()
  addressId?: string;
}
