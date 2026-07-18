import { Module } from '@nestjs/common';
import { BusinessHoursController } from './business-hours.controller';
import { BusinessSettingsService } from './business-settings.service';
import { DaysOffController } from './days-off.controller';

@Module({
  controllers: [BusinessHoursController, DaysOffController],
  providers: [BusinessSettingsService],
  exports: [BusinessSettingsService],
})
export class BusinessSettingsModule {}
