import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/createAddress.dto';
import { UpdateAddressDto } from './dto/updateAddress.dto';
import { Address } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { JwtUser } from '../auth/guards/admin.guard';

export interface RequestWithJwtUser extends Request {
  user: JwtUser;
}

@ApiTags('Endereços')
@ApiBearerAuth('JWT-auth')
@Controller('addresses')
@UseGuards(JwtAuthGuard)
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  @ApiOperation({ summary: 'Adicionar um novo endereço' })
  async create(
    @Req() req: RequestWithJwtUser,
    @Body() createAddressDto: CreateAddressDto,
  ): Promise<Address> {
    const userId: string = req.user.id;
    return this.addressesService.create(userId, createAddressDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os endereços do cliente logado' })
  async findAll(@Req() req: RequestWithJwtUser): Promise<Address[]> {
    const userId: string = req.user.id;
    return this.addressesService.findAllByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um endereço específico pelo ID' })
  @ApiParam({
    name: 'id',
    description: 'ID (UUID) do endereço',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  async findOne(
    @Req() req: RequestWithJwtUser,
    @Param('id') id: string,
  ): Promise<Address> {
    const userId: string = req.user.id;
    return this.addressesService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar os dados de um endereço' })
  @ApiParam({
    name: 'id',
    description: 'ID (UUID) do endereço a ser atualizado',
  })
  async update(
    @Req() req: RequestWithJwtUser,
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    const userId: string = req.user.id;
    return this.addressesService.update(id, userId, updateAddressDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir um endereço do cliente logado' })
  @ApiParam({
    name: 'id',
    description: 'ID (UUID) do endereço a ser excluído',
  })
  async remove(
    @Req() req: RequestWithJwtUser,
    @Param('id') id: string,
  ): Promise<Address> {
    const userId: string = req.user.id;
    return this.addressesService.remove(id, userId);
  }
}
