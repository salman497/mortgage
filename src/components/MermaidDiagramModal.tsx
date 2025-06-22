import React, { useState, useEffect, useRef } from 'react';
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
  CircularProgress,
} from '@mui/material';
import { Close, Timeline } from '@mui/icons-material';
import mermaid from 'mermaid';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const diagramRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Initialize Mermaid
  useEffect(() => {
    try {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose',
        fontFamily: 'Arial, sans-serif',
        fontSize: 14,
        flowchart: {
          useMaxWidth: true,
          htmlLabels: true,
          curve: 'basis',
        },
        pie: {
          textPosition: 0.75,
        },
      });
      console.log('🔍 Mermaid initialized successfully');
    } catch (error) {
      console.error('🔍 Mermaid initialization error:', error);
    }
  }, []);

  // Render diagram when modal opens
  useEffect(() => {
    if (open && diagramRef.current) {
      renderDiagram();
    }
  }, [open, mermaidCode]);

  const renderDiagram = async () => {
    if (!diagramRef.current) return;

    setLoading(true);
    setError(null);

    try {
      // Debug logging
      console.log('🔍 Mermaid Debug - Starting render:', {
        mermaidCode: mermaidCode.trim(),
        codeLength: mermaidCode.length,
        isEmpty: !mermaidCode.trim()
      });

      if (!mermaidCode.trim()) {
        throw new Error('Mermaid code is empty or contains only whitespace');
      }

      // Clear previous diagram
      diagramRef.current.innerHTML = '';
      
      // Generate unique ID for this diagram
      const diagramId = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      console.log('🔍 Mermaid Debug - Attempting render with ID:', diagramId);
      
      // For mermaid v10.9.1, use the render method correctly
      const result = await mermaid.render(diagramId, mermaidCode.trim());
      const svg = result.svg || result; // Handle different return formats
      
      console.log('🔍 Mermaid Debug - Render successful, SVG length:', typeof svg === 'string' ? svg.length : 'Not a string');
      
      // Insert the SVG into the container
      if (typeof svg === 'string') {
        diagramRef.current.innerHTML = svg;
        
        // Make the diagram responsive
        const svgElement = diagramRef.current.querySelector('svg');
        if (svgElement) {
          svgElement.style.maxWidth = '100%';
          svgElement.style.height = 'auto';
          svgElement.style.display = 'block';
          console.log('🔍 Mermaid Debug - SVG styles applied');
        } else {
          console.warn('🔍 Mermaid Debug - No SVG element found after render');
        }
      } else {
        throw new Error('Mermaid render did not return expected SVG string');
      }
    } catch (err) {
      console.error('🔍 Mermaid rendering error:', err);
      console.error('🔍 Mermaid code that failed:', mermaidCode);
      setError(`Failed to render diagram: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    if (!disabled) {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    if (diagramRef.current) {
      diagramRef.current.innerHTML = '';
    }
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
              position: 'relative',
            }}
          >
            {loading && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <CircularProgress color="primary" />
                <Typography variant="body2" color="text.secondary">
                  Rendering diagram...
                </Typography>
              </Box>
            )}
            
            {error && (
              <Box sx={{ textAlign: 'center', color: 'error.main' }}>
                <Typography variant="body1" gutterBottom>
                  ⚠️ {error}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  The calculation logic is still working correctly.
                </Typography>
              </Box>
            )}

            {!loading && !error && (
              <Box
                ref={diagramRef}
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  '& svg': {
                    maxWidth: '100%',
                    height: 'auto',
                  },
                }}
              />
            )}

            {/* Fallback for empty diagram */}
            {!loading && !error && diagramRef.current && !diagramRef.current.innerHTML && (
              <Box sx={{ textAlign: 'center', color: 'warning.main' }}>
                <Typography variant="body1" gutterBottom>
                  🔍 Diagram appears empty
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Check browser console for debugging information
                </Typography>
              </Box>
            )}
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
            💡 This interactive diagram shows the step-by-step calculation process with your current values
          </Typography>
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