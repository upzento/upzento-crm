import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Prisma } from '@prisma/client';

import { CreateGeneralSettingsDto } from './dto/create-general-settings.dto';
import { UpdateGeneralSettingsDto } from './dto/update-general-settings.dto';
import { CreateIntegrationSettingsDto } from './dto/create-integration-settings.dto';
import { UpdateIntegrationSettingsDto } from './dto/update-integration-settings.dto';
import { CreateModuleSettingsDto } from './dto/create-module-settings.dto';
import { UpdateModuleSettingsDto } from './dto/update-module-settings.dto';
import { CreateNotificationSettingsDto } from './dto/create-notification-settings.dto';
import { UpdateNotificationSettingsDto } from './dto/update-notification-settings.dto';
import { CreateSecuritySettingsDto } from './dto/create-security-settings.dto';
import { UpdateSecuritySettingsDto } from './dto/update-security-settings.dto';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { ModuleType } from './dto/create-module-settings.dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  // General Settings
  async createGeneralSettings(createGeneralSettingsDto: CreateGeneralSettingsDto) {
    // Check if settings already exist for this client
    const existingSettings = await this.prisma.generalSettings.findUnique({
      where: { clientId: createGeneralSettingsDto.clientId },
    });

    if (existingSettings) {
      throw new BadRequestException('General settings already exist for this client');
    }

    return this.prisma.generalSettings.create({
      data: createGeneralSettingsDto,
    });
  }

  async getGeneralSettings(clientId: string) {
    const settings = await this.prisma.generalSettings.findUnique({
      where: { clientId },
    });

    if (!settings) {
      throw new NotFoundException('General settings not found');
    }

    return settings;
  }

  async updateGeneralSettings(clientId: string, updateGeneralSettingsDto: UpdateGeneralSettingsDto) {
    // Check if settings exist
    await this.getGeneralSettings(clientId);

    return this.prisma.generalSettings.update({
      where: { clientId },
      data: updateGeneralSettingsDto,
    });
  }

  // Integration Settings
  async createIntegrationSettings(createIntegrationSettingsDto: CreateIntegrationSettingsDto) {
    return this.prisma.integrationSettings.create({
      data: {
        ...createIntegrationSettingsDto,
        settings: createIntegrationSettingsDto.settings as unknown as Prisma.JsonObject,
      },
    });
  }

  async getIntegrationSettings(id: string) {
    const settings = await this.prisma.integrationSettings.findUnique({
      where: { id },
    });

    if (!settings) {
      throw new NotFoundException(`Integration settings with ID ${id} not found`);
    }

    return settings;
  }

  async getAllIntegrationSettings(clientId: string) {
    return this.prisma.integrationSettings.findMany({
      where: { clientId },
    });
  }

  async getIntegrationSettingsByType(clientId: string, type: string) {
    return this.prisma.integrationSettings.findMany({
      where: { 
        clientId,
        type,
      },
    });
  }

  async updateIntegrationSettings(id: string, updateIntegrationSettingsDto: UpdateIntegrationSettingsDto) {
    // Check if settings exist
    await this.getIntegrationSettings(id);

    return this.prisma.integrationSettings.update({
      where: { id },
      data: {
        ...updateIntegrationSettingsDto,
        settings: updateIntegrationSettingsDto.settings as unknown as Prisma.JsonObject,
      },
    });
  }

  async deleteIntegrationSettings(id: string) {
    // Check if settings exist
    await this.getIntegrationSettings(id);

    return this.prisma.integrationSettings.delete({
      where: { id },
    });
  }

  // Module Settings
  async createModuleSettings(createModuleSettingsDto: CreateModuleSettingsDto) {
    // Check if settings already exist for this module and client
    const existingSettings = await this.prisma.moduleSettings.findUnique({
      where: {
        clientId_moduleType: {
          clientId: createModuleSettingsDto.clientId,
          moduleType: createModuleSettingsDto.moduleType,
        },
      },
    });

    if (existingSettings) {
      throw new BadRequestException(`Settings for module ${createModuleSettingsDto.moduleType} already exist for this client`);
    }

    return this.prisma.moduleSettings.create({
      data: {
        ...createModuleSettingsDto,
        settings: createModuleSettingsDto.settings as unknown as Prisma.JsonObject,
      },
    });
  }

  async getModuleSettings(id: string) {
    const settings = await this.prisma.moduleSettings.findUnique({
      where: { id },
    });

    if (!settings) {
      throw new NotFoundException(`Module settings with ID ${id} not found`);
    }

    return settings;
  }

  async getModuleSettingsByType(clientId: string, moduleType: ModuleType) {
    const settings = await this.prisma.moduleSettings.findUnique({
      where: {
        clientId_moduleType: {
          clientId,
          moduleType,
        },
      },
    });

    if (!settings) {
      // If settings don't exist, create default settings
      return this.createModuleSettings({
        clientId,
        moduleType,
        isEnabled: true,
        settings: {},
      });
    }

    return settings;
  }

  async getAllModuleSettings(clientId: string) {
    return this.prisma.moduleSettings.findMany({
      where: { clientId },
    });
  }

  async updateModuleSettings(id: string, updateModuleSettingsDto: UpdateModuleSettingsDto) {
    // Check if settings exist
    await this.getModuleSettings(id);

    return this.prisma.moduleSettings.update({
      where: { id },
      data: {
        ...updateModuleSettingsDto,
        settings: updateModuleSettingsDto.settings as unknown as Prisma.JsonObject,
      },
    });
  }

  async updateModuleSettingsByType(clientId: string, moduleType: ModuleType, updateModuleSettingsDto: UpdateModuleSettingsDto) {
    // Try to get existing settings
    let settings;
    try {
      settings = await this.getModuleSettingsByType(clientId, moduleType);
    } catch (error) {
      // If settings don't exist, create them
      return this.createModuleSettings({
        clientId,
        moduleType,
        ...updateModuleSettingsDto,
      });
    }

    // Update existing settings
    return this.prisma.moduleSettings.update({
      where: {
        clientId_moduleType: {
          clientId,
          moduleType,
        },
      },
      data: {
        ...updateModuleSettingsDto,
        settings: updateModuleSettingsDto.settings as unknown as Prisma.JsonObject,
      },
    });
  }

  // Notification Settings
  async createNotificationSettings(createNotificationSettingsDto: CreateNotificationSettingsDto) {
    // Check if settings already exist for this module and user
    const existingSettings = await this.prisma.notificationSettings.findUnique({
      where: {
        userId_moduleType: {
          userId: createNotificationSettingsDto.userId,
          moduleType: createNotificationSettingsDto.moduleType,
        },
      },
    });

    if (existingSettings) {
      throw new BadRequestException(`Notification settings for module ${createNotificationSettingsDto.moduleType} already exist for this user`);
    }

    return this.prisma.notificationSettings.create({
      data: createNotificationSettingsDto,
    });
  }

  async getNotificationSettings(id: string) {
    const settings = await this.prisma.notificationSettings.findUnique({
      where: { id },
    });

    if (!settings) {
      throw new NotFoundException(`Notification settings with ID ${id} not found`);
    }

    return settings;
  }

  async getNotificationSettingsByType(userId: string, moduleType: ModuleType) {
    const settings = await this.prisma.notificationSettings.findUnique({
      where: {
        userId_moduleType: {
          userId,
          moduleType,
        },
      },
    });

    if (!settings) {
      // If settings don't exist, create default settings
      return this.createNotificationSettings({
        userId,
        moduleType,
        emailEnabled: true,
        smsEnabled: false,
        pushEnabled: true,
        inAppEnabled: true,
      });
    }

    return settings;
  }

  async getAllNotificationSettings(userId: string) {
    return this.prisma.notificationSettings.findMany({
      where: { userId },
    });
  }

  async updateNotificationSettings(id: string, updateNotificationSettingsDto: UpdateNotificationSettingsDto) {
    // Check if settings exist
    await this.getNotificationSettings(id);

    return this.prisma.notificationSettings.update({
      where: { id },
      data: updateNotificationSettingsDto,
    });
  }

  async updateNotificationSettingsByType(userId: string, moduleType: ModuleType, updateNotificationSettingsDto: UpdateNotificationSettingsDto) {
    // Try to get existing settings
    let settings;
    try {
      settings = await this.getNotificationSettingsByType(userId, moduleType);
    } catch (error) {
      // If settings don't exist, create them
      return this.createNotificationSettings({
        userId,
        moduleType,
        ...updateNotificationSettingsDto,
      });
    }

    // Update existing settings
    return this.prisma.notificationSettings.update({
      where: {
        userId_moduleType: {
          userId,
          moduleType,
        },
      },
      data: updateNotificationSettingsDto,
    });
  }

  // Security Settings
  async createSecuritySettings(createSecuritySettingsDto: CreateSecuritySettingsDto) {
    // Check if settings already exist for this client
    const existingSettings = await this.prisma.securitySettings.findUnique({
      where: { clientId: createSecuritySettingsDto.clientId },
    });

    if (existingSettings) {
      throw new BadRequestException('Security settings already exist for this client');
    }

    return this.prisma.securitySettings.create({
      data: createSecuritySettingsDto,
    });
  }

  async getSecuritySettings(clientId: string) {
    const settings = await this.prisma.securitySettings.findUnique({
      where: { clientId },
    });

    if (!settings) {
      throw new NotFoundException('Security settings not found');
    }

    return settings;
  }

  async updateSecuritySettings(clientId: string, updateSecuritySettingsDto: UpdateSecuritySettingsDto) {
    // Check if settings exist
    let settings;
    try {
      settings = await this.getSecuritySettings(clientId);
    } catch (error) {
      // If settings don't exist, create them with defaults
      return this.createSecuritySettings({
        clientId,
        ...updateSecuritySettingsDto,
      });
    }

    return this.prisma.securitySettings.update({
      where: { clientId },
      data: updateSecuritySettingsDto,
    });
  }

  // Audit Log
  async createAuditLog(createAuditLogDto: CreateAuditLogDto) {
    return this.prisma.auditLog.create({
      data: {
        ...createAuditLogDto,
        details: createAuditLogDto.details as unknown as Prisma.JsonObject,
      },
    });
  }

  async getAuditLogs(clientId: string, options?: {
    page?: number;
    limit?: number;
    entityType?: string;
    action?: string;
    userId?: string;
    fromDate?: Date;
    toDate?: Date;
  }) {
    const { 
      page = 1, 
      limit = 10, 
      entityType, 
      action, 
      userId,
      fromDate,
      toDate
    } = options || {};

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.AuditLogWhereInput = { clientId };
    
    if (entityType) {
      where.entityType = entityType;
    }
    
    if (action) {
      where.action = action;
    }
    
    if (userId) {
      where.userId = userId;
    }

    if (fromDate || toDate) {
      where.createdAt = {};
      
      if (fromDate) {
        where.createdAt.gte = fromDate;
      }
      
      if (toDate) {
        where.createdAt.lte = toDate;
      }
    }

    // Get total count for pagination
    const total = await this.prisma.auditLog.count({ where });

    // Get audit logs with pagination
    const logs = await this.prisma.auditLog.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return {
      data: logs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getAuditLog(id: string) {
    const log = await this.prisma.auditLog.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!log) {
      throw new NotFoundException(`Audit log with ID ${id} not found`);
    }

    return log;
  }
} 