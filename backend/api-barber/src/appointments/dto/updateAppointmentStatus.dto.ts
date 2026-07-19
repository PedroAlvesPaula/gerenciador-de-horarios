import { IsEnum, IsNotEmpty } from 'class-validator';
import { AppointmentStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAppointmentStatusDto {
  @ApiProperty({
    example: AppointmentStatus.CONFIRMED,
    description:
      'Status do agendamento: PENDING, CONFIRMED, COMPLETED ou CANCELED.',
  })
  @IsEnum(AppointmentStatus, { message: 'Status de agendamento inválido' })
  @IsNotEmpty({ message: 'Informe o status do agendamento' })
  status!: AppointmentStatus;
}
