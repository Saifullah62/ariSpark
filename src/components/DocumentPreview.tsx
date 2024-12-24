import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Button,
  TextField,
  Tooltip,
} from '@mui/material';
import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  RotateLeft as RotateLeftIcon,
  RotateRight as RotateRightIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  Edit as EditIcon,
  History as HistoryIcon,
  Comment as CommentIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface DocumentPreviewProps {
  document: {
    id: string;
    name: string;
    type: string;
    url: string;
    metadata?: {
      author?: string;
      createdDate?: Date;
      lastModified?: Date;
      size?: number;
      version?: string;
      tags?: string[];
      comments?: Array<{
        id: string;
        user: string;
        text: string;
        timestamp: Date;
        resolved?: boolean;
      }>;
      history?: Array<{
        version: string;
        date: Date;
        author: string;
        changes: string;
      }>;
    };
  };
  onClose: () => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ document, onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [selectedTab, setSelectedTab] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleDocumentLoadSuccess = ({ numPages }: { numPages: any }) => {
    setNumPages(numPages);
  };

  const renderPdfPreview = () => (
    <Box sx={{ overflow: 'auto', height: '100%' }}>
      <Document
        file={document.url}
        onLoadSuccess={handleDocumentLoadSuccess}
        loading={
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <Typography>Loading PDF...</Typography>
          </Box>
        }
      >
        <Page
          pageNumber={currentPage}
          scale={scale}
          rotate={rotation}
          loading={
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <Typography>Loading page...</Typography>
            </Box>
          }
        />
      </Document>
    </Box>
  );

  const renderImagePreview = () => (
    <Box
      component="img"
      src={document.url}
      alt={document.name}
      sx={{
        maxWidth: '100%',
        height: 'auto',
        transform: `scale(${scale}) rotate(${rotation}deg)`,
        transition: 'transform 0.3s',
      }}
    />
  );

  const renderVideoPreview = () => (
    <Box
      component="video"
      controls
      sx={{ width: '100%', maxHeight: '70vh' }}
    >
      <source src={document.url} type={document.type} />
      Your browser does not support the video tag.
    </Box>
  );

  const renderToolbar = () => (
    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
      <Tooltip title="Zoom In">
        <IconButton onClick={() => setScale(s => Math.min(s + 0.1, 2))}>
          <ZoomInIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Zoom Out">
        <IconButton onClick={() => setScale(s => Math.max(s - 0.1, 0.5))}>
          <ZoomOutIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Rotate Left">
        <IconButton onClick={() => setRotation(r => r - 90)}>
          <RotateLeftIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Rotate Right">
        <IconButton onClick={() => setRotation(r => r + 90)}>
          <RotateRightIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Download">
        <IconButton>
          <DownloadIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Print">
        <IconButton>
          <PrintIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Share">
        <IconButton>
          <ShareIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Edit">
        <IconButton>
          <EditIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );

  const renderMetadata = () => (
    <List>
      {document.metadata && (
        <>
          <ListItem>
            <ListItemIcon>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText
              primary="Author"
              secondary={document.metadata.author || 'Unknown'}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <HistoryIcon />
            </ListItemIcon>
            <ListItemText
              primary="Created"
              secondary={document.metadata.createdDate?.toLocaleDateString()}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <EditIcon />
            </ListItemIcon>
            <ListItemText
              primary="Last Modified"
              secondary={document.metadata.lastModified?.toLocaleDateString()}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Tags"
              secondary={
                <Box sx={{ mt: 1 }}>
                  {document.metadata.tags?.map(tag => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </Box>
              }
            />
          </ListItem>
        </>
      )}
    </List>
  );

  const renderComments = () => (
    <Box>
      <List>
        {document.metadata?.comments?.map(comment => (
          <ListItem key={comment.id}>
            <ListItemIcon>
              <CommentIcon />
            </ListItemIcon>
            <ListItemText
              primary={comment.user}
              secondary={
                <>
                  <Typography variant="body2">{comment.text}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {comment.timestamp.toLocaleString()}
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
      <Box sx={{ mt: 2, p: 2 }}>
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button
          variant="contained"
          sx={{ mt: 1 }}
          disabled={!newComment.trim()}
          onClick={() => {
            // Handle comment submission
            setNewComment('');
          }}
        >
          Add Comment
        </Button>
      </Box>
    </Box>
  );

  const renderVersionHistory = () => (
    <List>
      {document.metadata?.history?.map(version => (
        <ListItem key={version.version}>
          <ListItemIcon>
            <HistoryIcon />
          </ListItemIcon>
          <ListItemText
            primary={`Version ${version.version}`}
            secondary={
              <>
                <Typography variant="body2">
                  {version.changes}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {version.author} - {version.date.toLocaleString()}
                </Typography>
              </>
            }
          />
        </ListItem>
      ))}
    </List>
  );

  return (
    <Box sx={{ height: '100%', display: 'flex' }}>
      {/* Main Preview */}
      <Box sx={{ flexGrow: 1, p: 2 }}>
        {renderToolbar()}
        {document.type.includes('pdf') && renderPdfPreview()}
        {document.type.includes('image') && renderImagePreview()}
        {document.type.includes('video') && renderVideoPreview()}
      </Box>

      {/* Sidebar */}
      <Paper sx={{ width: 300, borderLeft: 1, borderColor: 'divider' }}>
        <Tabs
          value={selectedTab}
          onChange={(_, newValue) => setSelectedTab(newValue)}
          variant="fullWidth"
        >
          <Tab label="Info" />
          <Tab label="Comments" />
          <Tab label="History" />
        </Tabs>
        <Box sx={{ p: 2 }}>
          {selectedTab === 0 && renderMetadata()}
          {selectedTab === 1 && renderComments()}
          {selectedTab === 2 && renderVersionHistory()}
        </Box>
      </Paper>
    </Box>
  );
};

export default DocumentPreview;
