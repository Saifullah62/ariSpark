import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Tooltip,
  Alert,
  Autocomplete,
  Switch,
  FormControlLabel,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  BookmarkBorder as BookmarkIcon,
  BookmarkAdded as BookmarkedIcon,
  Share as ShareIcon,
  ImportExport as ImportIcon,
  Category as CategoryIcon,
  Search as SearchIcon,
  Sort as SortIcon,
  FilterList as FilterIcon,
  Translate as TranslateIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  AudioFile as AudioIcon,
  FormatQuote as QuoteIcon,
  Psychology as AIIcon,
} from '@mui/icons-material';

interface Term {
  id: string;
  term: string;
  definition: string;
  category: string;
  subject: string;
  tags: string[];
  examples: string[];
  relatedTerms: string[];
  translations?: { [key: string]: string };
  pronunciation?: {
    phonetic: string;
    audioUrl?: string;
  };
  images?: string[];
  source?: string;
  lastModified: Date;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  bookmarked: boolean;
  metadata: {
    createdBy: string;
    createdDate: Date;
    viewCount: number;
    usageCount: number;
  };
}

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
}

const subjects = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'Literature',
  'History',
  'Economics',
  'Psychology',
  'Engineering',
];

const categories: Category[] = [
  { id: 'concept', name: 'Core Concepts', description: 'Fundamental ideas and principles', color: '#2196f3' },
  { id: 'formula', name: 'Formulas', description: 'Mathematical and scientific formulas', color: '#4caf50' },
  { id: 'theory', name: 'Theories', description: 'Scientific and academic theories', color: '#9c27b0' },
  { id: 'method', name: 'Methods', description: 'Procedures and techniques', color: '#ff9800' },
  { id: 'definition', name: 'Definitions', description: 'Term definitions', color: '#f44336' },
];

const GlossarySystem: React.FC = () => {
  const [terms, setTerms] = useState<Term[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('alphabetical');
  const [currentTab, setCurrentTab] = useState(0);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddTerm = () => {
    setShowAddDialog(true);
  };

  const handleGenerateAIDefinition = async (term: string) => {
    setLoading(true);
    // Simulated AI definition generation
    setTimeout(() => {
      // Add AI-generated content
      setLoading(false);
    }, 1500);
  };

  const renderTermForm = () => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Term"
          variant="outlined"
          required
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Definition"
          variant="outlined"
          multiline
          rows={4}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Subject</InputLabel>
          <Select>
            {subjects.map(subject => (
              <MenuItem key={subject} value={subject}>
                {subject}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select>
            {categories.map(category => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Examples (one per line)"
          variant="outlined"
          multiline
          rows={3}
        />
      </Grid>
      <Grid item xs={12}>
        <Autocomplete
          multiple
          freeSolo
          options={[]}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Tags"
              variant="outlined"
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Autocomplete
          multiple
          options={terms.map(t => t.term)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Related Terms"
              variant="outlined"
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel>Difficulty Level</InputLabel>
          <Select>
            <MenuItem value="basic">Basic</MenuItem>
            <MenuItem value="intermediate">Intermediate</MenuItem>
            <MenuItem value="advanced">Advanced</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );

  const renderTermCard = (term: Term) => (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          transform: 'translateY(-4px)',
          transition: 'transform 0.2s',
          boxShadow: 3,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">{term.term}</Typography>
          <IconButton
            size="small"
            sx={{ ml: 'auto' }}
            onClick={() => term.bookmarked = !term.bookmarked}
          >
            {term.bookmarked ? <BookmarkedIcon color="primary" /> : <BookmarkIcon />}
          </IconButton>
        </Box>
        <Typography variant="body1" paragraph>
          {term.definition}
        </Typography>
        {term.examples.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Examples:
            </Typography>
            <List dense>
              {term.examples.map((example, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={example}
                    sx={{ '& .MuiListItemText-primary': { fontSize: '0.9rem' } }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
        <Box sx={{ mt: 1 }}>
          {term.tags.map(tag => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              sx={{ mr: 0.5, mb: 0.5 }}
            />
          ))}
        </Box>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          startIcon={<EditIcon />}
          onClick={() => {
            setSelectedTerm(term);
            setShowAddDialog(true);
          }}
        >
          Edit
        </Button>
        <Button
          size="small"
          startIcon={<ShareIcon />}
        >
          Share
        </Button>
        <IconButton size="small" sx={{ ml: 'auto' }}>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );

  const renderToolbar = () => (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            placeholder="Search terms..."
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1 }} />,
            }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Subject</InputLabel>
              <Select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
              >
                <MenuItem value="all">All Subjects</MenuItem>
                {subjects.map(subject => (
                  <MenuItem key={subject} value={subject}>
                    {subject}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {categories.map(category => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="alphabetical">A-Z</MenuItem>
                <MenuItem value="recent">Most Recent</MenuItem>
                <MenuItem value="popular">Most Popular</MenuItem>
                <MenuItem value="difficulty">Difficulty</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddTerm}
            >
              Add Term
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );

  const renderAIAssistant = () => (
    <Dialog
      open={showAIDialog}
      onClose={() => setShowAIDialog(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>AI Definition Assistant</DialogTitle>
      <DialogContent>
        <Alert severity="info" sx={{ mb: 2 }}>
          The AI assistant will help you generate comprehensive definitions and examples.
        </Alert>
        <TextField
          fullWidth
          label="Enter a term"
          variant="outlined"
          sx={{ mb: 2 }}
        />
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Generated Definition:</Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Generated Examples:</Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Suggested Tags:</Typography>
              <Box sx={{ mt: 1 }}>
                {['tag1', 'tag2', 'tag3'].map(tag => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    sx={{ mr: 0.5, mb: 0.5 }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowAIDialog(false)}>Cancel</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleGenerateAIDefinition('')}
        >
          Generate
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 600,
            background: 'linear-gradient(45deg, #FFD700, #FFA500)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Glossary
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<ImportIcon />}
            sx={{ mr: 1 }}
          >
            Import/Export
          </Button>
          <Button
            variant="contained"
            startIcon={<AIIcon />}
            onClick={() => setShowAIDialog(true)}
            sx={{
              background: 'linear-gradient(45deg, #FFD700, #FFA500)',
              '&:hover': {
                background: 'linear-gradient(45deg, #FFE14D, #FFB533)',
              },
            }}
          >
            AI Assistant
          </Button>
        </Box>
      </Box>

      {renderToolbar()}

      <Tabs
        value={currentTab}
        onChange={(_, newValue) => setCurrentTab(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab label="All Terms" />
        <Tab label="Bookmarked" />
        <Tab label="Recent" />
        <Tab label="By Subject" />
      </Tabs>

      <Grid container spacing={3}>
        {terms.map(term => (
          <Grid item xs={12} sm={6} md={4} key={term.id}>
            {renderTermCard(term)}
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedTerm ? 'Edit Term' : 'Add New Term'}
        </DialogTitle>
        <DialogContent>
          {renderTermForm()}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddDialog(false)}>Cancel</Button>
          <Button variant="contained" color="primary">
            {selectedTerm ? 'Save Changes' : 'Add Term'}
          </Button>
        </DialogActions>
      </Dialog>

      {renderAIAssistant()}
    </Box>
  );
};

export default GlossarySystem;
