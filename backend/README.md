# Upzento CRM Backend

This is the backend API for the Upzento CRM platform, built with NestJS, Prisma, and PostgreSQL.

## Features

- Multi-tenant architecture for agencies and clients
- JWT authentication with role-based access control
- RESTful API with Swagger documentation
- PostgreSQL database with Prisma ORM
- Modular design with clean architecture

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
cd backend
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Generate Prisma client:

```bash
npx prisma generate
```

5. Run migrations:

```bash
npx prisma migrate dev
```

### Running the Application

#### Development

```bash
npm run start:dev
```

#### Production

```bash
npm run build
npm run start:prod
```

### API Documentation

Once the application is running, you can access the Swagger API documentation at:

```
http://localhost:3001/api/docs
```

## Project Structure

```
backend/
├── src/
│   ├── common/           # Shared utilities and helpers
│   │   └── prisma/       # Prisma service and module
│   ├── config/           # Configuration files
│   ├── modules/          # Feature modules
│   │   ├── auth/         # Authentication module
│   │   ├── users/        # Users module
│   │   ├── tenants/      # Tenants module
│   │   ├── agencies/     # Agencies module
│   │   ├── clients/      # Clients module
│   │   └── ...           # Other feature modules
│   ├── app.module.ts     # Main application module
│   └── main.ts           # Application entry point
├── prisma/               # Prisma schema and migrations
└── test/                 # Test files
```

## Authentication

The API uses JWT authentication. To access protected endpoints:

1. Obtain a token by logging in at `/api/auth/login`
2. Include the token in the Authorization header as a Bearer token

## Multi-tenancy

The API implements a multi-tenant architecture with three levels:

1. **Platform (Admin)** - The top-level entity that manages the entire platform
2. **Agencies** - Mid-level entities that manage client relationships
3. **Clients** - End-user entities that utilize the CRM features

Data is isolated between tenants through a tenant context that is included in the JWT token. 