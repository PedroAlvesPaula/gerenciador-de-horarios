import { PartialType } from '@nestjs/swagger';
import { CreateCatalogItemDto } from './createCatalogItem.dto';

export class UpdateCatalogItemDto extends PartialType(CreateCatalogItemDto) {}
