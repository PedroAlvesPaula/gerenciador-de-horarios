import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InventoryItem } from '@prisma/client';
import { AdminGuard } from '../auth/guards/admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateInventoryItemDto } from './dto/createInventoryItem.dto';
import { UpdateInventoryItemDto } from './dto/updateInventoryItem.dto';
import { UpdateInventoryQuantityDto } from './dto/updateInventoryQuantity.dto';
import { InventoryService } from './inventory.service';

@ApiTags('Estoque')
@ApiBearerAuth('JWT-auth')
@Controller('inventory')
@UseGuards(JwtAuthGuard, AdminGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar item de estoque (somente ADMIN)' })
  create(@Body() data: CreateInventoryItemDto): Promise<InventoryItem> {
    return this.inventoryService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Listar itens de estoque (somente ADMIN)' })
  findAll(): Promise<InventoryItem[]> {
    return this.inventoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar item de estoque (somente ADMIN)' })
  findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<InventoryItem> {
    return this.inventoryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Editar item de estoque (somente ADMIN)' })
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() data: UpdateInventoryItemDto,
  ): Promise<InventoryItem> {
    return this.inventoryService.update(id, data);
  }

  @Patch(':id/quantity')
  @ApiOperation({ summary: 'Alterar quantidade do item (somente ADMIN)' })
  updateQuantity(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() data: UpdateInventoryQuantityDto,
  ): Promise<InventoryItem> {
    return this.inventoryService.updateQuantity(id, data.delta);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir item de estoque (somente ADMIN)' })
  remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<InventoryItem> {
    return this.inventoryService.remove(id);
  }
}
