import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  Card,
  CardContent,
  Tooltip,
  IconButton,
  Alert,
  Divider,
  Chip,
} from '@mui/material';
import { Info, Calculate } from '@mui/icons-material';
import { MortgageInputs, MortgageCalculation } from '../types';
import { calculateMortgageDetails, formatCurrency, formatPercentage } from '../utils/mortgageCalculations';
import NumberInputWithK from './NumberInputWithK';

interface MortgageCalculatorProps {
  inputs: MortgageInputs;
  onInputChange: (updates: Partial<MortgageInputs>) => void;
}

const MortgageCalculator: React.FC<MortgageCalculatorProps> = ({ inputs, onInputChange }) => {
  const [results, setResults] = useState<MortgageCalculation | null>(null);

  useEffect(() => {
    if (inputs.loanAmount > 0 && inputs.interestRate > 0 && inputs.loanTermYears > 0) {
      const calculation = calculateMortgageDetails(inputs);
      setResults(calculation);
    }
  }, [inputs]);

  const handleInputChange = (field: keyof MortgageInputs) => (value: number) => {
    onInputChange({ [field]: value });
  };

  const handleTextInputChange = (field: keyof MortgageInputs) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(event.target.value) || 0;
    onInputChange({ [field]: value });
  };

  const loanToValueRatio = inputs.propertyValue 
    ? (inputs.loanAmount / inputs.propertyValue) * 100 
    : 0;

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Calculate sx={{ mr: 1 }} />
        Mortgage Calculator
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Card elevation={1}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Loan Details
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    How much did you borrow?
                  </Typography>
                  <Tooltip title="The total amount you borrowed from the bank">
                    <IconButton size="small">
                      <Info fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <NumberInputWithK
                  fullWidth
                  value={inputs.loanAmount}
                  onChange={handleInputChange('loanAmount')}
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                  }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Property Value
                  </Typography>
                  <Tooltip title="The current market value of your property">
                    <IconButton size="small">
                      <Info fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <NumberInputWithK
                  fullWidth
                  value={inputs.propertyValue || 0}
                  onChange={handleInputChange('propertyValue')}
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                  }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Interest Rate (% per year)
                  </Typography>
                  <Tooltip title="The annual interest rate charged by your lender">
                    <IconButton size="small">
                      <Info fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <TextField
                  fullWidth
                  type="number"
                  value={inputs.interestRate}
                  onChange={handleTextInputChange('interestRate')}
                  inputProps={{ step: 0.1 }}
                  InputProps={{
                    endAdornment: <Typography sx={{ ml: 1 }}>%</Typography>,
                  }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Loan Term (years)
                  </Typography>
                  <Tooltip title="How long you have to pay back the loan">
                    <IconButton size="small">
                      <Info fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <TextField
                  fullWidth
                  type="number"
                  value={inputs.loanTermYears}
                  onChange={handleTextInputChange('loanTermYears')}
                  InputProps={{
                    endAdornment: <Typography sx={{ ml: 1 }}>years</Typography>,
                  }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Offset Account Balance
                  </Typography>
                  <Tooltip title="Money in your offset account reduces interest daily - every dollar counts!">
                    <IconButton size="small">
                      <Info fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <NumberInputWithK
                  fullWidth
                  value={inputs.offsetBalance || 0}
                  onChange={handleInputChange('offsetBalance')}
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                  }}
                />
                {inputs.offsetBalance && inputs.offsetBalance > 0 && (
                  <Alert severity="success" sx={{ mt: 1 }}>
                    <strong>Smart move!</strong> Your ${formatCurrency(inputs.offsetBalance).replace('$', '')} offset 
                    saves you ~${formatCurrency((inputs.offsetBalance * inputs.interestRate) / 100 / 12).replace('$', '')} 
                    per month in interest!
                  </Alert>
                )}
              </Box>

              {loanToValueRatio > 80 && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Your LVR is {formatPercentage(loanToValueRatio)}. 
                  You'll need to pay Lender's Mortgage Insurance (LMI).
                </Alert>
              )}
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: 1 }}>
          {results && (
            <Card elevation={1}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Monthly Payment Breakdown
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h4" color="primary" gutterBottom>
                    {formatCurrency(results.monthlyPayment)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total monthly payment
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Principal
                    </Typography>
                    <Typography variant="h6">
                      {formatCurrency(results.monthlyPrincipal)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Interest
                    </Typography>
                    <Typography variant="h6" color="error">
                      {formatCurrency(results.monthlyInterest)}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total Interest Over Life of Loan
                  </Typography>
                  <Typography variant="h5" color="error">
                    {formatCurrency(results.totalInterest)}
                  </Typography>
                  <Chip 
                    label={`${formatPercentage((results.totalInterest / inputs.loanAmount) * 100)} of loan amount`}
                    size="small"
                    color="error"
                    variant="outlined"
                    sx={{ mt: 1 }}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total Amount You'll Pay
                  </Typography>
                  <Typography variant="h6">
                    {formatCurrency(results.totalPayment)}
                  </Typography>
                </Box>

                {results.lmiAmount && results.lmiAmount > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Lender's Mortgage Insurance (LMI)
                    </Typography>
                    <Typography variant="h6" color="warning.main">
                      {formatCurrency(results.lmiAmount)}
                    </Typography>
                  </Box>
                )}

                {results.stampDuty && results.stampDuty > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Stamp Duty (NSW estimate)
                    </Typography>
                    <Typography variant="h6">
                      {formatCurrency(results.stampDuty)}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}
        </Box>
      </Box>

      {results && (
        <>
          <Card elevation={1} sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                The Reality Check
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                <strong>Did you know?</strong> You're paying the bank{' '}
                <strong>{formatCurrency(results.totalInterest)}</strong> in interest alone! 
                That's {formatPercentage((results.totalInterest / inputs.loanAmount) * 100)} 
                of your original loan amount.
              </Alert>
              <Typography variant="body2" color="text.secondary">
                Every month, you're paying <strong>{formatCurrency(results.monthlyInterest)}</strong> 
                to the bank as profit, while only <strong>{formatCurrency(results.monthlyPrincipal)}</strong> 
                goes toward actually owning your home.
              </Typography>
            </CardContent>
          </Card>

          {inputs.offsetBalance && inputs.offsetBalance > 0 && (
            <Card elevation={1} sx={{ mt: 3, bgcolor: 'success.light' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  🎉 Offset Account Benefits
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Monthly Interest Savings
                    </Typography>
                    <Typography variant="h5" color="success.main">
                      {formatCurrency((inputs.offsetBalance * inputs.interestRate) / 100 / 12)}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Annual Interest Savings
                    </Typography>
                    <Typography variant="h5" color="success.main">
                      {formatCurrency((inputs.offsetBalance * inputs.interestRate) / 100)}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Effective Interest Rate
                    </Typography>
                    <Typography variant="h5" color="info.main">
                      {formatPercentage(inputs.interestRate * (1 - inputs.offsetBalance / inputs.loanAmount))}
                    </Typography>
                  </Box>
                </Box>
                <Alert severity="success" sx={{ mt: 2 }}>
                  <strong>Tax-Free Savings:</strong> Unlike term deposits or savings accounts, 
                  offset account savings are not taxable income. It's like earning {formatPercentage(inputs.interestRate)} 
                  tax-free on your money!
                </Alert>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </Box>
  );
};

export default MortgageCalculator; 