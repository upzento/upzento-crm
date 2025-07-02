# Upzento CRM

A multi-tenant CRM platform for agencies and their clients with a modern, cosmic-themed UI.

## Overview

Upzento CRM centralizes all business growth functions in one platform, allowing agencies to manage multiple clients with isolated data. The platform features a unique cosmic design with dark/light mode support and is built with a modular architecture.

## Features

### Core System

- **Multi-tenant Architecture**: Agencies manage clients with complete data isolation
- **Role-based Access**: Admin, agency, client, and team member roles
- **Embedding System**: Secure iframe/JS widgets with domain verification
- **Mobile-ready**: Responsive design for all devices
- **API-first**: Designed for future mobile app development

### Dashboards

- **Admin Dashboard**: Platform-wide management and analytics
- **Agency Dashboard**: Client and team management with analytics
- **Client Dashboard**: Access to enabled modules and settings

### Modules

- **Payment System**: Subscription and payment management
- **Reviews Module**: Collection, moderation, and showcase of customer reviews
- **Chat Module**: Website chat and WhatsApp integration
- **Phone & SMS Module**: Call tracking and SMS management
- **Forms Module**: Drag-and-drop form builder with submissions management
- **Contacts Module**: Comprehensive contact and lead management
- **Marketing Campaigns**: Email, SMS, and automated marketing workflows
- **Deals/Pipeline**: Sales pipeline and deal management
- **Appointments System**: Staff, service, and booking management
- **Shop/E-Commerce**: Product, order, and inventory management
- **Advanced Analytics**: Data visualization and custom dashboards

## Technology Stack

- **Frontend**: TypeScript, React, Next.js, TailwindCSS
- **Backend**: TypeScript, NestJS, Prisma ORM
- **Database**: PostgreSQL
- **Hosting**: Railway

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/upzento-crm.git
cd upzento-crm
```

2. Install dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables
```bash
# Backend
cp backend/.env.example backend/.env
# Edit .env with your database credentials

# Frontend
cp frontend/.env.example frontend/.env
# Edit .env with your API URL
```

4. Run database migrations
```bash
cd backend
npx prisma migrate dev
```

5. Start development servers
```bash
# Backend
cd backend
npm run start:dev

# Frontend
cd frontend
npm run dev
```

## Module Documentation

- [Client Dashboard Implementation](./docs/client-dashboard-implementation.md)
- [Reviews Module Implementation](./docs/reviews-implementation.md)
- [Chat Module Implementation](./docs/chat-implementation.md)
- [Phone & SMS Implementation](./docs/phone-sms-implementation.md)
- [Forms Implementation](./docs/forms-implementation.md)
- [Contacts Implementation](./docs/contacts-implementation.md)
- [Marketing Campaigns Implementation](./docs/marketing-campaigns-implementation.md)
- [Deals/Pipeline Implementation](./docs/deals-implementation.md)
- [Payment Implementation](./docs/payment-implementation.md)
- [Appointments System Implementation](./docs/appointments-implementation.md)
- [Shop/E-Commerce Implementation](./docs/shop-implementation.md)
- [Advanced Analytics Implementation](./docs/advanced-analytics-implementation.md)

## Architecture Documentation

- [Multi-tenancy Architecture](./docs/multi-tenancy-architecture.md)
- [Database Schema](./docs/database-schema.md)
- [Embedding Strategy](./docs/embedding-strategy.md)
- [UI Design Guidelines](./docs/ui-design-guidelines.md)

## Project Status

All planned modules have been successfully implemented! 🎉

See [PROGRESS.md](./PROGRESS.md) for detailed development status and [PROJECT_COMPLETION.md](./PROJECT_COMPLETION.md) for the final project report.

## License

This project is proprietary and confidential.
