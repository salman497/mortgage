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
                  value={inputs.interestRate || ''}
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
                  value={inputs.loanTermYears || ''}
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
                {inputs.offsetBalance && inputs.offsetBalance > 0 ? (
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
                ) : (
                  <Box />
                )}
              </Box>

              {loanToValueRatio > 80 ? (
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
              ) : (
                <Box />
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
                    title="How Your Monthly Payment is Calculated"
                    description="This diagram shows the step-by-step calculation process for determining your monthly mortgage payment."
                    mermaidCode={`
flowchart TD
    subgraph "📊 Input Values"
        A[🏠 Loan Amount<br/>${formatCurrency(inputs.loanAmount)}]
        B[📈 Interest Rate<br/>${inputs.interestRate}% per year]
        C[⏰ Loan Term<br/>${inputs.loanTermYears} years]
    end
    
    subgraph "🔄 Conversion Process"
        D[📅 Convert to Monthly Terms]
                 E["💯 Monthly Rate<br/>${inputs.interestRate}% ÷ 12<br/>= ${(inputs.interestRate/12).toFixed(3)}%"]
        F["📊 Total Payments<br/>${inputs.loanTermYears} × 12<br/>= ${inputs.loanTermYears * 12} months"]
    end
    
    subgraph "🧮 Formula Calculation"
                 G["⚡ Amortization Formula<br/>PMT = P × [r(1+r)^n] / [(1+r)^n-1]"]
        H[💰 Monthly Payment Result<br/>${formatCurrency(results.monthlyPayment)}]
    end
    
    subgraph "📋 Payment Breakdown"
        I[🏛️ Interest Portion<br/>${formatCurrency(results.monthlyInterest)}<br/>💸 Goes to bank profit]
        J[🏗️ Principal Portion<br/>${formatCurrency(results.monthlyPrincipal)}<br/>🏠 Reduces loan balance]
    end
    
    ${inputs.offsetBalance && inputs.offsetBalance > 0 ? `
    subgraph "💳 Offset Account Impact"
        K[💰 Offset Balance<br/>${formatCurrency(inputs.offsetBalance)}]
        L[⚡ Interest Reduction<br/>Saves ${formatCurrency((inputs.offsetBalance * inputs.interestRate) / 100 / 12)}/month]
    end
    ` : ''}
    
    A --> D
    B --> D
    C --> D
    
    D --> E
    D --> F
    
    A --> G
    E --> G
    F --> G
    
    G --> H
    
    H --> I
    H --> J
    
    ${inputs.offsetBalance && inputs.offsetBalance > 0 ? `
    K --> L
    L -.->|Reduces| I
    ` : ''}
    
    classDef input fill:#e8f5e8,stroke:#4caf50,stroke-width:2px
    classDef process fill:#fff2e8,stroke:#ff9800,stroke-width:2px
    classDef calculation fill:#e8f0ff,stroke:#2196f3,stroke-width:2px
    classDef breakdown fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px
    classDef offset fill:#e0f2f1,stroke:#009688,stroke-width:2px
    
    class A,B,C input
    class D,E,F process
    class G,H calculation
    class I,J breakdown
    ${inputs.offsetBalance && inputs.offsetBalance > 0 ? `class K,L offset` : ''}
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
    subgraph "📅 Payment Schedule"
        A[💳 Monthly Payment<br/>${formatCurrency(results.monthlyPayment)}]
                 B["📊 Loan Term<br/>${inputs.loanTermYears} years<br/>(${inputs.loanTermYears * 12} total payments)"]
    end
    
    subgraph "💰 Balance & Interest Calculation"
        C[🏠 Starting Loan Balance<br/>${formatCurrency(inputs.loanAmount)}]
        D[💳 Offset Balance<br/>${formatCurrency(inputs.offsetBalance || 0)}]
        E[📈 Effective Balance<br/>for Interest Calculation]
        F[📊 Monthly Interest Payment<br/>varies each month]
    end
    
    subgraph "📊 Cumulative Totals"
        G[💸 Total Interest Paid<br/>${formatCurrency(results.totalInterest)}]
        H[🏠 Original Loan Amount<br/>${formatCurrency(inputs.loanAmount)}]
        I[💰 Total You'll Pay<br/>${formatCurrency(results.totalPayment)}]
    end
    
    subgraph "📈 Impact Analysis"
        J[📊 Interest as % of Loan<br/>${formatPercentage((results.totalInterest / inputs.loanAmount) * 100)}]
        K[💡 Why This Matters<br/>Every dollar to interest<br/>is a dollar not building equity]
    end
    
    A --> E
    B --> E
    C --> E
    D -.->|Reduces| E
    
    E --> F
    F --> G
    
    H --> I
    G --> I
    
    G --> J
    J --> K
    
    classDef payment fill:#e8f5e8,stroke:#4caf50,stroke-width:2px
    classDef calculation fill:#fff2e8,stroke:#ff9800,stroke-width:2px
    classDef totals fill:#e8f0ff,stroke:#2196f3,stroke-width:2px
    classDef analysis fill:#ffebee,stroke:#f44336,stroke-width:2px
    
    class A,B payment
    class C,D,E,F calculation
    class G,H,I totals
    class J,K analysis
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

                {results.lmiAmount && results.lmiAmount > 0 ? (
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
    subgraph "📊 Property & Loan Details"
        A[🏠 Property Value<br/>${formatCurrency(inputs.propertyValue || 0)}]
        B[💰 Loan Amount<br/>${formatCurrency(inputs.loanAmount)}]
    end
    
    subgraph "🔢 LVR Calculation"
        C[📊 Calculate LVR<br/>Loan ÷ Property Value]
        D[📈 Your LVR<br/>${formatPercentage(loanToValueRatio)}]
    end
    
    subgraph "❓ LMI Assessment"
        E{🤔 Is LVR > 80%?}
        F[✅ No LMI Required<br/>You're in the safe zone!]
    end
    
    subgraph "💸 LMI Rate Determination"
        G[📋 LMI Rate Table]
        H[80-85% → 0.5% LMI Rate]
        I[85-90% → 1.0% LMI Rate]
        J[90-95% → 1.5% LMI Rate]
        K[95%+ → 2.0% LMI Rate]
    end
    
    subgraph "💰 Final Calculation"
        L[🧮 LMI Amount<br/>Loan Amount × LMI Rate]
        M[💸 Your LMI Cost<br/>${formatCurrency(results.lmiAmount)}]
    end
    
    A --> C
    B --> C
    C --> D
    D --> E
    
    E -->|No (LVR ≤ 80%)| F
    E -->|Yes (LVR > 80%)| G
    
    G --> H
    G --> I
    G --> J
    G --> K
    
    H --> L
    I --> L
    J --> L
    K --> L
    
    B --> L
    L --> M
    
    classDef property fill:#e8f5e8,stroke:#4caf50,stroke-width:2px
    classDef calculation fill:#fff2e8,stroke:#ff9800,stroke-width:2px
    classDef decision fill:#e3f2fd,stroke:#2196f3,stroke-width:2px
    classDef rates fill:#fce4ec,stroke:#e91e63,stroke-width:2px
    classDef result fill:#ffebee,stroke:#f44336,stroke-width:2px
    classDef good fill:#e8f5e8,stroke:#4caf50,stroke-width:3px
    
    class A,B property
    class C,D calculation
    class E decision
    class F good
    class G,H,I,J,K rates
    class L,M result
                        `}
                      />
                    </Box>
                    <Typography variant="h6" color="warning.main">
                      {formatCurrency(results.lmiAmount)}
                    </Typography>
                  </Box>
                ) : (
                  <Box />
                )}

                {results.stampDuty && results.stampDuty > 0 ? (
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
                ) : (
                  <Box />
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

          {inputs.offsetBalance && inputs.offsetBalance > 0 ? (
            <Card elevation={1} sx={{ mt: 3, bgcolor: 'success.light' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    🎉 Offset Account Benefits
                  </Typography>
                  <MermaidDiagramModal
                    title="How Your Offset Account Works"
                    description="This diagram shows how your offset account reduces interest and provides tax-free savings benefits."
                    mermaidCode={`
flowchart TD
    subgraph "💰 Your Financial Setup"
        A[💳 Your Offset Account<br/>${formatCurrency(inputs.offsetBalance)}]
        B[🏠 Your Home Loan<br/>${formatCurrency(inputs.loanAmount)}]
    end
    
    subgraph "🔢 Interest Calculation Magic"
        C[📊 Effective Loan Balance<br/>for Interest Calculation<br/>${formatCurrency(Math.max(0, inputs.loanAmount - inputs.offsetBalance))}]
        D[💡 How It Works<br/>Interest calculated on<br/>Loan - Offset Balance]
    end
    
    subgraph "💰 Monthly Savings Impact"
        E[📈 Interest Rate Applied<br/>${formatPercentage(inputs.interestRate)}% p.a.]
        F[💸 Monthly Interest Saved<br/>${formatCurrency((inputs.offsetBalance * inputs.interestRate) / 100 / 12)}]
        G[📅 Annual Interest Saved<br/>${formatCurrency((inputs.offsetBalance * inputs.interestRate) / 100)}]
    end
    
    subgraph "✨ Key Benefits"
        H[🚫 No Tax on Savings<br/>Unlike term deposits]
        I[💸 Instant Access<br/>Your money stays available]
        J[📈 Effective Rate<br/>${formatPercentage(inputs.interestRate * (1 - inputs.offsetBalance / inputs.loanAmount))}% on remaining loan]
        K[⚡ Compound Effect<br/>Savings accelerate over time]
    end
    
    A -.->|Reduces| B
    B --> C
    A --> D
    D --> C
    
    C --> E
    E --> F
    F --> G
    
    F --> H
    F --> I
    C --> J
    G --> K
    
    classDef account fill:#e8f5e8,stroke:#4caf50,stroke-width:3px
    classDef loan fill:#fff2e8,stroke:#ff9800,stroke-width:2px
    classDef calculation fill:#e3f2fd,stroke:#2196f3,stroke-width:2px
    classDef savings fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px
    classDef benefits fill:#e0f2f1,stroke:#009688,stroke-width:2px
    
    class A account
    class B,C,D loan
    class E calculation
    class F,G savings
    class H,I,J,K benefits
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
          ) : (
            <Box />
          )}
        </>
      )}
    </Box>
  );
};

export default MortgageCalculator; 