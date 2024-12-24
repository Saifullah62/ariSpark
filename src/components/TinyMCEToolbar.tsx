import React from 'react';
import { Box, IconButton, Tooltip, CircularProgress } from '@mui/material';
import {
  AutoFixHigh as ImproveIcon,
  Psychology as SuggestIcon,
  Spellcheck as GrammarIcon,
  FormatListBulleted as OutlineIcon,
  Summarize as SummarizeIcon,
  Lightbulb as ExplainIcon,
} from '@mui/icons-material';
import { Editor } from '@tinymce/tinymce-react';
import { tinymceService } from '../services/tinymce';

interface TinyMCEToolbarProps {
  editor: Editor | null;
}

export const TinyMCEToolbar: React.FC<TinyMCEToolbarProps> = ({ editor }) => {
  const [loading, setLoading] = React.useState(false);

  const getSelectedContent = (): string => {
    if (!editor) return '';
    return editor.selection.getContent({ format: 'text' }) || editor.getContent({ format: 'text' });
  };

  const updateContent = (newContent: string) => {
    if (!editor) return;
    editor.selection.setContent(newContent);
  };

  const handleAction = async (action: (content: string) => Promise<string>) => {
    if (!editor || loading) return;

    const content = getSelectedContent();
    if (!content) {
      editor.notificationManager.open({
        text: 'Please select some text or have content in the editor.',
        type: 'warning',
      });
      return;
    }

    setLoading(true);
    try {
      const result = await action(content);
      updateContent(result);
      editor.notificationManager.open({
        text: 'Content updated successfully!',
        type: 'success',
      });
    } catch (error) {
      console.error('Error:', error);
      editor.notificationManager.open({
        text: 'An error occurred. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, p: 1, borderBottom: 1, borderColor: 'divider' }}>
      <Tooltip title="Improve Writing">
        <IconButton
          onClick={() => handleAction(tinymceService.improveWriting)}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : <ImproveIcon />}
        </IconButton>
      </Tooltip>

      <Tooltip title="Suggest Completion">
        <IconButton
          onClick={() => handleAction(tinymceService.suggestCompletion)}
          disabled={loading}
        >
          <SuggestIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Fix Grammar">
        <IconButton
          onClick={() => handleAction(tinymceService.fixGrammar)}
          disabled={loading}
        >
          <GrammarIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Generate Outline">
        <IconButton
          onClick={() => handleAction(tinymceService.generateOutline)}
          disabled={loading}
        >
          <OutlineIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Summarize">
        <IconButton
          onClick={() => handleAction(tinymceService.summarize)}
          disabled={loading}
        >
          <SummarizeIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Explain Concept">
        <IconButton
          onClick={() => handleAction(tinymceService.explainConcept)}
          disabled={loading}
        >
          <ExplainIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};
