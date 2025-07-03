import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class TenantContextGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredTenantType = this.reflector.get<string>(
      'tenantType',
      context.getHandler(),
    );

    if (!requiredTenantType) {
      // No tenant type required, allow access
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    if (!user || !user.tenantContext) {
      throw new ForbiddenException('No tenant context available');
    }

    // Check if the user has the required tenant context
    switch (requiredTenantType) {
      case 'admin':
        return user.tenantContext.isAdmin === true;
        
      case 'agency':
        return user.tenantContext.agencyId !== undefined;
        
      case 'agency-admin':
        return user.tenantContext.isAgencyAdmin === true;
        
      case 'client':
        return user.tenantContext.clientId !== undefined;
        
      case 'client-admin':
        return user.tenantContext.isClientAdmin === true;
        
      default:
        return false;
    }
  }
} 