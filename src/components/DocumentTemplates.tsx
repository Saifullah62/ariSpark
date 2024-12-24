import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FileCopy as CopyIcon,
  Category as CategoryIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Assignment as AssignmentIcon,
  Description as DocumentIcon,
} from '@mui/icons-material';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  content: string;
  metadata: {
    author: string;
    createdDate: Date;
    lastModified: Date;
    usageCount: number;
    rating: number;
  };
  structure: {
    sections: Array<{
      title: string;
      description: string;
      required: boolean;
      type: 'text' | 'list' | 'table' | 'image' | 'reference';
    }>;
    placeholders: Array<{
      key: string;
      description: string;
      type: string;
      required: boolean;
    }>;
  };
}

const academicTemplates: Template[] = [
  {
    id: 'research-paper',
    name: 'Research Paper',
    description: 'Standard academic research paper template with sections for abstract, introduction, methodology, results, and conclusion.',
    category: 'Academic',
    tags: ['research', 'academic', 'paper'],
    content: '', // Template content would be here
    metadata: {
      author: 'System',
      createdDate: new Date(),
      lastModified: new Date(),
      usageCount: 0,
      rating: 4.5,
    },
    structure: {
      sections: [
        { title: 'Abstract', description: 'Brief summary of the paper', required: true, type: 'text' },
        { title: 'Introduction', description: 'Background and research objectives', required: true, type: 'text' },
        { title: 'Methodology', description: 'Research methods and procedures', required: true, type: 'text' },
        { title: 'Results', description: 'Findings and data analysis', required: true, type: 'text' },
        { title: 'Discussion', description: 'Interpretation of results', required: true, type: 'text' },
        { title: 'Conclusion', description: 'Summary and implications', required: true, type: 'text' },
        { title: 'References', description: 'Citations and references', required: true, type: 'reference' },
      ],
      placeholders: [
        { key: 'TITLE', description: 'Paper title', type: 'text', required: true },
        { key: 'AUTHOR', description: 'Author name', type: 'text', required: true },
        { key: 'INSTITUTION', description: 'Institution name', type: 'text', required: true },
      ],
    },
  },
  // Add more template definitions
];

const DocumentTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>(academicTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = [
    'Academic',
    'Assignment',
    'Research',
    'Lab Report',
    'Thesis',
    'Project',
    'Business',
    'Personal',
  ];

  const handleCreateFromTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setShowTemplateDialog(true);
  };

  const renderTemplateCard = (template: Template) => (
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
          {template.category === 'Academic' ? <SchoolIcon color="primary" /> : <DocumentIcon />}
          <Typography variant="h6" sx={{ ml: 1 }}>
            {template.name}
          </Typography>
        </Box>
        <Typography color="textSecondary" variant="body2" gutterBottom>
          {template.description}
        </Typography>
        <Box sx={{ mt: 2 }}>
          {template.tags.map(tag => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              sx={{ mr: 0.5, mb: 0.5 }}
            />
          ))}
        </Box>
        <Typography variant="caption" display="block" sx={{ mt: 2 }}>
          Used {template.metadata.usageCount} times
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          startIcon={<CopyIcon />}
          onClick={() => handleCreateFromTemplate(template)}
        >
          Use Template
        </Button>
        <IconButton size="small" sx={{ ml: 'auto' }}>
          <EditIcon />
        </IconButton>
      </CardActions>
    </Card>
  );

  const renderCreateDialog = () => (
    <Dialog
      open={showCreateDialog}
      onClose={() => setShowCreateDialog(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Create New Template</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Template Name"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                {categories.map(category => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tags (comma separated)"
              variant="outlined"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowCreateDialog(false)}>Cancel</Button>
        <Button variant="contained" color="primary">
          Create Template
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderTemplateDialog = () => (
    <Dialog
      open={showTemplateDialog}
      onClose={() => setShowTemplateDialog(false)}
      maxWidth="lg"
      fullWidth
    >
      {selectedTemplate && (
        <>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SchoolIcon color="primary" sx={{ mr: 1 }} />
              {selectedTemplate.name}
            </Box>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                {/* Template sections */}
                <List>
                  {selectedTemplate.structure.sections.map((section, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={section.title}
                        secondary={section.description}
                      />
                      {section.required && (
                        <Chip label="Required" size="small" color="primary" />
                      )}
                    </ListItem>
                  ))}
                </List>
              </Grid>
              <Grid item xs={12} md={4}>
                {/* Template placeholders */}
                <Typography variant="h6" gutterBottom>
                  Required Information
                </Typography>
                <List>
                  {selectedTemplate.structure.placeholders.map((placeholder, index) => (
                    <ListItem key={index}>
                      <TextField
                        fullWidth
                        label={placeholder.description}
                        required={placeholder.required}
                        variant="outlined"
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowTemplateDialog(false)}>Cancel</Button>
            <Button variant="contained" color="primary">
              Create Document
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Document Templates</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowCreateDialog(true)}
        >
          Create Template
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Category</InputLabel>
          <Select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <MenuItem value="all">All Categories</MenuItem>
            {categories.map(category => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {templates
          .filter(t => filterCategory === 'all' || t.category === filterCategory)
          .map(template => (
            <Grid item xs={12} sm={6} md={4} key={template.id}>
              {renderTemplateCard(template)}
            </Grid>
          ))}
      </Grid>

      {renderCreateDialog()}
      {renderTemplateDialog()}
    </Box>
  );
};

export default DocumentTemplates;
