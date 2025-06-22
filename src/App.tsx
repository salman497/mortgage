import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  useMediaQuery,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { Calculate, Home, TrendingUp, School, AccountBalance, RestartAlt } from '@mui/icons-material';

// Import components
import MortgageCalculator from './components/MortgageCalculator';
import InterestAnalysis from './components/InterestAnalysis';
import PayoffStrategies from './components/PayoffStrategies';
import PropertyInvestment from './components/PropertyInvestment';
import EducationalContent from './components/EducationalContent';
import PayPalDonate from './components/PayPalDonate';
import { MortgageInputs, PropertyInvestmentInputs } from './types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

// Default values
const DEFAULT_MORTGAGE_INPUTS: MortgageInputs = {
  loanAmount: 500000,
  interestRate: 6.5,
  loanTermYears: 30,
  propertyValue: 625000,
  offsetBalance: 0,
};

const DEFAULT_PROPERTY_INPUTS: PropertyInvestmentInputs = {
  propertyPrice: 600000,
  deposit: 120000,
  rentalIncome: 450,
  expenses: 200,
  interestRate: 6.5,
  loanTermYears: 30,
  taxRate: 37,
};

const DEFAULT_EXTRA_PAYMENT = 0;

// LocalStorage keys
const STORAGE_KEYS = {
  MORTGAGE_INPUTS: 'mortgageCalculator_mortgageInputs',
  PROPERTY_INPUTS: 'mortgageCalculator_propertyInputs',
  EXTRA_PAYMENT: 'mortgageCalculator_extraPayment',
  TAB_VALUE: 'mortgageCalculator_tabValue',
};

function App() {
  const [tabValue, setTabValue] = useState(0);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Load initial values from localStorage or use defaults
  const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
      console.warn(`Failed to load ${key} from localStorage:`, error);
      return defaultValue;
    }
  };

  // Shared mortgage inputs state
  const [mortgageInputs, setMortgageInputs] = useState<MortgageInputs>(() =>
    loadFromStorage(STORAGE_KEYS.MORTGAGE_INPUTS, DEFAULT_MORTGAGE_INPUTS)
  );

  // Property investment inputs state (shares interestRate with mortgage inputs)
  const [propertyInputs, setPropertyInputs] = useState<PropertyInvestmentInputs>(() =>
    loadFromStorage(STORAGE_KEYS.PROPERTY_INPUTS, DEFAULT_PROPERTY_INPUTS)
  );

  // Additional state for Interest Analysis
  const [extraPayment, setExtraPayment] = useState(() =>
    loadFromStorage(STORAGE_KEYS.EXTRA_PAYMENT, DEFAULT_EXTRA_PAYMENT)
  );

  // Load saved tab value
  useEffect(() => {
    const savedTab = loadFromStorage(STORAGE_KEYS.TAB_VALUE, 0);
    setTabValue(savedTab);
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MORTGAGE_INPUTS, JSON.stringify(mortgageInputs));
  }, [mortgageInputs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROPERTY_INPUTS, JSON.stringify(propertyInputs));
  }, [propertyInputs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXTRA_PAYMENT, JSON.stringify(extraPayment));
  }, [extraPayment]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TAB_VALUE, JSON.stringify(tabValue));
  }, [tabValue]);

  // Sync interest rate between mortgage and property inputs
  const handleMortgageInputChange = (updates: Partial<MortgageInputs>) => {
    setMortgageInputs(prev => {
      const newInputs = { ...prev, ...updates };
      
      // Sync interest rate to property inputs if it changed
      if ('interestRate' in updates) {
        setPropertyInputs(prevProperty => ({
          ...prevProperty,
          interestRate: newInputs.interestRate
        }));
      }
      
      return newInputs;
    });
  };

  const handlePropertyInputChange = (updates: Partial<PropertyInvestmentInputs>) => {
    setPropertyInputs(prev => {
      const newInputs = { ...prev, ...updates };
      
      // Sync interest rate to mortgage inputs if it changed
      if ('interestRate' in updates) {
        setMortgageInputs(prevMortgage => ({
          ...prevMortgage,
          interestRate: newInputs.interestRate
        }));
      }
      
      return newInputs;
    });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleReset = () => {
    // Clear all localStorage
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });

    // Reset all state to defaults
    setMortgageInputs(DEFAULT_MORTGAGE_INPUTS);
    setPropertyInputs(DEFAULT_PROPERTY_INPUTS);
    setExtraPayment(DEFAULT_EXTRA_PAYMENT);
    setTabValue(0);
    setResetDialogOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Home sx={{ mr: 2 }} />
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              minWidth: 0 // Allows flex item to shrink below its content size
            }}
          >
            Australian Mortgage - Take Control
          </Typography>
          <PayPalDonate />
          <Button
            color="inherit"
            startIcon={<RestartAlt />}
            onClick={() => setResetDialogOpen(true)}
            sx={{ 
              ml: 2,
              minWidth: 'auto', // Prevents button from being too wide on mobile
              '& .MuiButton-startIcon': {
                display: { xs: 'none', sm: 'flex' } // Hide icon on extra small screens
              }
            }}
          >
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
              Reset All
            </Box>
            <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
              Reset
            </Box>
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 3, mb: 3 }}>
        <Paper elevation={2}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant={isMobile ? 'scrollable' : 'fullWidth'}
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab
              label="Calculator"
              icon={<Calculate />}
              iconPosition="start"
              sx={{ minHeight: 72 }}
            />
            <Tab
              label="Interest Analysis"
              icon={<TrendingUp />}
              iconPosition="start"
              sx={{ minHeight: 72 }}
            />
            <Tab
              label="Payoff Strategies"
              icon={<School />}
              iconPosition="start"
              sx={{ minHeight: 72 }}
            />
            <Tab
              label="Property Investment"
              icon={<AccountBalance />}
              iconPosition="start"
              sx={{ minHeight: 72 }}
            />
            <Tab
              label="Learn More"
              icon={<School />}
              iconPosition="start"
              sx={{ minHeight: 72 }}
            />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <MortgageCalculator 
              inputs={mortgageInputs}
              onInputChange={handleMortgageInputChange}
            />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <InterestAnalysis 
              inputs={mortgageInputs}
              onInputChange={handleMortgageInputChange}
              extraPayment={extraPayment}
              onExtraPaymentChange={setExtraPayment}
            />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <PayoffStrategies 
              inputs={mortgageInputs}
              onInputChange={handleMortgageInputChange}
            />
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            <PropertyInvestment 
              inputs={propertyInputs}
              onInputChange={handlePropertyInputChange}
            />
          </TabPanel>
          <TabPanel value={tabValue} index={4}>
            <EducationalContent />
          </TabPanel>
        </Paper>
      </Container>

      {/* Reset Confirmation Dialog */}
      <Dialog
        open={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
        aria-labelledby="reset-dialog-title"
        aria-describedby="reset-dialog-description"
      >
        <DialogTitle id="reset-dialog-title">
          Reset All Data?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="reset-dialog-description">
            This will clear all your entered values and reset everything back to the default settings. 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleReset} color="error" variant="contained">
            Reset All
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

export default App;
