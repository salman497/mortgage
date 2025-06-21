import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Slider,
  Alert,
} from '@mui/material';
import { TrendingUp } from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { MortgageInputs } from '../types';
import { generateChartData, formatCurrency } from '../utils/mortgageCalculations';

const InterestAnalysis: React.FC = () => {
  const [inputs, setInputs] = useState<MortgageInputs>({
    loanAmount: 500000,
    interestRate: 6.5,
    loanTermYears: 30,
  });

  const [extraPayment, setExtraPayment] = useState(0);

  const chartData = useMemo(() => {
    const baseData = generateChartData(inputs);
    const extraData = extraPayment > 0 ? generateChartData(inputs, extraPayment) : null;
    
    return baseData.map((item, index) => ({
      month: item.month,
      year: Math.floor(item.month / 12) + 1,
      balance: item.balance,
      cumulativeInterest: item.cumulativeInterest,
      cumulativePrincipal: item.cumulativePrincipal,
      monthlyInterest: index > 0 ? item.cumulativeInterest - baseData[index - 1].cumulativeInterest : 0,
      extraBalance: extraData && extraData[index] ? extraData[index].balance : null,
      extraCumulativeInterest: extraData && extraData[index] ? extraData[index].cumulativeInterest : null,
    })).filter((_, index) => index % 12 === 0); // Show yearly data points
  }, [inputs, extraPayment]);

  const finalData = chartData[chartData.length - 1];
  const pieData = [
    { name: 'Principal', value: inputs.loanAmount, color: '#8884d8' },
    { name: 'Interest', value: finalData?.cumulativeInterest || 0, color: '#ff6b6b' },
  ];

  const handleInputChange = (field: keyof MortgageInputs) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(event.target.value) || 0;
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <TrendingUp sx={{ mr: 1 }} />
        Interest Analysis & Visualization
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Card elevation={1}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Loan Parameters
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Loan Amount: {formatCurrency(inputs.loanAmount)}
                </Typography>
                <Slider
                  value={inputs.loanAmount}
                  onChange={(_, value) => setInputs(prev => ({ ...prev, loanAmount: value as number }))}
                  min={100000}
                  max={2000000}
                  step={25000}
                  valueLabelDisplay="auto"
                  valueLabelFormat={formatCurrency}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Interest Rate: {inputs.interestRate}%
                </Typography>
                <Slider
                  value={inputs.interestRate}
                  onChange={(_, value) => setInputs(prev => ({ ...prev, interestRate: value as number }))}
                  min={1}
                  max={12}
                  step={0.1}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}%`}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Extra Monthly Payment: {formatCurrency(extraPayment)}
                </Typography>
                <Slider
                  value={extraPayment}
                  onChange={(_, value) => setExtraPayment(value as number)}
                  min={0}
                  max={2000}
                  step={50}
                  valueLabelDisplay="auto"
                  valueLabelFormat={formatCurrency}
                />
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Card elevation={1}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Interest vs Principal
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Card elevation={1} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Loan Balance Over Time
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="year" 
                label={{ value: 'Years', position: 'insideBottom', offset: -10 }}
              />
              <YAxis 
                tickFormatter={formatCurrency}
                label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value, name) => [formatCurrency(value as number), name]}
                labelFormatter={(year) => `Year ${year}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="balance" 
                stroke="#8884d8" 
                strokeWidth={3}
                name="Remaining Balance"
              />
              {extraPayment > 0 && (
                <Line 
                  type="monotone" 
                  dataKey="extraBalance" 
                  stroke="#82ca9d" 
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  name={`With Extra $${extraPayment}/month`}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card elevation={1} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Cumulative Interest vs Principal Payments
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="year" 
                label={{ value: 'Years', position: 'insideBottom', offset: -10 }}
              />
              <YAxis 
                tickFormatter={formatCurrency}
                label={{ value: 'Cumulative Amount ($)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value, name) => [formatCurrency(value as number), name]}
                labelFormatter={(year) => `Year ${year}`}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="cumulativeInterest"
                stackId="1"
                stroke="#ff6b6b"
                fill="#ff6b6b"
                name="Total Interest Paid"
              />
              <Area
                type="monotone"
                dataKey="cumulativePrincipal"
                stackId="1"
                stroke="#8884d8"
                fill="#8884d8"
                name="Total Principal Paid"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {finalData && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <strong>Eye-Opening Fact:</strong> Over the life of this loan, you'll pay{' '}
          <strong>{formatCurrency(finalData.cumulativeInterest)}</strong> in interest - that's{' '}
          <strong>{((finalData.cumulativeInterest / inputs.loanAmount) * 100).toFixed(1)}%</strong> of your 
          original loan amount going straight to the bank's profit!
        </Alert>
      )}

      {extraPayment > 0 && chartData.length > 0 && (
        <Alert severity="success">
          <strong>Good News!</strong> By paying an extra {formatCurrency(extraPayment)} per month, 
          you could save approximately{' '}
          <strong>
            {formatCurrency(
              (finalData?.cumulativeInterest || 0) - 
              (chartData[chartData.length - 1]?.extraCumulativeInterest || 0)
            )}
          </strong>{' '}
          in interest payments!
        </Alert>
      )}
    </Box>
  );
};

export default InterestAnalysis; 