import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Appointment, CatalogItem, AppointmentStatus } from '@prisma/client';
import { CreateAppointmentDto } from './dto/createAppointment.dto';

interface ActiveAppointmentWithCatalog {
  id: string;
  scheduledAt: Date;
  status: AppointmentStatus;
  catalogItem: CatalogItem;
}

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    clientId: string,
    data: CreateAppointmentDto,
  ): Promise<Appointment> {
    const catalogItem: CatalogItem | null =
      await this.prisma.catalogItem.findUnique({
        where: { id: data.catalogItemId },
      });

    if (!catalogItem) {
      throw new NotFoundException('Service not found in catalog.');
    }

    const startOfNew: Date = new Date(data.scheduledAt);
    const endOfNew: Date = new Date(
      startOfNew.getTime() + catalogItem.durationMinutes * 60000,
    );

    const activeAppointments: ActiveAppointmentWithCatalog[] =
      await this.prisma.appointment.findMany({
        where: {
          status: {
            in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED],
          },
        },
        include: {
          catalogItem: true,
        },
      });

    const hasConflict: boolean = activeAppointments.some(
      (existing: ActiveAppointmentWithCatalog) => {
        const startOfExisting: Date = new Date(existing.scheduledAt);
        const endOfExisting: Date = new Date(
          startOfExisting.getTime() +
            existing.catalogItem.durationMinutes * 60000,
        );

        return startOfNew < endOfExisting && startOfExisting < endOfNew;
      },
    );

    if (hasConflict) {
      throw new ConflictException('The requested time slot is already booked.');
    }

    return this.prisma.appointment.create({
      data: {
        scheduledAt: startOfNew,
        clientId: clientId,
        catalogItemId: data.catalogItemId,
        addressId: data.addressId,
      },
    });
  }

  async findByClient(clientId: string): Promise<Appointment[]> {
    return this.prisma.appointment.findMany({
      where: { clientId },
      include: { catalogItem: true, address: true },
      orderBy: { scheduledAt: 'desc' },
    });
  }

  async findAll(): Promise<Appointment[]> {
    return this.prisma.appointment.findMany({
      include: { client: true, catalogItem: true, address: true },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  async updateStatus(
    id: string,
    status: AppointmentStatus,
  ): Promise<Appointment> {
    const appointment: Appointment | null =
      await this.prisma.appointment.findUnique({
        where: { id },
      });

    if (!appointment) {
      throw new NotFoundException('Appointment not found.');
    }

    return this.prisma.appointment.update({
      where: { id },
      data: { status },
    });
  }
}
