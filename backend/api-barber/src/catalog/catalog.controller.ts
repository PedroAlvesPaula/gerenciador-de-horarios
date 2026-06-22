import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CreateCatalogItemDto } from './dto/createCatalogItem.dto';
import { UpdateCatalogItemDto } from './dto/updateCatalogItem.dto';
import { CatalogItem } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async create(
    @Body() createCatalogItemDto: CreateCatalogItemDto,
  ): Promise<CatalogItem> {
    return this.catalogService.create(createCatalogItemDto);
  }

  @Get()
  async findAll(): Promise<CatalogItem[]> {
    return this.catalogService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CatalogItem> {
    return this.catalogService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async update(
    @Param('id') id: string,
    @Body() updateCatalogItemDto: UpdateCatalogItemDto,
  ): Promise<CatalogItem> {
    return this.catalogService.update(id, updateCatalogItemDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async remove(@Param('id') id: string): Promise<CatalogItem> {
    return this.catalogService.remove(id);
  }
}
