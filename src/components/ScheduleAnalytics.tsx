import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

interface Task {
  id: number;
  title: string;
  description: string;
  date: Date;
  type: 'class' | 'work' | 'study' | 'other';
  priority: 'high' | 'medium' | 'low';
  completed?: boolean;
}

interface ScheduleAnalyticsProps {
  tasks: Task[];
  selectedDate: Date;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const PRIORITY_COLORS = {
  high: '#f44336',
  medium: '#ff9800',
  low: '#4caf50',
};

const ScheduleAnalytics: React.FC<ScheduleAnalyticsProps> = ({ tasks, selectedDate }) => {
  const getTaskTypeDistribution = () => {
    const distribution = tasks.reduce((acc, task) => {
      acc[task.type] = (acc[task.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
  };

  const getWeeklyDistribution = () => {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      return date;
    });

    return weekDays.map(date => ({
      name: date.toLocaleDateString('en-US', { weekday: 'short' }),
      tasks: tasks.filter(task => 
        task.date.toDateString() === date.toDateString()
      ).length,
      completed: tasks.filter(task => 
        task.date.toDateString() === date.toDateString() && task.completed
      ).length,
    }));
  };

  const getPriorityDistribution = () => {
    const distribution = tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
  };

  const getCompletionRate = () => {
    const completed = tasks.filter(task => task.completed).length;
    return tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Schedule Analytics
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Box sx={{ height: 200 }}>
            <Typography variant="subtitle2" align="center" gutterBottom>
              Task Distribution by Type
            </Typography>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={getTaskTypeDistribution()}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {getTaskTypeDistribution().map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <Box sx={{ height: 200 }}>
            <Typography variant="subtitle2" align="center" gutterBottom>
              Weekly Task Distribution
            </Typography>
            <ResponsiveContainer>
              <BarChart data={getWeeklyDistribution()}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="tasks" name="Total Tasks" fill="#8884d8" />
                <Bar dataKey="completed" name="Completed" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center', mt: 2 }}>
            <Box>
              <Typography variant="h4" color="primary">
                {tasks.length}
              </Typography>
              <Typography variant="body2">Total Tasks</Typography>
            </Box>
            <Box>
              <Typography variant="h4" color="primary">
                {getCompletionRate()}%
              </Typography>
              <Typography variant="body2">Completion Rate</Typography>
            </Box>
            <Box>
              <Typography variant="h4" color="primary">
                {tasks.filter(t => t.priority === 'high').length}
              </Typography>
              <Typography variant="body2">High Priority</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ScheduleAnalytics;
