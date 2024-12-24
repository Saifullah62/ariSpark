import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  useTheme,
  Grid,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Folder as FolderIcon,
  Description as DocumentIcon,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import DocumentToolbar from '../components/DocumentToolbar';
import DocumentEditor from '../components/DocumentEditor';
import { useNotificationStore } from '../services/notifications';

interface DocumentItem {
  id: string;
  name: string;
  type: 'folder' | 'document';
  createdAt: number;
  content?: string;
}

const Documents: React.FC = () => {
  const theme = useTheme();
  const { addNotification } = useNotificationStore();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState<DocumentItem | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);

  const handleCreateFolder = (name: string) => {
    const newFolder: DocumentItem = {
      id: `folder-${Date.now()}`,
      name,
      type: 'folder',
      createdAt: Date.now(),
    };
    setDocuments([...documents, newFolder]);
    addNotification({
      message: `Folder "${name}" created successfully`,
      type: 'success',
    });
  };

  const handleCreateDocument = (name: string) => {
    const newDocument: DocumentItem = {
      id: `doc-${Date.now()}`,
      name,
      type: 'document',
      createdAt: Date.now(),
      content: '',
    };
    setDocuments([...documents, newDocument]);
    addNotification({
      message: `Document "${name}" created successfully`,
      type: 'success',
    });
  };

  const handleUploadFiles = (files: FileList) => {
    const newDocuments: DocumentItem[] = Array.from(files).map(file => ({
      id: `doc-${Date.now()}-${file.name}`,
      name: file.name,
      type: 'document',
      createdAt: Date.now(),
    }));
    setDocuments([...documents, ...newDocuments]);
    addNotification({
      message: `${files.length} file(s) uploaded successfully`,
      type: 'success',
    });
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, item: DocumentItem) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleDelete = () => {
    if (selectedItem) {
      setDocuments(documents.filter(doc => doc.id !== selectedItem.id));
      addNotification({
        message: `${selectedItem.type === 'folder' ? 'Folder' : 'Document'} "${selectedItem.name}" deleted`,
        type: 'success',
      });
      handleMenuClose();
    }
  };

  const handleRename = () => {
    // Implement rename functionality
    handleMenuClose();
  };

  const handleDocumentClick = (document: DocumentItem) => {
    if (document.type === 'document') {
      setSelectedDocument(document);
      setEditorOpen(true);
    }
  };

  const handleSaveDocument = (id: string, content: string) => {
    setDocuments(docs => docs.map(doc =>
      doc.id === id ? { ...doc, content } : doc
    ));
    addNotification({
      message: 'Document saved successfully',
      type: 'success',
    });
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography
        variant="h4"
        sx={{
          p: 2,
          background: 'linear-gradient(45deg, #FFD700, #FFA500)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 600,
        }}
      >
        Documents
      </Typography>

      <DocumentToolbar
        onCreateFolder={handleCreateFolder}
        onCreateDocument={handleCreateDocument}
        onUploadFiles={handleUploadFiles}
      />

      <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto' }}>
        <Grid container spacing={2}>
          {documents.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: item.type === 'document' ? 'pointer' : 'default',
                  '&:hover': {
                    boxShadow: theme.shadows[4],
                  },
                }}
                onClick={() => handleDocumentClick(item)}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 1,
                    }}
                  >
                    {item.type === 'folder' ? (
                      <FolderIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                    ) : (
                      <DocumentIcon sx={{ color: theme.palette.secondary.main, mr: 1 }} />
                    )}
                    <Typography
                      variant="subtitle1"
                      sx={{
                        flexGrow: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Created: {new Date(item.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, item)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleRename}>
            <EditIcon sx={{ mr: 1 }} /> Rename
          </MenuItem>
          <MenuItem onClick={handleDelete}>
            <DeleteIcon sx={{ mr: 1 }} /> Delete
          </MenuItem>
        </Menu>

        <DocumentEditor
          open={editorOpen}
          onClose={() => {
            setEditorOpen(false);
            setSelectedDocument(null);
          }}
          document={selectedDocument}
          onSave={handleSaveDocument}
        />
      </Box>
    </Box>
  );
};

export default Documents;