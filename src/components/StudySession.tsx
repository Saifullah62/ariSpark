import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Timer as TimerIcon,
  CheckCircle as CheckCircleIcon,
  School as SchoolIcon,
  Lightbulb as LightbulbIcon,
  BookmarkBorder as BookmarkIcon,
  BookmarkAdded as BookmarkAddedIcon,
  Share as ShareIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material';

interface Concept {
  id: number;
  title: string;
  description: string;
  mastery: number;
  lastReviewed?: Date;
  notes: string[];
  examples: string[];
  relatedConcepts: string[];
}

interface StudySessionProps {
  subject: string;
  onAskTutor: (question: string) => void;
}

const StudySession: React.FC<StudySessionProps> = ({ subject, onAskTutor }) => {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);
  const [showConceptDialog, setShowConceptDialog] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [studyTimer, setStudyTimer] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const handleAddConcept = () => {
    const newConcept: Concept = {
      id: Date.now(),
      title: 'New Concept',
      description: '',
      mastery: 0,
      notes: [],
      examples: [],
      relatedConcepts: [],
    };
    setConcepts([...concepts, newConcept]);
    setSelectedConcept(newConcept);
    setShowConceptDialog(true);
  };

  const handleUpdateConcept = (updatedConcept: Concept) => {
    setConcepts(concepts.map(c => 
      c.id === updatedConcept.id ? updatedConcept : c
    ));
    setShowConceptDialog(false);
  };

  const handleAddNote = () => {
    if (selectedConcept && newNote.trim()) {
      const updatedConcept = {
        ...selectedConcept,
        notes: [...selectedConcept.notes, newNote.trim()],
        lastReviewed: new Date(),
      };
      handleUpdateConcept(updatedConcept);
      setNewNote('');
    }
  };

  const handleStartTimer = () => {
    setStudyTimer(25 * 60); // 25 minutes in seconds
    setIsTimerRunning(true);
  };

  const handleStopTimer = () => {
    setIsTimerRunning(false);
    setStudyTimer(null);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && studyTimer !== null && studyTimer > 0) {
      interval = setInterval(() => {
        setStudyTimer(prev => prev !== null ? prev - 1 : null);
      }, 1000);
    } else if (studyTimer === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, studyTimer]);

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Study Session: {subject}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Track your understanding and master key concepts
              </Typography>
            </Box>
            <Box>
              {studyTimer === null ? (
                <Button
                  startIcon={<TimerIcon />}
                  variant="outlined"
                  onClick={handleStartTimer}
                >
                  Start Study Timer
                </Button>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h6">
                    {formatTime(studyTimer)}
                  </Typography>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleStopTimer}
                  >
                    Stop
                  </Button>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            {concepts.map((concept) => (
              <Grid item xs={12} sm={6} key={concept.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography variant="h6" gutterBottom>
                        {concept.title}
                      </Typography>
                      <IconButton size="small">
                        <BookmarkIcon />
                      </IconButton>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {concept.description}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" gutterBottom>
                        Mastery Level
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={concept.mastery}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {concept.relatedConcepts.map((related, index) => (
                        <Chip
                          key={index}
                          label={related}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      startIcon={<PsychologyIcon />}
                      onClick={() => {
                        setSelectedConcept(concept);
                        setShowConceptDialog(true);
                      }}
                    >
                      Review
                    </Button>
                    <Button
                      size="small"
                      startIcon={<LightbulbIcon />}
                      onClick={() => onAskTutor(`Can you explain ${concept.title}?`)}
                    >
                      Ask Tutor
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
            <Grid item xs={12} sm={6}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'action.hover',
                  cursor: 'pointer',
                }}
                onClick={handleAddConcept}
              >
                <CardContent>
                  <Box sx={{ textAlign: 'center' }}>
                    <SchoolIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography>Add New Concept</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Study Progress
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" gutterBottom>
                Overall Mastery
              </Typography>
              <LinearProgress
                variant="determinate"
                value={
                  concepts.length
                    ? concepts.reduce((acc, c) => acc + c.mastery, 0) / concepts.length
                    : 0
                }
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
            <List>
              {concepts.map((concept) => (
                <ListItem key={concept.id}>
                  <ListItemIcon>
                    {concept.mastery >= 80 ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <BookmarkIcon color="action" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={concept.title}
                    secondary={`Last reviewed: ${
                      concept.lastReviewed
                        ? new Date(concept.lastReviewed).toLocaleDateString()
                        : 'Never'
                    }`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      <Dialog
        open={showConceptDialog}
        onClose={() => setShowConceptDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedConcept?.title || 'New Concept'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={selectedConcept?.title || ''}
                onChange={(e) =>
                  setSelectedConcept(prev =>
                    prev ? { ...prev, title: e.target.value } : null
                  )
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={selectedConcept?.description || ''}
                onChange={(e) =>
                  setSelectedConcept(prev =>
                    prev ? { ...prev, description: e.target.value } : null
                  )
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Notes
              </Typography>
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a new note..."
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <Button onClick={handleAddNote}>Add</Button>
                    ),
                  }}
                />
              </Box>
              <List>
                {selectedConcept?.notes.map((note, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={note} />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConceptDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => selectedConcept && handleUpdateConcept(selectedConcept)}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudySession;
