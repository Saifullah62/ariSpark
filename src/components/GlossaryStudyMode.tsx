import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Grid,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Alert,
  Tooltip,
} from '@mui/material';
import {
  School as StudyIcon,
  Timer as TimerIcon,
  CheckCircle as CorrectIcon,
  Cancel as WrongIcon,
  Refresh as ResetIcon,
  Save as SaveIcon,
  Share as ShareIcon,
  Psychology as AIIcon,
  Settings as SettingsIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from '@mui/icons-material';

interface StudyTerm {
  id: string;
  term: string;
  definition: string;
  examples: string[];
  difficulty: 'basic' | 'intermediate' | 'advanced';
  subject: string;
  category: string;
  lastReviewed?: Date;
  confidence: number;
  nextReview?: Date;
}

interface StudySession {
  id: string;
  date: Date;
  duration: number;
  termsStudied: number;
  correctAnswers: number;
  incorrectAnswers: number;
  terms: string[];
}

const GlossaryStudyMode: React.FC = () => {
  const [studyTerms, setStudyTerms] = useState<StudyTerm[]>([]);
  const [currentTerm, setCurrentTerm] = useState<StudyTerm | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    incorrect: 0,
    total: 0,
    timeSpent: 0,
  });
  const [studyMode, setStudyMode] = useState<'flashcard' | 'quiz' | 'writing'>('flashcard');
  const [showSettings, setShowSettings] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (timer) {
      return () => clearInterval(timer);
    }
  }, [timer]);

  const startStudySession = () => {
    // Initialize study session
    setTimer(setInterval(() => {
      setSessionStats(prev => ({
        ...prev,
        timeSpent: prev.timeSpent + 1,
      }));
    }, 1000));
  };

  const handleAnswer = (correct: boolean) => {
    setSessionStats(prev => ({
      ...prev,
      correct: correct ? prev.correct + 1 : prev.correct,
      incorrect: correct ? prev.incorrect : prev.incorrect + 1,
      total: prev.total + 1,
    }));
    setShowAnswer(false);
    nextTerm();
  };

  const nextTerm = () => {
    // Get next term based on spaced repetition algorithm
    const nextTerm = getNextTerm();
    setCurrentTerm(nextTerm);
    setUserAnswer('');
    setShowHint(false);
  };

  const getNextTerm = () => {
    // Implement spaced repetition logic
    return studyTerms[0]; // Placeholder
  };

  const renderFlashcard = () => (
    <Card
      sx={{
        maxWidth: 600,
        mx: 'auto',
        mt: 3,
        minHeight: 300,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        {currentTerm && (
          <>
            <Typography variant="h5" gutterBottom>
              {showAnswer ? 'Definition' : currentTerm.term}
            </Typography>
            {showAnswer ? (
              <>
                <Typography variant="body1" paragraph>
                  {currentTerm.definition}
                </Typography>
                {currentTerm.examples.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Examples:
                    </Typography>
                    {currentTerm.examples.map((example, index) => (
                      <Typography key={index} variant="body2" paragraph>
                        • {example}
                      </Typography>
                    ))}
                  </Box>
                )}
              </>
            ) : (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => setShowAnswer(true)}
                >
                  Show Answer
                </Button>
              </Box>
            )}
          </>
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: 'center', p: 2 }}>
        {showAnswer && (
          <>
            <Button
              variant="contained"
              color="success"
              startIcon={<CorrectIcon />}
              onClick={() => handleAnswer(true)}
            >
              Knew It
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<WrongIcon />}
              onClick={() => handleAnswer(false)}
            >
              Need Review
            </Button>
          </>
        )}
      </CardActions>
    </Card>
  );

  const renderQuizMode = () => (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 3 }}>
      {currentTerm && (
        <>
          <Typography variant="h5" gutterBottom>
            {currentTerm.term}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            placeholder="Type your answer..."
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setShowHint(true)}
            >
              Show Hint
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                // Check answer
                setShowAnswer(true);
              }}
            >
              Check Answer
            </Button>
          </Box>
          {showHint && (
            <Alert severity="info" sx={{ mb: 2 }}>
              First letter: {currentTerm.definition[0]}...
            </Alert>
          )}
        </>
      )}
    </Box>
  );

  const renderWritingMode = () => (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 3 }}>
      {currentTerm && (
        <>
          <Typography variant="h5" gutterBottom>
            Write a detailed explanation of: {currentTerm.term}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={8}
            variant="outlined"
            placeholder="Write your explanation here..."
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={() => setShowHint(true)}
            >
              View Guidelines
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                // Submit for AI review
                setShowAnswer(true);
              }}
            >
              Submit for Review
            </Button>
          </Box>
        </>
      )}
    </Box>
  );

  const renderProgress = () => (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Progress
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(sessionStats.total / studyTerms.length) * 100}
              sx={{ mb: 1 }}
            />
            <Typography variant="body2" color="textSecondary">
              {sessionStats.total} of {studyTerms.length} terms
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Accuracy
            </Typography>
            <Typography variant="h6">
              {sessionStats.total > 0
                ? Math.round((sessionStats.correct / sessionStats.total) * 100)
                : 0}%
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {sessionStats.correct} correct, {sessionStats.incorrect} incorrect
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Time
            </Typography>
            <Typography variant="h6">
              {Math.floor(sessionStats.timeSpent / 60)}:
              {(sessionStats.timeSpent % 60).toString().padStart(2, '0')}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Average: {sessionStats.total > 0
                ? Math.round(sessionStats.timeSpent / sessionStats.total)
                : 0} seconds per term
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );

  const renderSettings = () => (
    <Dialog
      open={showSettings}
      onClose={() => setShowSettings(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Study Settings</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Study Mode</InputLabel>
              <Select
                value={studyMode}
                onChange={(e) => setStudyMode(e.target.value as any)}
              >
                <MenuItem value="flashcard">Flashcards</MenuItem>
                <MenuItem value="quiz">Quiz</MenuItem>
                <MenuItem value="writing">Writing Practice</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Difficulty</InputLabel>
              <Select>
                <MenuItem value="all">All Levels</MenuItem>
                <MenuItem value="basic">Basic</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Order</InputLabel>
              <Select>
                <MenuItem value="spaced">Spaced Repetition</MenuItem>
                <MenuItem value="random">Random</MenuItem>
                <MenuItem value="alphabetical">Alphabetical</MenuItem>
                <MenuItem value="difficulty">By Difficulty</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowSettings(false)}>Cancel</Button>
        <Button variant="contained" color="primary">
          Apply Settings
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Study Mode</Typography>
        <Box>
          <IconButton onClick={() => setShowSettings(true)}>
            <SettingsIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<StudyIcon />}
            onClick={startStudySession}
          >
            Start Study Session
          </Button>
        </Box>
      </Box>

      {renderProgress()}

      {studyMode === 'flashcard' && renderFlashcard()}
      {studyMode === 'quiz' && renderQuizMode()}
      {studyMode === 'writing' && renderWritingMode()}

      {renderSettings()}
    </Box>
  );
};

export default GlossaryStudyMode;
