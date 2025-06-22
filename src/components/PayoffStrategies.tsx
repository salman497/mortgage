import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { School, ExpandMore, CheckCircle, TrendingUp, Savings } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MortgageInputs } from '../types';
import { comparePayoffStrategies, formatCurrency } from '../utils/mortgageCalculations';
import TermWithInfo, { getExplanation } from './TermWithInfo';

interface PayoffStrategiesProps {
  inputs: MortgageInputs;
  onInputChange: (updates: Partial<MortgageInputs>) => void;
}

const PayoffStrategies: React.FC<PayoffStrategiesProps> = ({ inputs }) => {
  const scenarios = useMemo(() => {
    return comparePayoffStrategies(inputs);
  }, [inputs]);

  const chartData = scenarios.map(scenario => ({
    name: scenario.name,
    totalInterest: scenario.totalInterest,
    payoffTime: scenario.payoffTime,
    savings: scenario.totalSavings,
  }));

  const strategies = [
    {
      title: "Weekly Payments",
      description: "Instead of 12 monthly payments, make 52 weekly payments (equivalent to 13 monthly payments per year)",
      benefits: [
        "Pay off your loan 4-6 years earlier",
        "Save tens of thousands in interest",
        "Align payments with your weekly income",
        "Build discipline with smaller, frequent payments"
      ],
      tip: "Simply divide your monthly payment by 4 and pay weekly"
    },
    {
      title: "Extra Principal Payments",
      description: "Add extra money to your monthly payment that goes directly to principal",
      benefits: [
        "Every extra dollar saves you 2-3 dollars in interest",
        "Flexible - pay extra when you can afford it",
        "Dramatic impact even with small amounts",
        "Compound effect over time"
      ],
      tip: "Even $100 extra per month can save you 5+ years and $100,000+ in interest"
    },
    {
      title: "Offset Account",
      description: "Link a transaction account to your mortgage where the balance reduces interest calculations daily",
      benefits: [
        "Interest calculated on (loan balance - offset balance)",
        "Keep full access to your money for emergencies",
        "Tax-free interest savings (no tax on 'interest earned')",
        "Works 24/7 - every dollar counts every day",
        "Can be more effective than extra repayments"
      ],
      tip: "Every $10,000 in offset saves ~$650/year in interest at 6.5% rate - that's like earning 6.5% tax-free!"
    },
    {
      title: "Refinancing Strategy",
      description: "Switch to a lower interest rate or shorter loan term",
      benefits: [
        "Lower interest rate reduces total cost",
        "Shorter term means faster payoff",
        "Fixed payment with guaranteed timeline",
        "One-time effort for long-term savings"
      ],
      tip: "Consider refinancing if rates drop by 0.5% or more"
    },
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <School sx={{ mr: 1 }} />
        Mortgage Payoff Strategies
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <strong>The Secret Banks Don't Want You to Know:</strong> Small changes to your payment strategy 
        can save you tens of thousands of dollars and years of payments!
      </Alert>

      <Card elevation={1} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Strategy Comparison - Your Loan: {formatCurrency(inputs.loanAmount)} at {inputs.interestRate}%
          </Typography>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TermWithInfo 
                      term="Strategy"
                      explanation={getExplanation('Payoff Strategies')}
                      variant="body2"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TermWithInfo 
                      term="Monthly Payment"
                      explanation={getExplanation('Monthly Payment')}
                      variant="body2"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TermWithInfo 
                      term="Total Interest"
                      explanation={getExplanation('Interest')}
                      variant="body2"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TermWithInfo 
                      term="Payoff Time"
                      explanation={getExplanation('Loan Term')}
                      variant="body2"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TermWithInfo 
                      term="Interest Savings"
                      explanation="How much less interest you'll pay compared to just making minimum payments. More savings = more money in your pocket!"
                      variant="body2"
                    />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {scenarios.map((scenario) => (
                  <TableRow key={scenario.name}>
                    <TableCell component="th" scope="row">
                      <strong>{scenario.name}</strong>
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(scenario.monthlyPayment)}
                    </TableCell>
                    <TableCell align="right">
                      <Typography color={scenario.name === 'Minimum Payment' ? 'error' : 'text.primary'}>
                        {formatCurrency(scenario.totalInterest)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      {scenario.payoffTime.toFixed(1)} years
                    </TableCell>
                    <TableCell align="right">
                      {scenario.totalSavings > 0 ? (
                        <Chip 
                          label={formatCurrency(scenario.totalSavings)}
                          color="success"
                          size="small"
                        />
                      ) : (
                        <Typography color="text.secondary">Baseline</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Card elevation={1} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Interest Comparison by Strategy
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Bar dataKey="totalInterest" fill="#ff6b6b" name="Total Interest" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Detailed Strategy Guide
      </Typography>

      {strategies.map((strategy, index) => (
        <Accordion key={index} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">{strategy.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary" paragraph>
              {strategy.description}
            </Typography>
            
            <Typography variant="subtitle2" gutterBottom>
              Key Benefits:
            </Typography>
            <List dense>
              {strategy.benefits.map((benefit, idx) => (
                <ListItem key={idx} sx={{ py: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircle color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={benefit} />
                </ListItem>
              ))}
            </List>
            
            <Alert severity="success" sx={{ mt: 2 }}>
              <strong>Pro Tip:</strong> {strategy.tip}
            </Alert>
          </AccordionDetails>
        </Accordion>
      ))}

      <Card elevation={1} sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <TrendingUp sx={{ mr: 1 }} />
            Offset Account: The Smart Money Strategy
          </Typography>
          
          <Alert severity="success" sx={{ mb: 2 }}>
            <strong>Pro Tip:</strong> An offset account can be more powerful than extra repayments because 
            you keep access to your money while still saving on interest!
          </Alert>
          
          <Typography variant="body1" paragraph>
            <strong>How it works:</strong> Your offset account balance is subtracted from your loan balance 
            before calculating daily interest. So if you have a $500,000 loan and $50,000 in offset, 
            you only pay interest on $450,000.
          </Typography>
          
          <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Offset Account Example
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Loan Balance: $500,000 at 6.5%
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Offset Balance: $50,000
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Interest calculated on: $450,000
            </Typography>
            <Typography variant="body2" color="success.main">
              • <strong>Annual Interest Saving: $3,250</strong>
            </Typography>
            <Typography variant="body2" color="info.main">
              • Plus you keep access to your $50,000!
            </Typography>
          </Box>
          
          <Typography variant="subtitle2" gutterBottom>
            Offset vs Extra Repayments:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <CheckCircle color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="Offset: Keep money accessible for emergencies or opportunities"
                secondary="Perfect for irregular income or those building cash reserves"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <CheckCircle color="info" fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="Extra Repayments: Permanently reduce loan balance"
                secondary="Better if you're disciplined and won't need the money back"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <Card elevation={1} sx={{ mt: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <TrendingUp sx={{ mr: 1 }} />
            The Compound Effect
          </Typography>
          <Typography variant="body1" paragraph>
            The magic of these strategies lies in compound savings. Every dollar you pay toward principal 
            early saves you 2-3 dollars in future interest payments. This is because you're not just 
            saving the interest on that dollar - you're saving the interest on the interest!
          </Typography>
          <Typography variant="body2">
            <strong>Example:</strong> An extra $100/month on a $500,000 loan at 6.5% saves you approximately 
            $127,000 in interest and pays off your loan 5.5 years earlier!
          </Typography>
        </CardContent>
      </Card>

      <Card elevation={1} sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <Savings sx={{ mr: 1 }} />
            Which Strategy Should You Choose?
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="If you have irregular income" 
                secondary="Choose extra principal payments - flexible and you can adjust based on cash flow"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="If you have steady weekly income" 
                secondary="Choose weekly payments - automatic and aligns with your pay cycle"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="If you have a large sum of money" 
                secondary="Consider a lump sum payment or setting up an offset account"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="If interest rates have dropped" 
                secondary="Refinance to a lower rate, then implement extra payment strategies"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PayoffStrategies; 