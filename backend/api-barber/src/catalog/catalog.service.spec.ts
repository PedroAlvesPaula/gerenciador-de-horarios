import { ConflictException, NotFoundException } from '@nestjs/common';
import { CatalogItem, Prisma } from '@prisma/client';
import { CatalogService } from './catalog.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CatalogService', () => {
  const prisma = {
    catalogItem: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    appointmentCatalogItem: {
      count: jest.fn(),
    },
  };
  const savedItem: CatalogItem = {
    id: 'a5e73e38-4500-4e53-82fb-d00944f5c613',
    name: 'Corte Clássico',
    description: 'Corte completo',
    price: new Prisma.Decimal(40),
    durationMinutes: 40,
    createdAt: new Date('2026-07-19T12:00:00.000Z'),
    updatedAt: new Date('2026-07-19T12:00:00.000Z'),
  };
  let service: CatalogService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CatalogService(prisma as unknown as PrismaService);
  });

  it('creates a catalog item', async () => {
    prisma.catalogItem.create.mockResolvedValue(savedItem);

    await expect(
      service.create({
        name: 'Corte Clássico',
        description: 'Corte completo',
        price: 40,
        durationMinutes: 40,
      }),
    ).resolves.toEqual(savedItem);

    expect(prisma.catalogItem.create).toHaveBeenCalledWith({
      data: {
        name: 'Corte Clássico',
        description: 'Corte completo',
        price: 40,
        durationMinutes: 40,
      },
    });
  });

  it('lists catalog items in alphabetical order', async () => {
    prisma.catalogItem.findMany.mockResolvedValue([savedItem]);

    await expect(service.findAll()).resolves.toEqual([savedItem]);
    expect(prisma.catalogItem.findMany).toHaveBeenCalledWith({
      orderBy: { name: 'asc' },
    });
  });

  it('returns not found for an unknown catalog item', async () => {
    prisma.catalogItem.findUnique.mockResolvedValue(null);

    await expect(service.findOne(savedItem.id)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('updates the item and allows clearing its description', async () => {
    const updatedItem = { ...savedItem, description: null };
    prisma.catalogItem.findUnique.mockResolvedValue(savedItem);
    prisma.catalogItem.update.mockResolvedValue(updatedItem);

    await expect(
      service.update(savedItem.id, { description: null, price: 45 }),
    ).resolves.toEqual(updatedItem);
    expect(prisma.catalogItem.update).toHaveBeenCalledWith({
      where: { id: savedItem.id },
      data: {
        name: undefined,
        description: null,
        price: 45,
        durationMinutes: undefined,
      },
    });
  });

  it('deletes an item that is not linked to an appointment', async () => {
    prisma.catalogItem.findUnique.mockResolvedValue(savedItem);
    prisma.appointmentCatalogItem.count.mockResolvedValue(0);
    prisma.catalogItem.delete.mockResolvedValue(savedItem);

    await expect(service.remove(savedItem.id)).resolves.toEqual(savedItem);
    expect(prisma.catalogItem.delete).toHaveBeenCalledWith({
      where: { id: savedItem.id },
    });
  });

  it('preserves an item linked to appointment history', async () => {
    prisma.catalogItem.findUnique.mockResolvedValue(savedItem);
    prisma.appointmentCatalogItem.count.mockResolvedValue(1);

    await expect(service.remove(savedItem.id)).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(prisma.catalogItem.delete).not.toHaveBeenCalled();
  });
});
