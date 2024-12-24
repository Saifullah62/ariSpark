import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  ViewDay as ViewDayIcon,
  ViewWeek as ViewWeekIcon,
  ViewModule as ViewModuleIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import TimelineView from '../components/TimelineView';
import ScheduleAnalytics from '../components/ScheduleAnalytics';
import TaskForm from '../components/TaskForm';

interface Task {
  id: number;
  title: string;
  description: string;
  date: Date;
  time?: string;
  type: 'class' | 'work' | 'study' | 'other';
  priority: 'high' | 'medium' | 'low';
  completed?: boolean;
  recurring?: 'daily' | 'weekly' | 'monthly' | 'none';
  reminder?: boolean;
  location?: string;
  notes?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const commonStyles = {
  pageContainer: {
    p: 3,
  },
  pageTitle: {
    mb: 2,
  },
};

const Schedule: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewTab, setViewTab] = useState(0);
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as const });

  useEffect(() => {
    const savedTasks = localStorage.getItem('schedule_tasks');
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
        ...task,
        date: new Date(task.date),
      }));
      setTasks(parsedTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('schedule_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleOpenDialog = (task?: Task) => {
    if (task) {
      setEditingTask(task);
    } else {
      setEditingTask(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTask(null);
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (editingTask) {
      setTasks(tasks.map(task =>
        task.id === editingTask.id ? { ...task, ...taskData } as Task : task
      ));
      setSnackbar({
        open: true,
        message: 'Task updated successfully',
        severity: 'success',
      });
    } else {
      const newTask = {
        ...taskData,
        id: Date.now(),
        date: selectedDate,
        completed: false,
      } as Task;
      setTasks([...tasks, newTask]);
      setSnackbar({
        open: true,
        message: 'Task created successfully',
        severity: 'success',
      });
    }
    handleCloseDialog();
  };

  const handleTaskAction = (task: Task, action: 'edit' | 'delete' | 'complete') => {
    switch (action) {
      case 'edit':
        handleOpenDialog(task);
        break;
      case 'delete':
        setTasks(tasks.filter(t => t.id !== task.id));
        setSnackbar({
          open: true,
          message: 'Task deleted successfully',
          severity: 'success',
        });
        break;
      case 'complete':
        setTasks(tasks.map(t =>
          t.id === task.id ? { ...t, completed: !t.completed } : t
        ));
        setSnackbar({
          open: true,
          message: `Task marked as ${task.completed ? 'incomplete' : 'complete'}`,
          severity: 'success',
        });
        break;
    }
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchor(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchor(null);
  };

  const handleFilterToggle = (filter: string) => {
    setActiveFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const getFilteredTasks = () => {
    let filtered = tasks.filter(task =>
      task.date.toDateString() === selectedDate.toDateString()
    );

    if (activeFilters.length > 0) {
      filtered = filtered.filter(task =>
        activeFilters.includes(task.type) ||
        activeFilters.includes(task.priority)
      );
    }

    return filtered;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={commonStyles.pageContainer}>
        <Typography variant="h4" sx={commonStyles.pageTitle}>
          Schedule
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Calendar</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog()}
                >
                  Add Task
                </Button>
              </Box>
              <DateCalendar
                value={selectedDate}
                onChange={handleDateChange}
                sx={{ width: '100%' }}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper sx={{ mb: 3 }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                  value={viewTab}
                  onChange={(_, newValue) => setViewTab(newValue)}
                  sx={{ px: 2 }}
                >
                  <Tab icon={<ViewDayIcon />} label="Timeline" />
                  <Tab icon={<ViewWeekIcon />} label="Analytics" />
                </Tabs>
              </Box>

              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                  {selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Typography>
                <IconButton onClick={handleFilterClick}>
                  <FilterListIcon />
                </IconButton>
              </Box>

              <TabPanel value={viewTab} index={0}>
                <TimelineView
                  tasks={getFilteredTasks()}
                  onTaskAction={handleTaskAction}
                />
              </TabPanel>

              <TabPanel value={viewTab} index={1}>
                <ScheduleAnalytics
                  tasks={tasks}
                  selectedDate={selectedDate}
                />
              </TabPanel>
            </Paper>
          </Grid>
        </Grid>

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {editingTask ? 'Edit Task' : 'Create New Task'}
          </DialogTitle>
          <DialogContent>
            <TaskForm
              task={editingTask || { date: selectedDate }}
              onSubmit={handleSaveTask}
              onCancel={handleCloseDialog}
            />
          </DialogContent>
        </Dialog>

        <Menu
          anchorEl={filterAnchor}
          open={Boolean(filterAnchor)}
          onClose={handleFilterClose}
        >
          <MenuItem disabled>
            <Typography variant="subtitle2">Task Types</Typography>
          </MenuItem>
          {['class', 'work', 'study', 'other'].map(type => (
            <MenuItem
              key={type}
              onClick={() => handleFilterToggle(type)}
              sx={{ color: activeFilters.includes(type) ? 'primary.main' : 'inherit' }}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </MenuItem>
          ))}
          <MenuItem disabled>
            <Typography variant="subtitle2">Priority</Typography>
          </MenuItem>
          {['high', 'medium', 'low'].map(priority => (
            <MenuItem
              key={priority}
              onClick={() => handleFilterToggle(priority)}
              sx={{ color: activeFilters.includes(priority) ? 'primary.main' : 'inherit' }}
            >
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </MenuItem>
          ))}
        </Menu>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default Schedule;