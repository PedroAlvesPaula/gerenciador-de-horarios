import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  AvailabilityResponse,
  AvailabilityService,
} from './availability.service';
import { GetAvailabilityDto } from './dto/getAvailability.dto';

@ApiTags('Disponibilidade')
@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get()
  @ApiOperation({ summary: 'Consultar horários livres para um serviço' })
  @ApiOkResponse({
    schema: {
      example: {
        date: '2026-07-20',
        availableSlots: ['09:00', '09:30', '10:30', '14:00'],
      },
    },
  })
  findAvailableSlots(
    @Query() query: GetAvailabilityDto,
  ): Promise<AvailabilityResponse> {
    return this.availabilityService.getAvailability(query);
  }
}
