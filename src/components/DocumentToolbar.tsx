import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  CreateNewFolder as CreateNewFolderIcon,
  NoteAdd as NoteAddIcon,
  Upload as UploadIcon,
} from '@mui/icons-material';

interface DocumentToolbarProps {
  onCreateFolder: (name: string) => void;
  onCreateDocument: (name: string) => void;
  onUploadFiles: (files: FileList) => void;
}

const DocumentToolbar: React.FC<DocumentToolbarProps> = ({
  onCreateFolder,
  onCreateDocument,
  onUploadFiles,
}) => {
  const theme = useTheme();
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false);
  const [newDocumentDialogOpen, setNewDocumentDialogOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleCreateFolder = () => {
    if (newItemName.trim()) {
      onCreateFolder(newItemName.trim());
      setNewItemName('');
      setNewFolderDialogOpen(false);
    }
  };

  const handleCreateDocument = () => {
    if (newItemName.trim()) {
      onCreateDocument(newItemName.trim());
      setNewItemName('');
      setNewDocumentDialogOpen(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onUploadFiles(event.target.files);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        p: 2,
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Tooltip title="Create New Folder">
        <Button
          variant="contained"
          startIcon={<CreateNewFolderIcon />}
          onClick={() => setNewFolderDialogOpen(true)}
          sx={{
            backgroundColor: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          New Folder
        </Button>
      </Tooltip>

      <Tooltip title="Create New Document">
        <Button
          variant="contained"
          startIcon={<NoteAddIcon />}
          onClick={() => setNewDocumentDialogOpen(true)}
          sx={{
            backgroundColor: theme.palette.secondary.main,
            '&:hover': {
              backgroundColor: theme.palette.secondary.dark,
            },
          }}
        >
          New Document
        </Button>
      </Tooltip>

      <input
        type="file"
        multiple
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />

      <Tooltip title="Upload Files">
        <Button
          variant="contained"
          startIcon={<UploadIcon />}
          onClick={() => fileInputRef.current?.click()}
          sx={{
            backgroundColor: theme.palette.success.main,
            '&:hover': {
              backgroundColor: theme.palette.success.dark,
            },
          }}
        >
          Upload Files
        </Button>
      </Tooltip>

      {/* New Folder Dialog */}
      <Dialog
        open={newFolderDialogOpen}
        onClose={() => {
          setNewFolderDialogOpen(false);
          setNewItemName('');
        }}
      >
        <DialogTitle>Create New Folder</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Folder Name"
            type="text"
            fullWidth
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleCreateFolder();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setNewFolderDialogOpen(false);
              setNewItemName('');
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleCreateFolder} variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* New Document Dialog */}
      <Dialog
        open={newDocumentDialogOpen}
        onClose={() => {
          setNewDocumentDialogOpen(false);
          setNewItemName('');
        }}
      >
        <DialogTitle>Create New Document</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Document Name"
            type="text"
            fullWidth
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleCreateDocument();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setNewDocumentDialogOpen(false);
              setNewItemName('');
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleCreateDocument} variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentToolbar;
