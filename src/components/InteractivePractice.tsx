import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Chip,
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Help as HelpIcon,
  EmojiObjects as InsightIcon,
  Timeline as ProgressIcon,
} from '@mui/icons-material';

interface Question {
  id: number;
  text: string;
  type: 'multiple-choice' | 'open-ended' | 'true-false';
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  subtopics: string[];
}

interface PracticeSession {
  id: number;
  topic: string;
  questions: Question[];
  currentQuestionIndex: number;
  answers: { [key: number]: string };
  startTime: Date;
  endTime?: Date;
}

interface InteractivePracticeProps {
  subject: string;
  onAskTutor: (question: string) => void;
}

const InteractivePractice: React.FC<InteractivePracticeProps> = ({
  subject,
  onAskTutor,
}) => {
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  const sampleQuestions: Question[] = [
    {
      id: 1,
      text: "What is the primary purpose of the Fourth Amendment?",
      type: "multiple-choice",
      options: [
        "To protect against unreasonable searches and seizures",
        "To ensure the right to bear arms",
        "To protect freedom of speech",
        "To guarantee a speedy trial"
      ],
      correctAnswer: "To protect against unreasonable searches and seizures",
      explanation: "The Fourth Amendment protects citizens from unreasonable searches and seizures by the government, requiring probable cause and warrants for most searches.",
      difficulty: "medium",
      topic: "Constitutional Law",
      subtopics: ["Fourth Amendment", "Search and Seizure", "Privacy Rights"]
    },
    {
      id: 2,
      text: "What constitutes 'probable cause'?",
      type: "open-ended",
      correctAnswer: "Probable cause exists when there are reasonably trustworthy facts and circumstances that would lead a reasonable person to believe that a crime has been, is being, or will be committed.",
      explanation: "Probable cause is a fundamental requirement for warrants and arrests, based on specific facts rather than mere suspicion.",
      difficulty: "hard",
      topic: "Criminal Procedure",
      subtopics: ["Probable Cause", "Warrants", "Police Powers"]
    },
    // Add more sample questions as needed
  ];

  const startNewSession = () => {
    const newSession: PracticeSession = {
      id: Date.now(),
      topic: subject,
      questions: sampleQuestions,
      currentQuestionIndex: 0,
      answers: {},
      startTime: new Date(),
    };
    setSession(newSession);
    setAnswer('');
    setFeedback(null);
  };

  const getCurrentQuestion = (): Question | null => {
    if (!session) return null;
    return session.questions[session.currentQuestionIndex];
  };

  const handleAnswer = () => {
    if (!session || !getCurrentQuestion()) return;

    const currentQuestion = getCurrentQuestion()!;
    const isCorrect = answer.toLowerCase() === currentQuestion.correctAnswer.toLowerCase();

    setSession({
      ...session,
      answers: {
        ...session.answers,
        [currentQuestion.id]: answer,
      },
    });

    setFeedback({
      type: isCorrect ? 'success' : 'error',
      message: isCorrect
        ? 'Correct! Well done!'
        : 'Not quite right. Would you like to review this concept?',
    });

    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (!session) return;

    if (session.currentQuestionIndex < session.questions.length - 1) {
      setSession({
        ...session,
        currentQuestionIndex: session.currentQuestionIndex + 1,
      });
      setAnswer('');
      setFeedback(null);
      setShowExplanation(false);
    } else {
      setSession({
        ...session,
        endTime: new Date(),
      });
      setShowProgress(true);
    }
  };

  const calculateProgress = () => {
    if (!session) return { correct: 0, total: 0, percentage: 0 };

    const correct = Object.entries(session.answers).filter(
      ([id, answer]) =>
        answer.toLowerCase() ===
        session.questions.find((q) => q.id === Number(id))?.correctAnswer.toLowerCase()
    ).length;

    return {
      correct,
      total: session.questions.length,
      percentage: (correct / session.questions.length) * 100,
    };
  };

  return (
    <Box>
      {!session ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Interactive Practice Session
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Test your knowledge with personalized questions and get instant feedback
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={startNewSession}
            startIcon={<RefreshIcon />}
          >
            Start Practice Session
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Question {session.currentQuestionIndex + 1} of {session.questions.length}
                </Typography>
                <Box>
                  {getCurrentQuestion()?.subtopics.map((subtopic) => (
                    <Chip
                      key={subtopic}
                      label={subtopic}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                  ))}
                  <Chip
                    label={getCurrentQuestion()?.difficulty}
                    color={
                      getCurrentQuestion()?.difficulty === 'easy'
                        ? 'success'
                        : getCurrentQuestion()?.difficulty === 'medium'
                        ? 'warning'
                        : 'error'
                    }
                    size="small"
                  />
                </Box>
              </Box>
              
              <Typography variant="body1" gutterBottom>
                {getCurrentQuestion()?.text}
              </Typography>

              {getCurrentQuestion()?.type === 'multiple-choice' ? (
                <FormControl component="fieldset" sx={{ mt: 2 }}>
                  <RadioGroup
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                  >
                    {getCurrentQuestion()?.options?.map((option) => (
                      <FormControlLabel
                        key={option}
                        value={option}
                        control={<Radio />}
                        label={option}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              ) : (
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  sx={{ mt: 2 }}
                />
              )}

              {feedback && (
                <Alert
                  severity={feedback.type}
                  sx={{ mt: 2 }}
                  action={
                    feedback.type === 'error' && (
                      <Button
                        color="inherit"
                        size="small"
                        onClick={() =>
                          onAskTutor(
                            `Can you explain more about ${getCurrentQuestion()?.topic}?`
                          )
                        }
                      >
                        Ask Tutor
                      </Button>
                    )
                  }
                >
                  {feedback.message}
                </Alert>
              )}

              {showExplanation && (
                <Paper sx={{ p: 2, mt: 2, bgcolor: 'action.hover' }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Explanation:
                  </Typography>
                  <Typography variant="body2">
                    {getCurrentQuestion()?.explanation}
                  </Typography>
                </Paper>
              )}

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="contained"
                  onClick={handleAnswer}
                  disabled={!answer || showExplanation}
                >
                  Submit Answer
                </Button>
                {showExplanation && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNextQuestion}
                  >
                    Next Question
                  </Button>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      <Dialog
        open={showProgress}
        onClose={() => setShowProgress(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Practice Session Complete!</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <CircularProgress
              variant="determinate"
              value={calculateProgress().percentage}
              size={120}
              thickness={4}
              sx={{ mb: 2 }}
            />
            <Typography variant="h6" gutterBottom>
              Score: {calculateProgress().correct} / {calculateProgress().total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Keep practicing to improve your understanding!
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowProgress(false)}>Close</Button>
          <Button
            variant="contained"
            onClick={() => {
              setShowProgress(false);
              startNewSession();
            }}
          >
            Start New Session
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InteractivePractice;
