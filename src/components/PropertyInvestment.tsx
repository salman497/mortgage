import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
} from '@mui/material';
import { AccountBalance, ExpandMore, Home, Calculate, Warning } from '@mui/icons-material';
import { PropertyInvestmentInputs } from '../types';
import { calculateNegativeGearing, formatCurrency, formatPercentage } from '../utils/mortgageCalculations';
import NumberInputWithK from './NumberInputWithK';
import TermWithInfo, { getExplanation } from './TermWithInfo';
import MermaidDiagramModal from './MermaidDiagramModal';

interface PropertyInvestmentProps {
  inputs: PropertyInvestmentInputs;
  onInputChange: (updates: Partial<PropertyInvestmentInputs>) => void;
}

const PropertyInvestment: React.FC<PropertyInvestmentProps> = ({ inputs, onInputChange }) => {
  const investmentAnalysis = useMemo(() => {
    return calculateNegativeGearing(inputs);
  }, [inputs]);

  const handleInvestmentInputChange = (field: keyof PropertyInvestmentInputs) => (value: number) => {
    onInputChange({ [field]: value });
  };

  const handleTextInputChange = (field: keyof PropertyInvestmentInputs) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(event.target.value) || 0;
    onInputChange({ [field]: value });
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <AccountBalance sx={{ mr: 1 }} />
        Property Investment Strategies
      </Typography>

      <Alert severity="warning" sx={{ mb: 3 }}>
        <strong>Disclaimer:</strong> Property investment involves significant risks. This calculator provides 
        estimates only. Always consult with qualified financial advisors before making investment decisions.
      </Alert>

      <Typography variant="h6" gutterBottom>
        Negative Gearing Calculator
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Card elevation={1}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Investment Property Details
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <TermWithInfo 
                  term="Property Price"
                  explanation={getExplanation('Property Value')}
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                />
                <NumberInputWithK
                  fullWidth
                  value={inputs.propertyPrice}
                  onChange={handleInvestmentInputChange('propertyPrice')}
                  InputProps={{ startAdornment: '$' }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <TermWithInfo 
                  term="Deposit"
                  explanation={getExplanation('Deposit')}
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                />
                <NumberInputWithK
                  fullWidth
                  value={inputs.deposit}
                  onChange={handleInvestmentInputChange('deposit')}
                  InputProps={{ startAdornment: '$' }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <TermWithInfo 
                  term="Weekly Rental Income"
                  explanation={getExplanation('Rental Income')}
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                />
                <TextField
                  fullWidth
                  type="number"
                  value={inputs.rentalIncome}
                  onChange={handleTextInputChange('rentalIncome')}
                  InputProps={{ startAdornment: '$' }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <TermWithInfo 
                  term="Weekly Expenses"
                  explanation={getExplanation('Expenses')}
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                />
                <TextField
                  fullWidth
                  type="number"
                  value={inputs.expenses}
                  onChange={handleTextInputChange('expenses')}
                  InputProps={{ startAdornment: '$' }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <TermWithInfo 
                  term="Interest Rate (%)"
                  explanation={getExplanation('Interest Rate')}
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                />
                <TextField
                  fullWidth
                  type="number"
                  value={inputs.interestRate}
                  onChange={handleTextInputChange('interestRate')}
                  inputProps={{ step: 0.1 }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <TermWithInfo 
                  term="Your Tax Rate (%)"
                  explanation={getExplanation('Tax Rate')}
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                />
                <TextField
                  fullWidth
                  type="number"
                  value={inputs.taxRate}
                  onChange={handleTextInputChange('taxRate')}
                />
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Card elevation={1}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Investment Analysis
                </Typography>
                <MermaidDiagramModal
                  title="Property Investment Cash Flow Analysis"
                  description="This diagram shows how rental income, expenses, and tax benefits combine to determine your investment property's cash flow."
                  mermaidCode={`
flowchart TD
    A["Property Price: ${formatCurrency(inputs.propertyPrice)}"] --> B[Loan Details]
    C["Deposit: ${formatCurrency(inputs.deposit)}"] --> B
    B --> D["Loan Amount: ${formatCurrency(inputs.propertyPrice - inputs.deposit)}"]
    D --> E[Monthly Payments]
    F["Interest Rate: ${inputs.interestRate}%"] --> E
    E --> G["Monthly Payment: ${formatCurrency(((inputs.propertyPrice - inputs.deposit) * (inputs.interestRate/100/12) * Math.pow(1 + inputs.interestRate/100/12, inputs.loanTermYears * 12)) / (Math.pow(1 + inputs.interestRate/100/12, inputs.loanTermYears * 12) - 1))}"]
    
    H["Weekly Rental: ${formatCurrency(inputs.rentalIncome)}"] --> I[Income]
    I --> J["Monthly Rental: ${formatCurrency(inputs.rentalIncome * 52/12)}"]
    
    K["Weekly Expenses: ${formatCurrency(inputs.expenses)}"] --> L[Costs]
    L --> M["Monthly Expenses: ${formatCurrency(inputs.expenses * 52/12)}"]
    G --> N[Cash Flow]
    J --> N
    M --> N
    N --> O["Monthly Cash Flow: ${formatCurrency(investmentAnalysis.cashFlow/12)}"]
    
    P["Tax Rate: ${inputs.taxRate}%"] --> Q[Tax Benefits]
    N --> Q
    Q --> R["After-Tax Cash Flow"]
                  `}
                />
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <TermWithInfo 
                  term="Weekly Cash Flow"
                  explanation={getExplanation('Cash Flow')}
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                />
                <Typography 
                  variant="h4" 
                  color={investmentAnalysis.cashFlow >= 0 ? 'success.main' : 'error.main'}
                  gutterBottom
                >
                  {formatCurrency(investmentAnalysis.cashFlow / 52)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Chip 
                    label={investmentAnalysis.cashFlow >= 0 ? 'Positive Gearing' : 'Negative Gearing'}
                    color={investmentAnalysis.cashFlow >= 0 ? 'success' : 'warning'}
                  />
                  <TermWithInfo 
                    term={investmentAnalysis.cashFlow >= 0 ? 'What is Positive Gearing?' : 'What is Negative Gearing?'}
                    explanation={getExplanation(investmentAnalysis.cashFlow >= 0 ? 'Positive Gearing' : 'Negative Gearing')}
                    variant="body2"
                  />
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <TermWithInfo 
                  term="Annual Tax Benefit"
                  explanation={getExplanation('Tax Deductions')}
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                />
                <Typography variant="h6" color="success.main">
                  {formatCurrency(investmentAnalysis.taxBenefit)}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <TermWithInfo 
                  term="Expected Capital Growth (3% p.a.)"
                  explanation={getExplanation('Capital Growth')}
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                />
                <Typography variant="h6">
                  {formatCurrency(investmentAnalysis.capitalGrowth)}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Net Annual Return
                </Typography>
                <Typography variant="h5" color="primary">
                  {formatCurrency(investmentAnalysis.netReturn)}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Return on Investment
                </Typography>
                <Typography variant="h6">
                  {formatPercentage(investmentAnalysis.totalReturn)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Alert severity="info" sx={{ mb: 2 }}>
        <strong>How Negative Gearing Works:</strong> When your rental income is less than your 
        property expenses (including interest), you can claim this loss against your other income, 
        reducing your tax. The tax benefit helps offset the cash flow shortfall.
      </Alert>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Understanding Negative Gearing</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            <ListItem>
              <ListItemText 
                primary="Tax Deductible Expenses"
                secondary="Interest payments, property management fees, insurance, rates, repairs and maintenance"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Capital Gains Tax"
                secondary="When you sell, you'll pay CGT on the profit, but you get a 50% discount if held for over 12 months"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Depreciation Benefits"
                secondary="You can claim depreciation on the building and fittings, providing additional tax deductions"
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Card elevation={1} sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Using Property Equity for Multiple Properties
          </Typography>
          <Typography variant="body1" paragraph>
            Once you've built equity in your first property, you can use it as security to purchase 
            additional investment properties. This strategy, known as "equity multiplication," allows 
            you to build a property portfolio without saving for multiple deposits.
          </Typography>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1">How Equity Access Works</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                <ListItem>
                  <ListItemIcon><Home color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Home Equity Loan"
                    secondary="Borrow against your existing property's equity to fund the deposit for an investment property"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Calculate color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Cross-Collateralization"
                    secondary="Use your existing property as security for the new loan, often requiring less cash deposit"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Warning color="warning" /></ListItemIcon>
                  <ListItemText 
                    primary="Risks to Consider"
                    secondary="Your existing home becomes security for both loans. If investment fails, you could lose your primary residence"
                  />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PropertyInvestment; 