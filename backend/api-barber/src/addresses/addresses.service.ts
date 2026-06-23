import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Address } from '@prisma/client';
import { CreateAddressDto } from './dto/createAddress.dto';
import { UpdateAddressDto } from './dto/updateAddress.dto';

@Injectable()
export class AddressesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, data: CreateAddressDto): Promise<Address> {
    return this.prisma.address.create({
      data: {
        street: data.street,
        number: data.number,
        complement: data.complement,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        userId: userId,
      },
    });
  }

  async findAllByUser(userId: string): Promise<Address[]> {
    return this.prisma.address.findMany({
      where: { userId },
    });
  }

  async findOne(id: string, userId: string): Promise<Address> {
    const address: Address | null = await this.prisma.address.findFirst({
      where: { id, userId },
    });

    if (!address) {
      throw new NotFoundException('Address not found.');
    }

    return address;
  }

  async update(
    id: string,
    userId: string,
    data: UpdateAddressDto,
  ): Promise<Address> {
    await this.findOne(id, userId);

    return this.prisma.address.update({
      where: { id },
      data: {
        street: data.street,
        number: data.number,
        complement: data.complement,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
      },
    });
  }

  async remove(id: string, userId: string): Promise<Address> {
    await this.findOne(id, userId);

    return this.prisma.address.delete({
      where: { id },
    });
  }
}
