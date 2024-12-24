import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Grid,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  CircularProgress,
  Tooltip,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  AutoAwesome as AIIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { openAIService } from '../services/openai';

interface Term {
  id: number;
  term: string;
  definition: string;
  category: string;
  relatedTerms: string[];
  example?: string;
  createdAt: string;
  updatedAt: string;
}

const categories = [
  'Criminal Law',
  'Constitutional Law',
  'Criminal Procedure',
  'Evidence',
  'Legal Ethics',
  'Legal Research',
  'Other',
];

const commonStyles = {
  pageContainer: {
    p: 3,
  },
  pageTitle: {
    fontWeight: 600,
    mb: 3,
  },
};

const Glossary: React.FC = () => {
  const [terms, setTerms] = useState<Term[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);
  const [newTerm, setNewTerm] = useState<Partial<Term>>({
    category: categories[0],
    relatedTerms: [],
  });
  const [relatedTermInput, setRelatedTermInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const savedTerms = localStorage.getItem('glossary');
    if (savedTerms) {
      setTerms(JSON.parse(savedTerms));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('glossary', JSON.stringify(terms));
  }, [terms]);

  const handleGenerateTerms = async (category: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Generating terms for category:', category);
      const generatedTerms = await openAIService.generateGlossaryTerms(category, 5);
      console.log('Generated terms:', generatedTerms);

      if (!Array.isArray(generatedTerms) || generatedTerms.length === 0) {
        throw new Error('No terms were generated');
      }

      // Validate each generated term
      generatedTerms.forEach((term, index) => {
        if (!term.term || !term.definition) {
          throw new Error(`Term ${index + 1} is missing required fields`);
        }
      });

      // Create new terms with proper structure
      const newTerms = generatedTerms.map(genTerm => {
        const term: Term = {
          id: Date.now() + Math.random(),
          term: genTerm.term.trim(),
          definition: genTerm.definition.trim(),
          category: (genTerm.category || category).trim(),
          relatedTerms: Array.isArray(genTerm.relatedTerms) 
            ? genTerm.relatedTerms.map(t => String(t).trim())
            : [],
          example: genTerm.example?.trim() || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        console.log('Created term:', term);
        return term;
      });

      // Update state with new terms
      setTerms(prev => {
        const updated = [...prev, ...newTerms];
        console.log('Updated terms:', updated);
        return updated;
      });

      setSuccess(`Added ${newTerms.length} new terms to your glossary`);
    } catch (err) {
      console.error('Error generating terms:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate terms');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (term?: Term) => {
    if (term) {
      setSelectedTerm(term);
      setNewTerm(term);
    } else {
      setSelectedTerm(null);
      setNewTerm({
        category: categories[0],
        relatedTerms: [],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTerm(null);
    setNewTerm({
      category: categories[0],
      relatedTerms: [],
    });
    setRelatedTermInput('');
  };

  const handleAddTerm = () => {
    if (newTerm.term && newTerm.definition) {
      if (selectedTerm) {
        setTerms(
          terms.map((term) =>
            term.id === selectedTerm.id
              ? {
                  ...term,
                  ...newTerm,
                  updatedAt: new Date().toISOString(),
                } as Term
              : term
          )
        );
      } else {
        const term: Term = {
          id: Date.now(),
          term: newTerm.term,
          definition: newTerm.definition,
          category: newTerm.category || categories[0],
          relatedTerms: newTerm.relatedTerms || [],
          example: newTerm.example,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setTerms([...terms, term]);
      }
      handleCloseDialog();
      setSuccess('Term saved successfully!');
    }
  };

  const handleDeleteTerm = (id: number) => {
    setTerms(terms.filter((term) => term.id !== id));
    setSuccess('Term deleted successfully!');
  };

  const handleAddRelatedTerm = () => {
    if (relatedTermInput && !newTerm.relatedTerms?.includes(relatedTermInput)) {
      setNewTerm({
        ...newTerm,
        relatedTerms: [...(newTerm.relatedTerms || []), relatedTermInput],
      });
      setRelatedTermInput('');
    }
  };

  const handleRemoveRelatedTerm = (termToRemove: string) => {
    setNewTerm({
      ...newTerm,
      relatedTerms: newTerm.relatedTerms?.filter((term) => term !== termToRemove),
    });
  };

  const getFilteredTerms = () => {
    let filteredTerms = terms;

    if (selectedCategory) {
      filteredTerms = filteredTerms.filter(
        (term) => term.category === selectedCategory
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredTerms = filteredTerms.filter(
        (term) =>
          term.term.toLowerCase().includes(query) ||
          term.definition.toLowerCase().includes(query)
      );
    }

    return filteredTerms.sort((a, b) => a.term.localeCompare(b.term));
  };

  return (
    <Box sx={commonStyles.pageContainer}>
      <Typography variant="h4" sx={commonStyles.pageTitle}>
        Glossary
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{
                background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976D2, #1CB5E0)',
                },
              }}
            >
              Add Term
            </Button>
            <Button
              variant="contained"
              startIcon={<AIIcon />}
              onClick={() => handleGenerateTerms(selectedCategory || 'Legal Concepts')}
              disabled={loading}
              sx={{
                background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #FFE14D, #FFB533)',
                },
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Generate Terms'}
            </Button>
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField
                fullWidth
                placeholder="Search terms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Category"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <List>
              {getFilteredTerms().map((term) => (
                <React.Fragment key={term.id}>
                  <ListItem
                    sx={{
                      bgcolor: 'background.paper',
                      borderRadius: 1,
                      mb: 1,
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                    secondaryAction={
                      <Box>
                        <IconButton onClick={() => handleOpenDialog(term)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteTerm(term.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemText
                      primary={
                        <Typography variant="h6" component="div">
                          {term.term}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body1" color="text.secondary" gutterBottom>
                            {term.definition}
                          </Typography>
                          {term.example && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              Example: {term.example}
                            </Typography>
                          )}
                          <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip
                              label={term.category}
                              size="small"
                              sx={{
                                background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                                color: 'black',
                              }}
                            />
                            {term.relatedTerms.map((relatedTerm) => (
                              <Chip
                                key={relatedTerm}
                                label={relatedTerm}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Grid>
        </Grid>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedTerm ? 'Edit Term' : 'Add New Term'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Term"
                value={newTerm.term || ''}
                onChange={(e) => setNewTerm({ ...newTerm, term: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Definition"
                multiline
                rows={3}
                value={newTerm.definition || ''}
                onChange={(e) => setNewTerm({ ...newTerm, definition: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Example"
                multiline
                rows={2}
                value={newTerm.example || ''}
                onChange={(e) => setNewTerm({ ...newTerm, example: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={newTerm.category}
                  label="Category"
                  onChange={(e) => setNewTerm({ ...newTerm, category: e.target.value })}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                <TextField
                  label="Related Terms"
                  value={relatedTermInput}
                  onChange={(e) => setRelatedTermInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddRelatedTerm();
                    }
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleAddRelatedTerm}
                  disabled={!relatedTermInput}
                >
                  Add
                </Button>
              </Box>
              <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {newTerm.relatedTerms?.map((term) => (
                  <Chip
                    key={term}
                    label={term}
                    onDelete={() => handleRemoveRelatedTerm(term)}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleAddTerm}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={!newTerm.term || !newTerm.definition}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!error || !!success}
        autoHideDuration={6000}
        onClose={() => {
          setError(null);
          setSuccess(null);
        }}
      >
        <Alert
          onClose={() => {
            setError(null);
            setSuccess(null);
          }}
          severity={error ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {error || success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Glossary;