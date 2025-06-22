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
import MermaidDiagramModal from './MermaidDiagramModal';

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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Monthly Payment Breakdown
                  </Typography>
                  <MermaidDiagramModal
                    title="Monthly Payment Calculation"
                    description="This diagram shows how your monthly mortgage payment is calculated using the amortization formula and how it's split between principal and interest."
                    mermaidCode={`
flowchart TD
    A["Loan Amount: ${formatCurrency(inputs.loanAmount)}"] --> B[Monthly Interest Rate]
    C["Annual Rate: ${inputs.interestRate}%"] --> B
    B --> D["Monthly Rate = ${inputs.interestRate}% ÷ 12 = ${(inputs.interestRate/12).toFixed(3)}%"]
    E["Loan Term: ${inputs.loanTermYears} years"] --> F["Total Payments = ${inputs.loanTermYears} × 12 = ${(inputs.loanTermYears * 12)} months"]
    A --> G[Amortization Formula]
    D --> G
    F --> G
    G --> H["Monthly Payment = ${formatCurrency(results.monthlyPayment)}"]
    H --> I[Payment Split]
    I --> J["Principal: ${formatCurrency(results.monthlyPrincipal)}"]
    I --> K["Interest: ${formatCurrency(results.monthlyInterest)}"]
    L["Offset Balance: ${formatCurrency(inputs.offsetBalance || 0)}"] --> M[Effective Balance]
    A --> M
    M --> N["${formatCurrency(Math.max(0, inputs.loanAmount - (inputs.offsetBalance || 0)))}"]
    N --> K
                    `}
                  />
                </Box>
                
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
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Interest Over Life of Loan
                    </Typography>
                    <MermaidDiagramModal
                      title="Total Interest Calculation"
                      description="This diagram shows how your total interest is calculated over the life of the loan, including the impact of your offset account."
                      mermaidCode={`
flowchart TD
    A["Monthly Payment: ${formatCurrency(results.monthlyPayment)}"] --> B[Payment Schedule]
    C["Loan Term: ${inputs.loanTermYears} years (${inputs.loanTermYears * 12} payments)"] --> B
    D["Offset Balance: ${formatCurrency(inputs.offsetBalance || 0)}"] --> E[Effective Interest]
    F["Loan Balance Each Month"] --> E
    E --> G[Monthly Interest Payment]
    G --> H[Cumulative Interest]
    B --> H
    H --> I["Total Interest: ${formatCurrency(results.totalInterest)}"]
    J["Original Loan: ${formatCurrency(inputs.loanAmount)}"] --> K[Total Cost]
    I --> K
    K --> L["Total You'll Pay: ${formatCurrency(results.totalPayment)}"]
    M["Interest as % of Loan"] --> N["${formatPercentage((results.totalInterest / inputs.loanAmount) * 100)}"]
                      `}
                    />
                  </Box>
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <TermWithInfo 
                        term="Lender's Mortgage Insurance (LMI)"
                        explanation={getExplanation('LMI')}
                        variant="body2"
                        color="text.secondary"
                      />
                      <MermaidDiagramModal
                        title="LMI Calculation"
                        description="This diagram shows how Lender's Mortgage Insurance (LMI) is calculated based on your Loan-to-Value Ratio (LVR)."
                        mermaidCode={`
flowchart TD
    A["Loan Amount: ${formatCurrency(inputs.loanAmount)}"] --> C[LVR Calculation]
    B["Property Value: ${formatCurrency(inputs.propertyValue || 0)}"] --> C
    C --> D["LVR = ${formatPercentage(loanToValueRatio)}"]
    D --> E{LVR > 80%?}
    E -->|No| F["No LMI Required"]
    E -->|Yes| G[LMI Rate Determination]
    G --> H{LVR Range}
    H -->|80-85%| I["LMI Rate: 0.5%"]
    H -->|85-90%| J["LMI Rate: 1.0%"]
    H -->|90-95%| K["LMI Rate: 1.5%"]
    H -->|95%+| L["LMI Rate: 2.0%"]
    I --> M[Calculate LMI]
    J --> M
    K --> M
    L --> M
    A --> M
    M --> N["LMI = ${formatCurrency(results.lmiAmount)}"]
                        `}
                      />
                    </Box>
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    🎉 Offset Account Benefits
                  </Typography>
                  <MermaidDiagramModal
                    title="Offset Account Benefits"
                    description="This diagram shows how your offset account saves you money by reducing the effective loan balance that accrues interest."
                    mermaidCode={`
flowchart TD
    A["Original Loan: ${formatCurrency(inputs.loanAmount)}"] --> B[Offset Impact]
    C["Offset Balance: ${formatCurrency(inputs.offsetBalance)}"] --> B
    B --> D["Effective Loan Balance"]
    D --> E["${formatCurrency(Math.max(0, inputs.loanAmount - inputs.offsetBalance))}"]
    F["Interest Rate: ${inputs.interestRate}%"] --> G[Monthly Savings]
    C --> G
    G --> H["Monthly Interest Savings"]
    H --> I["${formatCurrency((inputs.offsetBalance * inputs.interestRate) / 100 / 12)}"]
    G --> J[Annual Savings]
    J --> K["${formatCurrency((inputs.offsetBalance * inputs.interestRate) / 100)}"]
    L[Effective Interest Rate] --> M["${formatPercentage(inputs.interestRate * (1 - inputs.offsetBalance / inputs.loanAmount))}"]
    N[Tax Benefits] --> O["Tax-Free Savings<br/>(Unlike term deposits)"]
                    `}
                  />
                </Box>
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