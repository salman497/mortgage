import {
  MortgageInputs,
  MortgageCalculation,
  PaymentScheduleEntry,
  PropertyInvestmentInputs,
  InvestmentAnalysis,
  ComparisonScenario,
  ChartDataPoint,
} from '../types';

/**
 * Calculate monthly mortgage payment using the standard amortization formula
 */
export const calculateMonthlyPayment = (
  principal: number,
  annualRate: number,
  years: number
): number => {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = years * 12;
  
  if (monthlyRate === 0) {
    return principal / numPayments;
  }
  
  const monthlyPayment =
    principal *
    (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);
  
  return monthlyPayment;
};

/**
 * Calculate LMI (Lender's Mortgage Insurance) - Australian specific
 */
export const calculateLMI = (loanAmount: number, propertyValue: number): number => {
  const lvrPercentage = (loanAmount / propertyValue) * 100;
  
  if (lvrPercentage <= 80) {
    return 0;
  }
  
  // Simplified LMI calculation based on LVR
  let lmiRate = 0;
  if (lvrPercentage <= 85) {
    lmiRate = 0.005;
  } else if (lvrPercentage <= 90) {
    lmiRate = 0.01;
  } else if (lvrPercentage <= 95) {
    lmiRate = 0.015;
  } else {
    lmiRate = 0.02;
  }
  
  return loanAmount * lmiRate;
};

/**
 * Calculate stamp duty - Australian specific (varies by state)
 */
export const calculateStampDuty = (propertyValue: number, state: string = 'NSW'): number => {
  // Simplified NSW stamp duty calculation
  if (propertyValue <= 14000) {
    return propertyValue * 0.0125;
  } else if (propertyValue <= 32000) {
    return 175 + (propertyValue - 14000) * 0.015;
  } else if (propertyValue <= 85000) {
    return 445 + (propertyValue - 32000) * 0.0175;
  } else if (propertyValue <= 319000) {
    return 1372.5 + (propertyValue - 85000) * 0.035;
  } else if (propertyValue <= 1064000) {
    return 9562.5 + (propertyValue - 319000) * 0.045;
  } else {
    return 43087.5 + (propertyValue - 1064000) * 0.055;
  }
};

/**
 * Calculate comprehensive mortgage details
 */
export const calculateMortgageDetails = (inputs: MortgageInputs): MortgageCalculation => {
  const monthlyPayment = calculateMonthlyPayment(
    inputs.loanAmount,
    inputs.interestRate,
    inputs.loanTermYears
  );
  
  // Calculate actual total interest using payment schedule to account for offset
  const paymentSchedule = generatePaymentSchedule(inputs);
  const totalInterest = paymentSchedule.reduce((sum, entry) => sum + entry.interest, 0);
  const totalPayment = totalInterest + inputs.loanAmount;
  
  const monthlyInterestRate = inputs.interestRate / 100 / 12;
  
  // Calculate interest considering offset balance
  const effectiveLoanBalance = Math.max(0, inputs.loanAmount - (inputs.offsetBalance || 0));
  const monthlyInterest = effectiveLoanBalance * monthlyInterestRate;
  const monthlyPrincipal = monthlyPayment - monthlyInterest;
  
  const lmiAmount = inputs.propertyValue 
    ? calculateLMI(inputs.loanAmount, inputs.propertyValue)
    : 0;
    
  const stampDuty = inputs.propertyValue 
    ? calculateStampDuty(inputs.propertyValue)
    : 0;
  
  return {
    monthlyPayment,
    totalInterest,
    totalPayment,
    monthlyInterest,
    monthlyPrincipal,
    lmiAmount,
    stampDuty,
  };
};

/**
 * Calculate offset account benefits
 */
export const calculateOffsetBenefits = (inputs: MortgageInputs) => {
  const offsetBalance = inputs.offsetBalance || 0;
  const monthlyInterestSavings = (offsetBalance * inputs.interestRate) / 100 / 12;
  const annualInterestSavings = (offsetBalance * inputs.interestRate) / 100;
  const effectiveInterestRate = inputs.interestRate * (1 - offsetBalance / inputs.loanAmount);
  
  return {
    monthlyInterestSavings,
    annualInterestSavings,
    effectiveInterestRate,
    taxFreeEquivalent: annualInterestSavings, // Offset savings are tax-free
  };
};

/**
 * Generate payment schedule with extra payments and offset account
 */
export const generatePaymentSchedule = (
  inputs: MortgageInputs,
  extraPayment: number = 0
): PaymentScheduleEntry[] => {
  const schedule: PaymentScheduleEntry[] = [];
  const monthlyPayment = calculateMonthlyPayment(
    inputs.loanAmount,
    inputs.interestRate,
    inputs.loanTermYears
  );
  
  let balance = inputs.loanAmount;
  const monthlyRate = inputs.interestRate / 100 / 12;
  const offsetBalance = inputs.offsetBalance || 0;
  let month = 0;
  
  while (balance > 0.01 && month < inputs.loanTermYears * 12) {
    month++;
    
    // Calculate interest on effective balance (loan balance minus offset)
    const effectiveBalance = Math.max(0, balance - offsetBalance);
    const interestPayment = effectiveBalance * monthlyRate;
    const principalPayment = Math.min(monthlyPayment - interestPayment + extraPayment, balance);
    
    balance -= principalPayment;
    
    schedule.push({
      month,
      payment: monthlyPayment + extraPayment,
      principal: principalPayment,
      interest: interestPayment,
      balance: Math.max(0, balance),
      extraPayment: extraPayment,
    });
  }
  
  return schedule;
};

/**
 * Compare different payoff strategies
 */
export const comparePayoffStrategies = (inputs: MortgageInputs): ComparisonScenario[] => {
  const baseCalculation = calculateMortgageDetails(inputs);
  const baseSchedule = generatePaymentSchedule(inputs);
  
  const scenarios: ComparisonScenario[] = [
    {
      name: 'Minimum Payment',
      monthlyPayment: baseCalculation.monthlyPayment,
      totalInterest: baseCalculation.totalInterest,
      payoffTime: inputs.loanTermYears,
      totalSavings: 0,
    },
  ];
  
  // Weekly payments strategy
  const weeklyPayment = baseCalculation.monthlyPayment / 4;
  const weeklyInterestRate = inputs.interestRate / 100 / 52;
  let weeklyBalance = inputs.loanAmount;
  let weeklyWeeks = 0;
  let weeklyTotalInterest = 0;
  const offsetBalance = inputs.offsetBalance || 0;
  
  while (weeklyBalance > 0.01 && weeklyWeeks < inputs.loanTermYears * 52) {
    weeklyWeeks++;
    // Account for offset in weekly calculation
    const effectiveWeeklyBalance = Math.max(0, weeklyBalance - offsetBalance);
    const weeklyInterestPayment = effectiveWeeklyBalance * weeklyInterestRate;
    const weeklyPrincipalPayment = Math.min(weeklyPayment - weeklyInterestPayment, weeklyBalance);
    
    weeklyBalance -= weeklyPrincipalPayment;
    weeklyTotalInterest += weeklyInterestPayment;
  }
  
  scenarios.push({
    name: 'Weekly Payments',
    monthlyPayment: weeklyPayment * 4,
    totalInterest: weeklyTotalInterest,
    payoffTime: weeklyWeeks / 52,
    totalSavings: baseCalculation.totalInterest - weeklyTotalInterest,
  });
  
  // Extra $100 monthly
  const extraSchedule = generatePaymentSchedule(inputs, 100);
  const extraTotalInterest = extraSchedule.reduce((sum, entry) => sum + entry.interest, 0);
  
  scenarios.push({
    name: 'Extra $100/month',
    monthlyPayment: baseCalculation.monthlyPayment + 100,
    totalInterest: extraTotalInterest,
    payoffTime: extraSchedule.length / 12,
    totalSavings: baseCalculation.totalInterest - extraTotalInterest,
  });
  
  // Extra $500 monthly
  const extra500Schedule = generatePaymentSchedule(inputs, 500);
  const extra500TotalInterest = extra500Schedule.reduce((sum, entry) => sum + entry.interest, 0);
  
  scenarios.push({
    name: 'Extra $500/month',
    monthlyPayment: baseCalculation.monthlyPayment + 500,
    totalInterest: extra500TotalInterest,
    payoffTime: extra500Schedule.length / 12,
    totalSavings: baseCalculation.totalInterest - extra500TotalInterest,
  });
  
  return scenarios;
};

/**
 * Generate chart data for visualization
 */
export const generateChartData = (inputs: MortgageInputs, extraPayment: number = 0): ChartDataPoint[] => {
  const schedule = generatePaymentSchedule(inputs, extraPayment);
  let cumulativeInterest = 0;
  let cumulativePrincipal = 0;
  
  return schedule.map((entry) => {
    cumulativeInterest += entry.interest;
    cumulativePrincipal += entry.principal;
    
    return {
      month: entry.month,
      balance: entry.balance,
      cumulativeInterest,
      cumulativePrincipal,
    };
  });
};

/**
 * Calculate negative gearing benefits
 */
export const calculateNegativeGearing = (inputs: PropertyInvestmentInputs): InvestmentAnalysis => {
  const loanAmount = inputs.propertyPrice - inputs.deposit;
  const annualInterest = loanAmount * (inputs.interestRate / 100);
  const annualRentalIncome = inputs.rentalIncome * 12;
  
  const totalExpenses = inputs.expenses + annualInterest;
  const cashFlow = annualRentalIncome - totalExpenses;
  
  // Tax benefit from negative gearing (if cash flow is negative)
  const taxBenefit = cashFlow < 0 ? Math.abs(cashFlow) * (inputs.taxRate / 100) : 0;
  
  // Assuming 3% annual capital growth
  const capitalGrowth = inputs.propertyPrice * 0.03;
  
  const netReturn = cashFlow + taxBenefit + capitalGrowth;
  const totalReturn = (netReturn / inputs.deposit) * 100;
  
  return {
    cashFlow,
    taxBenefit,
    netReturn,
    capitalGrowth,
    totalReturn,
  };
};

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' ';
};

/**
 * Format percentage for display
 */
export const formatPercentage = (value: number, decimals: number = 2): string => {
  return `${value.toFixed(decimals)}% `;
}; 