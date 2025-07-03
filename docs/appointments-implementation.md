# Appointments System Implementation

## Overview

The Appointments System module provides a comprehensive solution for managing staff, services, locations, and bookings. It enables clients to set up an online booking system for their customers, manage staff availability, and track appointments efficiently.

## Core Features

### 1. Staff Management

- **Staff Profiles**: Create and manage staff member profiles with contact information
- **Availability Management**: Set working hours and availability for each staff member
- **Skills and Services**: Assign specific services that each staff member can provide
- **Calendar Integration**: Sync with staff calendars (Google, Outlook, etc.)
- **Vacation/Time Off**: Manage staff time off and unavailability periods

### 2. Service Management

- **Service Catalog**: Create and manage services offered by the business
- **Service Categories**: Organize services into categories
- **Pricing Options**: Set pricing for different service durations or types
- **Service Duration**: Define standard duration for each service
- **Service Description**: Add detailed descriptions and images for each service
- **Online Booking Control**: Enable/disable online booking for specific services

### 3. Location Management

- **Multiple Locations**: Support for businesses with multiple locations
- **Location Details**: Address, contact information, and business hours for each location
- **Service Availability**: Configure which services are available at each location
- **Staff Assignment**: Assign staff members to specific locations
- **Location-specific Settings**: Custom settings for each business location

### 4. Booking Management

- **Appointment Calendar**: Visual calendar interface for viewing and managing appointments
- **Booking Creation**: Create appointments manually or through online booking
- **Booking Modification**: Reschedule, cancel, or modify existing appointments
- **Recurring Appointments**: Set up recurring appointment schedules
- **Booking Status**: Track appointment status (confirmed, completed, canceled, etc.)
- **Notes and Requirements**: Add special notes or requirements for appointments

### 5. Online Booking Widget

- **Embeddable Widget**: Customizable booking widget for client websites
- **Domain Verification**: Secure embedding with domain verification
- **Booking Flow**: Multi-step booking process for customers
- **Service Selection**: Allow customers to select services, staff, and time slots
- **Customer Information**: Collect customer details during booking
- **Confirmation System**: Email/SMS confirmations for bookings
- **Cancellation/Rescheduling**: Allow customers to manage their appointments

### 6. Notification System

- **Booking Confirmations**: Automated confirmations for new bookings
- **Reminder Notifications**: Send reminders to customers before appointments
- **Staff Notifications**: Alert staff about new or changed appointments
- **Cancellation Notifications**: Notify relevant parties about cancellations
- **Follow-up Messages**: Send follow-up messages after appointments
- **Custom Notification Templates**: Customize email and SMS notification content

### 7. Calendar Integrations

- **Google Calendar**: Two-way sync with Google Calendar
- **Microsoft Outlook**: Two-way sync with Outlook Calendar
- **Apple Calendar**: Calendar subscription for Apple Calendar
- **External Calendar Views**: Public/private calendar views for embedding
- **iCal Feed**: Generate iCal feeds for calendar subscriptions

## Technical Implementation

### Frontend Components

1. **Appointment Calendar Interface**
   - Month, week, and day views
   - Drag-and-drop appointment management
   - Color-coded appointments by type or status
   - Quick actions for common appointment tasks

2. **Staff Management Interface**
   - Staff listing and profile management
   - Availability editor with visual calendar
   - Service assignment controls
   - Time off management

3. **Service Management Interface**
   - Service catalog with categories
   - Service editor with pricing options
   - Service availability settings
   - Online booking configuration

4. **Location Management Interface**
   - Location listing and details editor
   - Business hours configuration
   - Service and staff assignment
   - Location-specific settings

5. **Booking Widget Designer**
   - Widget appearance customization
   - Booking flow configuration
   - Field and step customization
   - Preview functionality

### Backend Services

1. **Appointment Service**
   - Appointment CRUD operations
   - Availability checking
   - Conflict resolution
   - Recurring appointment handling

2. **Staff Service**
   - Staff profile management
   - Availability calculation
   - Calendar integration
   - Service assignment

3. **Service Catalog Service**
   - Service CRUD operations
   - Category management
   - Pricing configuration
   - Service availability

4. **Location Service**
   - Location CRUD operations
   - Business hours management
   - Service and staff assignment
   - Location-specific settings

5. **Booking Widget Service**
   - Widget configuration
   - Domain verification
   - Booking flow management
   - Customer-facing booking process

6. **Notification Service**
   - Email and SMS notifications
   - Notification templates
   - Scheduling and delivery
   - Delivery tracking

7. **Calendar Integration Service**
   - External calendar synchronization
   - iCal feed generation
   - Calendar event management
   - Availability reconciliation

### Database Schema

The module extends the Prisma schema with the following models:

```prisma
model Staff {
  id              String    @id @default(cuid())
  name            String
  email           String?
  phone           String?
  title           String?
  bio             String?
  avatar          String?
  calendarId      String?   // External calendar ID for sync
  calendarType    String?   // google, outlook, etc.
  calendarSyncEnabled Boolean @default(false)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  tenantId        String
  
  // Relations
  tenant          Tenant    @relation(fields: [tenantId], references: [id])
  availability    StaffAvailability[]
  services        StaffService[]
  locations       StaffLocation[]
  appointments    Appointment[]
  timeOff         TimeOff[]
}

model StaffAvailability {
  id              String    @id @default(cuid())
  staffId         String
  dayOfWeek       Int       // 0-6 (Sunday-Saturday)
  startTime       String    // HH:MM format
  endTime         String    // HH:MM format
  
  // Relations
  staff           Staff     @relation(fields: [staffId], references: [id], onDelete: Cascade)
}

model TimeOff {
  id              String    @id @default(cuid())
  staffId         String
  startDate       DateTime
  endDate         DateTime
  allDay          Boolean   @default(true)
  reason          String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  // Relations
  staff           Staff     @relation(fields: [staffId], references: [id], onDelete: Cascade)
}

model Service {
  id              String    @id @default(cuid())
  name            String
  description     String?
  duration        Int       // in minutes
  price           Float
  currency        String    @default("USD")
  categoryId      String?
  color           String?   // for calendar display
  image           String?
  onlineBookingEnabled Boolean @default(true)
  bufferTimeBefore Int      @default(0) // in minutes
  bufferTimeAfter Int       @default(0) // in minutes
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  tenantId        String
  
  // Relations
  tenant          Tenant    @relation(fields: [tenantId], references: [id])
  category        ServiceCategory? @relation(fields: [categoryId], references: [id])
  staffServices   StaffService[]
  locationServices LocationService[]
  appointments    Appointment[]
}

model ServiceCategory {
  id              String    @id @default(cuid())
  name            String
  description     String?
  order           Int       @default(0)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  tenantId        String
  
  // Relations
  tenant          Tenant    @relation(fields: [tenantId], references: [id])
  services        Service[]
}

model StaffService {
  staffId         String
  serviceId       String
  
  // Relations
  staff           Staff     @relation(fields: [staffId], references: [id], onDelete: Cascade)
  service         Service   @relation(fields: [serviceId], references: [id], onDelete: Cascade)
  
  @@id([staffId, serviceId])
}

model Location {
  id              String    @id @default(cuid())
  name            String
  address         String?
  city            String?
  state           String?
  zipCode         String?
  country         String?
  phone           String?
  email           String?
  isDefault       Boolean   @default(false)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  tenantId        String
  
  // Relations
  tenant          Tenant    @relation(fields: [tenantId], references: [id])
  businessHours   BusinessHours[]
  staffLocations  StaffLocation[]
  locationServices LocationService[]
  appointments    Appointment[]
}

model BusinessHours {
  id              String    @id @default(cuid())
  locationId      String
  dayOfWeek       Int       // 0-6 (Sunday-Saturday)
  startTime       String    // HH:MM format
  endTime         String    // HH:MM format
  isClosed        Boolean   @default(false)
  
  // Relations
  location        Location  @relation(fields: [locationId], references: [id], onDelete: Cascade)
}

model StaffLocation {
  staffId         String
  locationId      String
  
  // Relations
  staff           Staff     @relation(fields: [staffId], references: [id], onDelete: Cascade)
  location        Location  @relation(fields: [locationId], references: [id], onDelete: Cascade)
  
  @@id([staffId, locationId])
}

model LocationService {
  locationId      String
  serviceId       String
  
  // Relations
  location        Location  @relation(fields: [locationId], references: [id], onDelete: Cascade)
  service         Service   @relation(fields: [serviceId], references: [id], onDelete: Cascade)
  
  @@id([locationId, serviceId])
}

model Appointment {
  id              String    @id @default(cuid())
  startTime       DateTime
  endTime         DateTime
  status          String    @default("confirmed") // confirmed, completed, canceled, no-show
  notes           String?
  internalNotes   String?
  serviceId       String
  staffId         String
  locationId      String?
  customerId      String?
  customerName    String?
  customerEmail   String?
  customerPhone   String?
  source          String    @default("manual") // manual, online, api
  recurringId     String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  tenantId        String
  
  // Relations
  tenant          Tenant    @relation(fields: [tenantId], references: [id])
  service         Service   @relation(fields: [serviceId], references: [id])
  staff           Staff     @relation(fields: [staffId], references: [id])
  location        Location? @relation(fields: [locationId], references: [id])
  customer        Contact?  @relation(fields: [customerId], references: [id])
  recurring       RecurringAppointment? @relation(fields: [recurringId], references: [id])
  reminders       AppointmentReminder[]
}

model RecurringAppointment {
  id              String    @id @default(cuid())
  frequency       String    // daily, weekly, monthly
  interval        Int       @default(1)
  daysOfWeek      String?   // comma-separated days (0-6)
  startDate       DateTime
  endDate         DateTime?
  count           Int?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  tenantId        String
  
  // Relations
  tenant          Tenant    @relation(fields: [tenantId], references: [id])
  appointments    Appointment[]
}

model AppointmentReminder {
  id              String    @id @default(cuid())
  appointmentId   String
  type            String    // email, sms
  minutesBefore   Int
  sent            Boolean   @default(false)
  sentAt          DateTime?
  
  // Relations
  appointment     Appointment @relation(fields: [appointmentId], references: [id], onDelete: Cascade)
}

model BookingWidget {
  id              String    @id @default(cuid())
  name            String
  slug            String    @unique
  settings        Json
  allowedDomains  String?   // comma-separated list of domains
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  tenantId        String
  
  // Relations
  tenant          Tenant    @relation(fields: [tenantId], references: [id])
}
```

## API Endpoints

### Staff Management

- `GET /staff` - List all staff members
- `POST /staff` - Create a new staff member
- `GET /staff/:id` - Get staff member details
- `PATCH /staff/:id` - Update staff member
- `DELETE /staff/:id` - Delete staff member
- `GET /staff/:id/availability` - Get staff availability
- `POST /staff/:id/availability` - Update staff availability
- `GET /staff/:id/services` - Get services offered by staff member
- `POST /staff/:id/services` - Update services offered by staff member
- `GET /staff/:id/time-off` - Get staff time off periods
- `POST /staff/:id/time-off` - Create staff time off period
- `DELETE /staff/:id/time-off/:timeOffId` - Delete staff time off period

### Service Management

- `GET /services` - List all services
- `POST /services` - Create a new service
- `GET /services/:id` - Get service details
- `PATCH /services/:id` - Update service
- `DELETE /services/:id` - Delete service
- `GET /service-categories` - List all service categories
- `POST /service-categories` - Create a new service category
- `PATCH /service-categories/:id` - Update service category
- `DELETE /service-categories/:id` - Delete service category

### Location Management

- `GET /locations` - List all locations
- `POST /locations` - Create a new location
- `GET /locations/:id` - Get location details
- `PATCH /locations/:id` - Update location
- `DELETE /locations/:id` - Delete location
- `GET /locations/:id/business-hours` - Get location business hours
- `POST /locations/:id/business-hours` - Update location business hours
- `GET /locations/:id/services` - Get services offered at location
- `POST /locations/:id/services` - Update services offered at location
- `GET /locations/:id/staff` - Get staff assigned to location
- `POST /locations/:id/staff` - Update staff assigned to location

### Appointment Management

- `GET /appointments` - List appointments with filtering options
- `POST /appointments` - Create a new appointment
- `GET /appointments/:id` - Get appointment details
- `PATCH /appointments/:id` - Update appointment
- `DELETE /appointments/:id` - Delete appointment
- `PATCH /appointments/:id/status` - Update appointment status
- `GET /appointments/availability` - Check availability for appointments
- `POST /appointments/recurring` - Create recurring appointments
- `GET /appointments/calendar` - Get appointments in calendar format

### Booking Widget

- `GET /booking-widgets` - List all booking widgets
- `POST /booking-widgets` - Create a new booking widget
- `GET /booking-widgets/:id` - Get booking widget details
- `PATCH /booking-widgets/:id` - Update booking widget
- `DELETE /booking-widgets/:id` - Delete booking widget
- `GET /booking-widgets/:slug/embed` - Get embeddable widget code
- `POST /booking-widgets/:slug/verify-domain` - Verify domain for widget embedding

### Public Booking API

- `GET /public/services` - List available services
- `GET /public/staff` - List available staff
- `GET /public/locations` - List available locations
- `GET /public/availability` - Check available time slots
- `POST /public/appointments` - Create a new appointment
- `GET /public/appointments/:id` - Get public appointment details
- `PATCH /public/appointments/:id` - Update public appointment (with token)
- `DELETE /public/appointments/:id` - Cancel public appointment (with token)

## Integration Points

### 1. Contacts Module

- Link appointments to contacts
- Create contacts from appointment bookings
- View contact appointment history
- Use contact information for appointment communications

### 2. Calendar Integrations

- Google Calendar two-way synchronization
- Microsoft Outlook calendar integration
- iCal feed generation for calendar subscriptions
- External calendar event management

### 3. Notification System

- Email notifications for appointments
- SMS notifications and reminders
- Custom notification templates
- Scheduled reminders and follow-ups

### 4. Payment Module

- Accept payments for appointments
- Deposit and full payment options
- Refund processing for cancellations
- Payment status tracking

## Security & Compliance

### 1. Data Protection

- Secure handling of customer appointment data
- Encryption of sensitive information
- Compliance with data retention policies
- Secure calendar synchronization

### 2. Access Control

- Role-based access to appointment data
- Staff-specific view restrictions
- Customer access to own appointments only
- Administrative oversight capabilities

### 3. Domain Verification

- Secure widget embedding with domain verification
- Prevention of unauthorized widget usage
- Domain allowlist management
- Embedding code security

### 4. Multi-tenancy Security

- Strict tenant isolation for appointment data
- Prevention of cross-tenant data access
- Tenant-specific configuration options

## User Experience Considerations

1. **Intuitive Booking Flow**: Simple, step-by-step booking process for customers
2. **Mobile Responsiveness**: Full booking capabilities on mobile devices
3. **Calendar Visualization**: Clear calendar views for staff and administrators
4. **Quick Actions**: Common appointment tasks accessible with minimal clicks
5. **Notification System**: Timely reminders and confirmations for all parties

## Future Enhancements

1. **Advanced Scheduling**:
   - Automatic staff assignment based on skills and workload
   - Smart scheduling to optimize staff time
   - Waiting list management for popular time slots
   - Buffer time customization between appointments

2. **Enhanced Customer Experience**:
   - Customer accounts and appointment history
   - Favorite staff and service selection
   - Loyalty program integration
   - Personalized booking recommendations

3. **Business Intelligence**:
   - Appointment analytics and reporting
   - Staff utilization metrics
   - Service popularity tracking
   - Revenue forecasting based on bookings

4. **Advanced Integrations**:
   - Video conferencing for virtual appointments
   - Customer review collection after appointments
   - Marketing automation based on appointment history
   - Additional calendar platform integrations

## Implementation Timeline

1. **Phase 1** - Core Functionality:
   - Basic staff and service management
   - Simple appointment booking and calendar
   - Manual appointment creation
   - Basic email notifications

2. **Phase 2** - Enhanced Features:
   - Location management
   - Online booking widget
   - Calendar integrations
   - SMS notifications and reminders

3. **Phase 3** - Advanced Capabilities:
   - Recurring appointments
   - Advanced availability management
   - Customer self-service portal
   - Business intelligence and reporting
</rewritten_file> 