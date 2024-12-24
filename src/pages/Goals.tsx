import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  IconButton,
  LinearProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Collapse,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Flag as FlagIcon,
  CheckCircle as CompleteIcon,
  Timer as TimerIcon,
  TrendingUp as ProgressIcon,
  Star as StarIcon,
  ExpandLess,
  ExpandMore,
  Psychology as AIIcon,
} from '@mui/icons-material';
import { openAIService } from '../services/openai';

interface Goal {
  id: string;
  title: string;
  description: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  progress: number;
  category: string;
  milestones: Milestone[];
  completed: boolean;
  createdAt: string;
  aiSuggestions?: string[];
}

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

const categories = [
  'Academic',
  'Career',
  'Personal Development',
  'Health',
  'Skills',
  'Projects',
];

const commonStyles = {
  pageContainer: {
    p: 3,
  },
  pageTitle: {
    fontWeight: 600,
    background: 'linear-gradient(45deg, #FFD700, #FFA500)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
};

const Goals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showMilestoneDialog, setShowMilestoneDialog] = useState(false);
  const [expandedGoals, setExpandedGoals] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    priority: 'medium',
    progress: 0,
    milestones: [],
  });
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    dueDate: '',
  });

  useEffect(() => {
    const savedGoals = localStorage.getItem('goals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  const handleAddGoal = async () => {
    if (!newGoal.title || !newGoal.description) return;

    setLoading(true);
    try {
      // Get AI suggestions for milestones and improvements
      const suggestions = await openAIService.generateGoalSuggestions({
        title: newGoal.title,
        description: newGoal.description,
        category: newGoal.category || 'Personal Development',
      });

      const goal: Goal = {
        id: Date.now().toString(),
        title: newGoal.title,
        description: newGoal.description,
        deadline: newGoal.deadline || '',
        priority: newGoal.priority as 'high' | 'medium' | 'low',
        progress: 0,
        category: newGoal.category || 'Personal Development',
        milestones: suggestions
          ? suggestions
              .split('\n')
              .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'))
              .map(suggestion => ({
                id: Date.now().toString() + Math.random(),
                title: suggestion.replace(/^[-•]\s+/, '').trim(),
                completed: false,
              }))
          : [],
        completed: false,
        createdAt: new Date().toISOString(),
        aiSuggestions: [suggestions],
      };

      setGoals(prev => [...prev, goal]);
      setNewGoal({
        priority: 'medium',
        progress: 0,
        milestones: [],
      });
      setShowAddDialog(false);
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const handleToggleComplete = (id: string) => {
    setGoals(goals.map(goal =>
      goal.id === id
        ? { ...goal, completed: !goal.completed, progress: goal.completed ? goal.progress : 100 }
        : goal
    ));
  };

  const handleUpdateProgress = (id: string, newProgress: number) => {
    setGoals(goals.map(goal =>
      goal.id === id
        ? { ...goal, progress: Math.min(100, Math.max(0, newProgress)) }
        : goal
    ));
  };

  const handleAddMilestone = (goalId: string) => {
    if (!newMilestone.title) return;

    setGoals(goals.map(goal =>
      goal.id === goalId
        ? {
          ...goal,
          milestones: [
            ...goal.milestones,
            {
              id: Date.now().toString(),
              title: newMilestone.title,
              completed: false,
              dueDate: newMilestone.dueDate,
            },
          ],
        }
        : goal
    ));

    setNewMilestone({ title: '', dueDate: '' });
    setShowMilestoneDialog(false);
  };

  const handleToggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals(goals.map(goal =>
      goal.id === goalId
        ? {
          ...goal,
          milestones: goal.milestones.map(milestone =>
            milestone.id === milestoneId
              ? { ...milestone, completed: !milestone.completed }
              : milestone
          ),
        }
        : goal
    ));
  };

  const handleExpandGoal = (goalId: string) => {
    setExpandedGoals(prev =>
      prev.includes(goalId)
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'linear-gradient(45deg, #FFD700, #FFA500)',
      medium: 'linear-gradient(45deg, #FFE14D, #FFB533)',
      low: 'linear-gradient(45deg, #FFF4B5, #FFD27F)',
    };
    return colors[priority] || colors.medium;
  };

  const renderGoalCard = (goal: Goal) => (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {goal.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              label={goal.priority}
              size="small"
              sx={{
                background: getPriorityColor(goal.priority),
                color: '#000',
                fontWeight: 600,
              }}
            />
            <IconButton
              size="small"
              onClick={() => handleExpandGoal(goal.id)}
            >
              {expandedGoals.includes(goal.id) ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" paragraph>
          {goal.description}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Progress</Typography>
            <Typography variant="body2" color="primary">
              {goal.progress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={goal.progress}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: 'rgba(255, 215, 0, 0.1)',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(45deg, #FFD700, #FFA500)',
              },
            }}
          />
        </Box>

        <Collapse in={expandedGoals.includes(goal.id)}>
          <Typography variant="subtitle2" gutterBottom>
            Milestones
          </Typography>
          <List dense>
            {goal.milestones.map(milestone => (
              <ListItem key={milestone.id}>
                <ListItemIcon>
                  <IconButton
                    size="small"
                    onClick={() => handleToggleMilestone(goal.id, milestone.id)}
                  >
                    <CompleteIcon
                      sx={{
                        color: milestone.completed ? 'primary.main' : 'text.disabled',
                      }}
                    />
                  </IconButton>
                </ListItemIcon>
                <ListItemText
                  primary={milestone.title}
                  secondary={milestone.dueDate}
                  sx={{
                    '& .MuiListItemText-primary': {
                      textDecoration: milestone.completed ? 'line-through' : 'none',
                      color: milestone.completed ? 'text.disabled' : 'text.primary',
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>

          {goal.aiSuggestions && goal.aiSuggestions.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                AI Suggestions
              </Typography>
              <List dense>
                {goal.aiSuggestions.map((suggestion, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <AIIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={suggestion}
                      sx={{ color: 'text.secondary' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Collapse>
      </CardContent>

      <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => {
            setSelectedGoal(goal);
            setShowAddDialog(true);
          }}
          sx={{
            borderColor: 'primary.main',
            color: 'primary.main',
            '&:hover': {
              borderColor: 'primary.dark',
              background: 'rgba(255, 215, 0, 0.1)',
            },
          }}
        >
          Edit
        </Button>
        <Button
          variant="outlined"
          startIcon={goal.completed ? <StarIcon /> : <CompleteIcon />}
          onClick={() => handleToggleComplete(goal.id)}
          sx={{
            borderColor: goal.completed ? 'primary.main' : 'success.main',
            color: goal.completed ? 'primary.main' : 'success.main',
            '&:hover': {
              borderColor: goal.completed ? 'primary.dark' : 'success.dark',
              background: goal.completed
                ? 'rgba(255, 215, 0, 0.1)'
                : 'rgba(76, 175, 80, 0.1)',
            },
          }}
        >
          {goal.completed ? 'Completed' : 'Complete'}
        </Button>
        <IconButton
          color="error"
          onClick={() => handleDeleteGoal(goal.id)}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    </Card>
  );

  return (
    <Box sx={commonStyles.pageContainer}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Typography variant="h4" sx={commonStyles.pageTitle}>
          Goals
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedGoal(null);
            setShowAddDialog(true);
          }}
          sx={{
            background: 'linear-gradient(45deg, #FFD700, #FFA500)',
            '&:hover': {
              background: 'linear-gradient(45deg, #FFE14D, #FFB533)',
            },
          }}
        >
          Add Goal
        </Button>
      </Box>

      <Grid container spacing={3}>
        {goals.map(goal => (
          <Grid item xs={12} sm={6} md={4} key={goal.id}>
            {renderGoalCard(goal)}
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedGoal ? 'Edit Goal' : 'Add New Goal'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Title"
              variant="outlined"
              value={newGoal.title || ''}
              onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
            />
            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              multiline
              rows={3}
              value={newGoal.description || ''}
              onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Deadline"
                  type="date"
                  value={newGoal.deadline || ''}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    label="Priority"
                    value={newGoal.priority || 'medium'}
                    onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value })}
                  >
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    label="Category"
                    value={newGoal.category || ''}
                    onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                  >
                    {categories.map(category => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAddGoal}
            disabled={loading}
            sx={{
              background: 'linear-gradient(45deg, #FFD700, #FFA500)',
              '&:hover': {
                background: 'linear-gradient(45deg, #FFE14D, #FFB533)',
              },
            }}
          >
            {loading ? 'Processing...' : selectedGoal ? 'Save Changes' : 'Add Goal'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showMilestoneDialog}
        onClose={() => setShowMilestoneDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Milestone</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Title"
              variant="outlined"
              value={newMilestone.title}
              onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
            />
            <TextField
              fullWidth
              label="Due Date"
              type="date"
              value={newMilestone.dueDate}
              onChange={(e) => setNewMilestone({ ...newMilestone, dueDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowMilestoneDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => selectedGoal && handleAddMilestone(selectedGoal.id)}
            sx={{
              background: 'linear-gradient(45deg, #FFD700, #FFA500)',
              '&:hover': {
                background: 'linear-gradient(45deg, #FFE14D, #FFB533)',
              },
            }}
          >
            Add Milestone
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Goals;