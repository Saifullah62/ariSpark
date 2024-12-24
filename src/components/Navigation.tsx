import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  useTheme,
  useMediaQuery,
  Tooltip,
  Collapse,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Calculate as MathIcon,
  EmojiObjects as GoalsIcon,
  Schedule as ScheduleIcon,
  School as TutorIcon,
  AccountBalance as FinanceIcon,
  Description as DocumentsIcon,
  Book as GlossaryIcon,
  ChevronLeft as ChevronLeftIcon,
  Menu as MenuIcon,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';

const drawerWidth = 240;

interface NavigationProps {
  open: boolean;
  onToggle: () => void;
}

interface MenuItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  subItems?: MenuItem[];
}

const menuItems: MenuItem[] = [
  { path: '/', label: 'Dashboard', icon: <DashboardIcon /> },
  { path: '/math', label: 'Math Solver', icon: <MathIcon /> },
  { path: '/goals', label: 'Goals', icon: <GoalsIcon /> },
  { path: '/schedule', label: 'Schedule', icon: <ScheduleIcon /> },
  { path: '/tutor', label: 'AI Tutor', icon: <TutorIcon /> },
  { path: '/finance', label: 'Finance', icon: <FinanceIcon /> },
  {
    path: '/documents',
    label: 'Documents',
    icon: <DocumentsIcon />,
    subItems: [
      { path: '/documents/templates', label: 'Templates', icon: <DocumentsIcon /> },
      { path: '/documents/recent', label: 'Recent', icon: <DocumentsIcon /> },
      { path: '/documents/shared', label: 'Shared', icon: <DocumentsIcon /> },
    ],
  },
  { path: '/glossary', label: 'Glossary', icon: <GlossaryIcon /> },
];

const Navigation: React.FC<NavigationProps> = ({ open, onToggle }) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleItemClick = (path: string, hasSubItems?: boolean) => {
    if (hasSubItems) {
      setExpandedItems(prev =>
        prev.includes(path)
          ? prev.filter(item => item !== path)
          : [...prev, path]
      );
    } else {
      navigate(path);
      if (isMobile) {
        onToggle();
      }
    }
  };

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const isSelected = location.pathname === item.path;
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedItems.includes(item.path);

    return (
      <React.Fragment key={item.path}>
        <ListItem
          button
          selected={isSelected}
          onClick={() => handleItemClick(item.path, hasSubItems)}
          sx={{
            pl: theme.spacing(2 + depth * 2),
            borderRadius: theme.shape.borderRadius,
            mx: 1,
            mb: 0.5,
            '&.Mui-selected': {
              background: 'linear-gradient(45deg, rgba(255,215,0,0.1), rgba(255,165,0,0.1))',
              '&:hover': {
                background: 'linear-gradient(45deg, rgba(255,215,0,0.2), rgba(255,165,0,0.2))',
              },
            },
            '&:hover': {
              background: 'linear-gradient(45deg, rgba(255,215,0,0.05), rgba(255,165,0,0.05))',
            },
          }}
        >
          <ListItemIcon
            sx={{
              color: isSelected ? theme.palette.primary.main : 'inherit',
              minWidth: 40,
            }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText
            primary={item.label}
            sx={{
              '& .MuiListItemText-primary': {
                fontWeight: isSelected ? 600 : 400,
                color: isSelected ? theme.palette.primary.main : 'inherit',
              },
            }}
          />
          {hasSubItems && (
            <Box component="span" sx={{ ml: 'auto' }}>
              {isExpanded ? <ExpandLess /> : <ExpandMore />}
            </Box>
          )}
        </ListItem>
        
        {hasSubItems && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.subItems!.map(subItem => renderMenuItem(subItem, depth + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  const drawer = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          p: 1,
        }}
      >
        <IconButton onClick={onToggle}>
          <ChevronLeftIcon />
        </IconButton>
      </Box>
      <List
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: 6,
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme.palette.divider,
            borderRadius: 3,
          },
        }}
      >
        {menuItems.map(item => renderMenuItem(item))}
      </List>
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <Drawer
          variant="temporary"
          anchor="left"
          open={open}
          onClose={onToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              background: theme.palette.background.paper,
              borderRight: `1px solid ${theme.palette.divider}`,
            },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          open={open}
          sx={{
            width: open ? drawerWidth : theme.spacing(7),
            flexShrink: 0,
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            '& .MuiDrawer-paper': {
              width: open ? drawerWidth : theme.spacing(7),
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              boxSizing: 'border-box',
              background: theme.palette.background.paper,
              borderRight: `1px solid ${theme.palette.divider}`,
              overflowX: 'hidden',
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

      {!open && !isMobile && (
        <Box
          sx={{
            position: 'fixed',
            left: 0,
            top: theme.spacing(8),
            bottom: 0,
            width: theme.spacing(7),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pt: 1,
          }}
        >
          {menuItems.map(item => (
            <Tooltip
              key={item.path}
              title={item.label}
              placement="right"
              arrow
            >
              <IconButton
                onClick={() => handleItemClick(item.path)}
                sx={{
                  mb: 1,
                  color: location.pathname === item.path
                    ? theme.palette.primary.main
                    : 'inherit',
                }}
              >
                {item.icon}
              </IconButton>
            </Tooltip>
          ))}
        </Box>
      )}
    </>
  );
};

export default Navigation;
