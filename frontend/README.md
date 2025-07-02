# Upzento CRM Frontend

This is the frontend application for the Upzento CRM platform, built with Next.js, React, and Tailwind CSS.

## Features

- Modern, cosmic-themed UI with dark and light modes
- Responsive design for mobile and desktop
- Type-safe development with TypeScript
- Component-based architecture with reusable UI components
- Tailwind CSS for styling with custom theme

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
cd frontend
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

### Running the Application

#### Development

```bash
npm run dev
```

This will start the development server at [http://localhost:3000](http://localhost:3000).

#### Production

```bash
npm run build
npm run start
```

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── app/             # Next.js app router
│   │   ├── (auth)/      # Authentication pages
│   │   ├── (dashboard)/ # Dashboard pages
│   │   ├── layout.tsx   # Root layout
│   │   └── page.tsx     # Home page
│   ├── components/      # Reusable UI components
│   │   ├── ui/          # Base UI components
│   │   └── ...          # Feature-specific components
│   ├── lib/             # Utility functions and libraries
│   │   ├── api/         # API client
│   │   └── ...          # Other utilities
│   └── styles/          # Global styles
└── tailwind.config.js   # Tailwind CSS configuration
```

## UI Components

The application uses a custom component library with a cosmic/space theme. Key components include:

- **Theme Provider**: Manages dark/light mode with system preference detection
- **Cosmic Card**: Card component with cosmic styling and hover effects
- **Cosmic Button**: Button component with glow effects and animations
- **Navigation**: Responsive navigation bar with mobile menu
- **Layout**: Page layouts with consistent styling

## Theme Customization

The application uses a custom Tailwind CSS theme with:

- Dark and light mode color schemes
- Cosmic color palette with gradients
- Custom animations and transitions
- Responsive design utilities

## Authentication

The frontend authenticates with the backend API using JWT tokens:

1. Login with email and password
2. Store access and refresh tokens
3. Include token in API requests
4. Refresh token when expired
5. Role-based UI rendering

## Multi-tenancy

The UI adapts based on the user's tenant context:

- **Admin**: Access to platform-wide management
- **Agency**: Access to agency and client management
- **Client**: Access to client-specific features 