import { Role } from '@prisma/client';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersService', () => {
  const prisma = { user: { findMany: jest.fn() } };
  let service: UsersService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new UsersService(prisma as unknown as PrismaService);
  });

  it('lists only clients and does not select their password', async () => {
    prisma.user.findMany.mockResolvedValue([]);

    await expect(service.findClientsWithAddresses()).resolves.toEqual([]);

    expect(prisma.user.findMany).toHaveBeenCalledWith({
      where: { role: Role.USER },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        addresses: { orderBy: [{ city: 'asc' }, { street: 'asc' }] },
      },
      orderBy: { name: 'asc' },
    });
  });
});
