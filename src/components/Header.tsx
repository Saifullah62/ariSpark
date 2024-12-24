import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  useTheme,
  Tooltip,
  useMediaQuery,
  Badge,
} from '@mui/material';
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { config } from '../config/config';
import { useNotificationStore } from '../services/notifications';
import { NotificationsMenu } from './NotificationsMenu';

interface HeaderProps {
  onToggleTheme: () => void;
  isDarkMode: boolean;
  onToggleNav: () => void;
  isNavOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  onToggleTheme, 
  isDarkMode, 
  onToggleNav,
  isNavOpen 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [notificationsAnchor, setNotificationsAnchor] = useState<null | HTMLElement>(null);
  const { unreadCount } = useNotificationStore();

  const handleOpenNotifications = (event: React.MouseEvent<HTMLButtonElement>) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setNotificationsAnchor(null);
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: theme.zIndex.drawer + 1,
        background: theme.palette.background.paper,
        color: theme.palette.text.primary,
        boxShadow: 'none',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="toggle navigation"
          onClick={onToggleNav}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Box 
          component="img"
          src="/src/assets/logo.svg"
          alt="AriSpark Logo"
          sx={{ 
            height: 32,
            width: 32,
            marginRight: 1,
          }}
        />
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontWeight: 600,
            background: 'linear-gradient(45deg, #FFD700, #FFA500)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {config.appName}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Toggle Theme">
            <IconButton onClick={onToggleTheme} color="inherit">
              {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Notifications">
            <IconButton 
              color="inherit"
              onClick={handleOpenNotifications}
            >
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
        </Box>

        <NotificationsMenu
          anchorEl={notificationsAnchor}
          open={Boolean(notificationsAnchor)}
          onClose={handleCloseNotifications}
        />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
