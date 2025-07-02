import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { User, Role, Client } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async getClientById(clientId: string): Promise<Client | null> {
    return this.prisma.client.findUnique({
      where: { id: clientId },
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...userData } = createUserDto;
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    return this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });
  }

  async findAll(tenantContext: any = {}): Promise<User[]> {
    // Apply tenant filtering based on context
    const where: any = {};
    
    if (tenantContext.agencyId) {
      where.agencyId = tenantContext.agencyId;
    }
    
    if (tenantContext.clientId) {
      where.clientId = tenantContext.clientId;
    }
    
    return this.prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        agencyId: true,
        clientId: true,
        createdAt: true,
        updatedAt: true,
        password: false, // Exclude password
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const { password, ...userData } = updateUserDto;
    
    // If password is provided, hash it
    const data: any = { ...userData };
    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }
    
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }
} 