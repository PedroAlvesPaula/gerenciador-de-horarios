import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateCatalogItemDto } from './createCatalogItem.dto';

export class UpdateCatalogItemDto extends PartialType(
  OmitType(CreateCatalogItemDto, ['id'] as const),
) {}
