# Multi-Tenancy Architecture

This document outlines the multi-tenancy architecture for the Upzento CRM platform, explaining the approach, implementation details, and security considerations.

## Overview

Upzento CRM implements a hierarchical multi-tenant architecture with three main levels:

1. **Platform (Admin)** - The top-level entity that manages the entire platform
2. **Agencies** - Mid-level entities that manage client relationships
3. **Clients** - End-user entities that utilize the CRM features

This approach allows for efficient resource sharing while maintaining strict data isolation between tenants.

## Multi-Tenancy Model

### Hierarchical Structure

```
Platform (Admin)
├── Agency 1
│   ├── Client 1-1
│   ├── Client 1-2
│   └── Client 1-3
├── Agency 2
│   ├── Client 2-1
│   └── Client 2-2
└── Agency 3
    ├── Client 3-1
    └── Client 3-2
```

### Tenant Context

Every request in the system includes a tenant context, which contains:

- Tenant ID (agency or client)
- Tenant type (agency or client)
- Parent tenant ID (for clients, this is their agency's ID)
- User role within the tenant

## Implementation Approach

### Database Isolation

Upzento uses a multi-tenant database design with tenant discriminator columns:

1. **Shared Schema Approach**: All tenants share the same database schema
2. **Tenant Discriminator**: Each table includes tenant identifier columns
3. **Foreign Key Relationships**: Maintain referential integrity within tenant boundaries

Key tables include:
- `tenants` - Platform-level tenants
- `agencies` - Agency-level tenants (belong to a tenant)
- `clients` - Client-level tenants (belong to an agency)

### Application Layer Isolation

1. **Tenant Middleware**: Extracts and validates tenant context from requests
2. **Query Filters**: Automatically applies tenant filters to all database queries
3. **Service Isolation**: Ensures services only access data within their tenant context

### API Isolation

1. **Tenant-aware Endpoints**: API endpoints include tenant context
2. **Authorization Guards**: Validate tenant access for all requests
3. **API Versioning**: Supports tenant-specific API versions when needed

## Security Measures

### Data Isolation

1. **Query Guards**: All database queries include tenant filters
2. **Middleware Validation**: Validates tenant context on every request
3. **Database Constraints**: Enforces referential integrity within tenant boundaries

### Authentication & Authorization

1. **JWT with Tenant Context**: Authentication tokens include tenant information
2. **Role-Based Access Control**: Permissions vary by tenant and user role
3. **Cross-Tenant Access Control**: Strict rules for accessing data across tenant boundaries

### Audit & Compliance

1. **Tenant-specific Audit Logs**: All actions are logged with tenant context
2. **Compliance Reports**: Generate tenant-specific compliance reports
3. **Data Isolation Testing**: Regular testing of tenant boundaries

## Domain Management

### Authorized Domains

Each client can register authorized domains for widget embedding:

1. **Domain Registration**: Clients register domains they own
2. **Domain Verification**: Domain ownership is verified
3. **Domain Enforcement**: Widgets only function on verified domains

### Implementation

```typescript
// Domain verification middleware example
export function verifyDomain(req: Request, res: Response, next: NextFunction) {
  const origin = req.headers.origin;
  const clientId = req.tenantContext.clientId;
  
  return DomainService.isAuthorized(clientId, origin)
    .then(isAuthorized => {
      if (!isAuthorized) {
        return res.status(403).json({ 
          error: 'Domain not authorized for this client' 
        });
      }
      next();
    });
}
```

## Performance Optimization

### Caching Strategy

1. **Tenant-aware Caching**: Cache keys include tenant identifiers
2. **Shared Resource Caching**: Common resources are cached across tenants
3. **Isolation Boundaries**: Ensure cached data respects tenant boundaries

### Query Optimization

1. **Indexed Tenant Columns**: Tenant discriminator columns are indexed
2. **Query Planning**: Optimize queries with tenant context in mind
3. **Connection Pooling**: Maintain separate connection pools per tenant (for high-volume tenants)

## Scaling Considerations

### Horizontal Scaling

1. **Stateless Services**: All services are stateless for easy scaling
2. **Tenant Routing**: Route requests based on tenant ID
3. **Sharding Strategy**: Prepare for future database sharding by tenant

### Vertical Partitioning

1. **Module Separation**: Different modules can be deployed separately
2. **Tenant-specific Resources**: High-volume tenants can get dedicated resources
3. **Microservices Approach**: Services can be scaled independently based on tenant needs

## Migration and Deployment

### Tenant-aware Migrations

1. **Staged Migrations**: Migrate tenants in batches
2. **Tenant-specific Features**: Enable features per tenant
3. **Rollback Strategy**: Ability to rollback changes for specific tenants

### Tenant Onboarding

1. **Provisioning Process**: Automated tenant provisioning
2. **Default Configuration**: Template-based initial setup
3. **Tenant Isolation Verification**: Verify isolation during onboarding

## Testing Strategy

1. **Multi-tenant Test Suite**: Tests run against multiple tenant contexts
2. **Isolation Testing**: Verify data isolation between tenants
3. **Performance Testing**: Test system performance with multiple active tenants

## Monitoring and Alerts

1. **Tenant-specific Metrics**: Monitor performance per tenant
2. **Isolation Breach Alerts**: Alert on potential isolation issues
3. **Tenant Health Dashboard**: Dashboard showing tenant system health 