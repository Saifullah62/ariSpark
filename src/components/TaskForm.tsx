import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Chip,
  Typography,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';
import {
  School as SchoolIcon,
  Work as WorkIcon,
  Book as BookIcon,
  MoreHoriz as MoreHorizIcon,
  Flag as FlagIcon,
} from '@mui/icons-material';

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

interface TaskFormProps {
  task: Partial<Task>;
  onSubmit: (task: Partial<Task>) => void;
  onCancel: () => void;
}

const taskTypes = [
  { value: 'class', label: 'Class', icon: <SchoolIcon /> },
  { value: 'work', label: 'Work', icon: <WorkIcon /> },
  { value: 'study', label: 'Study', icon: <BookIcon /> },
  { value: 'other', label: 'Other', icon: <MoreHorizIcon /> },
];

const priorities = [
  { value: 'high', label: 'High', color: 'error' },
  { value: 'medium', label: 'Medium', color: 'warning' },
  { value: 'low', label: 'Low', color: 'success' },
];

const recurringOptions = [
  { value: 'none', label: 'No Repeat' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel }) => {
  const [formData, setFormData] = React.useState<Partial<Task>>(task);

  const handleChange = (field: keyof Task, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ '& > *': { mb: 2 } }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Title"
            value={formData.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={formData.type || 'other'}
              onChange={(e) => handleChange('type', e.target.value)}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {taskTypes.find(t => t.value === selected)?.icon}
                  <Typography sx={{ ml: 1 }}>
                    {taskTypes.find(t => t.value === selected)?.label}
                  </Typography>
                </Box>
              )}
            >
              {taskTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {type.icon}
                    <Typography sx={{ ml: 1 }}>{type.label}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              value={formData.priority || 'medium'}
              onChange={(e) => handleChange('priority', e.target.value)}
              renderValue={(selected) => {
                const priority = priorities.find(p => p.value === selected);
                return (
                  <Chip
                    icon={<FlagIcon />}
                    label={priority?.label}
                    color={priority?.color as any}
                    size="small"
                  />
                );
              }}
            >
              {priorities.map((priority) => (
                <MenuItem key={priority.value} value={priority.value}>
                  <Chip
                    icon={<FlagIcon />}
                    label={priority.label}
                    color={priority.color as any}
                    size="small"
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            value={formData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TimePicker
            label="Time"
            value={formData.time ? new Date(`2000-01-01T${formData.time}`) : null}
            onChange={(newValue) => {
              if (newValue) {
                const timeString = newValue.toLocaleTimeString('en-US', {
                  hour12: false,
                  hour: '2-digit',
                  minute: '2-digit',
                });
                handleChange('time', timeString);
              }
            }}
            sx={{ width: '100%' }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Recurring</InputLabel>
            <Select
              value={formData.recurring || 'none'}
              onChange={(e) => handleChange('recurring', e.target.value)}
            >
              {recurringOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Location"
            value={formData.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Notes"
            value={formData.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.reminder || false}
                onChange={(e) => handleChange('reminder', e.target.checked)}
              />
            }
            label="Set Reminder"
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="contained" type="submit">
              {task.id ? 'Update Task' : 'Create Task'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TaskForm;
