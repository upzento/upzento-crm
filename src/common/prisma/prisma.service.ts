import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Successfully connected to the database');
    } catch (error) {
      this.logger.error('Failed to connect to the database', error);
      // In production, we might want to retry connection or exit gracefully
      if (process.env.NODE_ENV === 'production') {
        this.logger.warn('Database connection failed, but continuing startup for deployment validation');
      } else {
        throw error;
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Helper method to clean up the database during testing
  async cleanDatabase() {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('This method can only be used in the test environment');
    }

    // Add cascading deletion logic here when needed for testing
  }

  // Add a middleware for multi-tenancy that ensures all queries include tenant context
  async enableTenantContext() {
    this.$use(async (params, next) => {
      // Logic for tenant isolation will be implemented here
      return next(params);
    });
  }
} 