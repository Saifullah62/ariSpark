import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  IconButton,
  Chip,
  LinearProgress,
  Alert,
  Tooltip,
  Autocomplete,
} from '@mui/material';
import {
  AccountBalance as BankIcon,
  School as TuitionIcon,
  Work as JobIcon,
  LocalAtm as ExpenseIcon,
  TrendingUp as InvestmentIcon,
  Assignment as BudgetIcon,
  Assessment as AnalyticsIcon,
  Savings as SavingsIcon,
  Warning as AlertIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
  Category as CategoryIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';

interface Transaction {
  id: string;
  date: Date;
  amount: number;
  category: string;
  description: string;
  type: 'income' | 'expense';
  isRecurring: boolean;
  recurringFrequency?: 'weekly' | 'biweekly' | 'monthly';
  tags: string[];
}

interface Budget {
  id: string;
  category: string;
  amount: number;
  spent: number;
  type: 'expense' | 'savings';
  period: 'weekly' | 'monthly' | 'semester';
}

interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  category: 'savings' | 'debt' | 'investment' | 'emergency';
  priority: 'low' | 'medium' | 'high';
}

interface AiInsight {
  type: 'warning' | 'suggestion' | 'achievement';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  category: string;
  actionItems?: string[];
}

const FinanceManager: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [insights, setInsights] = useState<AiInsight[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'transaction' | 'budget' | 'goal'>('transaction');

  // Common categories for college students
  const expenseCategories = [
    'Tuition',
    'Books',
    'Rent',
    'Utilities',
    'Groceries',
    'Dining Out',
    'Transportation',
    'Entertainment',
    'Healthcare',
    'Personal Care',
    'Technology',
    'Clothing',
    'Savings',
    'Investments',
    'Emergency Fund',
    'Student Loan Payment',
  ];

  const incomeCategories = [
    'Part-time Job',
    'Internship',
    'Scholarships',
    'Grants',
    'Financial Aid',
    'Side Hustle',
    'Family Support',
  ];

  // Initialize sample data
  useEffect(() => {
    // Sample transactions
    const sampleTransactions: Transaction[] = [
      {
        id: '1',
        date: new Date(),
        amount: 800,
        category: 'Part-time Job',
        description: 'Bi-weekly paycheck',
        type: 'income',
        isRecurring: true,
        recurringFrequency: 'biweekly',
        tags: ['work', 'regular-income'],
      },
      {
        id: '2',
        date: new Date(),
        amount: 500,
        category: 'Rent',
        description: 'Monthly rent payment',
        type: 'expense',
        isRecurring: true,
        recurringFrequency: 'monthly',
        tags: ['housing', 'fixed-expense'],
      },
    ];

    // Sample budgets
    const sampleBudgets: Budget[] = [
      {
        id: '1',
        category: 'Rent',
        amount: 500,
        spent: 500,
        type: 'expense',
        period: 'monthly',
      },
      {
        id: '2',
        category: 'Groceries',
        amount: 200,
        spent: 150,
        type: 'expense',
        period: 'monthly',
      },
    ];

    // Sample goals
    const sampleGoals: FinancialGoal[] = [
      {
        id: '1',
        name: 'Emergency Fund',
        targetAmount: 3000,
        currentAmount: 1000,
        deadline: new Date(2024, 11, 31),
        category: 'emergency',
        priority: 'high',
      },
    ];

    setTransactions(sampleTransactions);
    setBudgets(sampleBudgets);
    setGoals(sampleGoals);
  }, []);

  // Generate AI insights based on financial data
  useEffect(() => {
    const generateInsights = () => {
      const newInsights: AiInsight[] = [];

      // Analyze spending patterns
      const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      // Check savings rate
      const savingsRate = (totalIncome - totalExpenses) / totalIncome;
      if (savingsRate < 0.2) {
        newInsights.push({
          type: 'warning',
          title: 'Low Savings Rate',
          description: 'Your current savings rate is below the recommended 20%. Consider reducing discretionary spending.',
          impact: 'high',
          category: 'savings',
          actionItems: [
            'Review entertainment expenses',
            'Look for student discounts',
            'Consider meal prepping to reduce food costs',
          ],
        });
      }

      // Analyze budget adherence
      budgets.forEach(budget => {
        const spentPercentage = budget.spent / budget.amount;
        if (spentPercentage > 0.9) {
          newInsights.push({
            type: 'warning',
            title: `High ${budget.category} Spending`,
            description: `You've used ${Math.round(spentPercentage * 100)}% of your ${budget.category} budget.`,
            impact: 'medium',
            category: 'budget',
            actionItems: [
              `Review your ${budget.category.toLowerCase()} expenses`,
              'Look for ways to reduce spending in this category',
              'Consider adjusting budget if necessary',
            ],
          });
        }
      });

      // Check for positive patterns
      const hasRegularIncome = transactions.some(t => t.isRecurring && t.type === 'income');
      if (hasRegularIncome) {
        newInsights.push({
          type: 'achievement',
          title: 'Stable Income',
          description: 'Having a regular income source is great for financial planning.',
          impact: 'high',
          category: 'income',
          actionItems: [
            'Consider automating savings',
            'Set up emergency fund contributions',
            'Plan for long-term financial goals',
          ],
        });
      }

      // Student-specific insights
      const educationExpenses = transactions
        .filter(t => ['Tuition', 'Books'].includes(t.category))
        .reduce((sum, t) => sum + t.amount, 0);

      if (educationExpenses > 0) {
        newInsights.push({
          type: 'suggestion',
          title: 'Education Expense Management',
          description: 'Consider ways to reduce education-related costs.',
          impact: 'medium',
          category: 'education',
          actionItems: [
            'Check for available scholarships',
            'Look for used textbooks or rentals',
            'Utilize student discounts',
            'Research tax deductions for education expenses',
          ],
        });
      }

      setInsights(newInsights);
    };

    generateInsights();
  }, [transactions, budgets]);

  const handleAddTransaction = (transaction: Partial<Transaction>) => {
    // Implementation
  };

  const handleAddBudget = (budget: Partial<Budget>) => {
    // Implementation
  };

  const handleAddGoal = (goal: Partial<FinancialGoal>) => {
    // Implementation
  };

  const renderTransactions = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Transactions</Typography>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={() => {
            setDialogType('transaction');
            setShowAddDialog(true);
          }}
        >
          Add Transaction
        </Button>
      </Box>

      <Grid container spacing={2}>
        {transactions.map(transaction => (
          <Grid item xs={12} key={transaction.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6">
                      {transaction.description}
                    </Typography>
                    <Typography color="textSecondary">
                      {transaction.category}
                    </Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    color={transaction.type === 'income' ? 'success.main' : 'error.main'}
                  >
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
                  </Typography>
                </Box>
                <Box sx={{ mt: 1 }}>
                  {transaction.tags.map(tag => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderBudgets = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Budgets</Typography>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={() => {
            setDialogType('budget');
            setShowAddDialog(true);
          }}
        >
          Add Budget
        </Button>
      </Box>

      <Grid container spacing={2}>
        {budgets.map(budget => (
          <Grid item xs={12} sm={6} md={4} key={budget.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{budget.category}</Typography>
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">
                      ${budget.spent} of ${budget.amount}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {Math.round((budget.spent / budget.amount) * 100)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(budget.spent / budget.amount) * 100}
                    color={
                      budget.spent / budget.amount > 0.9
                        ? 'error'
                        : budget.spent / budget.amount > 0.7
                        ? 'warning'
                        : 'primary'
                    }
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderInsights = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        AI Financial Insights
      </Typography>

      <Grid container spacing={2}>
        {insights.map((insight, index) => (
          <Grid item xs={12} key={index}>
            <Alert
              severity={
                insight.type === 'warning'
                  ? 'warning'
                  : insight.type === 'suggestion'
                  ? 'info'
                  : 'success'
              }
              icon={
                insight.type === 'warning' ? (
                  <AlertIcon />
                ) : insight.type === 'suggestion' ? (
                  <InfoIcon />
                ) : (
                  <CheckIcon />
                )
              }
            >
              <AlertTitle>{insight.title}</AlertTitle>
              {insight.description}
              {insight.actionItems && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="subtitle2">Recommended Actions:</Typography>
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {insight.actionItems.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </Box>
              )}
            </Alert>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          variant="fullWidth"
          sx={{ mb: 3 }}
        >
          <Tab icon={<MoneyIcon />} label="Transactions" />
          <Tab icon={<BudgetIcon />} label="Budgets" />
          <Tab icon={<AnalyticsIcon />} label="Insights" />
        </Tabs>

        {tabValue === 0 && renderTransactions()}
        {tabValue === 1 && renderBudgets()}
        {tabValue === 2 && renderInsights()}
      </Paper>

      {/* Add/Edit Dialog implementation */}
    </Box>
  );
};

export default FinanceManager;
