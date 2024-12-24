import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  AccessTime as TimeIcon,
  Category as CategoryIcon,
  Storage as StorageIcon,
  Share as ShareIcon,
  Group as UserIcon,
  Search as SearchIcon,
  CloudDownload as DownloadIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

interface DocumentStats {
  id: string;
  name: string;
  type: string;
  size: number;
  createdDate: Date;
  lastModified: Date;
  accessCount: number;
  downloadCount: number;
  shareCount: number;
  editCount: number;
  collaborators: number;
  version: number;
  category: string;
  tags: string[];
}

interface TimelineData {
  date: Date;
  views: number;
  edits: number;
  downloads: number;
  shares: number;
}

interface CategoryData {
  category: string;
  count: number;
  size: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const DocumentAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [documents, setDocuments] = useState<DocumentStats[]>([]);
  const [timelineData, setTimelineData] = useState<TimelineData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch analytics data
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = () => {
    setLoading(true);
    // Simulated data fetch
    setTimeout(() => {
      // Sample data
      setDocuments([
        {
          id: '1',
          name: 'Research Paper',
          type: 'document',
          size: 1024 * 1024,
          createdDate: new Date(),
          lastModified: new Date(),
          accessCount: 150,
          downloadCount: 45,
          shareCount: 23,
          editCount: 67,
          collaborators: 5,
          version: 2.1,
          category: 'Research',
          tags: ['academic', 'research', 'draft'],
        },
        // Add more sample documents
      ]);

      setTimelineData([
        {
          date: new Date(),
          views: 45,
          edits: 12,
          downloads: 8,
          shares: 5,
        },
        // Add more timeline data
      ]);

      setCategoryData([
        { category: 'Research', count: 25, size: 1024 * 1024 * 50 },
        { category: 'Notes', count: 45, size: 1024 * 1024 * 30 },
        { category: 'Assignments', count: 30, size: 1024 * 1024 * 20 },
        { category: 'Projects', count: 15, size: 1024 * 1024 * 40 },
        { category: 'Personal', count: 20, size: 1024 * 1024 * 25 },
      ]);

      setLoading(false);
    }, 1000);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderOverviewCards = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <StorageIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Total Storage</Typography>
            </Box>
            <Typography variant="h4">
              {formatBytes(documents.reduce((sum, doc) => sum + doc.size, 0))}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Across {documents.length} documents
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ViewIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Total Views</Typography>
            </Box>
            <Typography variant="h4">
              {documents.reduce((sum, doc) => sum + doc.accessCount, 0)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Last {timeRange}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EditIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Total Edits</Typography>
            </Box>
            <Typography variant="h4">
              {documents.reduce((sum, doc) => sum + doc.editCount, 0)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Across all documents
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ShareIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Total Shares</Typography>
            </Box>
            <Typography variant="h4">
              {documents.reduce((sum, doc) => sum + doc.shareCount, 0)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              With {documents.reduce((sum, doc) => sum + doc.collaborators, 0)} collaborators
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderActivityTimeline = () => (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <TimelineIcon sx={{ mr: 1 }} />
        <Typography variant="h6">Activity Timeline</Typography>
        <Box sx={{ flexGrow: 1 }} />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="day">Last 24 Hours</MenuItem>
            <MenuItem value="week">Last Week</MenuItem>
            <MenuItem value="month">Last Month</MenuItem>
            <MenuItem value="year">Last Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => new Date(date).toLocaleDateString()}
            />
            <YAxis />
            <RechartsTooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="views"
              stroke="#8884d8"
              name="Views"
            />
            <Line
              type="monotone"
              dataKey="edits"
              stroke="#82ca9d"
              name="Edits"
            />
            <Line
              type="monotone"
              dataKey="downloads"
              stroke="#ffc658"
              name="Downloads"
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );

  const renderCategoryDistribution = () => (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <PieChartIcon sx={{ mr: 1 }} />
        <Typography variant="h6">Category Distribution</Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar
                  dataKey="size"
                  name="Storage Used"
                  fill="#8884d8"
                  label={{ position: 'top' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );

  const renderTopDocuments = () => (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Top Documents
      </Typography>
      <List>
        {documents
          .sort((a, b) => b.accessCount - a.accessCount)
          .slice(0, 5)
          .map(doc => (
            <ListItem
              key={doc.id}
              sx={{
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                mb: 1,
              }}
            >
              <ListItemIcon>
                <AssessmentIcon />
              </ListItemIcon>
              <ListItemText
                primary={doc.name}
                secondary={
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      {doc.accessCount} views • {doc.editCount} edits •{' '}
                      {doc.downloadCount} downloads
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      {doc.tags.map(tag => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          sx={{ mr: 0.5 }}
                        />
                      ))}
                    </Box>
                  </Box>
                }
              />
            </ListItem>
          ))}
      </List>
    </Paper>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Document Analytics
      </Typography>

      {loading ? (
        <LinearProgress />
      ) : (
        <>
          {renderOverviewCards()}
          {renderActivityTimeline()}
          {renderCategoryDistribution()}
          {renderTopDocuments()}
        </>
      )}
    </Box>
  );
};

export default DocumentAnalytics;
