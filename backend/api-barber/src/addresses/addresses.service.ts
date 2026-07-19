import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Address, Prisma } from '@prisma/client';
import { CreateAddressDto } from './dto/createAddress.dto';
import { UpdateAddressDto } from './dto/updateAddress.dto';

const hasOwnField = <T extends object>(data: T, field: keyof T): boolean =>
  Object.getOwnPropertyDescriptor(data, field) !== undefined;

@Injectable()
export class AddressesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, data: CreateAddressDto): Promise<Address> {
    return this.prisma.address.create({
      data: {
        street: data.street,
        number: data.number,
        complement: data.complement || null,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state.toUpperCase(),
        zipCode: data.zipCode || null,
        userId,
      },
    });
  }

  async findAllByUser(userId: string): Promise<Address[]> {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ city: 'asc' }, { street: 'asc' }, { number: 'asc' }],
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
      where: { id, userId },
      data: {
        street: data.street,
        number: data.number,
        complement: hasOwnField(data, 'complement')
          ? data.complement || null
          : undefined,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state?.toUpperCase(),
        zipCode: hasOwnField(data, 'zipCode')
          ? data.zipCode || null
          : undefined,
      },
    });
  }

  async remove(id: string, userId: string): Promise<Address> {
    await this.findOne(id, userId);

    const appointmentCount = await this.prisma.appointment.count({
      where: { addressId: id },
    });

    if (appointmentCount > 0) {
      throw new ConflictException(
        'Este endereço está vinculado a agendamentos e não pode ser excluído.',
      );
    }

    try {
      return await this.prisma.address.delete({
        where: { id, userId },
      });
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new ConflictException(
          'Este endereço está vinculado a agendamentos e não pode ser excluído.',
        );
      }

      throw error;
    }
  }
}
