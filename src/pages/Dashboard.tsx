import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from '@mui/material';
import {
  Timer as TimerIcon,
  Assignment as TaskIcon,
  Flag as GoalIcon,
  Description as DocIcon,
  Add as AddIcon,
  Check as CheckIcon,
  Psychology as AIIcon,
  School as StudyIcon,
  FormatQuote as QuoteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { openAIService } from '../services/openai';
import { quotesService } from '../services/quotes';
import { commonStyles } from '../styles/common';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  subtasks?: string[];
  aiSuggestions?: string[];
}

interface StudyPlan {
  id: string;
  topic: string;
  duration: string;
  plan: string;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);
  const [showAddStudyPlanDialog, setShowAddStudyPlanDialog] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', dueDate: '' });
  const [newStudyPlan, setNewStudyPlan] = useState({ topic: '', duration: '' });
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState(quotesService.getDailyQuote());

  const handleRefreshQuote = () => {
    setQuote(quotesService.getRandomQuote());
  };

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    const savedStudyPlans = localStorage.getItem('studyPlans');
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedStudyPlans) setStudyPlans(JSON.parse(savedStudyPlans));
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('studyPlans', JSON.stringify(studyPlans));
  }, [tasks, studyPlans]);

  const handleAddTask = async () => {
    if (!newTask.title) return;

    setLoading(true);
    try {
      const breakdown = await openAIService.generateTaskBreakdown(newTask.title);

      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title,
        completed: false,
        dueDate: newTask.dueDate,
        subtasks: breakdown
          ? breakdown
              .split('\n')
              .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'))
              .map(subtask => subtask.replace(/^[-•]\s+/, '').trim())
          : [],
        aiSuggestions: [breakdown],
      };

      setTasks(prev => [...prev, task]);
      setNewTask({ title: '', dueDate: '' });
      setShowAddTaskDialog(false);
    } catch (error) {
      console.error('Error getting task breakdown:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudyPlan = async () => {
    if (!newStudyPlan.topic || !newStudyPlan.duration) return;

    setLoading(true);
    try {
      const plan = await openAIService.generateStudyPlan(
        newStudyPlan.topic,
        newStudyPlan.duration
      );

      const studyPlan: StudyPlan = {
        id: Date.now().toString(),
        topic: newStudyPlan.topic,
        duration: newStudyPlan.duration,
        plan,
        createdAt: new Date().toISOString(),
      };

      setStudyPlans(prev => [...prev, studyPlan]);
      setNewStudyPlan({ topic: '', duration: '' });
      setShowAddStudyPlanDialog(false);
    } catch (error) {
      console.error('Error generating study plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const getMetrics = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalStudyPlans = studyPlans.length;
    const activeStudyPlans = studyPlans.filter(plan =>
      new Date(plan.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;

    return { totalTasks, completedTasks, totalStudyPlans, activeStudyPlans };
  };

  const metrics = getMetrics();

  return (
    <Box sx={commonStyles.pageContainer}>
      <Typography variant="h4" sx={commonStyles.pageTitle}>
        Dashboard
      </Typography>

      {/* Quote Section */}
      <Card sx={commonStyles.gradientCard}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <QuoteIcon sx={{ fontSize: 40, color: 'white', opacity: 0.9, mr: 2 }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ color: 'white', mb: 1, fontStyle: 'italic' }}>
                "{quote.text}"
              </Typography>
              <Typography variant="subtitle1" sx={{ color: 'white', opacity: 0.9 }}>
                — {quote.author}
              </Typography>
            </Box>
            <IconButton onClick={handleRefreshQuote} sx={commonStyles.iconButton}>
              <RefreshIcon />
            </IconButton>
          </Box>
        </CardContent>
      </Card>

      <Grid container sx={commonStyles.gridContainer}>
        {/* Metrics Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={commonStyles.standardCard}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TaskIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Tasks</Typography>
              </Box>
              <Typography variant="h4" sx={{ mb: 1 }}>
                {metrics.completedTasks}/{metrics.totalTasks}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tasks Completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={commonStyles.standardCard}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <StudyIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Study Plans</Typography>
              </Box>
              <Typography variant="h4" sx={{ mb: 1 }}>
                {metrics.activeStudyPlans}/{metrics.totalStudyPlans}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Study Plans
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Tasks Section */}
        <Grid item xs={12} md={6}>
          <Card sx={commonStyles.standardCard}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={commonStyles.sectionTitle}>
                  Recent Tasks
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setShowAddTaskDialog(true)}
                  sx={commonStyles.primaryButton}
                >
                  Add Task
                </Button>
              </Box>
              <List sx={commonStyles.list}>
                {tasks.slice(0, 5).map((task) => (
                  <ListItem key={task.id}>
                    <ListItemIcon>
                      <IconButton
                        edge="start"
                        onClick={() => handleToggleTask(task.id)}
                        sx={{ color: task.completed ? 'success.main' : 'action.disabled' }}
                      >
                        <CheckIcon />
                      </IconButton>
                    </ListItemIcon>
                    <ListItemText
                      primary={task.title}
                      secondary={task.dueDate}
                      sx={{
                        textDecoration: task.completed ? 'line-through' : 'none',
                        color: task.completed ? 'text.secondary' : 'text.primary',
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Study Plans Section */}
        <Grid item xs={12} md={6}>
          <Card sx={commonStyles.standardCard}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={commonStyles.sectionTitle}>
                  Study Plans
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setShowAddStudyPlanDialog(true)}
                  sx={commonStyles.primaryButton}
                >
                  New Plan
                </Button>
              </Box>
              <List sx={commonStyles.list}>
                {studyPlans.slice(0, 5).map((plan) => (
                  <ListItem key={plan.id}>
                    <ListItemIcon>
                      <StudyIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={plan.topic}
                      secondary={`Duration: ${plan.duration}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Task Dialog */}
      <Dialog
        open={showAddTaskDialog}
        onClose={() => setShowAddTaskDialog(false)}
        sx={commonStyles.dialog}
      >
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Task Title"
            fullWidth
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            sx={commonStyles.textField}
          />
          <TextField
            margin="dense"
            label="Due Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newTask.dueDate}
            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            sx={commonStyles.textField}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddTaskDialog(false)}>Cancel</Button>
          <Button
            onClick={handleAddTask}
            variant="contained"
            sx={commonStyles.primaryButton}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Add Task'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Study Plan Dialog */}
      <Dialog
        open={showAddStudyPlanDialog}
        onClose={() => setShowAddStudyPlanDialog(false)}
        sx={commonStyles.dialog}
      >
        <DialogTitle>Create Study Plan</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Topic"
            fullWidth
            value={newStudyPlan.topic}
            onChange={(e) => setNewStudyPlan({ ...newStudyPlan, topic: e.target.value })}
            sx={commonStyles.textField}
          />
          <TextField
            margin="dense"
            label="Duration"
            fullWidth
            value={newStudyPlan.duration}
            onChange={(e) => setNewStudyPlan({ ...newStudyPlan, duration: e.target.value })}
            sx={commonStyles.textField}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddStudyPlanDialog(false)}>Cancel</Button>
          <Button
            onClick={handleAddStudyPlan}
            variant="contained"
            sx={commonStyles.primaryButton}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Create Plan'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;