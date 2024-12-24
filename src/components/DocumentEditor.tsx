import React from 'react';
import {
  Box,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  Dialog,
  useTheme,
} from '@mui/material';
import { Close as CloseIcon, Save as SaveIcon } from '@mui/icons-material';
import { Editor } from '@tinymce/tinymce-react';

interface DocumentEditorProps {
  open: boolean;
  onClose: () => void;
  document: {
    id: string;
    name: string;
    content?: string;
  } | null;
  onSave: (id: string, content: string) => void;
}

const DocumentEditor: React.FC<DocumentEditorProps> = ({
  open,
  onClose,
  document,
  onSave,
}) => {
  const theme = useTheme();
  const [content, setContent] = React.useState('');
  const editorRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (document) {
      setContent(document.content || '');
    }
  }, [document]);

  const handleSave = () => {
    if (document) {
      onSave(document.id, content);
    }
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          bgcolor: theme.palette.background.default,
        },
      }}
    >
      <AppBar 
        position="relative" 
        color="default" 
        elevation={1}
        sx={{
          bgcolor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography 
            sx={{ 
              ml: 2, 
              flex: 1,
              background: 'linear-gradient(45deg, #FFD700, #FFA500)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 600,
            }}
            variant="h6"
          >
            {document?.name || 'Document'}
          </Typography>
          <IconButton color="inherit" onClick={handleSave}>
            <SaveIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Editor
          apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
          onInit={(evt, editor) => editorRef.current = editor}
          value={content}
          onEditorChange={(newContent) => setContent(newContent)}
          init={{
            height: '100%',
            menubar: true,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'media', 'table', 'help', 'wordcount',
              'save', 'autosave'
            ],
            toolbar: 'undo redo | formatselect | ' +
              'bold italic backcolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | help',
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
            skin: theme.palette.mode === 'dark' ? 'oxide-dark' : 'oxide',
            content_css: theme.palette.mode === 'dark' ? 'dark' : 'default',
          }}
        />
      </Box>
    </Dialog>
  );
};

export default DocumentEditor;
