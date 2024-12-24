import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Tooltip,
  Tab,
  Tabs,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  FileCopy as CopyIcon,
  Link as LinkIcon,
  Search as SearchIcon,
  ImportExport as ImportIcon,
  LibraryBooks as LibraryIcon,
  MenuBook as BookIcon,
  Article as ArticleIcon,
  Public as WebIcon,
} from '@mui/icons-material';

interface Citation {
  id: string;
  type: 'book' | 'article' | 'website' | 'journal' | 'conference' | 'thesis';
  title: string;
  authors: string[];
  year: number;
  source: string;
  url?: string;
  doi?: string;
  isbn?: string;
  abstract?: string;
  keywords: string[];
  notes?: string;
  quotations: Array<{
    id: string;
    text: string;
    page: string;
    notes?: string;
  }>;
  metadata: {
    addedDate: Date;
    lastUsed?: Date;
    useCount: number;
    projects: string[];
  };
}

interface CitationStyle {
  id: string;
  name: string;
  format: string;
}

const citationStyles: CitationStyle[] = [
  { id: 'apa', name: 'APA 7th Edition', format: 'Author, A. A. (Year). Title...' },
  { id: 'mla', name: 'MLA 9th Edition', format: 'Author. "Title." Source...' },
  { id: 'chicago', name: 'Chicago', format: 'Author. Year. "Title."...' },
  { id: 'harvard', name: 'Harvard', format: 'Author (Year) Title...' },
  { id: 'ieee', name: 'IEEE', format: '[1] Author, "Title,"...' },
];

const CitationManager: React.FC = () => {
  const [citations, setCitations] = useState<Citation[]>([]);
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('apa');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  const [showImportDialog, setShowImportDialog] = useState(false);

  const handleAddCitation = () => {
    setShowAddDialog(true);
  };

  const handleImportCitations = () => {
    setShowImportDialog(true);
  };

  const formatCitation = (citation: Citation, style: string): string => {
    // Implementation of citation formatting based on style
    switch (style) {
      case 'apa':
        return `${citation.authors.join(', ')} (${citation.year}). ${citation.title}. ${citation.source}.`;
      case 'mla':
        return `${citation.authors.join(', ')}. "${citation.title}." ${citation.source}, ${citation.year}.`;
      default:
        return `${citation.authors.join(', ')} - ${citation.title} (${citation.year})`;
    }
  };

  const renderCitationForm = () => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel>Citation Type</InputLabel>
          <Select>
            <MenuItem value="book">Book</MenuItem>
            <MenuItem value="article">Article</MenuItem>
            <MenuItem value="website">Website</MenuItem>
            <MenuItem value="journal">Journal</MenuItem>
            <MenuItem value="conference">Conference Paper</MenuItem>
            <MenuItem value="thesis">Thesis</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Title"
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Authors (comma separated)"
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Year"
          type="number"
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Source"
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="URL"
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="DOI/ISBN"
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Abstract"
          multiline
          rows={4}
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Keywords (comma separated)"
          variant="outlined"
        />
      </Grid>
    </Grid>
  );

  const renderCitationList = () => (
    <List>
      {citations.map(citation => (
        <ListItem
          key={citation.id}
          sx={{
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            mb: 1,
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {citation.type === 'book' && <BookIcon sx={{ mr: 1 }} />}
                {citation.type === 'article' && <ArticleIcon sx={{ mr: 1 }} />}
                {citation.type === 'website' && <WebIcon sx={{ mr: 1 }} />}
                <Typography variant="subtitle1">{citation.title}</Typography>
              </Box>
            }
            secondary={
              <>
                <Typography variant="body2" color="textSecondary">
                  {formatCitation(citation, selectedStyle)}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {citation.keywords.map(keyword => (
                    <Chip
                      key={keyword}
                      label={keyword}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </Box>
              </>
            }
          />
          <ListItemSecondaryAction>
            <Tooltip title="Copy Citation">
              <IconButton onClick={() => navigator.clipboard.writeText(formatCitation(citation, selectedStyle))}>
                <CopyIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );

  const renderQuotations = () => (
    <List>
      {selectedCitation?.quotations.map(quote => (
        <ListItem key={quote.id}>
          <ListItemText
            primary={quote.text}
            secondary={
              <>
                <Typography variant="caption">
                  Page: {quote.page}
                </Typography>
                {quote.notes && (
                  <Typography variant="body2">
                    Notes: {quote.notes}
                  </Typography>
                )}
              </>
            }
          />
        </ListItem>
      ))}
    </List>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Citation Manager</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<ImportIcon />}
            onClick={handleImportCitations}
            sx={{ mr: 1 }}
          >
            Import Citations
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddCitation}
          >
            Add Citation
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                placeholder="Search citations..."
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1 }} />,
                }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Citation Style</InputLabel>
                <Select
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                >
                  {citationStyles.map(style => (
                    <MenuItem key={style.id} value={style.id}>
                      {style.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            {renderCitationList()}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Tabs
              value={currentTab}
              onChange={(_, newValue) => setCurrentTab(newValue)}
              sx={{ mb: 2 }}
            >
              <Tab label="Details" />
              <Tab label="Quotations" />
            </Tabs>
            {currentTab === 0 && selectedCitation && (
              <Box>
                <Typography variant="h6">{selectedCitation.title}</Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  {selectedCitation.abstract}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">Metadata</Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Added"
                        secondary={selectedCitation.metadata.addedDate.toLocaleDateString()}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Used"
                        secondary={`${selectedCitation.metadata.useCount} times`}
                      />
                    </ListItem>
                  </List>
                </Box>
              </Box>
            )}
            {currentTab === 1 && renderQuotations()}
          </Paper>
        </Grid>
      </Grid>

      {/* Add Citation Dialog */}
      <Dialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New Citation</DialogTitle>
        <DialogContent>
          {renderCitationForm()}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddDialog(false)}>Cancel</Button>
          <Button variant="contained" color="primary">
            Add Citation
          </Button>
        </DialogActions>
      </Dialog>

      {/* Import Dialog */}
      <Dialog
        open={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Import Citations</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Supported formats: BibTeX, RIS, EndNote XML, Zotero
          </Alert>
          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ mb: 2 }}
          >
            Choose File
            <input type="file" hidden />
          </Button>
          <Typography variant="body2" color="textSecondary">
            Or paste citation data:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={6}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowImportDialog(false)}>Cancel</Button>
          <Button variant="contained" color="primary">
            Import
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CitationManager;
