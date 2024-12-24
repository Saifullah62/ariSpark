import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface GoalAnalyticsProps {
  goals: any[];
  streak: number;
  completionRate: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const GoalAnalytics: React.FC<GoalAnalyticsProps> = ({ goals, streak, completionRate }) => {
  const getGoalsByStatus = () => {
    const total = goals.length;
    const completed = goals.filter(g => g.completed).length;
    const inProgress = goals.filter(g => !g.completed && g.progress > 0).length;
    const notStarted = goals.filter(g => !g.completed && g.progress === 0).length;

    return [
      { name: 'Completed', value: completed },
      { name: 'In Progress', value: inProgress },
      { name: 'Not Started', value: notStarted }
    ];
  };

  const getProgressHistory = () => {
    // This would ideally come from a real tracking history
    // For now, we'll generate some sample data
    return Array.from({ length: 7 }, (_, i) => ({
      day: i + 1,
      progress: Math.floor(Math.random() * 100)
    }));
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Goal Analytics
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="subtitle1">Goal Distribution</Typography>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={getGoalsByStatus()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getGoalsByStatus().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="subtitle1">Progress Over Time</Typography>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={getProgressHistory()}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="progress" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center', mt: 2 }}>
            <Box>
              <Typography variant="h4" color="primary">
                {streak}
              </Typography>
              <Typography variant="body2">Day Streak</Typography>
            </Box>
            <Box>
              <Typography variant="h4" color="primary">
                {completionRate}%
              </Typography>
              <Typography variant="body2">Completion Rate</Typography>
            </Box>
            <Box>
              <Typography variant="h4" color="primary">
                {goals.length}
              </Typography>
              <Typography variant="body2">Total Goals</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default GoalAnalytics;
