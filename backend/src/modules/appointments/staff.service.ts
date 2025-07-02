import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Staff } from '@prisma/client';
import { CreateStaffDto } from './dto/create-staff.dto';

@Injectable()
export class StaffService {
  constructor(private prisma: PrismaService) {}

  async create(createStaffDto: CreateStaffDto, clientId: string): Promise<Staff> {
    const { serviceIds, ...staffData } = createStaffDto;
    
    // Check for duplicate email within the client's staff
    const existingStaff = await this.prisma.staff.findFirst({
      where: {
        email: staffData.email,
        clientId
      }
    });
    
    if (existingStaff) {
      throw new BadRequestException(`A staff member with email ${staffData.email} already exists`);
    }
    
    // Create staff member
    const staff = await this.prisma.staff.create({
      data: {
        ...staffData,
        clientId
      }
    });
    
    // Assign services if provided
    if (serviceIds && serviceIds.length > 0) {
      // Verify all services exist and belong to the client
      const services = await this.prisma.service.findMany({
        where: {
          id: { in: serviceIds },
          clientId
        }
      });
      
      if (services.length !== serviceIds.length) {
        throw new BadRequestException('One or more service IDs are invalid');
      }
      
      // Create staff-service relationships
      await Promise.all(
        serviceIds.map(serviceId =>
          this.prisma.staffToService.create({
            data: {
              staffId: staff.id,
              serviceId
            }
          })
        )
      );
    }
    
    return this.findOne(staff.id, clientId);
  }

  async findAll(clientId: string): Promise<Staff[]> {
    return this.prisma.staff.findMany({
      where: { clientId },
      include: {
        services: {
          include: {
            service: true
          }
        },
        availability: true
      }
    });
  }

  async findOne(id: string, clientId: string): Promise<Staff> {
    const staff = await this.prisma.staff.findFirst({
      where: { id, clientId },
      include: {
        services: {
          include: {
            service: true
          }
        },
        availability: true,
        timeOff: true,
        appointments: {
          where: {
            startTime: {
              gte: new Date()
            }
          },
          orderBy: {
            startTime: 'asc'
          },
          take: 10
        }
      }
    });
    
    if (!staff) {
      throw new NotFoundException(`Staff with ID ${id} not found`);
    }
    
    return staff;
  }

  async update(id: string, updateStaffDto: any, clientId: string): Promise<Staff> {
    // First check if staff exists and belongs to client
    await this.findOne(id, clientId);
    
    const { serviceIds, ...staffData } = updateStaffDto;
    
    // Check for duplicate email within the client's staff
    if (staffData.email) {
      const existingStaff = await this.prisma.staff.findFirst({
        where: {
          email: staffData.email,
          clientId,
          id: { not: id }
        }
      });
      
      if (existingStaff) {
        throw new BadRequestException(`A staff member with email ${staffData.email} already exists`);
      }
    }
    
    // Update staff member
    await this.prisma.staff.update({
      where: { id },
      data: staffData
    });
    
    // Update service assignments if provided
    if (serviceIds && serviceIds.length > 0) {
      // Verify all services exist and belong to the client
      const services = await this.prisma.service.findMany({
        where: {
          id: { in: serviceIds },
          clientId
        }
      });
      
      if (services.length !== serviceIds.length) {
        throw new BadRequestException('One or more service IDs are invalid');
      }
      
      // Delete existing assignments
      await this.prisma.staffToService.deleteMany({
        where: { staffId: id }
      });
      
      // Create new assignments
      await Promise.all(
        serviceIds.map(serviceId =>
          this.prisma.staffToService.create({
            data: {
              staffId: id,
              serviceId
            }
          })
        )
      );
    }
    
    return this.findOne(id, clientId);
  }

  async remove(id: string, clientId: string): Promise<Staff> {
    // First check if staff exists and belongs to client
    await this.findOne(id, clientId);
    
    // Check if staff has any upcoming appointments
    const upcomingAppointments = await this.prisma.appointment.findFirst({
      where: {
        staffId: id,
        startTime: {
          gte: new Date()
        }
      }
    });
    
    if (upcomingAppointments) {
      throw new BadRequestException('Cannot delete staff member with upcoming appointments');
    }
    
    return this.prisma.staff.delete({
      where: { id }
    });
  }

  async addAvailability(
    staffId: string,
    dayOfWeek: number,
    startTime: string,
    endTime: string,
    clientId: string
  ) {
    // First check if staff exists and belongs to client
    await this.findOne(staffId, clientId);
    
    // Validate day of week
    if (dayOfWeek < 0 || dayOfWeek > 6) {
      throw new BadRequestException('Day of week must be between 0 (Sunday) and 6 (Saturday)');
    }
    
    // Validate time format (HH:MM)
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      throw new BadRequestException('Time must be in format HH:MM (24-hour)');
    }
    
    // Validate start time is before end time
    if (startTime >= endTime) {
      throw new BadRequestException('Start time must be before end time');
    }
    
    // Check for overlapping availability
    const overlappingAvailability = await this.prisma.staffAvailability.findFirst({
      where: {
        staffId,
        dayOfWeek,
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
    
    if (overlappingAvailability) {
      throw new BadRequestException('Overlapping availability found for this day');
    }
    
    return this.prisma.staffAvailability.create({
      data: {
        staffId,
        dayOfWeek,
        startTime,
        endTime
      }
    });
  }

  async removeAvailability(availabilityId: string, clientId: string) {
    const availability = await this.prisma.staffAvailability.findUnique({
      where: { id: availabilityId },
      include: { staff: true }
    });
    
    if (!availability) {
      throw new NotFoundException(`Availability with ID ${availabilityId} not found`);
    }
    
    if (availability.staff.clientId !== clientId) {
      throw new NotFoundException(`Availability with ID ${availabilityId} not found`);
    }
    
    return this.prisma.staffAvailability.delete({
      where: { id: availabilityId }
    });
  }

  async addTimeOff(
    staffId: string,
    startTime: string,
    endTime: string,
    description: string,
    clientId: string
  ) {
    // First check if staff exists and belongs to client
    await this.findOne(staffId, clientId);
    
    // Validate start time is before end time
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    
    if (startDate >= endDate) {
      throw new BadRequestException('Start time must be before end time');
    }
    
    // Check for conflicting appointments
    const conflictingAppointment = await this.prisma.appointment.findFirst({
      where: {
        staffId,
        OR: [
          {
            startTime: { lte: startDate },
            endTime: { gt: startDate }
          },
          {
            startTime: { lt: endDate },
            endTime: { gte: endDate }
          },
          {
            startTime: { gte: startDate },
            endTime: { lte: endDate }
          }
        ]
      }
    });
    
    if (conflictingAppointment) {
      throw new BadRequestException('Staff has appointments during the requested time off period');
    }
    
    return this.prisma.staffTimeOff.create({
      data: {
        staffId,
        startTime: startDate,
        endTime: endDate,
        description
      }
    });
  }

  async removeTimeOff(timeOffId: string, clientId: string) {
    const timeOff = await this.prisma.staffTimeOff.findUnique({
      where: { id: timeOffId },
      include: { staff: true }
    });
    
    if (!timeOff) {
      throw new NotFoundException(`Time off with ID ${timeOffId} not found`);
    }
    
    if (timeOff.staff.clientId !== clientId) {
      throw new NotFoundException(`Time off with ID ${timeOffId} not found`);
    }
    
    return this.prisma.staffTimeOff.delete({
      where: { id: timeOffId }
    });
  }
} 