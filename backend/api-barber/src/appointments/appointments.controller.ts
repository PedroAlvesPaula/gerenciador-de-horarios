import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/createAppointment.dto';
import { UpdateAppointmentStatusDto } from './dto/updateAppointmentStatus.dto';
import { Appointment } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { Request } from 'express';
import { JwtUser } from '../auth/guards/admin.guard';

export interface RequestWithJwtUser extends Request {
  user: JwtUser;
}

@ApiTags('Agendamentos')
@ApiBearerAuth('JWT-auth')
@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo agendamento (Cliente logado)' })
  async create(
    @Req() req: RequestWithJwtUser,
    @Body() createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    const clientId: string = req.user.id;
    return this.appointmentsService.create(clientId, createAppointmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os agendamentos do cliente logado' })
  async findAllByClient(
    @Req() req: RequestWithJwtUser,
  ): Promise<Appointment[]> {
    const clientId: string = req.user.id;
    return this.appointmentsService.findByClient(clientId);
  }

  @Get('all')
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'Listar todos os agendamentos do sistema (Somente ADMIN)',
  })
  async findAll(): Promise<Appointment[]> {
    return this.appointmentsService.findAll();
  }

  @Patch(':id/status')
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'Atualizar o status de um agendamento (Somente ADMIN)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID (UUID) do agendamento a ser atualizado',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateAppointmentStatusDto: UpdateAppointmentStatusDto,
  ): Promise<Appointment> {
    return this.appointmentsService.updateStatus(
      id,
      updateAppointmentStatusDto.status,
    );
  }
}
