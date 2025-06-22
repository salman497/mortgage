import React from 'react';
import { Box, Typography, Tooltip, IconButton } from '@mui/material';
import { Info } from '@mui/icons-material';

interface TermWithInfoProps {
  term: string;
  explanation: string;
  variant?: 'body1' | 'body2' | 'h6' | 'subtitle1' | 'subtitle2';
  color?: string;
  gutterBottom?: boolean;
}

// Simple explanations for common financial terms
export const FINANCIAL_EXPLANATIONS = {
  // Basic loan terms
  'Loan Amount': 'The total amount of money you borrowed from the bank or lender.',
  'Principal': 'The original amount of money you borrowed. This is what you actually owe, not including interest.',
  'Interest': 'Extra money you pay to the bank for borrowing their money. Think of it as the "rental fee" for using their money.',
  'Interest Rate': 'How much extra you pay each year, shown as a percentage. Higher rate = more money to the bank.',
  'Loan Term': 'How many years you have to pay back the loan. Longer term = smaller monthly payments but more interest overall.',
  'Monthly Payment': 'The fixed amount you pay every month. Part goes to paying back what you borrowed, part goes to the bank as interest.',

  // Property and equity terms
  'Property Value': 'How much your house or property is worth right now if you sold it.',
  'Deposit': 'The money you pay upfront when buying a property. Usually 10-20% of the property price.',
  'Equity': 'The part of your property that you actually own. If your house is worth $500k and you owe $300k, you have $200k equity.',
  'LVR': 'Loan-to-Value Ratio. Shows how much you borrowed compared to the property value. 80% LVR means you borrowed 80% of the property\'s value.',
  'LMI': 'Lender\'s Mortgage Insurance. Extra insurance you pay if you borrow more than 80% of the property value. This protects the bank, not you.',

  // Advanced concepts
  'Offset Account': 'A special bank account linked to your loan. Every dollar in this account reduces the interest you pay, but you can still spend the money anytime.',
  'Extra Payment': 'Additional money you pay on top of your regular monthly payment. This goes directly to reducing what you owe.',
  'Amortization': 'The way your loan payments are calculated so that you pay it off completely by the end of the loan term.',
  'Principal and Interest': 'Your regular payment has two parts: Principal (paying back what you borrowed) and Interest (paying the bank for lending you money).',

  // Investment terms
  'Rental Income': 'Money you receive from tenants who rent your investment property.',
  'Negative Gearing': 'When your rental income is less than your property expenses. You lose money each week, but get tax benefits.',
  'Positive Gearing': 'When your rental income is more than your property expenses. You make money each week.',
  'Tax Deductions': 'Expenses you can claim to reduce the tax you pay. Common for investment properties.',
  'Capital Growth': 'How much your property increases in value over time. If you bought for $400k and it\'s now worth $450k, that\'s $50k capital growth.',
  'Cash Flow': 'The actual money going in and out of your pocket each week from your investment property.',

  // Strategy terms
  'Refinancing': 'Switching your loan to a different bank or getting a better interest rate.',
  'Weekly Payments': 'Instead of paying monthly, you pay every week. This helps you pay off your loan faster.',
  'Payoff Strategies': 'Different ways to pay off your loan faster and save money on interest.',

  // Additional helpful terms
  'Stamp Duty': 'A government tax you pay when you buy a property. Usually 3-5% of the property value.',
  'Settlement': 'The final step when buying a property - when you get the keys and officially own it.',
  'Pre-approval': 'When a bank agrees to lend you money before you find a property to buy.',
  'Comparison Rate': 'The real cost of your loan including fees, not just the interest rate.',
  'Expenses': 'All the costs of owning an investment property like rates, insurance, repairs, and property management fees.',
  'Tax Rate': 'The percentage of your income you pay in tax. Higher earners pay higher rates.',
  'Return on Investment': 'How much money you make compared to how much you invested. Like earning 8% on your $100k investment.',
  'Net Return': 'Your actual profit after all costs and taxes are taken out.',
};

const TermWithInfo: React.FC<TermWithInfoProps> = ({ 
  term, 
  explanation, 
  variant = 'body2',
  color = 'text.secondary',
  gutterBottom = false 
}) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: gutterBottom ? 1 : 0 }}>
      <Typography variant={variant} color={color}>
        {term}
      </Typography>
      <Tooltip 
        title={explanation}
        arrow
        placement="top"
        sx={{ maxWidth: 300 }}
        componentsProps={{
          tooltip: {
            sx: {
              bgcolor: 'primary.main',
              fontSize: '0.875rem',
              lineHeight: 1.4,
              p: 2
            }
          }
        }}
      >
        <IconButton size="small" sx={{ ml: 0.5, color: 'primary.main' }}>
          <Info fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

// Helper function to get explanation for a term
export const getExplanation = (term: string): string => {
  return FINANCIAL_EXPLANATIONS[term as keyof typeof FINANCIAL_EXPLANATIONS] || 
         'This is a financial term that may need explanation.';
};

export default TermWithInfo; 