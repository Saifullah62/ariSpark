import React, { useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  Upload as UploadIcon,
  Description as FileIcon,
  Delete as DeleteIcon,
  Share as ShareIcon,
  PlayCircle as PlayIcon,
  PictureAsPdf as PdfIcon,
  VideoLibrary as VideoIcon,
  AudioFile as AudioIcon,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';

interface StudyMaterial {
  id: string;
  name: string;
  type: 'pdf' | 'video' | 'audio' | 'other';
  size: number;
  uploadDate: Date;
  tags: string[];
  notes?: string;
  shared?: boolean;
  url?: string;
}

interface StudyMaterialsManagerProps {
  onMaterialSelect: (material: StudyMaterial) => void;
}

const StudyMaterialsManager: React.FC<StudyMaterialsManagerProps> = ({
  onMaterialSelect,
}) => {
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<StudyMaterial | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      // Simulate file upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          const newMaterial: StudyMaterial = {
            id: Date.now().toString(),
            name: file.name,
            type: getFileType(file.name),
            size: file.size,
            uploadDate: new Date(),
            tags: [],
          };
          setMaterials((prev) => [...prev, newMaterial]);
          setUploadProgress(0);
          setShowUploadDialog(false);
        }
      }, 500);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'video/*': ['.mp4', '.webm'],
      'audio/*': ['.mp3', '.wav'],
    },
  });

  const getFileType = (filename: string): StudyMaterial['type'] => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'pdf';
    if (['mp4', 'webm'].includes(ext || '')) return 'video';
    if (['mp3', 'wav'].includes(ext || '')) return 'audio';
    return 'other';
  };

  const getFileIcon = (type: StudyMaterial['type']) => {
    switch (type) {
      case 'pdf':
        return <PdfIcon />;
      case 'video':
        return <VideoIcon />;
      case 'audio':
        return <AudioIcon />;
      default:
        return <FileIcon />;
    }
  };

  const handleDeleteMaterial = (id: string) => {
    setMaterials(materials.filter((m) => m.id !== id));
  };

  const handleShareMaterial = (id: string) => {
    setMaterials(
      materials.map((m) =>
        m.id === id ? { ...m, shared: !m.shared } : m
      )
    );
  };

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch = material.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tag) => material.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  const allTags = Array.from(
    new Set(materials.flatMap((m) => m.tags))
  );

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Study Materials</Typography>
              <Button
                variant="contained"
                startIcon={<UploadIcon />}
                onClick={() => setShowUploadDialog(true)}
              >
                Upload Material
              </Button>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  placeholder="Search materials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {allTags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onClick={() => {
                        setSelectedTags((prev) =>
                          prev.includes(tag)
                            ? prev.filter((t) => t !== tag)
                            : [...prev, tag]
                        );
                      }}
                      color={selectedTags.includes(tag) ? 'primary' : 'default'}
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>

            <List>
              {filteredMaterials.map((material) => (
                <ListItem
                  key={material.id}
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <ListItemIcon>{getFileIcon(material.type)}</ListItemIcon>
                  <ListItemText
                    primary={material.name}
                    secondary={
                      <Box>
                        <Typography variant="caption" display="block">
                          Uploaded: {material.uploadDate.toLocaleDateString()}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          {material.tags.map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              sx={{ mr: 0.5 }}
                            />
                          ))}
                        </Box>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleShareMaterial(material.id)}
                      sx={{ mr: 1 }}
                    >
                      <ShareIcon color={material.shared ? 'primary' : 'action'} />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteMaterial(material.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      <Dialog
        open={showUploadDialog}
        onClose={() => setShowUploadDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Upload Study Material</DialogTitle>
        <DialogContent>
          <Box
            {...getRootProps()}
            sx={{
              border: '2px dashed',
              borderColor: isDragActive ? 'primary.main' : 'grey.300',
              borderRadius: 1,
              p: 3,
              textAlign: 'center',
              cursor: 'pointer',
              mb: 2,
            }}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <Typography>Drop the files here...</Typography>
            ) : (
              <Typography>
                Drag and drop files here, or click to select files
              </Typography>
            )}
          </Box>
          {uploadProgress > 0 && (
            <Box sx={{ width: '100%', mt: 2 }}>
              <LinearProgress variant="determinate" value={uploadProgress} />
            </Box>
          )}
          <Alert severity="info" sx={{ mt: 2 }}>
            Supported formats: PDF, MP4, WebM, MP3, WAV
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUploadDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudyMaterialsManager;
