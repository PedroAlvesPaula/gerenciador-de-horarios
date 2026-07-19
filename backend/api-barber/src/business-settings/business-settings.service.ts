import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BusinessHour, DayOff, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBusinessHourDto } from './dto/createBusinessHour.dto';
import { UpdateBusinessHourDto } from './dto/updateBusinessHour.dto';
import { CreateDayOffDto } from './dto/createDayOff.dto';
import {
  assertValidDateOnly,
  dateOnlyToUtc,
  timeToMinutes,
} from '../common/utils/business-date-time';

interface BusinessHourValues {
  openTime: string;
  closeTime: string;
  breakStart?: string | null;
  breakEnd?: string | null;
}

@Injectable()
export class BusinessSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  findBusinessHours(): Promise<BusinessHour[]> {
    return this.prisma.businessHour.findMany({ orderBy: { dayOfWeek: 'asc' } });
  }

  async createBusinessHour(data: CreateBusinessHourDto): Promise<BusinessHour> {
    this.validateBusinessHour(data);

    try {
      if (data.id) {
        return await this.prisma.businessHour.upsert({
          where: { id: data.id },
          update: {},
          create: data,
        });
      }

      return await this.prisma.businessHour.create({ data });
    } catch (error: unknown) {
      this.throwKnownConflict(
        error,
        'Business hours are already configured for this day.',
      );
    }
  }

  async updateBusinessHour(
    id: string,
    data: UpdateBusinessHourDto,
  ): Promise<BusinessHour> {
    const current = await this.prisma.businessHour.findUnique({
      where: { id },
    });

    if (!current) {
      throw new NotFoundException('Business hour not found.');
    }

    this.validateBusinessHour({
      openTime: data.openTime ?? current.openTime,
      closeTime: data.closeTime ?? current.closeTime,
      breakStart:
        data.breakStart === undefined ? current.breakStart : data.breakStart,
      breakEnd: data.breakEnd === undefined ? current.breakEnd : data.breakEnd,
    });

    try {
      return await this.prisma.businessHour.update({ where: { id }, data });
    } catch (error: unknown) {
      this.throwKnownConflict(
        error,
        'Business hours are already configured for this day.',
      );
    }
  }

  async deleteBusinessHour(id: string): Promise<void> {
    const result = await this.prisma.businessHour.deleteMany({
      where: { id },
    });

    if (result.count === 0) {
      throw new NotFoundException('Business hour not found.');
    }
  }

  findDaysOff(): Promise<DayOff[]> {
    return this.prisma.dayOff.findMany({ orderBy: { date: 'asc' } });
  }

  async createDayOff(data: CreateDayOffDto): Promise<DayOff> {
    assertValidDateOnly(data.date);

    try {
      if (data.id) {
        return await this.prisma.dayOff.upsert({
          where: { id: data.id },
          update: {},
          create: {
            id: data.id,
            date: dateOnlyToUtc(data.date),
            reason: data.reason,
          },
        });
      }

      return await this.prisma.dayOff.create({
        data: {
          date: dateOnlyToUtc(data.date),
          reason: data.reason,
        },
      });
    } catch (error: unknown) {
      this.throwKnownConflict(error, 'This date is already registered off.');
    }
  }

  async deleteDayOff(id: string): Promise<void> {
    const result = await this.prisma.dayOff.deleteMany({ where: { id } });

    if (result.count === 0) {
      throw new NotFoundException('Day off not found.');
    }
  }

  private validateBusinessHour(values: BusinessHourValues): void {
    const openTime = timeToMinutes(values.openTime);
    const closeTime = timeToMinutes(values.closeTime);

    if (openTime >= closeTime) {
      throw new BadRequestException('openTime must be before closeTime.');
    }

    const hasBreakStart = values.breakStart != null;
    const hasBreakEnd = values.breakEnd != null;

    if (hasBreakStart !== hasBreakEnd) {
      throw new BadRequestException(
        'breakStart and breakEnd must be provided together.',
      );
    }

    if (!values.breakStart || !values.breakEnd) {
      return;
    }

    const breakStart = timeToMinutes(values.breakStart);
    const breakEnd = timeToMinutes(values.breakEnd);

    if (
      breakStart >= breakEnd ||
      breakStart < openTime ||
      breakEnd > closeTime
    ) {
      throw new BadRequestException(
        'The break must be a valid interval within business hours.',
      );
    }
  }

  private throwKnownConflict(error: unknown, message: string): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException(message);
    }

    throw error;
  }
}
