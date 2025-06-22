import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  Card,
  CardContent,
  Alert,
  Divider,
  Chip,
} from '@mui/material';
import { Calculate } from '@mui/icons-material';
import { MortgageInputs, MortgageCalculation } from '../types';
import { calculateMortgageDetails, formatCurrency, formatPercentage } from '../utils/mortgageCalculations';
import NumberInputWithK from './NumberInputWithK';
import TermWithInfo, { getExplanation } from './TermWithInfo';

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
                <TermWithInfo 
                  term="Loan Amount - How much did you borrow?"
                  explanation={getExplanation('Loan Amount')}
                  gutterBottom
                />
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
                <TermWithInfo 
                  term="Property Value"
                  explanation={getExplanation('Property Value')}
                  gutterBottom
                />
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
                <TermWithInfo 
                  term="Interest Rate (% per year)"
                  explanation={getExplanation('Interest Rate')}
                  gutterBottom
                />
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
                <TermWithInfo 
                  term="Loan Term (years)"
                  explanation={getExplanation('Loan Term')}
                  gutterBottom
                />
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
                <TermWithInfo 
                  term="Offset Account Balance"
                  explanation={getExplanation('Offset Account')}
                  gutterBottom
                />
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
                    per month in interest! Over the life of your loan, you'll save{' '}
                    <strong>${formatCurrency((inputs.offsetBalance * inputs.interestRate) / 100 * inputs.loanTermYears).replace('$', '')}</strong>{' '}
                    in total interest payments to the bank.
                    <br /><br />
                    <strong>Best part:</strong> This money stays accessible - you can spend it anytime you need it, 
                    unlike extra loan repayments which are locked away!
                  </Alert>
                )}
              </Box>

              {loanToValueRatio > 80 && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                    <span>Your</span>
                    <TermWithInfo 
                      term="LVR"
                      explanation={getExplanation('LVR')}
                      variant="body2"
                    />
                    <span>is {formatPercentage(loanToValueRatio)}. You'll need to pay</span>
                    <TermWithInfo 
                      term="LMI"
                      explanation={getExplanation('LMI')}
                      variant="body2"
                    />
                  </Box>
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
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <TermWithInfo 
                        term="Principal"
                        explanation={getExplanation('Principal')}
                        variant="body2"
                        color="text.secondary"
                      />
                    </Box>
                    <Typography variant="h6">
                      {formatCurrency(results.monthlyPrincipal)}
                    </Typography>
                  </Box>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <TermWithInfo 
                        term="Interest"
                        explanation={getExplanation('Interest')}
                        variant="body2"
                        color="text.secondary"
                      />
                    </Box>
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
                    <TermWithInfo 
                      term="Lender's Mortgage Insurance (LMI)"
                      explanation={getExplanation('LMI')}
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    />
                    <Typography variant="h6" color="warning.main">
                      {formatCurrency(results.lmiAmount)}
                    </Typography>
                  </Box>
                )}

                {results.stampDuty && results.stampDuty > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <TermWithInfo 
                      term="Stamp Duty (NSW estimate)"
                      explanation={getExplanation('Stamp Duty')}
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    />
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