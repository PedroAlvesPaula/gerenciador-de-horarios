import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { CatalogModule } from './catalog/catalog.module';
import { AddressesModule } from './addresses/addresses.module';
import { AppointmentsModule } from './appointments/appointments.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    PrismaModule,
    CatalogModule,
    AddressesModule,
    AppointmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
