import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Appointment, AppointmentStatus, Prisma } from '@prisma/client';
import { CreateAppointmentDto } from './dto/createAppointment.dto';
import { AvailabilityService } from '../availability/availability.service';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly availabilityService: AvailabilityService,
  ) {}

  async create(
    clientId: string,
    data: CreateAppointmentDto,
  ): Promise<Appointment> {
    const scheduledAt = new Date(data.scheduledAt);

    if (Number.isNaN(scheduledAt.getTime())) {
      throw new BadRequestException('Invalid appointment date.');
    }

    try {
      return await this.prisma.$transaction(
        async (transaction) => {
          if (data.addressId) {
            const address = await transaction.address.findFirst({
              where: { id: data.addressId, userId: clientId },
              select: { id: true },
            });

            if (!address) {
              throw new NotFoundException(
                'Address not found for the authenticated user.',
              );
            }
          }

          await this.availabilityService.assertSlotIsAvailable(
            data.catalogItemId,
            scheduledAt,
            transaction,
          );

          return transaction.appointment.create({
            data: {
              scheduledAt,
              clientId,
              catalogItemId: data.catalogItemId,
              addressId: data.addressId,
            },
          });
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2034'
      ) {
        throw new ConflictException(
          'This time was booked by another client. Choose another slot.',
        );
      }

      throw error;
    }
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
