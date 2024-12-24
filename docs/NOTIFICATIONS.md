# Notifications System Documentation

## Overview
The notifications system provides a centralized way to manage and display notifications throughout the application. It uses Zustand for state management and integrates with Material-UI for the user interface.

## Features
- Add new notifications
- Mark notifications as read/unread
- Remove individual notifications
- Clear all notifications
- Track unread notification count
- Persistent notifications across page navigation
- Different notification types (info, success, warning, error)

## Technical Implementation

### State Management
The notification state is managed using Zustand, providing a simple and efficient store:

```typescript
interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}
```

### Notification Interface
```typescript
interface Notification {
  id: string;           // Unique identifier
  message: string;      // Notification message
  type: NotificationType; // info | success | warning | error
  timestamp: number;    // Creation timestamp
  read: boolean;        // Read status
}
```

## Usage Examples

### Adding a Notification
```typescript
import { useNotificationStore } from '../services/notifications';

// Simple notification
const { addNotification } = useNotificationStore();
addNotification({
  message: "Changes saved successfully!",
  type: "success"
});

// Warning notification
addNotification({
  message: "Please save your changes before leaving",
  type: "warning"
});

// Error notification
addNotification({
  message: "Failed to save changes",
  type: "error"
});
```

### Managing Notifications
```typescript
const { 
  markAsRead, 
  markAllAsRead, 
  removeNotification, 
  clearAll 
} = useNotificationStore();

// Mark single notification as read
markAsRead("notification-id");

// Mark all notifications as read
markAllAsRead();

// Remove specific notification
removeNotification("notification-id");

// Clear all notifications
clearAll();
```

### Accessing Notification State
```typescript
const { 
  notifications,
  unreadCount 
} = useNotificationStore();

// Get all notifications
console.log(notifications);

// Get unread count
console.log(unreadCount);
```

## UI Components

### NotificationsMenu
The NotificationsMenu component provides the user interface for viewing and managing notifications:

```typescript
<NotificationsMenu
  anchorEl={notificationsAnchor}
  open={Boolean(notificationsAnchor)}
  onClose={handleCloseNotifications}
/>
```

### Notification Badge
The notification badge in the Header shows the unread count:

```typescript
<Badge badgeContent={unreadCount} color="error">
  <NotificationsIcon />
</Badge>
```

## Best Practices

### When to Use Notifications
1. **Success Messages**
   - After successful form submissions
   - When operations complete successfully
   - After saving changes

2. **Warning Messages**
   - Before potentially destructive actions
   - For important deadlines
   - When approaching resource limits

3. **Error Messages**
   - Failed operations
   - Network errors
   - Validation errors

4. **Info Messages**
   - System updates
   - New features
   - General announcements

### Notification Guidelines
1. **Message Content**
   - Keep messages clear and concise
   - Use actionable language
   - Provide context when needed

2. **Duration**
   - Success notifications: 3 seconds
   - Warning notifications: 5 seconds
   - Error notifications: Until dismissed
   - Info notifications: 4 seconds

3. **Styling**
   - Use appropriate colors for each type
   - Maintain consistent spacing
   - Ensure readable text contrast

## Error Handling
```typescript
try {
  // Operation
  addNotification({
    message: "Operation successful",
    type: "success"
  });
} catch (error) {
  addNotification({
    message: error.message || "An error occurred",
    type: "error"
  });
}
```

## Performance Considerations
1. **State Updates**
   - Batch notification updates when possible
   - Clean up old notifications periodically
   - Limit maximum number of stored notifications

2. **UI Rendering**
   - Use virtualization for long notification lists
   - Implement proper memo usage
   - Optimize animation performance

## Testing
```typescript
// Example test cases
describe('NotificationStore', () => {
  it('should add notification', () => {
    const { addNotification, notifications } = useNotificationStore.getState();
    addNotification({
      message: "Test notification",
      type: "info"
    });
    expect(notifications.length).toBe(1);
  });

  it('should mark notification as read', () => {
    const { markAsRead, notifications } = useNotificationStore.getState();
    const id = notifications[0].id;
    markAsRead(id);
    expect(notifications[0].read).toBe(true);
  });
});
```
