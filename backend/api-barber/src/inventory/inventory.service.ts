import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InventoryItem, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInventoryItemDto } from './dto/createInventoryItem.dto';
import { UpdateInventoryItemDto } from './dto/updateInventoryItem.dto';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  private throwKnownError(error: unknown): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw new NotFoundException('Item de estoque não encontrado.');
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2034'
    ) {
      throw new ConflictException(
        'O item foi atualizado por outra operação. Tente novamente.',
      );
    }

    throw error;
  }

  async create(data: CreateInventoryItemDto): Promise<InventoryItem> {
    if (data.id) {
      return this.prisma.inventoryItem.upsert({
        where: { id: data.id },
        update: {},
        create: data,
      });
    }

    return this.prisma.inventoryItem.create({ data });
  }

  async findAll(): Promise<InventoryItem[]> {
    return this.prisma.inventoryItem.findMany({
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });
  }

  async findOne(id: string): Promise<InventoryItem> {
    const item = await this.prisma.inventoryItem.findUnique({ where: { id } });

    if (!item) {
      throw new NotFoundException('Item de estoque não encontrado.');
    }

    return item;
  }

  async update(
    id: string,
    data: UpdateInventoryItemDto,
  ): Promise<InventoryItem> {
    try {
      return await this.prisma.inventoryItem.update({
        where: { id },
        data,
      });
    } catch (error: unknown) {
      return this.throwKnownError(error);
    }
  }

  async updateQuantity(id: string, delta: number): Promise<InventoryItem> {
    try {
      return await this.prisma.$transaction(
        async (transaction) => {
          if (delta < 0) {
            const updated = await transaction.inventoryItem.updateMany({
              where: { id, quantity: { gte: Math.abs(delta) } },
              data: { quantity: { increment: delta } },
            });

            if (updated.count === 0) {
              const itemExists = await transaction.inventoryItem.findUnique({
                where: { id },
                select: { id: true },
              });

              if (!itemExists) {
                throw new NotFoundException('Item de estoque não encontrado.');
              }

              throw new BadRequestException(
                'A quantidade do item não pode ficar negativa.',
              );
            }
          } else {
            await transaction.inventoryItem.update({
              where: { id },
              data: { quantity: { increment: delta } },
            });
          }

          const item = await transaction.inventoryItem.findUnique({
            where: { id },
          });

          if (!item) {
            throw new NotFoundException('Item de estoque não encontrado.');
          }

          return item;
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
    } catch (error: unknown) {
      return this.throwKnownError(error);
    }
  }

  async remove(id: string): Promise<InventoryItem> {
    try {
      return await this.prisma.inventoryItem.delete({ where: { id } });
    } catch (error: unknown) {
      return this.throwKnownError(error);
    }
  }
}
