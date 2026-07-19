import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard, JwtUser } from '../auth/guards/admin.guard';
import {
  AppointmentDetails,
  AppointmentsService,
} from './appointments.service';
import { CreateAppointmentDto } from './dto/createAppointment.dto';
import { CreateAdminAppointmentDto } from './dto/createAdminAppointment.dto';
import { UpdateAppointmentStatusDto } from './dto/updateAppointmentStatus.dto';

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
  @ApiOperation({ summary: 'Criar um novo agendamento (cliente logado)' })
  async create(
    @Req() req: RequestWithJwtUser,
    @Body() createAppointmentDto: CreateAppointmentDto,
  ): Promise<AppointmentDetails> {
    return this.appointmentsService.create(req.user.id, createAppointmentDto);
  }

  @Post('admin')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Criar um agendamento (somente ADMIN)' })
  async createForAdmin(
    @Body() data: CreateAdminAppointmentDto,
  ): Promise<AppointmentDetails> {
    return this.appointmentsService.createForAdmin(data);
  }

  @Get()
  @ApiOperation({ summary: 'Listar agendamentos do cliente logado' })
  async findAllByClient(
    @Req() req: RequestWithJwtUser,
  ): Promise<AppointmentDetails[]> {
    return this.appointmentsService.findByClient(req.user.id);
  }

  @Get('all')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Listar todos os agendamentos (somente ADMIN)' })
  async findAll(): Promise<AppointmentDetails[]> {
    return this.appointmentsService.findAll();
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Buscar um agendamento (somente ADMIN)' })
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<AppointmentDetails> {
    return this.appointmentsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Editar um agendamento (somente ADMIN)' })
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() data: CreateAdminAppointmentDto,
  ): Promise<AppointmentDetails> {
    return this.appointmentsService.update(id, data);
  }

  @Patch(':id/status')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Alterar status do agendamento (somente ADMIN)' })
  @ApiParam({ name: 'id', description: 'UUID do agendamento' })
  async updateStatus(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() data: UpdateAppointmentStatusDto,
  ): Promise<AppointmentDetails> {
    return this.appointmentsService.updateStatus(id, data.status);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Excluir um agendamento (somente ADMIN)' })
  async remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<AppointmentDetails> {
    return this.appointmentsService.remove(id);
  }
}
