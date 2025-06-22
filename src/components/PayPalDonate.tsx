import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

interface PayPalDonateProps {
  buttonId?: string;
}

const PayPalDonate: React.FC<PayPalDonateProps> = ({ 
  buttonId = '9WGS8R7479UJ6' 
}) => {
  const donateRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);
  const buttonRenderedRef = useRef(false);

  useEffect(() => {
    // Check if PayPal script is already loaded or being loaded
    if (scriptLoadedRef.current || document.querySelector('script[src*="paypalobjects.com/donate/sdk"]')) {
      // If script exists but button hasn't been rendered yet, try to render it
      if (window.PayPal && window.PayPal.Donation && !buttonRenderedRef.current) {
        renderButton();
      }
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://www.paypalobjects.com/donate/sdk/donate-sdk.js';
    script.charset = 'UTF-8';
    script.async = true;
    
    script.onload = () => {
      scriptLoadedRef.current = true;
      renderButton();
    };

    script.onerror = () => {
      console.error('Failed to load PayPal SDK');
    };

    document.head.appendChild(script);

    return () => {
      // Reset refs on cleanup
      buttonRenderedRef.current = false;
    };
  }, [buttonId]);

  const renderButton = () => {
    // Prevent multiple buttons from being rendered
    if (buttonRenderedRef.current) {
      return;
    }

    // Clear any existing button content
    const buttonContainer = document.getElementById('donate-button');
    if (buttonContainer) {
      buttonContainer.innerHTML = '';
    }

    // Ensure PayPal object is available
    if (window.PayPal && window.PayPal.Donation) {
      try {
        window.PayPal.Donation.Button({
          env: 'production',
          hosted_button_id: buttonId,
          image: {
            src: 'https://www.paypalobjects.com/en_AU/i/btn/btn_donate_LG.gif',
            alt: 'Donate with PayPal button',
            title: 'PayPal - The safer, easier way to pay online!',
          }
        }).render('#donate-button');
        
        buttonRenderedRef.current = true;
      } catch (error) {
        console.error('Error rendering PayPal donate button:', error);
      }
    }
  };

  return (
    <Box 
      ref={donateRef}
      sx={{ 
        display: 'flex', 
        alignItems: 'center',
        '& #donate-button': {
          display: 'flex',
          alignItems: 'center'
        }
      }}
    >
      <div id="donate-button"></div>
    </Box>
  );
};

// Extend Window interface to include PayPal
declare global {
  interface Window {
    PayPal?: {
      Donation: {
        Button: (config: {
          env: string;
          hosted_button_id: string;
          image: {
            src: string;
            alt: string;
            title: string;
          };
        }) => {
          render: (selector: string) => void;
        };
      };
    };
  }
}

export default PayPalDonate; 