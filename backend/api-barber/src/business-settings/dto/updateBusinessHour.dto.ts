import { PartialType } from '@nestjs/swagger';
import { CreateBusinessHourDto } from './createBusinessHour.dto';

export class UpdateBusinessHourDto extends PartialType(CreateBusinessHourDto) {}
