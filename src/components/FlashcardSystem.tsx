import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  LinearProgress,
  Menu,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Timer as TimerIcon,
  CheckCircle as CheckIcon,
  Cancel as CrossIcon,
  Flag as FlagIcon,
  BarChart as StatsIcon,
  Share as ShareIcon,
} from '@mui/icons-material';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  lastReviewed?: Date;
  nextReview?: Date;
  repetitionLevel: number;
  confidence: number;
}

interface FlashcardDeck {
  id: string;
  name: string;
  description: string;
  cards: Flashcard[];
  created: Date;
  lastStudied?: Date;
}

const FlashcardSystem: React.FC = () => {
  const [decks, setDecks] = useState<FlashcardDeck[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<FlashcardDeck | null>(null);
  const [currentCard, setCurrentCard] = useState<Flashcard | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showDeckDialog, setShowDeckDialog] = useState(false);
  const [showCardDialog, setShowCardDialog] = useState(false);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  const [studyStats, setStudyStats] = useState({
    totalReviewed: 0,
    correctCount: 0,
    averageConfidence: 0,
  });

  // Spaced Repetition Algorithm (SM-2 inspired)
  const calculateNextReview = (
    confidence: number,
    repetitionLevel: number
  ): Date => {
    let interval: number;
    if (confidence < 3) {
      interval = 1; // Review tomorrow
    } else if (confidence === 3) {
      interval = repetitionLevel * 2; // Double the interval
    } else {
      interval = repetitionLevel * 3; // Triple the interval for high confidence
    }
    
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + interval);
    return nextDate;
  };

  const handleConfidenceRating = (rating: number) => {
    if (!currentCard || !selectedDeck) return;

    const updatedCard = {
      ...currentCard,
      confidence: rating,
      repetitionLevel: rating >= 3 ? currentCard.repetitionLevel + 1 : 1,
      lastReviewed: new Date(),
      nextReview: calculateNextReview(rating, currentCard.repetitionLevel),
    };

    setDecks(decks.map(deck =>
      deck.id === selectedDeck.id
        ? {
            ...deck,
            cards: deck.cards.map(card =>
              card.id === currentCard.id ? updatedCard : card
            ),
          }
        : deck
    ));

    setStudyStats(prev => ({
      totalReviewed: prev.totalReviewed + 1,
      correctCount: prev.correctCount + (rating >= 3 ? 1 : 0),
      averageConfidence:
        (prev.averageConfidence * prev.totalReviewed + rating) /
        (prev.totalReviewed + 1),
    }));

    // Move to next card
    showNextCard();
  };

  const showNextCard = () => {
    if (!selectedDeck) return;

    const dueCards = selectedDeck.cards.filter(
      card => !card.nextReview || card.nextReview <= new Date()
    );

    if (dueCards.length === 0) {
      setCurrentCard(null);
      return;
    }

    // Prioritize cards based on due date and difficulty
    const sortedCards = dueCards.sort((a, b) => {
      if (!a.nextReview) return -1;
      if (!b.nextReview) return 1;
      return a.nextReview.getTime() - b.nextReview.getTime();
    });

    setCurrentCard(sortedCards[0]);
    setShowAnswer(false);
  };

  const handleCreateDeck = (name: string, description: string) => {
    const newDeck: FlashcardDeck = {
      id: Date.now().toString(),
      name,
      description,
      cards: [],
      created: new Date(),
    };
    setDecks([...decks, newDeck]);
    setShowDeckDialog(false);
  };

  const handleCreateCard = (card: Partial<Flashcard>) => {
    if (!selectedDeck) return;

    const newCard: Flashcard = {
      id: Date.now().toString(),
      front: card.front || '',
      back: card.back || '',
      topic: card.topic || '',
      difficulty: card.difficulty || 'medium',
      tags: card.tags || [],
      repetitionLevel: 1,
      confidence: 0,
    };

    setDecks(decks.map(deck =>
      deck.id === selectedDeck.id
        ? { ...deck, cards: [...deck.cards, newCard] }
        : deck
    ));

    setShowCardDialog(false);
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Flashcards</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setShowDeckDialog(true)}
              >
                Create Deck
              </Button>
            </Box>

            <Grid container spacing={2}>
              {decks.map(deck => (
                <Grid item xs={12} sm={6} md={4} key={deck.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{deck.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {deck.description}
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="caption">
                          {deck.cards.length} cards
                        </Typography>
                        {deck.lastStudied && (
                          <Typography variant="caption" sx={{ ml: 2 }}>
                            Last studied: {deck.lastStudied.toLocaleDateString()}
                          </Typography>
                        )}
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        onClick={() => {
                          setSelectedDeck(deck);
                          showNextCard();
                        }}
                      >
                        Study
                      </Button>
                      <Button
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => {
                          setSelectedDeck(deck);
                          setShowCardDialog(true);
                        }}
                      >
                        Add Card
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {selectedDeck && currentCard && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  {selectedDeck.name} - Study Session
                </Typography>
                <Card
                  sx={{
                    minHeight: 200,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                    },
                  }}
                  onClick={() => setShowAnswer(!showAnswer)}
                >
                  <CardContent>
                    <Typography variant="h5">
                      {showAnswer ? currentCard.back : currentCard.front}
                    </Typography>
                  </CardContent>
                </Card>
                {showAnswer && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      How well did you know this?
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                      {[1, 2, 3, 4, 5].map(rating => (
                        <Button
                          key={rating}
                          variant="contained"
                          onClick={() => handleConfidenceRating(rating)}
                          color={
                            rating <= 2
                              ? 'error'
                              : rating === 3
                              ? 'warning'
                              : 'success'
                          }
                        >
                          {rating}
                        </Button>
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>

      <Dialog
        open={showDeckDialog}
        onClose={() => setShowDeckDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Deck</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Deck Name"
            sx={{ mt: 2, mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeckDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => handleCreateDeck('New Deck', 'Description')}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showCardDialog}
        onClose={() => setShowCardDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingCard ? 'Edit Card' : 'Create New Card'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Front"
            multiline
            rows={3}
            sx={{ mt: 2, mb: 2 }}
          />
          <TextField
            fullWidth
            label="Back"
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Difficulty</InputLabel>
            <Select label="Difficulty" defaultValue="medium">
              <MenuItem value="easy">Easy</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="hard">Hard</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Tags (comma-separated)"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCardDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => handleCreateCard({})}
          >
            {editingCard ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FlashcardSystem;
