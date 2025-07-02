import { SetMetadata } from '@nestjs/common';

export const TENANT_TYPE_KEY = 'tenantType';

/**
 * Decorator to specify the required tenant type for an endpoint
 * @param tenantType The required tenant type ('admin', 'agency', 'agency-admin', 'client', 'client-admin')
 */
export const RequiresTenantType = (tenantType: string) => SetMetadata(TENANT_TYPE_KEY, tenantType); 