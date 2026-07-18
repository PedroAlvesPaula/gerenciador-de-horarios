import { ConflictException, NotFoundException } from '@nestjs/common';
import { AppointmentStatus } from '@prisma/client';
import { AppointmentsService } from './appointments.service';
import { PrismaService } from '../prisma/prisma.service';
import { AvailabilityService } from '../availability/availability.service';

describe('AppointmentsService', () => {
  const transaction = {
    address: { findFirst: jest.fn() },
    appointment: { create: jest.fn() },
  };
  const prisma = {
    $transaction: jest.fn(
      (callback: (database: typeof transaction) => Promise<unknown>) =>
        callback(transaction),
    ),
  };
  const availabilityService = {
    assertSlotIsAvailable: jest.fn(),
  };
  let service: AppointmentsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AppointmentsService(
      prisma as unknown as PrismaService,
      availabilityService as unknown as AvailabilityService,
    );
  });

  it('validates availability before creating the appointment', async () => {
    const scheduledAt = '2099-07-20T12:00:00.000Z';
    const createdAppointment = {
      id: 'appointment-id',
      scheduledAt: new Date(scheduledAt),
      durationMinutes: 70,
      status: AppointmentStatus.PENDING,
      clientId: 'client-id',
      addressId: null,
    };
    availabilityService.assertSlotIsAvailable.mockResolvedValue(70);
    transaction.appointment.create.mockResolvedValue(createdAppointment);

    await expect(
      service.create('client-id', {
        scheduledAt,
        catalogItemIds: ['first-catalog-item-id', 'second-catalog-item-id'],
      }),
    ).resolves.toEqual(createdAppointment);

    expect(availabilityService.assertSlotIsAvailable).toHaveBeenCalledWith(
      ['first-catalog-item-id', 'second-catalog-item-id'],
      new Date(scheduledAt),
      transaction,
    );
    expect(transaction.appointment.create).toHaveBeenCalledWith({
      data: {
        scheduledAt: new Date(scheduledAt),
        durationMinutes: 70,
        clientId: 'client-id',
        addressId: undefined,
        items: {
          create: [
            { catalogItemId: 'first-catalog-item-id' },
            { catalogItemId: 'second-catalog-item-id' },
          ],
        },
      },
    });
  });

  it('does not create an appointment when the selected slot is unavailable', async () => {
    availabilityService.assertSlotIsAvailable.mockRejectedValue(
      new ConflictException('Unavailable slot.'),
    );

    await expect(
      service.create('client-id', {
        scheduledAt: '2099-07-20T12:00:00.000Z',
        catalogItemIds: ['first-catalog-item-id'],
      }),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(transaction.appointment.create).not.toHaveBeenCalled();
  });

  it('rejects an address that does not belong to the authenticated client', async () => {
    transaction.address.findFirst.mockResolvedValue(null);

    await expect(
      service.create('client-id', {
        scheduledAt: '2099-07-20T12:00:00.000Z',
        catalogItemIds: ['first-catalog-item-id'],
        addressId: 'address-id',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(availabilityService.assertSlotIsAvailable).not.toHaveBeenCalled();
    expect(transaction.appointment.create).not.toHaveBeenCalled();
  });
});
