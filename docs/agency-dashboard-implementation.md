# Agency Dashboard Implementation

## Overview

The Agency Dashboard provides a comprehensive interface for agency administrators to manage their clients, team members, and business operations within the Upzento CRM platform. It offers tools for client management, team coordination, performance tracking, and access to all client-facing modules.

## Key Features

1. **Dashboard Overview**
   - Agency-specific statistics and metrics
   - Client activity monitoring
   - Revenue tracking and forecasting
   - Module usage analytics

2. **Client Management**
   - Complete client directory with search and filtering
   - Client creation and onboarding
   - Client status management
   - Access to client-specific modules and settings

3. **Team Management**
   - Team member directory with role-based filtering
   - Team member invitation and onboarding
   - Permission management for team members
   - Activity tracking and performance monitoring

4. **Module Access**
   - Forms management across clients
   - Phone & SMS campaign management
   - Reviews collection and management
   - Chat history and conversation management
   - Analytics dashboards for agency performance

5. **Billing and Subscription**
   - Subscription management for the agency
   - Client billing management
   - Invoice tracking and payment processing
   - Plan upgrades and downgrades

## Implementation Details

### Frontend Structure

The Agency Dashboard is implemented as a separate section in the frontend application with its own layout and navigation:

```
frontend/src/app/agency/
├── page.tsx                 # Main dashboard overview
├── layout.tsx               # Agency layout with sidebar
├── clients/
│   └── page.tsx             # Client management
├── team/
│   └── page.tsx             # Team management
├── forms/                   # To be implemented
├── phone-sms/               # To be implemented
├── reviews/                 # To be implemented
├── chat/                    # To be implemented
├── analytics/               # To be implemented
├── billing/                 # To be implemented
└── settings/                # To be implemented
```

### Components and Pages

1. **Agency Layout**
   - Sidebar navigation with links to all agency sections
   - Agency user profile and logout options
   - Theme toggle for dark/light mode

2. **Dashboard Overview**
   - Stats cards showing key metrics
   - Client activity feed
   - Module usage analytics
   - Revenue overview

3. **Client Management**
   - Client listing with filtering and search
   - Client detail view and editing
   - Client module management
   - Client status tracking

4. **Team Management**
   - Team member listing with role filtering
   - Team member invitation and onboarding
   - Permission management interface
   - Activity tracking

## Access Control

The Agency Dashboard is only accessible to users with the `AGENCY_ADMIN` or `AGENCY_USER` roles, with appropriate permission restrictions based on role. All routes and API endpoints are protected with authorization middleware to ensure proper access control.

## API Integration

The Agency Dashboard interfaces with the following API endpoints:

1. **Client Management**
   - `GET /clients` - List agency's clients
   - `POST /clients` - Create new client
   - `GET /clients/:id` - Get client details
   - `PATCH /clients/:id` - Update client
   - `DELETE /clients/:id` - Delete client

2. **Team Management**
   - `GET /agencies/:id/users` - List agency team members
   - `POST /agencies/:id/users` - Invite new team member
   - `PATCH /agencies/:id/users/:userId` - Update team member
   - `DELETE /agencies/:id/users/:userId` - Remove team member

3. **Module Management**
   - `GET /forms` - List agency's forms
   - `GET /phone-sms` - Access phone & SMS functionality
   - `GET /reviews` - Access reviews management
   - `GET /chat` - Access chat history and management

4. **Billing Management**
   - `GET /payment/agency-subscriptions` - Get agency subscription
   - `GET /payment/client-subscriptions` - Get client subscriptions
   - `GET /payment/agency-invoices` - Get agency invoices

## Data Flow

1. **Authentication and Authorization**
   - Agency login with JWT token
   - Role-based access control for agency routes
   - Tenant context set to agency scope

2. **Data Fetching**
   - Fetch agency-specific data with tenant filtering
   - Aggregate data across agency's clients
   - Real-time updates for critical metrics

3. **Data Modification**
   - Create, update, and delete operations for agency entities
   - Audit logging for all administrative actions
   - Validation and error handling

## Future Enhancements

1. **Client Impersonation**
   - Ability to view and interact with client dashboards
   - Seamless switching between agency and client views
   - Audit logging of impersonation sessions

2. **Advanced Analytics**
   - Cross-client performance analytics
   - Custom report generation
   - Data visualization and export options

3. **Automated Workflows**
   - Client onboarding automation
   - Recurring task management
   - Notification and alert system

4. **White-Labeling**
   - Agency branding customization
   - Custom domain support
   - Branded client dashboards 