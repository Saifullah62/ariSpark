import React, { useState } from 'react';
import { ThemeProvider, CssBaseline, createTheme, Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Header from './components/Header';
import Navigation from './components/Navigation';
import ResourceManagement from './pages/ResourceManagement';
import AiTutor from './pages/AiTutor';
import GlossarySystem from './components/GlossarySystem';
import Dashboard from './pages/Dashboard';
import MathSolver from './pages/MathSolver';
import Goals from './pages/Goals';
import Schedule from './pages/Schedule';
import Finance from './pages/Finance';
import Documents from './pages/Documents';

// Theme configuration
const getTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#FFD700', // Gold
        light: '#FFE14D',
        dark: '#FFA500',
      },
      secondary: {
        main: '#FF6B6B',
        light: '#FF9999',
        dark: '#CC5555',
      },
      background: {
        default: mode === 'light' ? '#F5F5F5' : '#121212',
        paper: mode === 'light' ? '#FFFFFF' : '#1E1E1E',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 600 },
      h2: { fontWeight: 600 },
      h3: { fontWeight: 600 },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
    },
  });

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(true);
  const theme = getTheme(isDarkMode ? 'dark' : 'light');

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          <Header 
            onToggleTheme={toggleTheme} 
            isDarkMode={isDarkMode} 
            onToggleNav={toggleNav}
            isNavOpen={isNavOpen}
          />
          <Navigation open={isNavOpen} onToggle={toggleNav} />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              mt: 8,
              ml: { sm: isNavOpen ? '240px' : '64px' },
              transition: theme => theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/math" element={<MathSolver />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/tutor" element={<AiTutor />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/documents/*" element={<Documents />} />
              <Route path="/glossary" element={<GlossarySystem />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;