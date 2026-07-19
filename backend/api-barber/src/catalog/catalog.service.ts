import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CatalogItem, Prisma } from '@prisma/client';
import { CreateCatalogItemDto } from './dto/createCatalogItem.dto';
import { UpdateCatalogItemDto } from './dto/updateCatalogItem.dto';

const hasOwnField = <T extends object>(data: T, field: keyof T): boolean =>
  Object.getOwnPropertyDescriptor(data, field) !== undefined;

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCatalogItemDto): Promise<CatalogItem> {
    return this.prisma.catalogItem.create({
      data: {
        name: data.name,
        description: data.description || null,
        price: data.price,
        durationMinutes: data.durationMinutes,
      },
    });
  }

  async findAll(): Promise<CatalogItem[]> {
    return this.prisma.catalogItem.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: string): Promise<CatalogItem> {
    const item: CatalogItem | null = await this.prisma.catalogItem.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException('Catalog item not found.');
    }

    return item;
  }

  async update(id: string, data: UpdateCatalogItemDto): Promise<CatalogItem> {
    await this.findOne(id);

    return this.prisma.catalogItem.update({
      where: { id },
      data: {
        name: data.name,
        description: hasOwnField(data, 'description')
          ? data.description || null
          : undefined,
        price: data.price,
        durationMinutes: data.durationMinutes,
      },
    });
  }

  async remove(id: string): Promise<CatalogItem> {
    await this.findOne(id);

    const appointmentCount = await this.prisma.appointmentCatalogItem.count({
      where: { catalogItemId: id },
    });

    if (appointmentCount > 0) {
      throw new ConflictException(
        'Este serviço está vinculado a agendamentos e não pode ser excluído.',
      );
    }

    try {
      return await this.prisma.catalogItem.delete({
        where: { id },
      });
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new ConflictException(
          'Este serviço está vinculado a agendamentos e não pode ser excluído.',
        );
      }

      throw error;
    }
  }
}
