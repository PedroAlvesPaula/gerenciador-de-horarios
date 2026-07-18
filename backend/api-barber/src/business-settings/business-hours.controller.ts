import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { BusinessHour } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { BusinessSettingsService } from './business-settings.service';
import { CreateBusinessHourDto } from './dto/createBusinessHour.dto';
import { UpdateBusinessHourDto } from './dto/updateBusinessHour.dto';

@ApiTags('Configurações - Horários de funcionamento')
@ApiBearerAuth('JWT-auth')
@Controller('business-hours')
@UseGuards(JwtAuthGuard, AdminGuard)
export class BusinessHoursController {
  constructor(private readonly settingsService: BusinessSettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar os horários configurados (ADMIN)' })
  findAll(): Promise<BusinessHour[]> {
    return this.settingsService.findBusinessHours();
  }

  @Post()
  @ApiOperation({ summary: 'Configurar o funcionamento de um dia (ADMIN)' })
  create(@Body() data: CreateBusinessHourDto): Promise<BusinessHour> {
    return this.settingsService.createBusinessHour(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar o funcionamento de um dia (ADMIN)' })
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() data: UpdateBusinessHourDto,
  ): Promise<BusinessHour> {
    return this.settingsService.updateBusinessHour(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Dia removido do expediente semanal.' })
  async delete(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    await this.settingsService.deleteBusinessHour(id);
  }
}
