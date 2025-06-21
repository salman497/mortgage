export interface MortgageInputs {
  loanAmount: number;
  interestRate: number;
  loanTermYears: number;
  extraPayment?: number;
  propertyValue?: number;
  offsetBalance?: number;
}

export interface MortgageCalculation {
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  monthlyInterest: number;
  monthlyPrincipal: number;
  lmiAmount?: number;
  stampDuty?: number;
}

export interface PaymentScheduleEntry {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  extraPayment?: number;
}

export interface PropertyInvestmentInputs {
  propertyPrice: number;
  deposit: number;
  rentalIncome: number;
  expenses: number;
  interestRate: number;
  loanTermYears: number;
  taxRate: number;
}

export interface InvestmentAnalysis {
  cashFlow: number;
  taxBenefit: number;
  netReturn: number;
  capitalGrowth: number;
  totalReturn: number;
}

export interface ComparisonScenario {
  name: string;
  monthlyPayment: number;
  totalInterest: number;
  payoffTime: number;
  totalSavings: number;
}

export interface ChartDataPoint {
  month: number;
  balance: number;
  cumulativeInterest: number;
  cumulativePrincipal: number;
} 