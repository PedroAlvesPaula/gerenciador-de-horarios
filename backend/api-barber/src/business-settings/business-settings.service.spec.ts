import { PrismaService } from '../prisma/prisma.service';
import { BusinessSettingsService } from './business-settings.service';

describe('BusinessSettingsService', () => {
  const prisma = {
    businessHour: {
      upsert: jest.fn(),
    },
    dayOff: {
      upsert: jest.fn(),
    },
  };
  let service: BusinessSettingsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new BusinessSettingsService(prisma as unknown as PrismaService);
  });

  it('uses the client-generated id to create business hours idempotently', async () => {
    const data = {
      id: 'a5e73e38-4500-4e53-82fb-d00944f5c613',
      dayOfWeek: 1,
      openTime: '09:00',
      closeTime: '18:00',
      breakStart: '12:00',
      breakEnd: '13:00',
    };
    prisma.businessHour.upsert.mockResolvedValue(data);

    await expect(service.createBusinessHour(data)).resolves.toEqual(data);
    expect(prisma.businessHour.upsert).toHaveBeenCalledWith({
      where: { id: data.id },
      update: {},
      create: data,
    });
  });

  it('uses the client-generated id to create a day off idempotently', async () => {
    const data = {
      id: 'a5e73e38-4500-4e53-82fb-d00944f5c613',
      date: '2026-12-25',
      reason: 'Natal',
    };
    const savedDayOff = {
      id: data.id,
      date: new Date('2026-12-25T00:00:00.000Z'),
      reason: data.reason,
    };
    prisma.dayOff.upsert.mockResolvedValue(savedDayOff);

    await expect(service.createDayOff(data)).resolves.toEqual(savedDayOff);
    expect(prisma.dayOff.upsert).toHaveBeenCalledWith({
      where: { id: data.id },
      update: {},
      create: savedDayOff,
    });
  });
});
