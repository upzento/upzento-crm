# Upzento CRM - Implementation Documentation

## Table of Contents

1. [Introduction](#introduction)
2. [API Integration](#api-integration)
3. [WebSocket Implementation](#websocket-implementation)
4. [Type Safety](#type-safety)
5. [Testing Framework](#testing-framework)
6. [Security Enhancements](#security-enhancements)
7. [Next Steps](#next-steps)

## Introduction

This document provides an overview of the implemented features and components for the Upzento CRM system. It covers the core infrastructure, API integration, real-time features, and security enhancements.

## API Integration

### Base API Client

The API client is implemented using Axios and provides a centralized way to communicate with the backend API. It includes:

- Automatic token management
- Request/response interceptors
- Error handling with token refresh
- Standardized response formatting

```typescript
// Example usage
import { shopApi } from '@/lib/api/modules/shop-api';

// Get products
const getProducts = async () => {
  try {
    const response = await shopApi.getProducts();
    return response.data;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
};
```

### Module-Specific API Clients

We've implemented strongly typed API clients for the following modules:

1. **Shop Module**
   - Product management
   - Category management
   - Order processing
   - Coupon system
   - Shipping integration

2. **Campaigns Module**
   - Campaign management
   - Segment management
   - A/B testing
   - Analytics tracking

3. **Reviews Module**
   - Review management
   - External review sources
   - AI-powered response suggestions
   - Review analytics

## WebSocket Implementation

### Socket Client

The WebSocket client provides real-time communication capabilities:

```typescript
import socketClient from '@/lib/websocket/socket-client';

// Connect to socket
const token = localStorage.getItem('token');
socketClient.connectSocket(token);

// Join a room
socketClient.joinRoom('conversation:123');

// Send a message
socketClient.sendMessage('conversation:123', { content: 'Hello!' });

// Subscribe to events
socketClient.subscribe('new-message', (message) => {
  console.log('New message:', message);
});

// Unsubscribe when done
socketClient.unsubscribe('new-message');
```

### Chat Hook

The `useChat` hook provides a React interface for chat functionality:

```typescript
import { useChat } from '@/hooks/useChat';

const ChatComponent = ({ conversationId }) => {
  const {
    messages,
    isLoading,
    error,
    typingUsers,
    sendMessage,
    setTyping,
    markAsRead
  } = useChat(conversationId);

  // Send a message
  const handleSend = () => {
    sendMessage('Hello, world!');
  };

  // Show typing indicator
  const handleTyping = () => {
    setTyping(true);
    // Reset after delay
    setTimeout(() => setTyping(false), 3000);
  };

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {messages.map(message => (
            <div key={message.id}>{message.content}</div>
          ))}
          {typingUsers.length > 0 && <p>Someone is typing...</p>}
        </div>
      )}
    </div>
  );
};
```

## Type Safety

### Common Types

We've implemented comprehensive type definitions for API responses and requests:

```typescript
// Common API response types
export interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface ApiListResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
```

### Module-Specific Types

Each module has its own set of types:

1. **Shop Module**
   - Product, ProductCategory, Order, etc.
   - Shipping integration types
   - Payment processing types

2. **Campaigns Module**
   - Campaign, CampaignSegment, CampaignTemplate, etc.
   - A/B testing types
   - Analytics types

3. **Reviews Module**
   - Review, ReviewResponse, ReviewTag, etc.
   - External review source types
   - AI suggestion types

## Testing Framework

### Jest Configuration

We've set up Jest with React Testing Library for comprehensive testing:

```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // ... other configuration
};

module.exports = createJestConfig(customJestConfig);
```

### Test Examples

Example test for the API client:

```typescript
describe('API Client', () => {
  it('should add authorization header when token exists', () => {
    // Get the request interceptor function
    const mockCreate = axios.create as jest.Mock;
    const mockInstance = mockCreate.mock.results[0].value;
    const requestInterceptor = mockInstance.interceptors.request.use.mock.calls[0][0];
    
    // Create a mock config
    const config = { headers: {} };
    
    // Call the interceptor
    const result = requestInterceptor(config);
    
    // Check if token was added
    expect(result.headers.Authorization).toBe('Bearer test-token');
  });
});
```

## Security Enhancements

### Security Headers

We've implemented comprehensive security headers in the Next.js configuration:

```javascript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on',
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin',
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
        },
      ],
    },
  ];
}
```

## Next Steps

### 1. Complete Remaining API Integrations

- Implement remaining API clients for all modules
- Add proper error handling for all endpoints
- Implement request/response logging

### 2. Enhance WebSocket Implementation

- Complete WebSocket gateway integration
- Add real-time notifications
- Implement chat analytics dashboard

### 3. Complete Testing Coverage

- Add tests for all API clients
- Implement component tests
- Add integration tests for critical flows

### 4. Implement A/B Testing UI

- Create A/B test creation interface
- Implement test results visualization
- Add statistical significance indicators

### 5. Complete External Reviews Integration

- Implement Google My Business integration
- Add Yelp reviews integration
- Create unified review aggregation system 