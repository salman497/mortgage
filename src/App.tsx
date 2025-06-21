import React, { useState } from 'react';
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
} from '@mui/material';
import { Calculate, Home, TrendingUp, School, AccountBalance } from '@mui/icons-material';

// Import components
import MortgageCalculator from './components/MortgageCalculator';
import InterestAnalysis from './components/InterestAnalysis';
import PayoffStrategies from './components/PayoffStrategies';
import PropertyInvestment from './components/PropertyInvestment';
import EducationalContent from './components/EducationalContent';

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

function App() {
  const [tabValue, setTabValue] = useState(0);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Home sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Mortgage: How Banks Fool Us
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 3, mb: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Understanding Your Mortgage
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Discover how mortgages really work and learn strategies to save thousands
          </Typography>
        </Box>

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
            <MortgageCalculator />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <InterestAnalysis />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <PayoffStrategies />
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            <PropertyInvestment />
          </TabPanel>
          <TabPanel value={tabValue} index={4}>
            <EducationalContent />
          </TabPanel>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default App;
