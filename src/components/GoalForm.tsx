import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Grid,
  Chip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

interface GoalFormProps {
  onAddGoal: (goal: any) => void;
}

const categories = [
  'Academic',
  'Career',
  'Personal Development',
  'Health & Fitness',
  'Skills',
  'Project',
];

const priorities = [
  { value: 'high', label: 'High', color: 'error' },
  { value: 'medium', label: 'Medium', color: 'warning' },
  { value: 'low', label: 'Low', color: 'success' },
];

const GoalForm: React.FC<GoalFormProps> = ({ onAddGoal }) => {
  const [goal, setGoal] = useState({
    title: '',
    description: '',
    deadline: null,
    category: '',
    priority: '',
    milestones: [''],
  });

  const handleAddMilestone = () => {
    setGoal(prev => ({
      ...prev,
      milestones: [...prev.milestones, ''],
    }));
  };

  const handleMilestoneChange = (index: number, value: string) => {
    const newMilestones = [...goal.milestones];
    newMilestones[index] = value;
    setGoal(prev => ({
      ...prev,
      milestones: newMilestones,
    }));
  };

  const handleRemoveMilestone = (index: number) => {
    setGoal(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    if (goal.title && goal.deadline) {
      onAddGoal({
        ...goal,
        id: Date.now(),
        completed: false,
        progress: 0,
        createdAt: new Date().toISOString(),
      });
      setGoal({
        title: '',
        description: '',
        deadline: null,
        category: '',
        priority: '',
        milestones: [''],
      });
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Create New Goal
      </Typography>
      <Box component="form" sx={{ '& > *': { mb: 2 } }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Goal Title"
              value={goal.title}
              onChange={(e) => setGoal({ ...goal, title: e.target.value })}
              placeholder="What do you want to achieve?"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Category"
              value={goal.category}
              onChange={(e) => setGoal({ ...goal, category: e.target.value })}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Priority"
              value={goal.priority}
              onChange={(e) => setGoal({ ...goal, priority: e.target.value })}
            >
              {priorities.map((priority) => (
                <MenuItem key={priority.value} value={priority.value}>
                  <Chip
                    label={priority.label}
                    color={priority.color as any}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={goal.description}
              onChange={(e) => setGoal({ ...goal, description: e.target.value })}
              placeholder="Describe your goal and why it's important..."
            />
          </Grid>

          <Grid item xs={12}>
            <DatePicker
              label="Deadline"
              value={goal.deadline}
              onChange={(date) => setGoal({ ...goal, deadline: date })}
              sx={{ width: '100%' }}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Milestones
            </Typography>
            {goal.milestones.map((milestone, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  value={milestone}
                  onChange={(e) => handleMilestoneChange(index, e.target.value)}
                  placeholder={`Milestone ${index + 1}`}
                />
                <Button
                  color="error"
                  onClick={() => handleRemoveMilestone(index)}
                  disabled={goal.milestones.length === 1}
                >
                  Remove
                </Button>
              </Box>
            ))}
            <Button onClick={handleAddMilestone}>Add Milestone</Button>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSubmit}
              disabled={!goal.title || !goal.deadline}
            >
              Create Goal
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default GoalForm;
