import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AppointmentStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { GetAvailabilityDto } from './dto/getAvailability.dto';
import {
  assertValidDateOnly,
  businessDateTimeToUtc,
  dateOnlyToUtc,
  formatDateInBusinessTimeZone,
  formatTimeInBusinessTimeZone,
  getBusinessDayRange,
  getDayOfWeek,
  minutesToTime,
  timeToMinutes,
} from '../common/utils/business-date-time';

const ACTIVE_APPOINTMENT_STATUSES = [
  AppointmentStatus.PENDING,
  AppointmentStatus.CONFIRMED,
];

export interface AvailabilityResponse {
  date: string;
  availableSlots: string[];
}

interface AvailabilityCalculation {
  response: AvailabilityResponse;
  totalDurationMinutes: number;
}

@Injectable()
export class AvailabilityService {
  constructor(private readonly prisma: PrismaService) {}

  async getAvailability(
    query: GetAvailabilityDto,
  ): Promise<AvailabilityResponse> {
    const calculation = await this.calculateAvailability(
      query,
      this.prisma,
      new Date(),
    );

    return calculation.response;
  }

  async assertSlotIsAvailable(
    catalogItemIds: string[],
    scheduledAt: Date,
    database: Prisma.TransactionClient,
  ): Promise<number> {
    if (Number.isNaN(scheduledAt.getTime())) {
      throw new BadRequestException('Invalid appointment date.');
    }

    if (
      scheduledAt.getUTCSeconds() !== 0 ||
      scheduledAt.getUTCMilliseconds() !== 0
    ) {
      throw new BadRequestException(
        'Appointment time must be aligned to a full minute.',
      );
    }

    const date = formatDateInBusinessTimeZone(scheduledAt);
    const time = formatTimeInBusinessTimeZone(scheduledAt);
    const calculation = await this.calculateAvailability(
      { date, catalogItemIds },
      database,
      new Date(),
    );

    if (!calculation.response.availableSlots.includes(time)) {
      throw new ConflictException(
        'The requested time is not available for the selected services.',
      );
    }

    return calculation.totalDurationMinutes;
  }

  private async calculateAvailability(
    query: GetAvailabilityDto,
    database: Prisma.TransactionClient,
    now: Date,
  ): Promise<AvailabilityCalculation> {
    assertValidDateOnly(query.date);

    const emptyResponse: AvailabilityResponse = {
      date: query.date,
      availableSlots: [],
    };
    const today = formatDateInBusinessTimeZone(now);

    if (query.date < today) {
      return { response: emptyResponse, totalDurationMinutes: 0 };
    }

    const uniqueCatalogItemIds = [...new Set(query.catalogItemIds)];

    if (
      uniqueCatalogItemIds.length === 0 ||
      uniqueCatalogItemIds.length !== query.catalogItemIds.length
    ) {
      throw new BadRequestException(
        'Select at least one service without repeated IDs.',
      );
    }

    const catalogItems = await database.catalogItem.findMany({
      where: { id: { in: uniqueCatalogItemIds } },
      select: { durationMinutes: true },
    });

    if (catalogItems.length !== uniqueCatalogItemIds.length) {
      throw new NotFoundException(
        'One or more services were not found in the catalog.',
      );
    }

    const totalDurationMinutes = catalogItems.reduce(
      (total, item) => total + item.durationMinutes,
      0,
    );

    const dayOff = await database.dayOff.findUnique({
      where: { date: dateOnlyToUtc(query.date) },
      select: { id: true },
    });

    if (dayOff) {
      return { response: emptyResponse, totalDurationMinutes };
    }

    const businessHour = await database.businessHour.findUnique({
      where: { dayOfWeek: getDayOfWeek(query.date) },
    });

    if (!businessHour) {
      return { response: emptyResponse, totalDurationMinutes };
    }

    const dayRange = getBusinessDayRange(query.date);
    const appointments = await database.appointment.findMany({
      where: {
        scheduledAt: { gte: dayRange.start, lt: dayRange.end },
        status: { in: ACTIVE_APPOINTMENT_STATUSES },
      },
      select: {
        scheduledAt: true,
        durationMinutes: true,
      },
    });

    const openTime = timeToMinutes(businessHour.openTime);
    const closeTime = timeToMinutes(businessHour.closeTime);
    const breakStart = businessHour.breakStart
      ? timeToMinutes(businessHour.breakStart)
      : null;
    const breakEnd = businessHour.breakEnd
      ? timeToMinutes(businessHour.breakEnd)
      : null;
    const availableSlots: string[] = [];

    const workingPeriods: Array<[number, number]> =
      breakStart !== null && breakEnd !== null
        ? [
            [openTime, breakStart],
            [breakEnd, closeTime],
          ]
        : [[openTime, closeTime]];

    for (const [periodStart, periodEnd] of workingPeriods) {
      for (
        let slotStartMinutes = periodStart;
        slotStartMinutes + totalDurationMinutes <= periodEnd;
        slotStartMinutes += totalDurationMinutes
      ) {
        const slotTime = minutesToTime(slotStartMinutes);
        const slotStart = businessDateTimeToUtc(query.date, slotTime);
        const slotEnd = new Date(
          slotStart.getTime() + totalDurationMinutes * 60_000,
        );
        const overlapsAppointment = appointments.some((appointment) => {
          const appointmentStart = appointment.scheduledAt;
          const appointmentEnd = new Date(
            appointmentStart.getTime() + appointment.durationMinutes * 60_000,
          );

          return slotStart < appointmentEnd && appointmentStart < slotEnd;
        });

        if (slotStart > now && !overlapsAppointment) {
          availableSlots.push(slotTime);
        }
      }
    }

    return {
      response: { date: query.date, availableSlots },
      totalDurationMinutes,
    };
  }
}
