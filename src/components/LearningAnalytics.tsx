import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface StudySession {
  id: string;
  date: Date;
  duration: number;
  topic: string;
  materialsStudied: string[];
  questionsAnswered: number;
  correctAnswers: number;
  confidence: number;
}

interface TopicProgress {
  topic: string;
  mastery: number;
  timeSpent: number;
  lastStudied: Date;
  strengthAreas: string[];
  weaknessAreas: string[];
}

interface LearningAnalyticsProps {
  timeRange: 'week' | 'month' | 'year';
  onTimeRangeChange: (range: 'week' | 'month' | 'year') => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const LearningAnalytics: React.FC<LearningAnalyticsProps> = ({
  timeRange,
  onTimeRangeChange,
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState<string>('all');

  // Sample data - replace with actual data from your application
  const studyData = [
    {
      date: '2024-01-01',
      timeSpent: 120,
      questionsAnswered: 50,
      accuracy: 80,
      confidence: 75,
    },
    // Add more data points
  ];

  const topicProgress: TopicProgress[] = [
    {
      topic: 'Criminal Law',
      mastery: 85,
      timeSpent: 480,
      lastStudied: new Date(),
      strengthAreas: ['Constitutional Rights', 'Due Process'],
      weaknessAreas: ['International Law', 'Cyber Crime'],
    },
    // Add more topics
  ];

  const performanceData = [
    { name: 'Correct', value: 75 },
    { name: 'Incorrect', value: 25 },
  ];

  const renderTimeSpentChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={studyData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="timeSpent"
          stroke="#8884d8"
          name="Study Time (minutes)"
        />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderPerformanceChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={performanceData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {performanceData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );

  const renderTopicProgress = () => (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Topic</TableCell>
            <TableCell align="right">Mastery</TableCell>
            <TableCell align="right">Time Spent (hrs)</TableCell>
            <TableCell>Last Studied</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {topicProgress.map((topic) => (
            <TableRow key={topic.topic}>
              <TableCell component="th" scope="row">
                {topic.topic}
              </TableCell>
              <TableCell align="right">{topic.mastery}%</TableCell>
              <TableCell align="right">
                {(topic.timeSpent / 60).toFixed(1)}
              </TableCell>
              <TableCell>
                {topic.lastStudied.toLocaleDateString()}
              </TableCell>
              <TableCell>
                {topic.mastery >= 80
                  ? 'Excellent'
                  : topic.mastery >= 60
                  ? 'Good'
                  : 'Needs Work'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Learning Analytics</Typography>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Time Range</InputLabel>
                <Select
                  value={timeRange}
                  label="Time Range"
                  onChange={(e) =>
                    onTimeRangeChange(e.target.value as 'week' | 'month' | 'year')
                  }
                >
                  <MenuItem value="week">Past Week</MenuItem>
                  <MenuItem value="month">Past Month</MenuItem>
                  <MenuItem value="year">Past Year</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Study Time
                    </Typography>
                    <Typography variant="h4">24.5 hrs</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total study time this {timeRange}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Performance
                    </Typography>
                    <Typography variant="h4">85%</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Average accuracy
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Topics Covered
                    </Typography>
                    <Typography variant="h4">12</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active study topics
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Tabs
                value={tabValue}
                onChange={(_, newValue) => setTabValue(newValue)}
                sx={{ borderBottom: 1, borderColor: 'divider' }}
              >
                <Tab label="Overview" />
                <Tab label="Time Analysis" />
                <Tab label="Performance" />
                <Tab label="Topic Progress" />
              </Tabs>

              <Box sx={{ mt: 2 }}>
                {tabValue === 0 && (
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" gutterBottom>
                        Study Time Distribution
                      </Typography>
                      {renderTimeSpentChart()}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" gutterBottom>
                        Performance Overview
                      </Typography>
                      {renderPerformanceChart()}
                    </Grid>
                  </Grid>
                )}

                {tabValue === 1 && (
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Detailed Time Analysis
                    </Typography>
                    {renderTimeSpentChart()}
                  </Box>
                )}

                {tabValue === 2 && (
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Performance Metrics
                    </Typography>
                    {renderPerformanceChart()}
                  </Box>
                )}

                {tabValue === 3 && (
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Topic Progress Tracking
                    </Typography>
                    {renderTopicProgress()}
                  </Box>
                )}
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LearningAnalytics;
