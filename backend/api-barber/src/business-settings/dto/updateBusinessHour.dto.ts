import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateBusinessHourDto } from './createBusinessHour.dto';

export class UpdateBusinessHourDto extends PartialType(
  OmitType(CreateBusinessHourDto, ['id'] as const),
) {}
