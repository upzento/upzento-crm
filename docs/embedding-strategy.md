# Embedding Strategy & Domain Restriction

This document outlines the approach for implementing secure, domain-restricted widget embedding in the Upzento CRM platform.

## Overview

Upzento CRM allows clients to embed various widgets (booking, reviews, forms, chat, shop) on their websites while ensuring these widgets only function on authorized domains for security and business reasons.

## Core Requirements

1. Widgets must only function on domains explicitly authorized by the client
2. Widgets must be embeddable via both iframe and JavaScript approaches
3. Domain verification must be secure and tamper-proof
4. Widget customization must be available while maintaining security
5. Performance must be optimized for embedded scenarios

## Domain Verification System

### Domain Registration Process

1. **Client Registration**: Clients register domains they own in their dashboard
2. **Verification Options**:
   - DNS TXT record verification
   - HTML file upload verification
   - Meta tag verification
3. **Verification Status**: Domains have statuses (pending, verified, rejected)
4. **Automatic Verification**: System periodically checks verification status

### Domain Storage

```typescript
// Domain entity in database
interface Domain {
  id: string;
  domain: string;         // e.g., "example.com"
  clientId: string;       // Associated client
  verificationMethod: 'DNS' | 'FILE' | 'META';
  verificationToken: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  createdAt: Date;
  updatedAt: Date;
}
```

## Widget Embedding Architecture

### Iframe Embedding

The iframe approach uses a direct URL embedding method with secure tokens:

```html
<!-- Example iframe embedding -->
<iframe 
  src="https://widgets.upzento.com/booking/ABC123?token=xyz&theme=dark" 
  width="100%" 
  height="600px"
  style="border: none;"
  title="Book an Appointment">
</iframe>
```

### JavaScript Embedding

The JavaScript approach uses a lightweight loader that injects the widget:

```html
<!-- Example JavaScript embedding -->
<div id="upzento-booking-widget" data-client="ABC123" data-theme="dark"></div>
<script src="https://widgets.upzento.com/loader.js" async></script>
```

## Domain Restriction Implementation

### Server-Side Verification

1. **Origin Check**: Server validates the origin/referer header against authorized domains
2. **Token Validation**: Secure tokens include domain information for verification
3. **API Rejection**: Unauthorized domains receive clear error responses

```typescript
// Server-side domain verification middleware
export async function verifyDomain(req, res, next) {
  const origin = req.headers.origin || req.headers.referer;
  const clientId = req.params.clientId || req.query.client;
  
  // Extract domain from origin
  const domain = extractDomain(origin);
  
  // Check if domain is authorized for this client
  const isAuthorized = await DomainService.isAuthorized(clientId, domain);
  
  if (!isAuthorized) {
    return res.status(403).json({
      error: 'DOMAIN_NOT_AUTHORIZED',
      message: 'This domain is not authorized to use this widget'
    });
  }
  
  // Add domain info to request for logging
  req.authorizedDomain = domain;
  next();
}
```

### Client-Side Verification

1. **Initial Check**: JavaScript loader verifies domain before loading widget
2. **Runtime Verification**: Widgets periodically verify they're on authorized domains
3. **Graceful Degradation**: Unauthorized domains show appropriate messages

```javascript
// Client-side verification in loader.js
(function() {
  // Get current domain
  const domain = window.location.hostname;
  
  // Get widget configuration
  const widgets = document.querySelectorAll('[id^="upzento-"]');
  
  widgets.forEach(async widget => {
    const clientId = widget.dataset.client;
    
    // Verify domain is authorized
    const response = await fetch(
      `https://api.upzento.com/verify-domain?client=${clientId}&domain=${domain}`,
      { method: 'GET' }
    );
    
    if (response.ok) {
      // Load widget if authorized
      loadWidget(widget, clientId);
    } else {
      // Show unauthorized message
      widget.innerHTML = `
        <div class="upzento-unauthorized">
          This domain is not authorized to use this widget.
        </div>
      `;
    }
  });
})();
```

## Security Measures

### Cross-Origin Protection

1. **CORS Configuration**: Strict CORS policies for widget endpoints
2. **CSP Headers**: Content Security Policy headers to prevent misuse
3. **Referrer Validation**: Multiple layers of referrer checking

### Token Security

1. **Short-lived Tokens**: Tokens expire quickly to prevent misuse
2. **Domain Binding**: Tokens are bound to specific domains
3. **Cryptographic Signing**: All tokens are cryptographically signed

### Abuse Prevention

1. **Rate Limiting**: Prevent abuse with rate limiting by domain/IP
2. **Usage Monitoring**: Monitor for unusual usage patterns
3. **Automatic Blocking**: Automatically block suspected abuse

## Widget Customization

Clients can customize widgets while maintaining security:

1. **Theme Customization**: Color schemes, fonts, and styling
2. **Layout Options**: Widget layout and component arrangement
3. **Localization**: Language and regional settings
4. **Behavior Options**: Functional behavior customization

Example configuration:

```javascript
// Widget configuration
const widgetConfig = {
  theme: {
    primary: '#3D5AFE',
    secondary: '#FF4081',
    mode: 'dark',
    borderRadius: '8px',
    fontFamily: 'Inter, sans-serif'
  },
  layout: {
    compact: false,
    hideHeader: false,
    hideFooter: true
  },
  locale: 'en-US',
  behavior: {
    autoFocus: true,
    confirmationEmail: true,
    redirectUrl: 'https://example.com/thank-you'
  }
};
```

## Performance Optimization

### Loading Strategy

1. **Lazy Loading**: Widgets load only when scrolled into view
2. **Resource Prioritization**: Critical resources load first
3. **Code Splitting**: Only load code needed for specific widget

### Caching Strategy

1. **CDN Delivery**: Widgets served via global CDN
2. **Cache Headers**: Appropriate cache headers for resources
3. **Versioned Assets**: Cache-busting for updated resources

### Size Optimization

1. **Minification**: All JavaScript and CSS is minified
2. **Tree Shaking**: Remove unused code
3. **Image Optimization**: Optimize images for web delivery

## Implementation Plan

1. **Domain Management System**:
   - Build domain registration UI in client dashboard
   - Implement domain verification methods
   - Create domain database schema and APIs

2. **Widget Infrastructure**:
   - Develop widget loader system
   - Implement domain verification middleware
   - Create widget rendering framework

3. **Individual Widgets**:
   - Booking widget
   - Reviews widget
   - Forms widget
   - Chat widget
   - Shop widget

4. **Security & Testing**:
   - Penetration testing for widget security
   - Performance testing under load
   - Cross-browser compatibility testing

## Usage Analytics

The system will track widget usage while respecting privacy:

1. **Impression Tracking**: Count widget views
2. **Conversion Tracking**: Track successful interactions
3. **Performance Metrics**: Monitor widget loading and interaction times
4. **Client Dashboard**: Show usage statistics in client dashboard

## Troubleshooting

A comprehensive troubleshooting system will help clients with embedding issues:

1. **Validation Tool**: Domain verification checker tool
2. **Error Logs**: Detailed error logs for debugging
3. **Status Page**: Widget system status information
4. **Documentation**: Clear embedding instructions and FAQs 