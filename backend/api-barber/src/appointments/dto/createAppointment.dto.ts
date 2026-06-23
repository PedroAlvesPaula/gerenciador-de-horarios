import { IsDateString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
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
    example: 'iddoitem',
    description: 'O serviço que sera prestado',
  })
  @IsUUID('4', { message: 'Invalid catalog item ID' })
  @IsNotEmpty({ message: 'Catalog item ID is required' })
  catalogItemId!: string;

  @ApiProperty({
    example: 'endereço',
    description: 'Onde o serviço sera prestado',
  })
  @IsUUID('4', { message: 'Invalid address ID' })
  @IsOptional()
  addressId?: string;
}
