import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateInventoryItemDto } from './createInventoryItem.dto';

export class UpdateInventoryItemDto extends PartialType(
  OmitType(CreateInventoryItemDto, ['id'] as const),
) {}
