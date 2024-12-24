import { SxProps, Theme } from '@mui/material';

export const commonStyles = {
  // Page Container
  pageContainer: {
    p: 3,
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
  },

  // Page Title
  pageTitle: {
    mb: 4,
    fontWeight: 600,
    background: 'linear-gradient(45deg, #FFD700, #FFA500)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },

  // Cards
  gradientCard: {
    background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
    color: 'white',
    mb: 3,
  },

  standardCard: {
    height: '100%',
    p: 2,
    display: 'flex',
    flexDirection: 'column',
    '&:hover': {
      boxShadow: (theme: Theme) => theme.shadows[4],
      transform: 'translateY(-2px)',
      transition: 'all 0.3s ease-in-out',
    },
  },

  // Buttons
  primaryButton: {
    background: 'linear-gradient(45deg, #FFD700, #FFA500)',
    color: 'white',
    '&:hover': {
      background: 'linear-gradient(45deg, #FFE14D, #FFB533)',
    },
  },

  iconButton: {
    color: 'white',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.1)',
    },
  },

  // Lists
  list: {
    width: '100%',
    bgcolor: 'background.paper',
    borderRadius: 1,
    '& .MuiListItem-root': {
      mb: 1,
      bgcolor: 'background.paper',
      borderRadius: 1,
      border: 1,
      borderColor: 'divider',
    },
  },

  // Dialog
  dialog: {
    '& .MuiDialog-paper': {
      borderRadius: 2,
    },
  },

  // Form Fields
  textField: {
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderColor: '#FFA500',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#FFD700',
      },
    },
  },

  // Loading States
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.8)',
    zIndex: 1000,
  },

  // Paper Components
  paper: {
    p: 3,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 2,
  },

  // Grid Layouts
  gridContainer: {
    spacing: 3,
    width: '100%',
    mt: 0,
  },

  // Typography
  sectionTitle: {
    fontWeight: 600,
    mb: 2,
  },

  subtitle: {
    color: 'text.secondary',
    mb: 1,
  },

  // Chips
  chip: {
    background: 'linear-gradient(45deg, #FFD700, #FFA500)',
    color: 'white',
    '&:hover': {
      background: 'linear-gradient(45deg, #FFE14D, #FFB533)',
    },
  },

  // Breadcrumbs
  breadcrumbs: {
    '& .MuiLink-root': {
      cursor: 'pointer',
      '&:hover': {
        color: '#FFA500',
      },
    },
  },
} as const;
