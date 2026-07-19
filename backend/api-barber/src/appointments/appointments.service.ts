import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AppointmentStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AvailabilityService } from '../availability/availability.service';
import { CreateAppointmentDto } from './dto/createAppointment.dto';
import { CreateAdminAppointmentDto } from './dto/createAdminAppointment.dto';

const appointmentDetailsInclude = {
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
} satisfies Prisma.AppointmentInclude;

export type AppointmentDetails = Prisma.AppointmentGetPayload<{
  include: typeof appointmentDetailsInclude;
}>;

const ACTIVE_STATUSES = new Set<AppointmentStatus>([
  AppointmentStatus.PENDING,
  AppointmentStatus.CONFIRMED,
]);

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly availabilityService: AvailabilityService,
  ) {}

  private parseScheduledAt(value: string): Date {
    const scheduledAt = new Date(value);

    if (Number.isNaN(scheduledAt.getTime())) {
      throw new BadRequestException('Data do agendamento inválida.');
    }

    return scheduledAt;
  }

  private async ensureAddressBelongsToClient(
    database: Prisma.TransactionClient,
    clientId: string,
    addressId: string,
  ): Promise<void> {
    const address = await database.address.findFirst({
      where: { id: addressId, userId: clientId },
      select: { id: true },
    });

    if (!address) {
      throw new NotFoundException(
        'Endereço não encontrado para o cliente selecionado.',
      );
    }
  }

  private throwTransactionError(error: unknown): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2034'
    ) {
      throw new ConflictException(
        'Este horário foi ocupado por outro agendamento. Escolha outro horário.',
      );
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw new NotFoundException('Agendamento não encontrado.');
    }

    throw error;
  }

  async create(
    clientId: string,
    data: CreateAppointmentDto,
  ): Promise<AppointmentDetails> {
    const scheduledAt = this.parseScheduledAt(data.scheduledAt);

    try {
      return await this.prisma.$transaction(
        async (transaction) => {
          await this.ensureAddressBelongsToClient(
            transaction,
            clientId,
            data.addressId,
          );

          const durationMinutes =
            await this.availabilityService.assertSlotIsAvailable(
              data.catalogItemIds,
              scheduledAt,
              transaction,
            );

          return transaction.appointment.create({
            data: {
              scheduledAt,
              durationMinutes,
              clientId,
              addressId: data.addressId,
              items: {
                create: data.catalogItemIds.map((catalogItemId) => ({
                  catalogItemId,
                })),
              },
            },
            include: appointmentDetailsInclude,
          });
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
    } catch (error: unknown) {
      return this.throwTransactionError(error);
    }
  }

  async createForAdmin(
    data: CreateAdminAppointmentDto,
  ): Promise<AppointmentDetails> {
    return this.create(data.clientId, {
      scheduledAt: data.scheduledAt,
      catalogItemIds: data.catalogItemIds,
      addressId: data.addressId,
    });
  }

  async findByClient(clientId: string): Promise<AppointmentDetails[]> {
    return this.prisma.appointment.findMany({
      where: { clientId },
      include: appointmentDetailsInclude,
      orderBy: { scheduledAt: 'desc' },
    });
  }

  async findAll(): Promise<AppointmentDetails[]> {
    return this.prisma.appointment.findMany({
      include: appointmentDetailsInclude,
      orderBy: { scheduledAt: 'asc' },
    });
  }

  async findOne(id: string): Promise<AppointmentDetails> {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: appointmentDetailsInclude,
    });

    if (!appointment) {
      throw new NotFoundException('Agendamento não encontrado.');
    }

    return appointment;
  }

  async update(
    id: string,
    data: CreateAdminAppointmentDto,
  ): Promise<AppointmentDetails> {
    const scheduledAt = this.parseScheduledAt(data.scheduledAt);

    try {
      return await this.prisma.$transaction(
        async (transaction) => {
          const existingAppointment = await transaction.appointment.findUnique({
            where: { id },
            select: { id: true },
          });

          if (!existingAppointment) {
            throw new NotFoundException('Agendamento não encontrado.');
          }

          await this.ensureAddressBelongsToClient(
            transaction,
            data.clientId,
            data.addressId,
          );

          const durationMinutes =
            await this.availabilityService.assertSlotIsAvailable(
              data.catalogItemIds,
              scheduledAt,
              transaction,
              id,
            );

          return transaction.appointment.update({
            where: { id },
            data: {
              scheduledAt,
              durationMinutes,
              clientId: data.clientId,
              addressId: data.addressId,
              items: {
                deleteMany: {},
                create: data.catalogItemIds.map((catalogItemId) => ({
                  catalogItemId,
                })),
              },
            },
            include: appointmentDetailsInclude,
          });
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
    } catch (error: unknown) {
      return this.throwTransactionError(error);
    }
  }

  async updateStatus(
    id: string,
    status: AppointmentStatus,
  ): Promise<AppointmentDetails> {
    try {
      return await this.prisma.$transaction(
        async (transaction) => {
          const appointment = await transaction.appointment.findUnique({
            where: { id },
            include: { items: { select: { catalogItemId: true } } },
          });

          if (!appointment) {
            throw new NotFoundException('Agendamento não encontrado.');
          }

          if (
            ACTIVE_STATUSES.has(status) &&
            !ACTIVE_STATUSES.has(appointment.status)
          ) {
            await this.availabilityService.assertSlotIsAvailable(
              appointment.items.map(({ catalogItemId }) => catalogItemId),
              appointment.scheduledAt,
              transaction,
              id,
            );
          }

          return transaction.appointment.update({
            where: { id },
            data: { status },
            include: appointmentDetailsInclude,
          });
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
    } catch (error: unknown) {
      return this.throwTransactionError(error);
    }
  }

  async remove(id: string): Promise<AppointmentDetails> {
    await this.findOne(id);

    try {
      return await this.prisma.appointment.delete({
        where: { id },
        include: appointmentDetailsInclude,
      });
    } catch (error: unknown) {
      return this.throwTransactionError(error);
    }
  }
}
