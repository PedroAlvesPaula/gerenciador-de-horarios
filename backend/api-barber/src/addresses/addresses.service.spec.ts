import { ConflictException, NotFoundException } from '@nestjs/common';
import { Address } from '@prisma/client';
import { AddressesService } from './addresses.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AddressesService', () => {
  const prisma = {
    address: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    appointment: {
      count: jest.fn(),
    },
  };
  const savedAddress: Address = {
    id: '7da35bf4-20bd-4c4a-9fd9-e2f50fb4e261',
    street: 'Rua das Flores',
    number: '123',
    complement: null,
    neighborhood: 'Centro',
    city: 'Ouro Preto',
    state: 'MG',
    zipCode: '35400-000',
    userId: 'client-id',
  };
  let service: AddressesService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AddressesService(prisma as unknown as PrismaService);
  });

  it('creates an address owned by the authenticated user', async () => {
    prisma.address.create.mockResolvedValue(savedAddress);

    await expect(
      service.create('client-id', {
        street: 'Rua das Flores',
        number: '123',
        neighborhood: 'Centro',
        city: 'Ouro Preto',
        state: 'mg',
        zipCode: '35400-000',
      }),
    ).resolves.toEqual(savedAddress);

    expect(prisma.address.create).toHaveBeenCalledWith({
      data: {
        street: 'Rua das Flores',
        number: '123',
        complement: null,
        neighborhood: 'Centro',
        city: 'Ouro Preto',
        state: 'MG',
        zipCode: '35400-000',
        userId: 'client-id',
      },
    });
  });

  it('lists only the addresses owned by the authenticated user', async () => {
    prisma.address.findMany.mockResolvedValue([savedAddress]);

    await expect(service.findAllByUser('client-id')).resolves.toEqual([
      savedAddress,
    ]);
    expect(prisma.address.findMany).toHaveBeenCalledWith({
      where: { userId: 'client-id' },
      orderBy: [{ city: 'asc' }, { street: 'asc' }, { number: 'asc' }],
    });
  });

  it('does not expose an address owned by another user', async () => {
    prisma.address.findFirst.mockResolvedValue(null);

    await expect(
      service.findOne(savedAddress.id, 'another-client-id'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('updates the address only when it belongs to the authenticated user', async () => {
    const updatedAddress = { ...savedAddress, complement: null, zipCode: null };
    prisma.address.findFirst.mockResolvedValue(savedAddress);
    prisma.address.update.mockResolvedValue(updatedAddress);

    await expect(
      service.update(savedAddress.id, 'client-id', {
        complement: '',
        state: 'sp',
        zipCode: '',
      }),
    ).resolves.toEqual(updatedAddress);

    expect(prisma.address.update).toHaveBeenCalledWith({
      where: { id: savedAddress.id, userId: 'client-id' },
      data: {
        street: undefined,
        number: undefined,
        complement: null,
        neighborhood: undefined,
        city: undefined,
        state: 'SP',
        zipCode: null,
      },
    });
  });

  it('deletes the address only when it belongs to the authenticated user', async () => {
    prisma.address.findFirst.mockResolvedValue(savedAddress);
    prisma.appointment.count.mockResolvedValue(0);
    prisma.address.delete.mockResolvedValue(savedAddress);

    await expect(service.remove(savedAddress.id, 'client-id')).resolves.toEqual(
      savedAddress,
    );
    expect(prisma.address.delete).toHaveBeenCalledWith({
      where: { id: savedAddress.id, userId: 'client-id' },
    });
  });

  it('preserves an address linked to appointment history', async () => {
    prisma.address.findFirst.mockResolvedValue(savedAddress);
    prisma.appointment.count.mockResolvedValue(1);

    await expect(
      service.remove(savedAddress.id, 'client-id'),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(prisma.address.delete).not.toHaveBeenCalled();
  });
});
