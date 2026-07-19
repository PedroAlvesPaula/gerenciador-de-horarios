import { ConflictException, NotFoundException } from '@nestjs/common';
import { AppointmentStatus } from '@prisma/client';
import { AppointmentsService } from './appointments.service';
import { PrismaService } from '../prisma/prisma.service';
import { AvailabilityService } from '../availability/availability.service';

const expectedAppointmentInclude = {
  client: {
    select: { id: true, name: true, email: true, phone: true },
  },
  items: { include: { catalogItem: true } },
  address: {
    select: {
      id: true,
      street: true,
      number: true,
      complement: true,
      neighborhood: true,
      city: true,
      state: true,
      zipCode: true,
    },
  },
};

describe('AppointmentsService', () => {
  const transaction = {
    address: { findFirst: jest.fn() },
    appointment: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };
  const prisma = {
    $transaction: jest.fn(
      (callback: (database: typeof transaction) => Promise<unknown>) =>
        callback(transaction),
    ),
    appointment: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  };
  const availabilityService = {
    assertSlotIsAvailable: jest.fn(),
  };
  let service: AppointmentsService;

  const createData = {
    scheduledAt: '2099-07-20T12:00:00.000Z',
    catalogItemIds: ['first-catalog-item-id', 'second-catalog-item-id'],
    addressId: 'address-id',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AppointmentsService(
      prisma as unknown as PrismaService,
      availabilityService as unknown as AvailabilityService,
    );
  });

  it('validates the address and availability before creating an appointment', async () => {
    const createdAppointment = { id: 'appointment-id' };
    transaction.address.findFirst.mockResolvedValue({ id: 'address-id' });
    availabilityService.assertSlotIsAvailable.mockResolvedValue(70);
    transaction.appointment.create.mockResolvedValue(createdAppointment);

    await expect(service.create('client-id', createData)).resolves.toEqual(
      createdAppointment,
    );

    expect(transaction.address.findFirst).toHaveBeenCalledWith({
      where: { id: 'address-id', userId: 'client-id' },
      select: { id: true },
    });
    expect(availabilityService.assertSlotIsAvailable).toHaveBeenCalledWith(
      createData.catalogItemIds,
      new Date(createData.scheduledAt),
      transaction,
    );
    expect(transaction.appointment.create).toHaveBeenCalledWith({
      data: {
        scheduledAt: new Date(createData.scheduledAt),
        durationMinutes: 70,
        clientId: 'client-id',
        addressId: 'address-id',
        items: {
          create: [
            { catalogItemId: 'first-catalog-item-id' },
            { catalogItemId: 'second-catalog-item-id' },
          ],
        },
      },
      include: expectedAppointmentInclude,
    });
  });

  it('returns an existing client-generated appointment without duplicating it', async () => {
    const existingAppointment = {
      id: 'a5e73e38-4500-4e53-82fb-d00944f5c613',
      clientId: 'client-id',
    };
    transaction.appointment.findUnique.mockResolvedValue(existingAppointment);

    await expect(
      service.create('client-id', {
        ...createData,
        id: existingAppointment.id,
      }),
    ).resolves.toEqual(existingAppointment);

    expect(transaction.appointment.findUnique).toHaveBeenCalledWith({
      where: { id: existingAppointment.id },
      include: expectedAppointmentInclude,
    });
    expect(transaction.address.findFirst).not.toHaveBeenCalled();
    expect(availabilityService.assertSlotIsAvailable).not.toHaveBeenCalled();
    expect(transaction.appointment.create).not.toHaveBeenCalled();
  });

  it('forwards the client-generated id when an admin creates the appointment', async () => {
    const id = 'a5e73e38-4500-4e53-82fb-d00944f5c613';
    const createSpy = jest
      .spyOn(service, 'create')
      .mockResolvedValue({ id } as never);

    await service.createForAdmin({
      ...createData,
      id,
      clientId: 'client-id',
    });

    expect(createSpy).toHaveBeenCalledWith('client-id', {
      ...createData,
      id,
    });
  });

  it('does not create an appointment when the selected slot is unavailable', async () => {
    transaction.address.findFirst.mockResolvedValue({ id: 'address-id' });
    availabilityService.assertSlotIsAvailable.mockRejectedValue(
      new ConflictException('Unavailable slot.'),
    );

    await expect(
      service.create('client-id', createData),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(transaction.appointment.create).not.toHaveBeenCalled();
  });

  it('rejects an address that does not belong to the selected client', async () => {
    transaction.address.findFirst.mockResolvedValue(null);

    await expect(
      service.create('client-id', createData),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(availabilityService.assertSlotIsAvailable).not.toHaveBeenCalled();
    expect(transaction.appointment.create).not.toHaveBeenCalled();
  });

  it('revalidates an update while excluding the appointment being edited', async () => {
    const updatedAppointment = { id: 'appointment-id' };
    transaction.appointment.findUnique.mockResolvedValue({
      id: 'appointment-id',
    });
    transaction.address.findFirst.mockResolvedValue({ id: 'address-id' });
    availabilityService.assertSlotIsAvailable.mockResolvedValue(70);
    transaction.appointment.update.mockResolvedValue(updatedAppointment);

    await expect(
      service.update('appointment-id', {
        ...createData,
        clientId: 'new-client-id',
      }),
    ).resolves.toEqual(updatedAppointment);

    expect(availabilityService.assertSlotIsAvailable).toHaveBeenCalledWith(
      createData.catalogItemIds,
      new Date(createData.scheduledAt),
      transaction,
      'appointment-id',
    );
    expect(transaction.appointment.update).toHaveBeenCalledWith({
      where: { id: 'appointment-id' },
      data: {
        scheduledAt: new Date(createData.scheduledAt),
        clientId: 'new-client-id',
        addressId: 'address-id',
        durationMinutes: 70,
        items: {
          deleteMany: {},
          create: [
            { catalogItemId: 'first-catalog-item-id' },
            { catalogItemId: 'second-catalog-item-id' },
          ],
        },
      },
      include: expectedAppointmentInclude,
    });
  });

  it('checks availability before reactivating a canceled appointment', async () => {
    const scheduledAt = new Date(createData.scheduledAt);
    transaction.appointment.findUnique.mockResolvedValue({
      id: 'appointment-id',
      scheduledAt,
      status: AppointmentStatus.CANCELED,
      items: [{ catalogItemId: 'first-catalog-item-id' }],
    });
    transaction.appointment.update.mockResolvedValue({
      id: 'appointment-id',
      status: AppointmentStatus.PENDING,
    });

    await service.updateStatus('appointment-id', AppointmentStatus.PENDING);

    expect(availabilityService.assertSlotIsAvailable).toHaveBeenCalledWith(
      ['first-catalog-item-id'],
      scheduledAt,
      transaction,
      'appointment-id',
    );
  });

  it('lists appointments using an explicit safe client projection', async () => {
    prisma.appointment.findMany.mockResolvedValue([]);

    await service.findAll();

    expect(prisma.appointment.findMany).toHaveBeenCalledWith({
      include: expectedAppointmentInclude,
      orderBy: { scheduledAt: 'asc' },
    });
  });

  it('deletes an existing appointment', async () => {
    const appointment = { id: 'appointment-id' };
    prisma.appointment.findUnique.mockResolvedValue(appointment);
    prisma.appointment.delete.mockResolvedValue(appointment);

    await expect(service.remove('appointment-id')).resolves.toEqual(
      appointment,
    );
    expect(prisma.appointment.delete).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'appointment-id' } }),
    );
  });
});
