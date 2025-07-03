import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
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