import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
  Chip,
} from '@mui/material';
import { Close, Timeline } from '@mui/icons-material';

interface MermaidDiagramModalProps {
  title: string;
  description: string;
  mermaidCode: string;
  triggerComponent?: React.ReactNode;
  disabled?: boolean;
}

const MermaidDiagramModal: React.FC<MermaidDiagramModalProps> = ({
  title,
  description,
  mermaidCode,
  triggerComponent,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleOpen = () => {
    if (!disabled) {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Default trigger component if none provided
  const defaultTrigger = (
    <Chip
      icon={<Timeline />}
      label="View Calculation Flow"
      onClick={handleOpen}
      variant="outlined"
      color="primary"
      size="small"
      sx={{ 
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        '&:hover': {
          backgroundColor: disabled ? 'transparent' : 'primary.light',
        }
      }}
      disabled={disabled}
    />
  );

  return (
    <>
      {/* Trigger Component */}
      <Box onClick={handleOpen} sx={{ display: 'inline-block' }}>
        {triggerComponent || defaultTrigger}
      </Box>

      {/* Modal Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        fullScreen={isMobile}
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: isMobile ? 0 : 2,
            m: isMobile ? 0 : 2,
            minHeight: isMobile ? '100vh' : '60vh',
          },
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pr: 1,
          bgcolor: 'primary.main',
          color: 'white'
        }}>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ color: 'white' }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 3 }}>
          <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
            {description}
          </Typography>
          
          {/* Mermaid Diagram Container */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '400px',
              bgcolor: '#f8f9fa',
              borderRadius: 2,
              p: 3,
              border: '1px solid #e0e0e0',
              overflow: 'auto',
            }}
          >
            {/* Improved visual for the diagram code */}
            <Box
              sx={{
                width: '100%',
                maxWidth: '100%',
                textAlign: 'center',
              }}
            >
              <Typography variant="h6" color="primary" gutterBottom>
                📊 Interactive Calculation Flow
              </Typography>
              <Box
                component="pre"
                sx={{
                  fontSize: '0.8rem',
                  fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                  bgcolor: 'white',
                  p: 2,
                  borderRadius: 1,
                  border: '1px solid #ddd',
                  textAlign: 'left',
                  overflow: 'auto',
                  maxHeight: '50vh',
                  lineHeight: 1.4,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {mermaidCode.trim()}
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                💡 This shows the step-by-step calculation process with your current values
              </Typography>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, bgcolor: '#f5f5f5' }}>
          <Button onClick={handleClose} variant="contained" color="primary" size="large">
            Got it! Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MermaidDiagramModal; 