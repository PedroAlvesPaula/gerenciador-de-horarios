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

@Controller('addresses')
@UseGuards(JwtAuthGuard) // Protege todas as rotas deste controlador
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  async create(
    @Req() req: RequestWithJwtUser,
    @Body() createAddressDto: CreateAddressDto,
  ): Promise<Address> {
    const userId: string = req.user.id;
    return this.addressesService.create(userId, createAddressDto);
  }

  @Get()
  async findAll(@Req() req: RequestWithJwtUser): Promise<Address[]> {
    const userId: string = req.user.id;
    return this.addressesService.findAllByUser(userId);
  }

  @Get(':id')
  async findOne(
    @Req() req: RequestWithJwtUser,
    @Param('id') id: string,
  ): Promise<Address> {
    const userId: string = req.user.id;
    return this.addressesService.findOne(id, userId);
  }

  @Patch(':id')
  async update(
    @Req() req: RequestWithJwtUser,
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    const userId: string = req.user.id;
    return this.addressesService.update(id, userId, updateAddressDto);
  }

  @Delete(':id')
  async remove(
    @Req() req: RequestWithJwtUser,
    @Param('id') id: string,
  ): Promise<Address> {
    const userId: string = req.user.id;
    return this.addressesService.remove(id, userId);
  }
}
