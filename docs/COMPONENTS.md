# Components Documentation

## Header Component
The Header component serves as the main navigation bar at the top of the application.

### Features
- Theme toggle (dark/light mode)
- Notifications system
- Mobile-responsive navigation toggle
- Application branding

### Usage
```tsx
import Header from '../components/Header';

<Header
  onToggleTheme={handleThemeToggle}
  isDarkMode={darkMode}
  onToggleNav={handleNavToggle}
  isNavOpen={navOpen}
/>
```

### Props
| Prop | Type | Description |
|------|------|-------------|
| onToggleTheme | () => void | Function to toggle theme |
| isDarkMode | boolean | Current theme state |
| onToggleNav | () => void | Function to toggle navigation |
| isNavOpen | boolean | Navigation menu state |

## NotificationsMenu Component
A dropdown menu that displays user notifications with various interaction options.

### Features
- Displays notification list
- Shows notification type icons
- Timestamp display
- Mark as read/unread functionality
- Individual and bulk notification clearing
- Empty state handling

### Usage
```tsx
import { NotificationsMenu } from './NotificationsMenu';

<NotificationsMenu
  anchorEl={notificationsAnchor}
  open={Boolean(notificationsAnchor)}
  onClose={handleCloseNotifications}
/>
```

### Props
| Prop | Type | Description |
|------|------|-------------|
| anchorEl | HTMLElement | null | Element to anchor menu to |
| open | boolean | Controls menu visibility |
| onClose | () => void | Function to close menu |

## Layout Component
The main layout wrapper that provides consistent structure across pages.

### Features
- Responsive sidebar navigation
- Content area with proper spacing
- Header integration
- Theme support

### Usage
```tsx
import Layout from '../components/Layout';

<Layout>
  <YourPageContent />
</Layout>
```

## AI Tutor Component
Interactive AI-powered tutoring interface.

### Features
- Chat-like interface
- Code snippet support
- Math equation rendering
- File attachment handling
- Session history

### Usage
```tsx
import AiTutor from '../pages/AiTutor';

<AiTutor />
```

## Math Solver Component
Component for solving mathematical problems with step-by-step solutions.

### Features
- Problem input interface
- Step-by-step solution display
- Multiple solution methods
- Math equation rendering
- Solution history

### Usage
```tsx
import MathSolver from '../pages/MathSolver';

<MathSolver />
```

## Schedule Component
Calendar and schedule management interface.

### Features
- Calendar view
- Event creation/editing
- Time slot management
- Event categorization
- Recurring events

### Usage
```tsx
import Schedule from '../pages/Schedule';

<Schedule />
```

## Common Props and Interfaces

### TabPanelProps
```typescript
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
```

### NotificationType
```typescript
type NotificationType = 'info' | 'success' | 'warning' | 'error';
```

### Notification
```typescript
interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  timestamp: number;
  read: boolean;
}
```

## Styling Guidelines

### Theme Colors
```typescript
const colors = {
  primary: {
    main: '#1976d2',
    light: '#42a5f5',
    dark: '#1565c0',
  },
  secondary: {
    main: '#9c27b0',
    light: '#ba68c8',
    dark: '#7b1fa2',
  },
  // ... other colors
};
```

### Common Styles
```typescript
const commonStyles = {
  gradientText: {
    background: 'linear-gradient(45deg, #FFD700, #FFA500)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  // ... other common styles
};
```

## Best Practices

1. **Component Organization**
   - Keep components focused and single-responsibility
   - Use TypeScript interfaces for props
   - Implement proper error boundaries

2. **State Management**
   - Use Zustand for global state
   - Keep local state with useState
   - Implement proper loading states

3. **Performance**
   - Implement proper memoization
   - Use lazy loading for routes
   - Optimize re-renders

4. **Accessibility**
   - Include proper ARIA labels
   - Ensure keyboard navigation
   - Maintain proper contrast ratios
