import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { CatalogModule } from './catalog/catalog.module';
import { AddressesModule } from './addresses/addresses.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { BusinessSettingsModule } from './business-settings/business-settings.module';
import { AvailabilityModule } from './availability/availability.module';
import { InventoryModule } from './inventory/inventory.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    PrismaModule,
    CatalogModule,
    AddressesModule,
    BusinessSettingsModule,
    AvailabilityModule,
    AppointmentsModule,
    InventoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
