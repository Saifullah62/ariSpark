import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Grid,
  Divider,
  IconButton,
  Chip,
  Tab,
  Tabs,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Badge,
  Card,
  CardContent,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Send as SendIcon,
  AutoStories as StudyIcon,
  Quiz as QuizIcon,
  Psychology as ConceptIcon,
  EmojiObjects as InsightIcon,
  School as SchoolIcon,
  Settings as SettingsIcon,
  Bookmark as BookmarkIcon,
  History as HistoryIcon,
  BarChart as BarChartIcon,
  EmojiEvents as TrophyIcon,
  Psychology as AIIcon,
} from '@mui/icons-material';
import { openAIService } from '../services/openai';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'insight' | 'question' | 'explanation' | 'quiz' | 'study-plan' | 'practice' | 'glossary';
  context?: {
    topic?: string;
    relatedConcepts?: string[];
    difficulty?: 'easy' | 'medium' | 'hard';
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tutor-tabpanel-${index}`}
      aria-labelledby={`tutor-tab-${index}`}
      {...other}
      style={{ flexGrow: 1, overflow: 'auto' }}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const commonStyles = {
  pageContainer: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    p: 3,
  },
  pageTitle: {
    mb: 3,
    fontWeight: 600,
    background: 'linear-gradient(45deg, #FFD700, #FFA500)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
};

const AiTutor: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [currentTopic, setCurrentTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentDifficulty, setCurrentDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [showSettings, setShowSettings] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [flashcards, setFlashcards] = useState<Array<{ front: string; back: string }>>([]);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now(),
        text: `Welcome to your AI Tutor! I'm here to help you learn and achieve your academic goals. What would you like to learn about today?`,
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'question',
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const messageType = identifyMessageType(inputMessage.toLowerCase());
      let aiResponse: Message;

      switch (messageType) {
        case 'glossary':
          const glossaryTerms = await openAIService.generateGlossaryTerms(
            currentTopic || extractTopic(inputMessage)
          );
          aiResponse = {
            id: Date.now(),
            text: formatGlossary(glossaryTerms),
            sender: 'ai',
            timestamp: new Date(),
            type: 'glossary',
            context: {
              topic: currentTopic || extractTopic(inputMessage),
            },
          };
          break;

        case 'quiz':
          const quiz = await openAIService.generateQuiz(currentTopic || inputMessage, currentDifficulty, 5);
          aiResponse = {
            id: Date.now(),
            text: formatQuiz(quiz),
            sender: 'ai',
            timestamp: new Date(),
            type: 'quiz',
            context: {
              topic: currentTopic || inputMessage,
              difficulty: currentDifficulty,
            },
          };
          break;

        case 'study-plan':
          const duration = extractDuration(inputMessage) || '2 weeks';
          const plan = await openAIService.generateStudyPlan(
            currentTopic || extractTopic(inputMessage),
            duration
          );
          aiResponse = {
            id: Date.now(),
            text: plan,
            sender: 'ai',
            timestamp: new Date(),
            type: 'study-plan',
            context: {
              topic: currentTopic || extractTopic(inputMessage),
            },
          };
          break;

        case 'practice':
          const problems = await openAIService.generatePracticeProblems(
            currentTopic || extractTopic(inputMessage),
            currentDifficulty
          );
          aiResponse = {
            id: Date.now(),
            text: problems,
            sender: 'ai',
            timestamp: new Date(),
            type: 'practice',
            context: {
              topic: currentTopic || extractTopic(inputMessage),
              difficulty: currentDifficulty,
            },
          };
          break;

        default:
          const explanation = await openAIService.explainConcept(inputMessage);
          aiResponse = {
            id: Date.now(),
            text: explanation,
            sender: 'ai',
            timestamp: new Date(),
            type: 'explanation',
            context: {
              topic: extractTopic(inputMessage),
            },
          };
          setCurrentTopic(extractTopic(inputMessage));
      }

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMessage: Message = {
        id: Date.now(),
        text: 'I apologize, but I encountered an error. Please try asking your question again.',
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    if (currentTopic) {
      switch (newValue) {
        case 1:
          handleQuizTab();
          break;
        case 2:
          handleStudyPlanTab();
          break;
        case 3:
          handlePracticeTab();
          break;
        case 4:
          if (flashcards.length === 0) {
            handleGenerateFlashcards();
          }
          break;
      }
    }
  };

  const handleQuizTab = async () => {
    setLoading(true);
    try {
      const quiz = await openAIService.generateQuiz(currentTopic, currentDifficulty, 5);
      const quizMessage: Message = {
        id: Date.now(),
        text: formatQuiz(quiz),
        sender: 'ai',
        timestamp: new Date(),
        type: 'quiz',
        context: {
          topic: currentTopic,
          difficulty: currentDifficulty,
        },
      };
      setMessages(prev => [...prev, quizMessage]);
      setTabValue(0);
    } catch (error) {
      console.error('Error generating quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStudyPlanTab = async () => {
    setLoading(true);
    try {
      const plan = await openAIService.generateStudyPlan(currentTopic, '2 weeks');
      const planMessage: Message = {
        id: Date.now(),
        text: plan,
        sender: 'ai',
        timestamp: new Date(),
        type: 'study-plan',
        context: {
          topic: currentTopic,
        },
      };
      setMessages(prev => [...prev, planMessage]);
      setTabValue(0);
    } catch (error) {
      console.error('Error generating study plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePracticeTab = async () => {
    setLoading(true);
    try {
      const problems = await openAIService.generatePracticeProblems(currentTopic, currentDifficulty);
      const practiceMessage: Message = {
        id: Date.now(),
        text: problems,
        sender: 'ai',
        timestamp: new Date(),
        type: 'practice',
        context: {
          topic: currentTopic,
          difficulty: currentDifficulty,
        },
      };
      setMessages(prev => [...prev, practiceMessage]);
      setTabValue(0);
    } catch (error) {
      console.error('Error generating practice problems:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFlashcards = async () => {
    if (!currentTopic) return;

    setLoading(true);
    try {
      const terms = await openAIService.generateGlossaryTerms(currentTopic, 10);
      const newFlashcards = terms.map(term => ({
        front: term.term,
        back: term.definition + (term.example ? `\n\nExample: ${term.example}` : ''),
      }));
      setFlashcards(newFlashcards);
      setCurrentFlashcardIndex(0);
      setIsFlipped(false);
    } catch (error) {
      console.error('Error generating flashcards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextFlashcard = () => {
    setIsFlipped(false);
    setCurrentFlashcardIndex(prev => (prev + 1) % flashcards.length);
  };

  const handlePreviousFlashcard = () => {
    setIsFlipped(false);
    setCurrentFlashcardIndex(prev => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const handleFlipCard = () => {
    setIsFlipped(prev => !prev);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const identifyMessageType = (message: string): string => {
    if (message.includes('quiz') || message.includes('test')) return 'quiz';
    if (message.includes('study plan') || message.includes('schedule')) return 'study-plan';
    if (message.includes('practice') || message.includes('exercise')) return 'practice';
    if (message.includes('glossary') || message.includes('terms') || message.includes('definitions')) return 'glossary';
    return 'explanation';
  };

  const extractTopic = (message: string): string => {
    const topics = message.match(/about\s+([^?.,]+)/i);
    return topics ? topics[1].trim() : message.split(' ').slice(0, 3).join(' ');
  };

  const extractDuration = (message: string): string | null => {
    const duration = message.match(/(\d+)\s*(day|week|month|hour)s?/i);
    return duration ? `${duration[1]} ${duration[2]}${duration[1] === '1' ? '' : 's'}` : null;
  };

  const formatQuiz = (quiz: any[]): string => {
    return quiz.map((q, i) => `
Question ${i + 1}: ${q.question}

Options:
${q.options.map((opt: string, j: number) => `${String.fromCharCode(65 + j)}. ${opt}`).join('\n')}

Correct Answer: ${q.correctAnswer}
Explanation: ${q.explanation}
`).join('\n---\n');
  };

  const formatGlossary = (terms: any[]): string => {
    return terms.map((term, i) => `
Term ${i + 1}: ${term.term}
Definition: ${term.definition}
Example: ${term.example}
Related Terms: ${term.relatedTerms.join(', ')}
Category: ${term.category}
`).join('\n---\n');
  };

  const renderMessage = (message: Message) => (
    <ListItem
      key={message.id}
      sx={{
        flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
        mb: 2,
      }}
    >
      <Avatar
        sx={{
          bgcolor: message.sender === 'user' ? 'primary.main' : 'secondary.main',
          background: message.sender === 'user'
            ? 'linear-gradient(45deg, #FFD700, #FFA500)'
            : 'linear-gradient(45deg, #FFE14D, #FFB533)',
        }}
      >
        {message.sender === 'user' ? 'U' : <AIIcon />}
      </Avatar>
      <Paper
        sx={{
          maxWidth: '70%',
          ml: message.sender === 'user' ? 0 : 2,
          mr: message.sender === 'user' ? 2 : 0,
          p: 2,
          borderRadius: 2,
          background: message.sender === 'user'
            ? 'linear-gradient(45deg, rgba(255,215,0,0.1), rgba(255,165,0,0.1))'
            : 'white',
        }}
      >
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          {message.text}
        </Typography>
        {message.context && (
          <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {message.context.topic && (
              <Chip
                label={message.context.topic}
                size="small"
                sx={{ background: 'linear-gradient(45deg, #FFD700, #FFA500)', color: '#000' }}
              />
            )}
            {message.context.difficulty && (
              <Chip
                label={message.context.difficulty}
                size="small"
                sx={{ background: 'linear-gradient(45deg, #FFE14D, #FFB533)', color: '#000' }}
              />
            )}
          </Box>
        )}
      </Paper>
    </ListItem>
  );

  return (
    <Box sx={commonStyles.pageContainer}>
      <Typography variant="h4" sx={commonStyles.pageTitle}>
        AI Tutor
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="AI Tutor tabs"
        >
          <Tab label="Chat" icon={<ConceptIcon />} />
          <Tab label="Quiz" icon={<QuizIcon />} disabled={!currentTopic || loading} />
          <Tab label="Study Plan" icon={<StudyIcon />} disabled={!currentTopic || loading} />
          <Tab label="Practice" icon={<SchoolIcon />} disabled={!currentTopic || loading} />
          <Tab label="Flashcards" icon={<BookmarkIcon />} disabled={!currentTopic || loading} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
          <List>
            {messages.map(renderMessage)}
            <div ref={messagesEndRef} />
          </List>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            multiline
            rows={2}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            disabled={loading}
          />
          <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || loading}
            sx={{
              background: 'linear-gradient(45deg, #FFD700, #FFA500)',
              '&:hover': {
                background: 'linear-gradient(45deg, #FFE14D, #FFB533)',
              },
            }}
          >
            {loading ? <CircularProgress size={24} /> : <SendIcon />}
          </Button>
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6">
            {currentTopic ? 
              `Generating quiz about ${currentTopic}...` :
              'Start a chat about a topic to generate a quiz'}
          </Typography>
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6">
            {currentTopic ? 
              `Creating study plan for ${currentTopic}...` :
              'Start a chat about a topic to generate a study plan'}
          </Typography>
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6">
            {currentTopic ? 
              `Generating practice problems for ${currentTopic}...` :
              'Start a chat about a topic to generate practice problems'}
          </Typography>
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={4}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          {flashcards.length > 0 ? (
            <>
              <Card
                sx={{
                  width: '100%',
                  maxWidth: 600,
                  height: 300,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.6s',
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'none',
                }}
                onClick={handleFlipCard}
              >
                <CardContent>
                  <Typography variant="h5" align="center">
                    {isFlipped ? flashcards[currentFlashcardIndex].back : flashcards[currentFlashcardIndex].front}
                  </Typography>
                </CardContent>
              </Card>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={handlePreviousFlashcard}
                  disabled={flashcards.length <= 1}
                >
                  Previous
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNextFlashcard}
                  disabled={flashcards.length <= 1}
                >
                  Next
                </Button>
              </Box>
              <Typography>
                Card {currentFlashcardIndex + 1} of {flashcards.length}
              </Typography>
            </>
          ) : (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                {currentTopic ? 
                  'Generating flashcards...' :
                  'Start a chat about a topic to generate flashcards'}
              </Typography>
              {currentTopic && (
                <Button
                  variant="contained"
                  onClick={handleGenerateFlashcards}
                  disabled={loading}
                >
                  Generate Flashcards
                </Button>
              )}
            </Box>
          )}
        </Box>
      </TabPanel>
    </Box>
  );
};

export default AiTutor;