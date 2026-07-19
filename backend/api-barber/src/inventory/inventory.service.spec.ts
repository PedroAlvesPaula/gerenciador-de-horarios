import { BadRequestException, NotFoundException } from '@nestjs/common';
import { InventoryItem, ItemCategory } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { InventoryService } from './inventory.service';

describe('InventoryService', () => {
  const transaction = {
    inventoryItem: {
      updateMany: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
    },
  };
  const prisma = {
    inventoryItem: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn(
      (callback: (database: typeof transaction) => Promise<unknown>) =>
        callback(transaction),
    ),
  };
  const savedItem: InventoryItem = {
    id: 'a5e73e38-4500-4e53-82fb-d00944f5c613',
    name: 'Lâminas',
    category: ItemCategory.DESCARTAVEIS,
    minRecommended: 3,
    quantity: 10,
    createdAt: new Date('2026-07-19T12:00:00.000Z'),
    updatedAt: new Date('2026-07-19T12:00:00.000Z'),
  };
  let service: InventoryService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new InventoryService(prisma as unknown as PrismaService);
  });

  it('creates an inventory item', async () => {
    prisma.inventoryItem.create.mockResolvedValue(savedItem);
    const data = {
      name: savedItem.name,
      category: savedItem.category,
      minRecommended: savedItem.minRecommended,
      quantity: savedItem.quantity,
    };

    await expect(service.create(data)).resolves.toEqual(savedItem);
    expect(prisma.inventoryItem.create).toHaveBeenCalledWith({ data });
  });

  it('lists items by category and name', async () => {
    prisma.inventoryItem.findMany.mockResolvedValue([savedItem]);

    await expect(service.findAll()).resolves.toEqual([savedItem]);
    expect(prisma.inventoryItem.findMany).toHaveBeenCalledWith({
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });
  });

  it('returns not found for an unknown item', async () => {
    prisma.inventoryItem.findUnique.mockResolvedValue(null);

    await expect(service.findOne(savedItem.id)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('atomically decreases the quantity', async () => {
    const updatedItem = { ...savedItem, quantity: 9 };
    transaction.inventoryItem.updateMany.mockResolvedValue({ count: 1 });
    transaction.inventoryItem.findUnique.mockResolvedValue(updatedItem);

    await expect(service.updateQuantity(savedItem.id, -1)).resolves.toEqual(
      updatedItem,
    );
    expect(transaction.inventoryItem.updateMany).toHaveBeenCalledWith({
      where: { id: savedItem.id, quantity: { gte: 1 } },
      data: { quantity: { increment: -1 } },
    });
  });

  it('does not allow a quantity to become negative', async () => {
    transaction.inventoryItem.updateMany.mockResolvedValue({ count: 0 });
    transaction.inventoryItem.findUnique.mockResolvedValue({
      id: savedItem.id,
    });

    await expect(
      service.updateQuantity(savedItem.id, -1),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('increments quantity atomically', async () => {
    const updatedItem = { ...savedItem, quantity: 11 };
    transaction.inventoryItem.update.mockResolvedValue(updatedItem);
    transaction.inventoryItem.findUnique.mockResolvedValue(updatedItem);

    await expect(service.updateQuantity(savedItem.id, 1)).resolves.toEqual(
      updatedItem,
    );
    expect(transaction.inventoryItem.update).toHaveBeenCalledWith({
      where: { id: savedItem.id },
      data: { quantity: { increment: 1 } },
    });
  });

  it('deletes an inventory item', async () => {
    prisma.inventoryItem.delete.mockResolvedValue(savedItem);

    await expect(service.remove(savedItem.id)).resolves.toEqual(savedItem);
    expect(prisma.inventoryItem.delete).toHaveBeenCalledWith({
      where: { id: savedItem.id },
    });
  });
});
