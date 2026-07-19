import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreateAppointmentDto } from './createAppointment.dto';

export class CreateAdminAppointmentDto extends CreateAppointmentDto {
  @ApiProperty({
    example: '123e4567-e89b-42d3-a456-426614174003',
    description: 'Cliente para quem o agendamento será criado',
  })
  @IsNotEmpty({ message: 'Selecione o cliente do agendamento' })
  @IsUUID('4', { message: 'ID de cliente inválido' })
  clientId!: string;
}
