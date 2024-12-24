import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Badge,
  Tooltip,
  Chip,
  Button,
  Snackbar,
  Alert,
  Avatar,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Stars as StarsIcon,
  Timeline as ProgressIcon,
  Lock as LockIcon,
  LockOpen as UnlockIcon,
  Celebration as CelebrationIcon,
  School as SchoolIcon,
  LocalFireDepartment as StreakIcon,
  Psychology as BrainIcon,
  WorkspacePremium as PremiumIcon,
  Groups as CollaborationIcon,
  Lightbulb as InsightIcon,
  Timer as TimeIcon,
  EmojiObjects as DiscoveryIcon,
  Explore as ExplorerIcon,
  Diversity3 as MentorIcon,
  AutoGraph as ProgressiveIcon,
  Diamond as EliteIcon,
  Whatshot as HotStreakIcon,
  Science as ResearchIcon,
} from '@mui/icons-material';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  category: 'study' | 'practice' | 'streak' | 'mastery' | 'social' | 'discovery' | 'mentor' | 'research' | 'challenge' | 'elite';
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  reward?: {
    type: 'badge' | 'title' | 'theme' | 'feature' | 'powerup' | 'mentor' | 'custom_avatar' | 'study_boost' | 'achievement_points' | 'special_access';
    value: string;
    description?: string;
  };
  dateUnlocked?: Date;
}

interface AchievementSystemProps {
  onAchievementUnlocked: (achievement: Achievement) => void;
}

const AchievementSystem: React.FC<AchievementSystemProps> = ({
  onAchievementUnlocked,
}) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [showUnlockDialog, setShowUnlockDialog] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [stats, setStats] = useState({
    totalUnlocked: 0,
    rareUnlocked: 0,
    currentStreak: 0,
    totalPoints: 0,
  });

  useEffect(() => {
    const initialAchievements: Achievement[] = [
      {
        id: '1',
        title: 'First Steps',
        description: 'Complete your first study session',
        icon: <SchoolIcon color="primary" />,
        progress: 0,
        maxProgress: 1,
        unlocked: false,
        category: 'study',
        rarity: 'common',
        reward: {
          type: 'badge',
          value: 'Beginner Scholar',
          description: 'Display this badge on your profile',
        },
      },
      {
        id: '2',
        title: 'Knowledge Seeker',
        description: 'Study for 10 hours total',
        icon: <BrainIcon color="primary" />,
        progress: 0,
        maxProgress: 10,
        unlocked: false,
        category: 'study',
        rarity: 'rare',
        reward: {
          type: 'title',
          value: 'Knowledge Seeker',
          description: 'A prestigious title for dedicated learners',
        },
      },
      {
        id: '3',
        title: 'Perfect Streak',
        description: 'Maintain a 7-day study streak',
        icon: <StreakIcon color="error" />,
        progress: 0,
        maxProgress: 7,
        unlocked: false,
        category: 'streak',
        rarity: 'epic',
        reward: {
          type: 'powerup',
          value: '2x_points_boost',
          description: 'Earn double achievement points for 24 hours',
        },
      },
      {
        id: '4',
        title: 'Master Mind',
        description: 'Achieve 100% mastery in any topic',
        icon: <PremiumIcon color="secondary" />,
        progress: 0,
        maxProgress: 100,
        unlocked: false,
        category: 'mastery',
        rarity: 'legendary',
        reward: {
          type: 'custom_avatar',
          value: 'master_frame',
          description: 'Exclusive profile frame for masters',
        },
      },
      {
        id: '5',
        title: 'Helpful Hand',
        description: 'Help 5 other students with their studies',
        icon: <CollaborationIcon color="primary" />,
        progress: 0,
        maxProgress: 5,
        unlocked: false,
        category: 'social',
        rarity: 'rare',
        reward: {
          type: 'title',
          value: 'Community Mentor',
          description: 'Recognition for helping others',
        },
      },
      {
        id: '6',
        title: 'Explorer',
        description: 'Study topics from 5 different subjects',
        icon: <ExplorerIcon color="primary" />,
        progress: 0,
        maxProgress: 5,
        unlocked: false,
        category: 'discovery',
        rarity: 'rare',
        reward: {
          type: 'study_boost',
          value: 'cross_subject_bonus',
          description: 'Bonus points for studying multiple subjects',
        },
      },
      {
        id: '7',
        title: 'Master Teacher',
        description: 'Create and share 10 study guides',
        icon: <MentorIcon color="secondary" />,
        progress: 0,
        maxProgress: 10,
        unlocked: false,
        category: 'mentor',
        rarity: 'epic',
        reward: {
          type: 'special_access',
          value: 'mentor_tools',
          description: 'Access to advanced teaching tools',
        },
      },
      {
        id: '8',
        title: 'Deep Diver',
        description: 'Complete 20 in-depth research sessions',
        icon: <ResearchIcon color="primary" />,
        progress: 0,
        maxProgress: 20,
        unlocked: false,
        category: 'research',
        rarity: 'epic',
        reward: {
          type: 'feature',
          value: 'advanced_analytics',
          description: 'Access to detailed learning analytics',
        },
      },
      {
        id: '9',
        title: 'Challenge Champion',
        description: 'Complete 50 difficult practice problems',
        icon: <ProgressiveIcon color="error" />,
        progress: 0,
        maxProgress: 50,
        unlocked: false,
        category: 'challenge',
        rarity: 'legendary',
        reward: {
          type: 'badge',
          value: 'problem_solver',
          description: 'Elite problem solver badge',
        },
      },
      {
        id: '10',
        title: 'Elite Scholar',
        description: 'Unlock 50 achievements',
        icon: <EliteIcon color="secondary" />,
        progress: 0,
        maxProgress: 50,
        unlocked: false,
        category: 'elite',
        rarity: 'mythic',
        reward: {
          type: 'special_access',
          value: 'elite_features',
          description: 'Access to exclusive elite features',
        },
      },
      {
        id: '11',
        title: 'Hot Streak',
        description: 'Study for 30 days consecutively',
        icon: <HotStreakIcon color="error" />,
        progress: 0,
        maxProgress: 30,
        unlocked: false,
        category: 'streak',
        rarity: 'mythic',
        reward: {
          type: 'powerup',
          value: 'permanent_boost',
          description: 'Permanent 1.5x achievement points',
        },
      },
      {
        id: '12',
        title: 'Eureka Moment',
        description: 'Make 100 flashcards',
        icon: <InsightIcon color="primary" />,
        progress: 0,
        maxProgress: 100,
        unlocked: false,
        category: 'discovery',
        rarity: 'epic',
        reward: {
          type: 'feature',
          value: 'ai_flashcards',
          description: 'AI-powered flashcard generation',
        },
      },
      {
        id: '13',
        title: 'Time Master',
        description: 'Complete study sessions in optimal time windows',
        icon: <TimeIcon color="primary" />,
        progress: 0,
        maxProgress: 20,
        unlocked: false,
        category: 'study',
        rarity: 'legendary',
        reward: {
          type: 'study_boost',
          value: 'time_optimizer',
          description: 'AI-powered study time recommendations',
        },
      },
      {
        id: '14',
        title: 'Pioneer',
        description: 'Be among the first to try new features',
        icon: <DiscoveryIcon color="secondary" />,
        progress: 0,
        maxProgress: 5,
        unlocked: false,
        category: 'discovery',
        rarity: 'mythic',
        reward: {
          type: 'special_access',
          value: 'beta_features',
          description: 'Early access to new features',
        },
      },
    ];

    setAchievements(initialAchievements);
  }, []);

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common':
        return '#78909c';
      case 'rare':
        return '#2196f3';
      case 'epic':
        return '#9c27b0';
      case 'legendary':
        return '#ffc107';
      case 'mythic':
        return '#ff69b4';
      default:
        return '#78909c';
    }
  };

  const handleProgressUpdate = (achievementId: string, newProgress: number) => {
    setAchievements(prevAchievements =>
      prevAchievements.map(achievement => {
        if (achievement.id === achievementId) {
          const updatedProgress = Math.min(newProgress, achievement.maxProgress);
          const wasUnlocked = achievement.unlocked;
          const isNowUnlocked = updatedProgress >= achievement.maxProgress;

          if (isNowUnlocked && !wasUnlocked) {
            setSelectedAchievement(achievement);
            setShowUnlockDialog(true);
            onAchievementUnlocked(achievement);
          }

          return {
            ...achievement,
            progress: updatedProgress,
            unlocked: isNowUnlocked,
            dateUnlocked: isNowUnlocked && !wasUnlocked ? new Date() : achievement.dateUnlocked,
          };
        }
        return achievement;
      })
    );
  };

  const renderAchievementCard = (achievement: Achievement) => (
    <Card
      sx={{
        position: 'relative',
        opacity: achievement.unlocked ? 1 : 0.7,
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: getRarityColor(achievement.rarity),
              mr: 2,
            }}
          >
            {achievement.icon}
          </Avatar>
          <Box>
            <Typography variant="h6" gutterBottom>
              {achievement.title}
            </Typography>
            <Chip
              label={achievement.rarity.toUpperCase()}
              size="small"
              sx={{
                bgcolor: getRarityColor(achievement.rarity),
                color: 'white',
              }}
            />
          </Box>
          {achievement.unlocked ? (
            <UnlockIcon
              color="success"
              sx={{ position: 'absolute', right: 16, top: 16 }}
            />
          ) : (
            <LockIcon
              color="action"
              sx={{ position: 'absolute', right: 16, top: 16 }}
            />
          )}
        </Box>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          {achievement.description}
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              Progress: {achievement.progress}/{achievement.maxProgress}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {Math.round((achievement.progress / achievement.maxProgress) * 100)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={(achievement.progress / achievement.maxProgress) * 100}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: 'action.hover',
              '& .MuiLinearProgress-bar': {
                bgcolor: getRarityColor(achievement.rarity),
              },
            }}
          />
        </Box>

        {achievement.reward && (
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
            <StarsIcon sx={{ mr: 1, color: getRarityColor(achievement.rarity) }} />
            <Typography variant="body2" color="text.secondary">
              Reward: {achievement.reward.value}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">Achievements</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title="Total Achievements">
              <Chip
                icon={<TrophyIcon />}
                label={`${stats.totalUnlocked}/${achievements.length}`}
                color="primary"
              />
            </Tooltip>
            <Tooltip title="Current Streak">
              <Chip
                icon={<StreakIcon />}
                label={`${stats.currentStreak} days`}
                color="error"
              />
            </Tooltip>
            <Tooltip title="Achievement Points">
              <Chip
                icon={<StarsIcon />}
                label={stats.totalPoints}
                color="secondary"
              />
            </Tooltip>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {achievements.map((achievement) => (
            <Grid item xs={12} sm={6} md={4} key={achievement.id}>
              {renderAchievementCard(achievement)}
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Dialog
        open={showUnlockDialog}
        onClose={() => setShowUnlockDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center' }}>
          <CelebrationIcon
            sx={{ fontSize: 60, color: selectedAchievement ? getRarityColor(selectedAchievement.rarity) : 'primary' }}
          />
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          {selectedAchievement && (
            <>
              <Typography variant="h5" gutterBottom>
                Achievement Unlocked!
              </Typography>
              <Typography variant="h6" color="primary" gutterBottom>
                {selectedAchievement.title}
              </Typography>
              <Typography variant="body1" paragraph>
                {selectedAchievement.description}
              </Typography>
              {selectedAchievement.reward && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Reward Earned
                  </Typography>
                  <Chip
                    icon={<StarsIcon />}
                    label={selectedAchievement.reward.value}
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowSnackbar(false)}
      >
        <Alert
          onClose={() => setShowSnackbar(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          New achievement unlocked!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AchievementSystem;
