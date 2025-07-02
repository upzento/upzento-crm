import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Appointment, AppointmentStatus } from '@prisma/client';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(createAppointmentDto: CreateAppointmentDto, clientId: string): Promise<Appointment> {
    const { serviceId, staffId, contactId, locationId } = createAppointmentDto;
    
    // Verify service belongs to the client
    const service = await this.prisma.service.findFirst({
      where: { id: serviceId, clientId }
    });
    
    if (!service) {
      throw new NotFoundException(`Service with ID ${serviceId} not found`);
    }
    
    // Verify staff belongs to the client
    const staff = await this.prisma.staff.findFirst({
      where: { id: staffId, clientId }
    });
    
    if (!staff) {
      throw new NotFoundException(`Staff with ID ${staffId} not found`);
    }
    
    // Verify staff is assigned to this service
    const staffService = await this.prisma.staffToService.findUnique({
      where: { 
        staffId_serviceId: {
          staffId,
          serviceId
        }
      }
    });
    
    if (!staffService) {
      throw new BadRequestException(`Staff member is not assigned to this service`);
    }
    
    // If contact ID is provided, verify it belongs to the client
    if (contactId) {
      const contact = await this.prisma.contact.findFirst({
        where: { id: contactId, clientId }
      });
      
      if (!contact) {
        throw new NotFoundException(`Contact with ID ${contactId} not found`);
      }
    }
    
    // If location ID is provided, verify it belongs to the client
    if (locationId) {
      const location = await this.prisma.location.findFirst({
        where: { id: locationId, clientId }
      });
      
      if (!location) {
        throw new NotFoundException(`Location with ID ${locationId} not found`);
      }
    }
    
    // Check for scheduling conflicts
    const { startTime, endTime } = createAppointmentDto;
    const conflictingAppointment = await this.prisma.appointment.findFirst({
      where: {
        staffId,
        status: { notIn: [AppointmentStatus.CANCELLED, AppointmentStatus.NO_SHOW] },
        OR: [
          {
            // New appointment starts during an existing appointment
            startTime: { lte: new Date(startTime) },
            endTime: { gt: new Date(startTime) }
          },
          {
            // New appointment ends during an existing appointment
            startTime: { lt: new Date(endTime) },
            endTime: { gte: new Date(endTime) }
          },
          {
            // New appointment contains an existing appointment
            startTime: { gte: new Date(startTime) },
            endTime: { lte: new Date(endTime) }
          }
        ]
      }
    });
    
    if (conflictingAppointment) {
      throw new BadRequestException('The staff member is not available at the requested time');
    }
    
    // Create the appointment
    return this.prisma.appointment.create({
      data: {
        ...createAppointmentDto,
        startTime: new Date(createAppointmentDto.startTime),
        endTime: new Date(createAppointmentDto.endTime),
        clientId
      }
    });
  }

  async findAll(clientId: string, filters?: {
    startDate?: string;
    endDate?: string;
    staffId?: string;
    serviceId?: string;
    status?: AppointmentStatus;
  }): Promise<Appointment[]> {
    const where: any = { clientId };
    
    if (filters) {
      // Apply date range filter
      if (filters.startDate || filters.endDate) {
        where.startTime = {};
        
        if (filters.startDate) {
          where.startTime.gte = new Date(filters.startDate);
        }
        
        if (filters.endDate) {
          where.endTime = { lte: new Date(filters.endDate) };
        }
      }
      
      // Apply staff filter
      if (filters.staffId) {
        where.staffId = filters.staffId;
      }
      
      // Apply service filter
      if (filters.serviceId) {
        where.serviceId = filters.serviceId;
      }
      
      // Apply status filter
      if (filters.status) {
        where.status = filters.status;
      }
    }
    
    return this.prisma.appointment.findMany({
      where,
      include: {
        service: true,
        staff: true,
        contact: true,
        location: true
      },
      orderBy: {
        startTime: 'asc'
      }
    });
  }

  async findOne(id: string, clientId: string): Promise<Appointment> {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id, clientId },
      include: {
        service: true,
        staff: true,
        contact: true,
        location: true,
        reminders: true
      }
    });
    
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    
    return appointment;
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto, clientId: string): Promise<Appointment> {
    // First check if appointment exists and belongs to client
    await this.findOne(id, clientId);
    
    const { serviceId, staffId, contactId, locationId } = updateAppointmentDto;
    
    // If service ID is provided, verify it belongs to the client
    if (serviceId) {
      const service = await this.prisma.service.findFirst({
        where: { id: serviceId, clientId }
      });
      
      if (!service) {
        throw new NotFoundException(`Service with ID ${serviceId} not found`);
      }
      
      // If staff ID is also provided, check staff-service assignment
      if (staffId) {
        const staffService = await this.prisma.staffToService.findUnique({
          where: { 
            staffId_serviceId: {
              staffId,
              serviceId
            }
          }
        });
        
        if (!staffService) {
          throw new BadRequestException(`Staff member is not assigned to this service`);
        }
      }
    }
    
    // If staff ID is provided, verify it belongs to the client
    if (staffId) {
      const staff = await this.prisma.staff.findFirst({
        where: { id: staffId, clientId }
      });
      
      if (!staff) {
        throw new NotFoundException(`Staff with ID ${staffId} not found`);
      }
    }
    
    // If contact ID is provided, verify it belongs to the client
    if (contactId) {
      const contact = await this.prisma.contact.findFirst({
        where: { id: contactId, clientId }
      });
      
      if (!contact) {
        throw new NotFoundException(`Contact with ID ${contactId} not found`);
      }
    }
    
    // If location ID is provided, verify it belongs to the client
    if (locationId) {
      const location = await this.prisma.location.findFirst({
        where: { id: locationId, clientId }
      });
      
      if (!location) {
        throw new NotFoundException(`Location with ID ${locationId} not found`);
      }
    }
    
    // Check for scheduling conflicts if time is being updated
    if (updateAppointmentDto.startTime || updateAppointmentDto.endTime) {
      const currentAppointment = await this.prisma.appointment.findUnique({
        where: { id }
      });
      
      const startTime = updateAppointmentDto.startTime 
        ? new Date(updateAppointmentDto.startTime) 
        : currentAppointment.startTime;
        
      const endTime = updateAppointmentDto.endTime 
        ? new Date(updateAppointmentDto.endTime) 
        : currentAppointment.endTime;
        
      const staffIdToCheck = staffId || currentAppointment.staffId;
      
      const conflictingAppointment = await this.prisma.appointment.findFirst({
        where: {
          id: { not: id }, // Exclude the current appointment
          staffId: staffIdToCheck,
          status: { notIn: [AppointmentStatus.CANCELLED, AppointmentStatus.NO_SHOW] },
          OR: [
            {
              startTime: { lte: startTime },
              endTime: { gt: startTime }
            },
            {
              startTime: { lt: endTime },
              endTime: { gte: endTime }
            },
            {
              startTime: { gte: startTime },
              endTime: { lte: endTime }
            }
          ]
        }
      });
      
      if (conflictingAppointment) {
        throw new BadRequestException('The staff member is not available at the requested time');
      }
    }
    
    // Update the appointment
    const data: any = { ...updateAppointmentDto };
    
    if (updateAppointmentDto.startTime) {
      data.startTime = new Date(updateAppointmentDto.startTime);
    }
    
    if (updateAppointmentDto.endTime) {
      data.endTime = new Date(updateAppointmentDto.endTime);
    }
    
    return this.prisma.appointment.update({
      where: { id },
      data,
      include: {
        service: true,
        staff: true,
        contact: true,
        location: true
      }
    });
  }

  async remove(id: string, clientId: string): Promise<Appointment> {
    // First check if appointment exists and belongs to client
    await this.findOne(id, clientId);
    
    return this.prisma.appointment.delete({
      where: { id }
    });
  }

  async updateStatus(id: string, status: AppointmentStatus, clientId: string): Promise<Appointment> {
    // First check if appointment exists and belongs to client
    await this.findOne(id, clientId);
    
    return this.prisma.appointment.update({
      where: { id },
      data: { status }
    });
  }

  async addReminder(
    appointmentId: string, 
    type: 'EMAIL' | 'SMS' | 'PUSH', 
    minutesBefore: number,
    clientId: string
  ) {
    // First check if appointment exists and belongs to client
    await this.findOne(appointmentId, clientId);
    
    return this.prisma.appointmentReminder.create({
      data: {
        appointmentId,
        type,
        minutesBefore
      }
    });
  }
} 