import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
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
}

interface TimelineViewProps {
  tasks: Task[];
  onTaskAction: (task: Task, action: 'edit' | 'delete' | 'complete') => void;
}

const TimelineView: React.FC<TimelineViewProps> = ({ tasks, onTaskAction }) => {
  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'class':
        return <SchoolIcon />;
      case 'work':
        return <WorkIcon />;
      case 'study':
        return <BookIcon />;
      default:
        return <MoreHorizIcon />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.time && b.time) {
      return a.time.localeCompare(b.time);
    }
    return 0;
  });

  return (
    <Box sx={{ position: 'relative', pl: 4 }}>
      {/* Timeline line */}
      <Box
        sx={{
          position: 'absolute',
          left: 16,
          top: 0,
          bottom: 0,
          width: 2,
          bgcolor: 'divider',
          zIndex: 0,
        }}
      />

      {sortedTasks.map((task, index) => (
        <Box
          key={task.id}
          sx={{
            position: 'relative',
            mb: 3,
            '&:last-child': { mb: 0 },
          }}
        >
          {/* Timeline dot */}
          <Box
            sx={{
              position: 'absolute',
              left: -12,
              top: 16,
              width: 24,
              height: 24,
              borderRadius: '50%',
              bgcolor: 'background.paper',
              border: 2,
              borderColor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
            }}
          >
            {getTaskIcon(task.type)}
          </Box>

          <Paper
            sx={{
              p: 2,
              ml: 2,
              borderLeft: 3,
              borderColor: `${getPriorityColor(task.priority)}.main`,
              bgcolor: task.completed ? 'action.hover' : 'background.paper',
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateX(8px)',
                boxShadow: 3,
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {task.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {task.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {task.time && (
                    <Chip
                      size="small"
                      icon={<AccessTimeIcon />}
                      label={task.time}
                      variant="outlined"
                    />
                  )}
                  <Chip
                    size="small"
                    icon={getTaskIcon(task.type)}
                    label={task.type}
                    variant="outlined"
                  />
                  <Chip
                    size="small"
                    icon={<FlagIcon />}
                    label={task.priority}
                    color={getPriorityColor(task.priority)}
                  />
                </Box>
              </Box>

              <Box>
                <Tooltip title="Edit">
                  <IconButton
                    size="small"
                    onClick={() => onTaskAction(task, 'edit')}
                    sx={{ mr: 1 }}
                  >
                    <MoreHorizIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Paper>
        </Box>
      ))}
    </Box>
  );
};

export default TimelineView;
