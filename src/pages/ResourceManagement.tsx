import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Tabs,
  Tab,
  Typography,
  IconButton,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Description as DocumentIcon,
  AttachMoney as FinanceIcon,
  Assessment as AnalyticsIcon,
  MenuBook as CitationIcon,
  Slideshow as PresentationIcon,
  Dashboard as DashboardIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';

// Import components
import DocumentManager from '../components/DocumentManager';
import DocumentTemplates from '../components/DocumentTemplates';
import CitationManager from '../components/CitationManager';
import PresentationMode from '../components/PresentationMode';
import DocumentAnalytics from '../components/DocumentAnalytics';
import FinanceManager from '../components/FinanceManager';
import FinancialInsights from '../components/FinancialInsights';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const ResourceManagement: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const menuItems = [
    { icon: <DashboardIcon />, text: 'Dashboard', tab: 0 },
    { icon: <DocumentIcon />, text: 'Documents', tab: 1 },
    { icon: <MenuBook />, text: 'Templates', tab: 2 },
    { icon: <CitationIcon />, text: 'Citations', tab: 3 },
    { icon: <PresentationIcon />, text: 'Presentations', tab: 4 },
    { icon: <AnalyticsIcon />, text: 'Analytics', tab: 5 },
    { icon: <FinanceIcon />, text: 'Finance', tab: 6 },
  ];

  const renderDrawer = () => (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ overflow: 'auto' }}>
        <List>
          <ListItem sx={{ py: 2 }}>
            <Typography variant="h6" color="primary">
              Resource Center
            </Typography>
          </ListItem>
          <Divider />
          {menuItems.map((item, index) => (
            <ListItem
              button
              key={index}
              selected={selectedTab === item.tab}
              onClick={() => {
                setSelectedTab(item.tab);
                if (isMobile) setDrawerOpen(false);
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {renderDrawer()}
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` },
        }}
      >
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setDrawerOpen(true)}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <TabPanel value={selectedTab} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Recent Documents
                </Typography>
                <DocumentManager />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Financial Overview
                </Typography>
                <FinancialInsights />
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={selectedTab} index={1}>
          <Paper sx={{ width: '100%' }}>
            <DocumentManager />
          </Paper>
        </TabPanel>

        <TabPanel value={selectedTab} index={2}>
          <Paper sx={{ width: '100%' }}>
            <DocumentTemplates />
          </Paper>
        </TabPanel>

        <TabPanel value={selectedTab} index={3}>
          <Paper sx={{ width: '100%' }}>
            <CitationManager />
          </Paper>
        </TabPanel>

        <TabPanel value={selectedTab} index={4}>
          <Paper sx={{ width: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Presentation Mode
            </Typography>
            {/* Presentation mode will be activated when a document is selected */}
            <Typography color="textSecondary">
              Select a document to enter presentation mode
            </Typography>
          </Paper>
        </TabPanel>

        <TabPanel value={selectedTab} index={5}>
          <Paper sx={{ width: '100%' }}>
            <DocumentAnalytics />
          </Paper>
        </TabPanel>

        <TabPanel value={selectedTab} index={6}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 2 }}>
                <FinanceManager />
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2 }}>
                <FinancialInsights />
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
      </Box>
    </Box>
  );
};

export default ResourceManagement;
