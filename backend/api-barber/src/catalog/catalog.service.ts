import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CatalogItem } from '@prisma/client';
import { CreateCatalogItemDto } from './dto/createCatalogItem.dto';
import { UpdateCatalogItemDto } from './dto/updateCatalogItem.dto';

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCatalogItemDto): Promise<CatalogItem> {
    return await this.prisma.catalogItem.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        durationMinutes: data.durationMinutes,
      },
    });
  }

  async findAll(): Promise<CatalogItem[]> {
    return await this.prisma.catalogItem.findMany();
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

    return await this.prisma.catalogItem.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        durationMinutes: data.durationMinutes,
      },
    });
  }

  async remove(id: string): Promise<CatalogItem> {
    await this.findOne(id);

    return this.prisma.catalogItem.delete({
      where: { id },
    });
  }
}
