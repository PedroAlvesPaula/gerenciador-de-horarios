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

const SLOT_INTERVAL_MINUTES = 30;
const ACTIVE_APPOINTMENT_STATUSES = [
  AppointmentStatus.PENDING,
  AppointmentStatus.CONFIRMED,
];

export interface AvailabilityResponse {
  date: string;
  availableSlots: string[];
}

@Injectable()
export class AvailabilityService {
  constructor(private readonly prisma: PrismaService) {}

  getAvailability(query: GetAvailabilityDto): Promise<AvailabilityResponse> {
    return this.calculateAvailability(query, this.prisma, new Date());
  }

  async assertSlotIsAvailable(
    catalogItemId: string,
    scheduledAt: Date,
    database: Prisma.TransactionClient,
  ): Promise<void> {
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
    const availability = await this.calculateAvailability(
      { date, catalogItemId },
      database,
      new Date(),
    );

    if (!availability.availableSlots.includes(time)) {
      throw new ConflictException(
        'The requested time is not available for this service.',
      );
    }
  }

  private async calculateAvailability(
    query: GetAvailabilityDto,
    database: Prisma.TransactionClient,
    now: Date,
  ): Promise<AvailabilityResponse> {
    assertValidDateOnly(query.date);

    const emptyResponse: AvailabilityResponse = {
      date: query.date,
      availableSlots: [],
    };
    const today = formatDateInBusinessTimeZone(now);

    if (query.date < today) {
      return emptyResponse;
    }

    const catalogItem = await database.catalogItem.findUnique({
      where: { id: query.catalogItemId },
      select: { durationMinutes: true },
    });

    if (!catalogItem) {
      throw new NotFoundException('Service not found in catalog.');
    }

    const dayOff = await database.dayOff.findUnique({
      where: { date: dateOnlyToUtc(query.date) },
      select: { id: true },
    });

    if (dayOff) {
      return emptyResponse;
    }

    const businessHour = await database.businessHour.findUnique({
      where: { dayOfWeek: getDayOfWeek(query.date) },
    });

    if (!businessHour) {
      return emptyResponse;
    }

    const dayRange = getBusinessDayRange(query.date);
    const appointments = await database.appointment.findMany({
      where: {
        scheduledAt: { gte: dayRange.start, lt: dayRange.end },
        status: { in: ACTIVE_APPOINTMENT_STATUSES },
      },
      select: {
        scheduledAt: true,
        catalogItem: { select: { durationMinutes: true } },
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

    for (
      let slotStartMinutes = openTime;
      slotStartMinutes + catalogItem.durationMinutes <= closeTime;
      slotStartMinutes += SLOT_INTERVAL_MINUTES
    ) {
      const slotEndMinutes = slotStartMinutes + catalogItem.durationMinutes;
      const slotTime = minutesToTime(slotStartMinutes);
      const slotStart = businessDateTimeToUtc(query.date, slotTime);
      const slotEnd = new Date(
        slotStart.getTime() + catalogItem.durationMinutes * 60_000,
      );
      const overlapsBreak =
        breakStart !== null &&
        breakEnd !== null &&
        slotStartMinutes < breakEnd &&
        breakStart < slotEndMinutes;
      const overlapsAppointment = appointments.some((appointment) => {
        const appointmentStart = appointment.scheduledAt;
        const appointmentEnd = new Date(
          appointmentStart.getTime() +
            appointment.catalogItem.durationMinutes * 60_000,
        );

        return slotStart < appointmentEnd && appointmentStart < slotEnd;
      });

      if (slotStart > now && !overlapsBreak && !overlapsAppointment) {
        availableSlots.push(slotTime);
      }
    }

    return { date: query.date, availableSlots };
  }
}
