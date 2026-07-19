import { AvailabilityService } from './availability.service';
import { PrismaService } from '../prisma/prisma.service';
import { AppointmentStatus } from '@prisma/client';
import {
  businessDateTimeToUtc,
  getBusinessDayRange,
} from '../common/utils/business-date-time';

describe('AvailabilityService', () => {
  const firstCatalogItemId = '123e4567-e89b-42d3-a456-426614174000';
  const secondCatalogItemId = '123e4567-e89b-42d3-a456-426614174001';
  const database = {
    catalogItem: { findMany: jest.fn() },
    dayOff: { findUnique: jest.fn() },
    businessHour: { findUnique: jest.fn() },
    appointment: { findMany: jest.fn() },
  };
  let service: AvailabilityService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AvailabilityService(database as unknown as PrismaService);
  });

  it('returns no slots for a past date without querying the database', async () => {
    await expect(
      service.getAvailability({
        date: '2000-01-01',
        catalogItemIds: [firstCatalogItemId],
      }),
    ).resolves.toEqual({ date: '2000-01-01', availableSlots: [] });

    expect(database.catalogItem.findMany).not.toHaveBeenCalled();
  });

  it('returns no slots when the requested day is registered off', async () => {
    database.catalogItem.findMany.mockResolvedValue([{ durationMinutes: 30 }]);
    database.dayOff.findUnique.mockResolvedValue({ id: 'day-off-id' });

    await expect(
      service.getAvailability({
        date: '2099-07-20',
        catalogItemIds: [firstCatalogItemId],
      }),
    ).resolves.toEqual({ date: '2099-07-20', availableSlots: [] });

    expect(database.businessHour.findUnique).not.toHaveBeenCalled();
  });

  it('removes slots that overlap the break, an appointment, or closing time', async () => {
    database.catalogItem.findMany.mockResolvedValue([{ durationMinutes: 40 }]);
    database.dayOff.findUnique.mockResolvedValue(null);
    database.businessHour.findUnique.mockResolvedValue({
      id: 'business-hour-id',
      dayOfWeek: 1,
      openTime: '09:00',
      closeTime: '12:00',
      breakStart: '10:00',
      breakEnd: '10:30',
    });
    database.appointment.findMany.mockResolvedValue([
      {
        scheduledAt: businessDateTimeToUtc('2099-07-20', '11:00'),
        durationMinutes: 30,
      },
    ]);

    await expect(
      service.getAvailability({
        date: '2099-07-20',
        catalogItemIds: [firstCatalogItemId],
      }),
    ).resolves.toEqual({
      date: '2099-07-20',
      availableSlots: ['09:00'],
    });
  });

  it('uses the service duration as the interval between slots', async () => {
    database.catalogItem.findMany.mockResolvedValue([{ durationMinutes: 20 }]);
    database.dayOff.findUnique.mockResolvedValue(null);
    database.businessHour.findUnique.mockResolvedValue({
      id: 'business-hour-id',
      dayOfWeek: 1,
      openTime: '09:00',
      closeTime: '10:00',
      breakStart: null,
      breakEnd: null,
    });
    database.appointment.findMany.mockResolvedValue([]);

    await expect(
      service.getAvailability({
        date: '2099-07-20',
        catalogItemIds: [firstCatalogItemId],
      }),
    ).resolves.toEqual({
      date: '2099-07-20',
      availableSlots: ['09:00', '09:20', '09:40'],
    });
  });

  it('sums all selected service durations to generate slots', async () => {
    database.catalogItem.findMany.mockResolvedValue([
      { durationMinutes: 20 },
      { durationMinutes: 30 },
    ]);
    database.dayOff.findUnique.mockResolvedValue(null);
    database.businessHour.findUnique.mockResolvedValue({
      id: 'business-hour-id',
      dayOfWeek: 1,
      openTime: '09:00',
      closeTime: '10:40',
      breakStart: null,
      breakEnd: null,
    });
    database.appointment.findMany.mockResolvedValue([]);

    await expect(
      service.getAvailability({
        date: '2099-07-20',
        catalogItemIds: [firstCatalogItemId, secondCatalogItemId],
      }),
    ).resolves.toEqual({
      date: '2099-07-20',
      availableSlots: ['09:00', '09:50'],
    });
  });

  it('hides a long service when it does not fit before an appointment', async () => {
    database.catalogItem.findMany.mockResolvedValue([
      { durationMinutes: 40 },
      { durationMinutes: 30 },
    ]);
    database.dayOff.findUnique.mockResolvedValue(null);
    database.businessHour.findUnique.mockResolvedValue({
      id: 'business-hour-id',
      dayOfWeek: 1,
      openTime: '09:00',
      closeTime: '12:00',
      breakStart: null,
      breakEnd: null,
    });
    database.appointment.findMany.mockResolvedValue([
      {
        scheduledAt: businessDateTimeToUtc('2099-07-20', '10:00'),
        durationMinutes: 40,
      },
    ]);

    await expect(
      service.getAvailability({
        date: '2099-07-20',
        catalogItemIds: [firstCatalogItemId, secondCatalogItemId],
      }),
    ).resolves.toEqual({
      date: '2099-07-20',
      availableSlots: [],
    });
  });

  it('excludes the appointment being edited from collision checks', async () => {
    database.catalogItem.findMany.mockResolvedValue([{ durationMinutes: 30 }]);
    database.dayOff.findUnique.mockResolvedValue(null);
    database.businessHour.findUnique.mockResolvedValue({
      id: 'business-hour-id',
      dayOfWeek: 1,
      openTime: '09:00',
      closeTime: '10:00',
      breakStart: null,
      breakEnd: null,
    });
    database.appointment.findMany.mockResolvedValue([]);
    const scheduledAt = businessDateTimeToUtc('2099-07-20', '09:00');

    await expect(
      service.assertSlotIsAvailable(
        [firstCatalogItemId],
        scheduledAt,
        database as unknown as PrismaService,
        'appointment-id',
      ),
    ).resolves.toBe(30);

    const range = getBusinessDayRange('2099-07-20');
    expect(database.appointment.findMany).toHaveBeenCalledWith({
      where: {
        scheduledAt: { gte: range.start, lt: range.end },
        status: {
          in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED],
        },
        id: { not: 'appointment-id' },
      },
      select: { scheduledAt: true, durationMinutes: true },
    });
  });
});
