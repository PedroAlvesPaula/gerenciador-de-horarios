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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { DayOff } from '@prisma/client';
import { AdminGuard } from '../auth/guards/admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BusinessSettingsService } from './business-settings.service';
import { CreateDayOffDto } from './dto/createDayOff.dto';

@ApiTags('Configurações - Folgas e feriados')
@ApiBearerAuth('JWT-auth')
@Controller('days-off')
@UseGuards(JwtAuthGuard, AdminGuard)
export class DaysOffController {
  constructor(private readonly settingsService: BusinessSettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar folgas e feriados (ADMIN)' })
  findAll(): Promise<DayOff[]> {
    return this.settingsService.findDaysOff();
  }

  @Post()
  @ApiOperation({ summary: 'Adicionar uma folga ou feriado (ADMIN)' })
  create(@Body() data: CreateDayOffDto): Promise<DayOff> {
    return this.settingsService.createDayOff(data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Folga removida.' })
  async delete(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    await this.settingsService.deleteDayOff(id);
  }
}
