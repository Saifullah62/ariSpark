import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, CircularProgress } from '@mui/material';
import { AutoFixHigh as AutoFixHighIcon } from '@mui/icons-material';

interface MotivationCardProps {
  quote: string;
  streak: number;
  onNewQuote: () => void;
}

const MotivationCard: React.FC<MotivationCardProps> = ({ quote, streak, onNewQuote }) => {
  const [timeUntilTomorrow, setTimeUntilTomorrow] = useState('');

  useEffect(() => {
    const updateTimeUntilTomorrow = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeUntilTomorrow(`${hours}h ${minutes}m`);
    };

    updateTimeUntilTomorrow();
    const interval = setInterval(updateTimeUntilTomorrow, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Paper 
      sx={{ 
        p: 3, 
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        color: 'white'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <AutoFixHighIcon sx={{ mr: 1 }} />
        <Typography variant="h6">Daily Motivation</Typography>
      </Box>

      <Typography 
        variant="body1" 
        sx={{ 
          fontStyle: 'italic', 
          mb: 3,
          minHeight: '80px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        "{quote}"
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {streak}
          </Typography>
          <Typography variant="body2">
            Day Streak
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress 
            variant="determinate" 
            value={(24 - new Date().getHours()) / 24 * 100}
            sx={{ color: 'white' }}
          />
          <Typography variant="caption" display="block">
            {timeUntilTomorrow} until tomorrow
          </Typography>
        </Box>

        <Button 
          variant="contained" 
          onClick={onNewQuote}
          sx={{ 
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.3)',
            }
          }}
        >
          New Quote
        </Button>
      </Box>
    </Paper>
  );
};

export default MotivationCard;
