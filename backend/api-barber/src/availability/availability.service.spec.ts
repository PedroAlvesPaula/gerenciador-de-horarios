import { AvailabilityService } from './availability.service';
import { PrismaService } from '../prisma/prisma.service';
import { businessDateTimeToUtc } from '../common/utils/business-date-time';

describe('AvailabilityService', () => {
  const database = {
    catalogItem: { findUnique: jest.fn() },
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
        catalogItemId: '123e4567-e89b-42d3-a456-426614174000',
      }),
    ).resolves.toEqual({ date: '2000-01-01', availableSlots: [] });

    expect(database.catalogItem.findUnique).not.toHaveBeenCalled();
  });

  it('returns no slots when the requested day is registered off', async () => {
    database.catalogItem.findUnique.mockResolvedValue({ durationMinutes: 30 });
    database.dayOff.findUnique.mockResolvedValue({ id: 'day-off-id' });

    await expect(
      service.getAvailability({
        date: '2099-07-20',
        catalogItemId: '123e4567-e89b-42d3-a456-426614174000',
      }),
    ).resolves.toEqual({ date: '2099-07-20', availableSlots: [] });

    expect(database.businessHour.findUnique).not.toHaveBeenCalled();
  });

  it('removes slots that overlap the break, an appointment, or closing time', async () => {
    database.catalogItem.findUnique.mockResolvedValue({ durationMinutes: 40 });
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
        catalogItem: { durationMinutes: 30 },
      },
    ]);

    await expect(
      service.getAvailability({
        date: '2099-07-20',
        catalogItemId: '123e4567-e89b-42d3-a456-426614174000',
      }),
    ).resolves.toEqual({
      date: '2099-07-20',
      availableSlots: ['09:00'],
    });
  });
});
