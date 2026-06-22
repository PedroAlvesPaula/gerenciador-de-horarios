import { PartialType } from '@nestjs/mapped-types';
import { CreateCatalogItemDto } from './createCatalogItem.dto';

export class UpdateCatalogItemDto extends PartialType(CreateCatalogItemDto) {}
