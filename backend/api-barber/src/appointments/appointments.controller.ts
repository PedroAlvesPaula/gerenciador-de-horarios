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
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/createAppointment.dto';
import { UpdateAppointmentStatusDto } from './dto/updateAppointmentStatus.dto';
import { Appointment } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { Request } from 'express';
import { JwtUser } from '../auth/guards/admin.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

export interface RequestWithJwtUser extends Request {
  user: JwtUser;
}

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}
  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Criar um novo agendamento (publico)' })
  async create(
    @Req() req: RequestWithJwtUser,
    @Body() createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    const clientId: string = req.user.id;
    return this.appointmentsService.create(clientId, createAppointmentDto);
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Listar todos agendamentos de um cliente' })
  async findAllByClient(
    @Req() req: RequestWithJwtUser,
  ): Promise<Appointment[]> {
    const clientId: string = req.user.id;
    return this.appointmentsService.findByClient(clientId);
  }

  @Get('all')
  @UseGuards(AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Listar todos agendamentos do sistema' })
  async findAll(): Promise<Appointment[]> {
    return this.appointmentsService.findAll();
  }

  @Patch(':id/status')
  @UseGuards(AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Atualizao estado de um agendamento' })
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
