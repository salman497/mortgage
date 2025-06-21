import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { School, ExpandMore, Info, Warning, MonetizationOn, AccountBalance, Home } from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const EducationalContent: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const lmiRates = [
    { lvr: '80%', rate: '0%', description: 'No LMI required' },
    { lvr: '85%', rate: '0.5-1.0%', description: 'Low LMI premium' },
    { lvr: '90%', rate: '1.0-2.0%', description: 'Moderate LMI premium' },
    { lvr: '95%', rate: '2.0-4.0%', description: 'High LMI premium' },
  ];

  const stampDutyExamples = [
    { state: 'NSW', price: '$500,000', duty: '$17,990' },
    { state: 'NSW', price: '$800,000', duty: '$31,490' },
    { state: 'VIC', price: '$500,000', duty: '$21,970' },
    { state: 'VIC', price: '$800,000', duty: '$40,070' },
    { state: 'QLD', price: '$500,000', duty: '$15,925' },
    { state: 'QLD', price: '$800,000', duty: '$27,425' },
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <School sx={{ mr: 1 }} />
        Learn About Mortgages
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <strong>Knowledge is Power:</strong> Understanding these concepts can save you tens of thousands 
        of dollars over the life of your mortgage!
      </Alert>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="LMI Explained" icon={<MonetizationOn />} />
          <Tab label="Stamp Duty" icon={<AccountBalance />} />
          <Tab label="Mortgage Basics" icon={<Home />} />
          <Tab label="Glossary" icon={<Info />} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Typography variant="h6" gutterBottom>
          Lender's Mortgage Insurance (LMI) - The Hidden Cost
        </Typography>
        
        <Alert severity="warning" sx={{ mb: 3 }}>
          <strong>Important:</strong> LMI protects the lender, not you! It's insurance for the bank 
          in case you default on your loan.
        </Alert>

        <Card elevation={1} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              What is LMI?
            </Typography>
            <Typography variant="body1" paragraph>
              Lender's Mortgage Insurance is a one-off premium you pay when you borrow more than 80% 
              of a property's value. Despite paying for it, this insurance only protects the lender 
              if you can't make your repayments.
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              LMI Rates by Loan-to-Value Ratio (LVR)
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>LVR</TableCell>
                    <TableCell>LMI Rate</TableCell>
                    <TableCell>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lmiRates.map((row) => (
                    <TableRow key={row.lvr}>
                      <TableCell>{row.lvr}</TableCell>
                      <TableCell>{row.rate}</TableCell>
                      <TableCell>{row.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">How to Avoid LMI</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              <ListItem>
                <ListItemIcon><MonetizationOn color="success" /></ListItemIcon>
                <ListItemText 
                  primary="Save a 20% Deposit"
                  secondary="The most straightforward way - borrow 80% or less of the property value"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><Home color="success" /></ListItemIcon>
                <ListItemText 
                  primary="Use Family Guarantee"
                  secondary="Family member uses their property as additional security"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><AccountBalance color="success" /></ListItemIcon>
                <ListItemText 
                  primary="Professional Packages"
                  secondary="Some lenders waive LMI for professionals (doctors, lawyers, etc.)"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><Warning color="warning" /></ListItemIcon>
                <ListItemText 
                  primary="First Home Buyer Schemes"
                  secondary="Government schemes may reduce or waive LMI for eligible buyers"
                />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        <Card elevation={1} sx={{ mt: 3, bgcolor: 'warning.light' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              LMI Reality Check
            </Typography>
            <Typography variant="body1">
              On a $500,000 property with a $450,000 loan (90% LVR), you might pay $9,000-$18,000 
              in LMI. This money goes to an insurance company and provides you no benefit. 
              It's essentially a penalty for not having a 20% deposit.
            </Typography>
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom>
          Stamp Duty - The Government's Cut
        </Typography>

        <Alert severity="info" sx={{ mb: 3 }}>
          Stamp duty is a state government tax on property transfers. It varies significantly 
          between states and can add tens of thousands to your property purchase cost.
        </Alert>

        <Card elevation={1} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Stamp Duty Examples by State
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>State</TableCell>
                    <TableCell>Property Price</TableCell>
                    <TableCell>Stamp Duty</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stampDutyExamples.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.state}</TableCell>
                      <TableCell>{row.price}</TableCell>
                      <TableCell>{row.duty}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">How to Reduce Stamp Duty</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              <ListItem>
                <ListItemIcon><Home color="success" /></ListItemIcon>
                <ListItemText 
                  primary="First Home Buyer Concessions"
                  secondary="Most states offer reduced or waived stamp duty for first home buyers under certain price thresholds"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><AccountBalance color="success" /></ListItemIcon>
                <ListItemText 
                  primary="Off-the-Plan Purchases"
                  secondary="Some states offer concessions for new properties or off-the-plan purchases"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><MonetizationOn color="info" /></ListItemIcon>
                <ListItemText 
                  primary="Property Value Timing"
                  secondary="Consider purchase timing - some concessions have sunset dates"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><Warning color="warning" /></ListItemIcon>
                <ListItemText 
                  primary="Professional Advice"
                  secondary="Conveyancers and solicitors can identify legitimate ways to minimize stamp duty"
                />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom>
          Mortgage Fundamentals
        </Typography>

        <Card elevation={1} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              How Monthly Payments Are Calculated
            </Typography>
            <Typography variant="body1" paragraph>
              Your monthly payment is calculated using the amortization formula, which ensures 
              you pay off both principal and interest over the loan term. Early payments are 
              mostly interest, while later payments are mostly principal.
            </Typography>
            
            <Alert severity="info">
              <strong>Formula:</strong> M = P [r(1+r)^n] / [(1+r)^n - 1]<br/>
              Where: M = Monthly payment, P = Principal, r = Monthly interest rate, n = Number of payments
            </Alert>
          </CardContent>
        </Card>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">Interest Rate Types</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Fixed Rate"
                  secondary="Interest rate stays the same for a set period (1-5 years typically). Provides certainty but may miss out on rate cuts."
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Variable Rate"
                  secondary="Interest rate can change based on Reserve Bank decisions and lender policies. Can benefit from rate cuts but risk rate rises."
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Split Rate"
                  secondary="Portion fixed, portion variable. Provides some certainty while maintaining flexibility."
                />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">Repayment Types</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Principal & Interest (P&I)"
                  secondary="Standard repayment where you pay both principal and interest. Recommended for most borrowers."
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Interest Only"
                  secondary="Pay only interest for a period (typically 1-5 years). Lower payments initially but no principal reduction."
                />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Typography variant="h6" gutterBottom>
          Mortgage Glossary
        </Typography>

        <List>
          <ListItem>
            <ListItemText 
              primary="Amortization"
              secondary="The process of paying off a loan through regular payments of principal and interest over time"
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Equity"
              secondary="The difference between your property's current value and the amount you owe on your mortgage"
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="LVR (Loan-to-Value Ratio)"
              secondary="The percentage of the property value that you're borrowing (e.g., $400k loan on $500k property = 80% LVR)"
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Offset Account"
              secondary="A transaction account linked to your mortgage where the balance reduces the interest calculated on your loan"
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Redraw Facility"
              secondary="Allows you to access extra payments you've made on your mortgage"
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Refinancing"
              secondary="Switching your mortgage to a different lender or loan product, typically for better rates or features"
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Serviceability"
              secondary="Your ability to make loan repayments based on your income, expenses, and other financial commitments"
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Settlement"
              secondary="The final step in a property purchase where ownership is transferred and funds are exchanged"
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Comparison Rate"
              secondary="The interest rate plus most fees and charges, expressed as a single percentage to help compare loans"
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Cross-Collateralization"
              secondary="Using multiple properties as security for one or more loans"
            />
          </ListItem>
        </List>
      </TabPanel>

      <Card elevation={1} sx={{ mt: 3, bgcolor: 'success.light' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Key Takeaways
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon><Info color="success" /></ListItemIcon>
              <ListItemText primary="Understand all costs upfront - LMI and stamp duty can add $50,000+ to your purchase" />
            </ListItem>
            <ListItem>
              <ListItemIcon><Info color="success" /></ListItemIcon>
              <ListItemText primary="Even small extra payments can save you years of repayments and tens of thousands in interest" />
            </ListItem>
            <ListItem>
              <ListItemIcon><Info color="success" /></ListItemIcon>
              <ListItemText primary="Shop around for loans - a 0.25% rate difference can save thousands over the loan term" />
            </ListItem>
            <ListItem>
              <ListItemIcon><Info color="success" /></ListItemIcon>
              <ListItemText primary="Consider your loan structure carefully - offset accounts and redraw facilities add flexibility" />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EducationalContent; 