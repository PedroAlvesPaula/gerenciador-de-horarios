import { PartialType } from '@nestjs/swagger';
import { CreateInventoryItemDto } from './createInventoryItem.dto';

export class UpdateInventoryItemDto extends PartialType(
  CreateInventoryItemDto,
) {}
