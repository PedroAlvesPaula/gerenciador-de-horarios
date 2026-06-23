import { IsEnum, IsNotEmpty } from 'class-validator';
import { AppointmentStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAppointmentStatusDto {
  @ApiProperty({
    example: 'inProgress',
    description:
      'O estado do serviço: criado, confirmado, em execução, encerrado.',
  })
  @IsEnum(AppointmentStatus, { message: 'Invalid appointment status' })
  @IsNotEmpty({ message: 'Status is required' })
  status!: AppointmentStatus;
}
