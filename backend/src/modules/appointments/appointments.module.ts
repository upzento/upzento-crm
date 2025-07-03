import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [
    AppointmentsController, 
    StaffController, 
    ServicesController, 
    LocationsController
  ],
  providers: [
    AppointmentsService, 
    StaffService, 
    ServicesService, 
    LocationsService
  ],
  exports: [
    AppointmentsService, 
    StaffService, 
    ServicesService, 
    LocationsService
  ],
})
export class AppointmentsModule {} 