import React, { useState, useEffect } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Paper,
  Grid,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Slider,
  Switch,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  SkipNext as NextIcon,
  SkipPrevious as PrevIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  Timer as TimerIcon,
  Settings as SettingsIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Edit as EditIcon,
  Notes as NotesIcon,
  Comment as CommentIcon,
  Draw as DrawIcon,
  Highlight as HighlightIcon,
  Save as SaveIcon,
  Share as ShareIcon,
} from '@mui/icons-material';

interface Slide {
  id: string;
  content: React.ReactNode;
  notes?: string;
  annotations?: Array<{
    type: 'highlight' | 'drawing' | 'comment';
    data: any;
  }>;
  duration?: number;
}

interface PresentationModeProps {
  document: {
    id: string;
    title: string;
    slides: Slide[];
  };
  onClose: () => void;
}

const PresentationMode: React.FC<PresentationModeProps> = ({ document, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [showSettings, setShowSettings] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showDrawer, setShowDrawer] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
        if (document.slides[currentSlide].duration && 
            elapsedTime >= document.slides[currentSlide].duration) {
          handleNext();
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentSlide, elapsedTime]);

  const handleNext = () => {
    if (currentSlide < document.slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
      setElapsedTime(0);
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
      setElapsedTime(0);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const renderSlideContent = (slide: Slide) => (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        transform: `scale(${zoom / 100})`,
        transition: 'transform 0.3s',
      }}
    >
      {slide.content}
      {showAnnotations && slide.annotations?.map((annotation, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            // Positioning would be based on annotation data
          }}
        >
          {annotation.type === 'highlight' && (
            <Box sx={{ bgcolor: 'yellow', opacity: 0.3 }}>
              {annotation.data.text}
            </Box>
          )}
          {annotation.type === 'drawing' && (
            <svg>
              <path d={annotation.data.path} stroke="red" fill="none" />
            </svg>
          )}
          {annotation.type === 'comment' && (
            <Tooltip title={annotation.data.text}>
              <CommentIcon color="primary" />
            </Tooltip>
          )}
        </Box>
      ))}
    </Box>
  );

  const renderControls = () => (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
        p: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <IconButton onClick={handlePrevious} disabled={currentSlide === 0}>
        <PrevIcon />
      </IconButton>
      <IconButton onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </IconButton>
      <IconButton
        onClick={handleNext}
        disabled={currentSlide === document.slides.length - 1}
      >
        <NextIcon />
      </IconButton>
      <Typography variant="body2" sx={{ mx: 2 }}>
        {currentSlide + 1} / {document.slides.length}
      </Typography>
      {showTimer && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TimerIcon />
          <Typography>
            {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}
          </Typography>
        </Box>
      )}
      <Box sx={{ flexGrow: 1 }} />
      <IconButton onClick={() => setShowNotes(!showNotes)}>
        <NotesIcon />
      </IconButton>
      <IconButton onClick={() => setShowAnnotations(!showAnnotations)}>
        <DrawIcon />
      </IconButton>
      <IconButton onClick={() => setShowSettings(true)}>
        <SettingsIcon />
      </IconButton>
      <IconButton onClick={toggleFullscreen}>
        {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
      </IconButton>
    </Box>
  );

  const renderSidebar = () => (
    <Drawer
      anchor="right"
      open={showDrawer}
      onClose={() => setShowDrawer(false)}
      variant="persistent"
      sx={{
        width: 300,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 300,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Slide Notes
        </Typography>
        {document.slides[currentSlide].notes ? (
          <Typography variant="body2">
            {document.slides[currentSlide].notes}
          </Typography>
        ) : (
          <Typography variant="body2" color="textSecondary">
            No notes for this slide
          </Typography>
        )}
      </Box>
    </Drawer>
  );

  const renderSettingsDialog = () => (
    <Dialog
      open={showSettings}
      onClose={() => setShowSettings(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Presentation Settings</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography gutterBottom>Zoom Level</Typography>
            <Slider
              value={zoom}
              onChange={(_, value) => setZoom(value as number)}
              min={50}
              max={200}
              step={10}
              marks
              valueLabelDisplay="auto"
              valueLabelFormat={value => `${value}%`}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={showTimer}
                  onChange={(e) => setShowTimer(e.target.checked)}
                />
              }
              label="Show Timer"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={showAnnotations}
                  onChange={(e) => setShowAnnotations(e.target.checked)}
                />
              }
              label="Show Annotations"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowSettings(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 3,
          position: 'relative',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          {renderSlideContent(document.slides[currentSlide])}
        </Paper>

        {/* Quick access tools */}
        <Box
          sx={{
            position: 'absolute',
            right: 24,
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Fab size="small" color="primary" onClick={() => setZoom(prev => Math.min(prev + 10, 200))}>
            <ZoomInIcon />
          </Fab>
          <Fab size="small" color="primary" onClick={() => setZoom(prev => Math.max(prev - 10, 50))}>
            <ZoomOutIcon />
          </Fab>
          <Fab size="small" color="primary" onClick={() => setShowDrawer(!showDrawer)}>
            <NotesIcon />
          </Fab>
          <Fab size="small" color="primary">
            <HighlightIcon />
          </Fab>
          <Fab size="small" color="primary">
            <DrawIcon />
          </Fab>
        </Box>
      </Box>

      {renderControls()}
      {renderSidebar()}
      {renderSettingsDialog()}
    </Box>
  );
};

export default PresentationMode;
