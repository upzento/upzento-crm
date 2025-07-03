# Upzento CRM UI Design Guidelines

This document outlines the design principles, components, and theme guidelines for the Upzento CRM platform, focusing on creating a unique, modern cosmic/space-inspired interface.

## Design Principles

### 1. Cosmic Elegance
- Create a sophisticated space-inspired interface that feels futuristic without being overwhelming
- Use subtle cosmic elements (stars, gradients, nebula-like patterns) as accents, not dominant elements
- Maintain professional appearance while incorporating unique cosmic elements

### 2. Clarity and Focus
- Ensure information hierarchy is clear and consistent
- Use space (margins, padding) strategically to create focus areas
- Design for scanability with clear section divisions

### 3. Responsive and Adaptive
- Design for all device sizes from mobile to large desktop displays
- Use flexible layouts that adapt to different screen dimensions
- Ensure touch-friendly UI elements for mobile users

### 4. Consistent Experience
- Maintain visual consistency across all modules and features
- Use a unified component library for consistent UI elements
- Create smooth transitions between sections and screens

## Color Palette

### Dark Theme (Default)
- **Background (Deep Space)**: #0F1123
- **Surface (Cosmic Surface)**: #1A1C2E
- **Primary (Cosmic Blue)**: #3D5AFE
- **Secondary (Nebula Pink)**: #FF4081
- **Accent (Stardust Gold)**: #FFD700
- **Error (Solar Flare)**: #FF3D00
- **Success (Aurora Green)**: #00E676
- **Warning (Solar Yellow)**: #FFEA00
- **Text Primary**: #FFFFFF
- **Text Secondary**: #B0B0C0

### Light Theme
- **Background (Stellar White)**: #F8F9FE
- **Surface (Moon Surface)**: #FFFFFF
- **Primary (Cosmic Blue)**: #3D5AFE
- **Secondary (Nebula Pink)**: #E91E63
- **Accent (Stardust Gold)**: #FF9800
- **Error (Solar Flare)**: #F44336
- **Success (Aurora Green)**: #00C853
- **Warning (Solar Yellow)**: #FFC107
- **Text Primary**: #1A1C2E
- **Text Secondary**: #5F6180

### Gradients
- **Cosmic Gradient**: Linear gradient from #3D5AFE to #AA00FF
- **Nebula Gradient**: Linear gradient from #FF4081 to #AA00FF
- **Aurora Gradient**: Linear gradient from #00E676 to #3D5AFE

## Typography

### Font Families
- **Primary Font**: 'Space Grotesk', sans-serif
- **Secondary Font**: 'Inter', sans-serif
- **Monospace Font**: 'JetBrains Mono', monospace (for code snippets)

### Font Weights
- Light: 300
- Regular: 400
- Medium: 500
- SemiBold: 600
- Bold: 700

### Font Sizes
- Heading 1: 36px (2.25rem)
- Heading 2: 28px (1.75rem)
- Heading 3: 24px (1.5rem)
- Heading 4: 20px (1.25rem)
- Heading 5: 18px (1.125rem)
- Heading 6: 16px (1rem)
- Body: 16px (1rem)
- Small: 14px (0.875rem)
- XSmall: 12px (0.75rem)

## Component Design

### Buttons
- **Primary Button**: Filled with primary color, subtle glow effect on hover
- **Secondary Button**: Outlined with secondary color
- **Text Button**: No background, just text color
- **Icon Button**: Circular with icon centered
- **Action Button**: Floating action button with accent color and more prominent glow effect

### Cards
- Subtle rounded corners (8px radius)
- Light box shadow in light theme, subtle glow in dark theme
- Optional gradient borders for emphasis
- Consistent padding (16px or 24px)

### Navigation
- Sidebar navigation with collapsible sections
- Top bar for global actions and user profile
- Breadcrumbs for deeper navigation paths
- Tab bars for content sections within modules

### Forms
- Floating labels
- Clear input states (focus, error, disabled)
- Inline validation with helpful error messages
- Consistent spacing between form elements

### Data Visualization
- Clean, minimal charts and graphs
- Space-inspired color palette for data series
- Subtle grid lines
- Clear legends and labels

### Loading States
- Custom loading spinner with cosmic/orbital animation
- Skeleton screens for content loading
- Subtle transition animations

## Cosmic Elements

### Background Elements
- Subtle star field patterns for empty states or backgrounds
- Nebula-like gradients for accent areas
- Constellation patterns for visual interest
- Subtle parallax effects for depth

### Animations
- Smooth transitions between states (300ms easing)
- Subtle hover animations
- Loading animations inspired by orbital movements
- Success/error animations with cosmic theme

### Iconography
- Custom icon set with cosmic/space theme
- Consistent stroke weight and style
- Clear meaning and purpose
- Optional subtle glow effect in dark mode

## Accessibility Guidelines

- Maintain WCAG 2.1 AA compliance minimum
- Ensure color contrast ratios meet standards
- Provide keyboard navigation for all interactive elements
- Support screen readers with proper ARIA attributes
- Design focus states for keyboard navigation

## Theme Switching

- Smooth transition between dark and light themes
- Persistent user preference storage
- Respect system preferences with option to override
- Consistent appearance of all components in both themes

## Responsive Breakpoints

- Mobile: < 600px
- Tablet: 600px - 960px
- Desktop Small: 960px - 1280px
- Desktop Medium: 1280px - 1600px
- Desktop Large: > 1600px

## Implementation Notes

- Use CSS variables for theme colors and properties
- Implement theme switching with React context
- Build a component library with StoryBook documentation
- Use CSS-in-JS (styled-components or emotion) for component styling
- Create a theme provider that handles all theme-related logic

## Example Components

```jsx
// Button Component Example
const PrimaryButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 0 0 rgba(61, 90, 254, 0);
  
  &:hover {
    box-shadow: 0 0 16px rgba(61, 90, 254, 0.5);
    transform: translateY(-2px);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(61, 90, 254, 0.3);
  }
`;

// Card Component Example
const CosmicCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 8px;
  padding: 24px;
  box-shadow: ${props => props.theme.isDark 
    ? '0 8px 16px rgba(0, 0, 0, 0.3), 0 0 8px rgba(61, 90, 254, 0.2)' 
    : '0 4px 12px rgba(0, 0, 0, 0.08)'};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.isDark 
      ? '0 12px 24px rgba(0, 0, 0, 0.4), 0 0 12px rgba(61, 90, 254, 0.3)' 
      : '0 8px 24px rgba(0, 0, 0, 0.12)'};
  }
`;
``` 