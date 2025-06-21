# Mortgage: How Banks Fool Us

A comprehensive React TypeScript application that helps users understand mortgage calculations, interest rates, and strategies to save money on their home loans.

## 🏠 Features

### 1. Interactive Mortgage Calculator
- Real-time calculation of monthly payments
- Breakdown of principal vs interest
- LMI (Lender's Mortgage Insurance) calculation
- Stamp duty estimation (Australian states)
- Visual representation of payment breakdown

### 2. Interest Analysis & Visualization
- Interactive charts showing loan balance over time
- Cumulative interest vs principal payments
- Impact of extra payments visualization
- Pie charts showing total interest vs principal

### 3. Payoff Strategies
- Comparison of different payment strategies
- Weekly payment benefits
- Extra payment impact analysis
- Strategy recommendations based on financial situation

### 4. Property Investment Tools
- Negative gearing calculator
- Property investment analysis
- Using equity for multiple properties
- Cash flow and tax benefit calculations

### 5. Educational Content
- Comprehensive explanation of LMI
- Stamp duty information by state
- Mortgage fundamentals
- Financial glossary

## 🚀 Technology Stack

- **Frontend**: React 18 with TypeScript
- **UI Framework**: Material-UI (MUI) v5
- **Charts**: Recharts
- **Styling**: Material Design with responsive layout
- **Build Tool**: Create React App

## 📊 Key Calculations

### Monthly Payment Formula
```
M = P [r(1+r)^n] / [(1+r)^n - 1]
```
Where:
- M = Monthly payment
- P = Principal loan amount
- r = Monthly interest rate
- n = Number of payments

### LMI Calculation
- 80% LVR or below: No LMI
- 85% LVR: 0.5-1.0% of loan amount
- 90% LVR: 1.0-2.0% of loan amount
- 95% LVR: 2.0-4.0% of loan amount

### Stamp Duty
Calculated based on Australian state rates with progressive scales.

## 🎯 Educational Goals

This application aims to:

1. **Demystify mortgage calculations** - Show users exactly how their payments are calculated
2. **Reveal hidden costs** - Expose LMI and stamp duty impacts
3. **Demonstrate saving strategies** - Show how small changes can save thousands
4. **Provide investment insights** - Explain negative gearing and equity usage
5. **Empower financial decisions** - Give users knowledge to negotiate better deals

## 🔧 Installation & Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd mortgage-calculator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📱 Mobile Responsive

The application is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile phones

## 🎨 Design Philosophy

- **Clean & Simple**: Google-like simplicity with Material Design
- **Information-Rich**: Comprehensive data without overwhelming users
- **Visual Learning**: Charts and diagrams to explain complex concepts
- **Interactive**: Real-time calculations and adjustable parameters

## 🧮 Use Cases

### For Home Buyers
- Calculate exact monthly payments
- Understand total interest costs
- Plan extra payment strategies
- Estimate LMI and stamp duty costs

### For Property Investors
- Analyze negative gearing scenarios
- Calculate property investment returns
- Plan multi-property portfolios
- Understand tax implications

### For Financial Education
- Learn mortgage terminology
- Understand amortization schedules
- Compare different loan strategies
- Make informed financial decisions

## 🚨 Important Disclaimers

- This calculator provides estimates only
- Always consult qualified financial advisors
- Interest rates and fees vary between lenders
- Property investment involves significant risks
- Tax advice should be sought from qualified professionals

## 🔮 Future Enhancements

- Historical interest rate analysis
- Refinancing calculator
- Property market data integration
- Advanced investment scenarios
- Export calculations to PDF
- Save and compare multiple scenarios

## 📧 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Disclaimer**: This application is for educational purposes only. Always seek professional financial advice before making investment decisions.
