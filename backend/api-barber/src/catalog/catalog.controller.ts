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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Catálogo de Serviços')
@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Criar um novo serviço (Apenas ADMIN)' })
  async create(
    @Body() createCatalogItemDto: CreateCatalogItemDto,
  ): Promise<CatalogItem> {
    return this.catalogService.create(createCatalogItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os serviços disponíveis (Público)' })
  async findAll(): Promise<CatalogItem[]> {
    return this.catalogService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lista um serviço por id' })
  async findOne(@Param('id') id: string): Promise<CatalogItem> {
    return this.catalogService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Atualiza um serviço por id (somente ADMIN)' })
  async update(
    @Param('id') id: string,
    @Body() updateCatalogItemDto: UpdateCatalogItemDto,
  ): Promise<CatalogItem> {
    return this.catalogService.update(id, updateCatalogItemDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Deleta um serviço pelo id passado' })
  async remove(@Param('id') id: string): Promise<CatalogItem> {
    return this.catalogService.remove(id);
  }
}
