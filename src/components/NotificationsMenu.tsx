import React from 'react';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  IconButton,
  Badge,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Done as DoneIcon,
  DeleteOutline as DeleteIcon,
} from '@mui/icons-material';
import { useNotificationStore, Notification } from '../services/notifications';
import { formatDistanceToNow } from 'date-fns';

interface NotificationsMenuProps {
  anchorEl: null | HTMLElement;
  open: boolean;
  onClose: () => void;
}

const NotificationIcon = ({ type }: { type: Notification['type'] }) => {
  switch (type) {
    case 'info':
      return <InfoIcon color="info" />;
    case 'success':
      return <SuccessIcon color="success" />;
    case 'warning':
      return <WarningIcon color="warning" />;
    case 'error':
      return <ErrorIcon color="error" />;
  }
};

export const NotificationsMenu: React.FC<NotificationsMenuProps> = ({
  anchorEl,
  open,
  onClose,
}) => {
  const theme = useTheme();
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = useNotificationStore();

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
  };

  const handleRemove = (id: string) => {
    removeNotification(id);
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 360,
          maxHeight: 480,
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Notifications</Typography>
        {notifications.length > 0 && (
          <Box>
            <IconButton size="small" onClick={markAllAsRead}>
              <DoneIcon />
            </IconButton>
            <IconButton size="small" onClick={clearAll}>
              <DeleteIcon />
            </IconButton>
          </Box>
        )}
      </Box>
      
      <Divider />
      
      {notifications.length === 0 ? (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography color="text.secondary">No notifications</Typography>
        </Box>
      ) : (
        notifications.map((notification) => (
          <MenuItem
            key={notification.id}
            sx={{
              py: 1.5,
              px: 2,
              backgroundColor: notification.read
                ? 'transparent'
                : theme.palette.action.hover,
            }}
          >
            <ListItemIcon>
              <NotificationIcon type={notification.type} />
            </ListItemIcon>
            <ListItemText
              primary={notification.message}
              secondary={formatDistanceToNow(notification.timestamp, { addSuffix: true })}
              sx={{
                '& .MuiListItemText-primary': {
                  color: notification.read
                    ? theme.palette.text.primary
                    : theme.palette.primary.main,
                },
              }}
            />
            <Box sx={{ ml: 1, display: 'flex', gap: 1 }}>
              {!notification.read && (
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkAsRead(notification.id);
                  }}
                >
                  <DoneIcon fontSize="small" />
                </IconButton>
              )}
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(notification.id);
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </MenuItem>
        ))
      )}
    </Menu>
  );
};
