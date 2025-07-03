# Upzento CRM Database Schema

This document outlines the core database schema for the Upzento CRM platform, focusing on the multi-tenant architecture and module relationships.

## Core Entities

### Tenant Management

```prisma
model Tenant {
  id          String    @id @default(uuid())
  name        String
  domain      String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  // Relationships
  agencies    Agency[]
}

model Agency {
  id          String    @id @default(uuid())
  name        String
  tenantId    String
  tenant      Tenant    @relation(fields: [tenantId], references: [id])
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  // Relationships
  clients     Client[]
  users       User[]
}

model Client {
  id          String    @id @default(uuid())
  name        String
  agencyId    String
  agency      Agency    @relation(fields: [agencyId], references: [id])
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  // Relationships
  users       User[]
  domains     Domain[]
  deals       Deal[]
  contacts    Contact[]
  // Other module relationships
}

model Domain {
  id          String    @id @default(uuid())
  domain      String
  clientId    String
  client      Client    @relation(fields: [clientId], references: [id])
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  // Domain is used for widget embedding authorization
}
```

### User Management

```prisma
model User {
  id          String    @id @default(uuid())
  email       String    @unique
  password    String
  firstName   String
  lastName    String
  role        Role      @default(CLIENT_USER)
  agencyId    String?
  agency      Agency?   @relation(fields: [agencyId], references: [id])
  clientId    String?
  client      Client?   @relation(fields: [clientId], references: [id])
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  // Relationships
  deals       Deal[]    @relation("AssignedTo")
  // Other relationships
}

enum Role {
  ADMIN
  AGENCY_ADMIN
  AGENCY_USER
  CLIENT_ADMIN
  CLIENT_USER
}
```

## Module Entities

### Contacts Module

```prisma
model Contact {
  id          String    @id @default(uuid())
  firstName   String
  lastName    String
  email       String?
  phone       String?
  clientId    String
  client      Client    @relation(fields: [clientId], references: [id])
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  // Relationships
  deals       Deal[]
  // Other relationships
}

model ContactTag {
  id          String    @id @default(uuid())
  name        String
  clientId    String
  contacts    ContactToTag[]
}

model ContactToTag {
  contactId   String
  tagId       String
  contact     Contact   @relation(fields: [contactId], references: [id])
  tag         ContactTag @relation(fields: [tagId], references: [id])
  
  @@id([contactId, tagId])
}
```

### Deals Module

```prisma
model Pipeline {
  id          String    @id @default(uuid())
  name        String
  clientId    String
  client      Client    @relation(fields: [clientId], references: [id])
  
  // Relationships
  stages      Stage[]
  deals       Deal[]
}

model Stage {
  id          String    @id @default(uuid())
  name        String
  order       Int
  pipelineId  String
  pipeline    Pipeline  @relation(fields: [pipelineId], references: [id])
  
  // Relationships
  deals       Deal[]
}

model Deal {
  id          String    @id @default(uuid())
  title       String
  value       Float?
  stageId     String
  stage       Stage     @relation(fields: [stageId], references: [id])
  pipelineId  String
  pipeline    Pipeline  @relation(fields: [pipelineId], references: [id])
  clientId    String
  client      Client    @relation(fields: [clientId], references: [id])
  assignedToId String?
  assignedTo  User?     @relation("AssignedTo", fields: [assignedToId], references: [id])
  contactId   String?
  contact     Contact?  @relation(fields: [contactId], references: [id])
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  // Relationships
  notes       Note[]
  // Other relationships
}

model Note {
  id          String    @id @default(uuid())
  content     String
  dealId      String
  deal        Deal      @relation(fields: [dealId], references: [id])
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

### Appointments Module

```prisma
model Service {
  id          String    @id @default(uuid())
  name        String
  duration    Int       // in minutes
  price       Float?
  clientId    String
  client      Client    @relation(fields: [clientId], references: [id])
  
  // Relationships
  appointments Appointment[]
}

model Staff {
  id          String    @id @default(uuid())
  name        String
  email       String
  clientId    String
  client      Client    @relation(fields: [clientId], references: [id])
  
  // Relationships
  appointments Appointment[]
}

model Appointment {
  id          String    @id @default(uuid())
  startTime   DateTime
  endTime     DateTime
  status      AppointmentStatus @default(SCHEDULED)
  serviceId   String
  service     Service   @relation(fields: [serviceId], references: [id])
  staffId     String
  staff       Staff     @relation(fields: [staffId], references: [id])
  clientId    String
  client      Client    @relation(fields: [clientId], references: [id])
  contactId   String?
  contact     Contact?  @relation(fields: [contactId], references: [id])
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

enum AppointmentStatus {
  SCHEDULED
  CONFIRMED
  COMPLETED
  CANCELLED
}
```

## Multi-tenancy Implementation

The database schema implements multi-tenancy through a hierarchical structure:

1. **Tenant** - Top-level organization (platform level)
2. **Agency** - Middle-level organization that manages clients
3. **Client** - Bottom-level organization that has access to CRM modules

Each entity in the system is associated with a specific client, ensuring data isolation between tenants. The schema includes foreign key relationships to maintain referential integrity and enforce tenant boundaries.

## Security Considerations

- All queries must include tenant context to prevent data leakage between tenants
- Row-level security will be implemented at the application layer
- Database roles and permissions will be strictly limited
- Sensitive data will be encrypted at rest

## Indexing Strategy

Key indexes will be created for:
- Foreign keys (tenantId, agencyId, clientId)
- Frequently queried fields (email, domain)
- Date fields used for reporting (createdAt, updatedAt)

## Schema Migration Strategy

- Incremental migrations using Prisma Migrate
- Version control for all schema changes
- Automated testing of migrations
- Backup procedures before migrations 