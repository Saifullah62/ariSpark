import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  LinearProgress,
  Alert,
  AlertTitle,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Warning as WarningIcon,
  CheckCircle as SuccessIcon,
  Info as InfoIcon,
  School as EducationIcon,
  Work as WorkIcon,
  LocalAtm as ExpenseIcon,
  Savings as SavingsIcon,
} from '@mui/icons-material';

interface FinancialData {
  transactions: any[];
  budgets: any[];
  goals: any[];
}

interface InsightCategory {
  name: string;
  icon: React.ReactNode;
  color: string;
}

const categories: { [key: string]: InsightCategory } = {
  education: {
    name: 'Education',
    icon: <EducationIcon />,
    color: '#2196f3',
  },
  work: {
    name: 'Work & Income',
    icon: <WorkIcon />,
    color: '#4caf50',
  },
  expenses: {
    name: 'Expenses',
    icon: <ExpenseIcon />,
    color: '#f44336',
  },
  savings: {
    name: 'Savings & Goals',
    icon: <SavingsIcon />,
    color: '#9c27b0',
  },
};

const FinancialInsights: React.FC<{ data: FinancialData }> = ({ data }) => {
  const [insights, setInsights] = useState<any[]>([]);
  const [selectedInsight, setSelectedInsight] = useState<any>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  useEffect(() => {
    analyzeFinancialData();
  }, [data]);

  const analyzeFinancialData = () => {
    const newInsights = [];

    // Analyze Income vs. Expenses
    const totalIncome = data.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = data.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const savingsRate = (totalIncome - totalExpenses) / totalIncome;

    // Student-specific analysis
    const educationExpenses = data.transactions
      .filter(t => ['Tuition', 'Books', 'Course Materials'].includes(t.category))
      .reduce((sum, t) => sum + t.amount, 0);

    const workIncome = data.transactions
      .filter(t => ['Part-time Job', 'Internship', 'Freelance'].includes(t.category))
      .reduce((sum, t) => sum + t.amount, 0);

    // Education Insights
    if (educationExpenses > 0) {
      newInsights.push({
        category: 'education',
        type: 'analysis',
        title: 'Education Expense Analysis',
        summary: `Your education expenses account for ${Math.round((educationExpenses / totalExpenses) * 100)}% of total expenses.`,
        details: {
          breakdown: {
            tuition: data.transactions
              .filter(t => t.category === 'Tuition')
              .reduce((sum, t) => sum + t.amount, 0),
            books: data.transactions
              .filter(t => t.category === 'Books')
              .reduce((sum, t) => sum + t.amount, 0),
          },
          recommendations: [
            'Research available scholarships and grants',
            'Consider used textbooks or digital alternatives',
            'Track education-related tax deductions',
            'Look for student discounts on course materials',
          ],
        },
      });
    }

    // Work-Study Balance
    if (workIncome > 0) {
      const workHours = data.transactions
        .filter(t => t.category === 'Part-time Job')
        .reduce((sum, t) => sum + (t.hours || 0), 0);

      newInsights.push({
        category: 'work',
        type: 'analysis',
        title: 'Work-Study Balance',
        summary: `You're earning an average of $${Math.round(workIncome / 4)} per week from work.`,
        details: {
          analysis: {
            hoursWorked: workHours,
            averageHourlyRate: workIncome / workHours,
            incomeStability: 'Medium',
          },
          recommendations: [
            'Consider flexible work arrangements during exam periods',
            'Look for higher-paying campus jobs',
            'Explore work-study program opportunities',
            'Balance work hours with study commitments',
          ],
        },
      });
    }

    // Savings Goals
    if (savingsRate < 0.2) {
      newInsights.push({
        category: 'savings',
        type: 'warning',
        title: 'Savings Opportunity',
        summary: 'Your current savings rate is below the recommended 20%.',
        details: {
          currentRate: savingsRate,
          targetRate: 0.2,
          potentialSavings: totalIncome * 0.2 - (totalIncome - totalExpenses),
          recommendations: [
            'Create a dedicated savings account for emergencies',
            'Set up automatic transfers on payday',
            'Look for areas to reduce discretionary spending',
            'Consider a part-time job or side hustle',
          ],
        },
      });
    }

    // Expense Pattern Analysis
    const expensePatterns = analyzeExpensePatterns(data.transactions);
    newInsights.push({
      category: 'expenses',
      type: 'analysis',
      title: 'Spending Pattern Analysis',
      summary: `Your top spending category is ${expensePatterns.topCategory}.`,
      details: {
        patterns: expensePatterns,
        recommendations: [
          'Create category-specific budgets',
          'Track daily expenses',
          'Identify and reduce unnecessary spending',
          'Look for student discounts',
        ],
      },
    });

    setInsights(newInsights);
  };

  const analyzeExpensePatterns = (transactions: any[]) => {
    const categoryTotals = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    const sortedCategories = Object.entries(categoryTotals)
      .sort(([, a], [, b]) => (b as number) - (a as number));

    return {
      topCategory: sortedCategories[0]?.[0] || 'N/A',
      categoryBreakdown: categoryTotals,
      unusualSpending: detectUnusualSpending(transactions),
    };
  };

  const detectUnusualSpending = (transactions: any[]) => {
    // Implementation of unusual spending detection
    return [];
  };

  const renderInsightCard = (insight: any) => (
    <Card
      sx={{
        cursor: 'pointer',
        '&:hover': { transform: 'scale(1.02)', transition: 'transform 0.2s' },
      }}
      onClick={() => {
        setSelectedInsight(insight);
        setShowDetailDialog(true);
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              bgcolor: categories[insight.category].color,
              p: 1,
              borderRadius: 1,
              mr: 2,
              color: 'white',
            }}
          >
            {categories[insight.category].icon}
          </Box>
          <Box>
            <Typography variant="h6">{insight.title}</Typography>
            <Chip
              label={insight.category}
              size="small"
              sx={{ bgcolor: categories[insight.category].color, color: 'white' }}
            />
          </Box>
        </Box>
        <Typography variant="body1">{insight.summary}</Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Grid container spacing={3}>
        {insights.map((insight, index) => (
          <Grid item xs={12} md={6} key={index}>
            {renderInsightCard(insight)}
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={showDetailDialog}
        onClose={() => setShowDetailDialog(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedInsight && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    bgcolor: categories[selectedInsight.category].color,
                    p: 1,
                    borderRadius: 1,
                    mr: 2,
                    color: 'white',
                  }}
                >
                  {categories[selectedInsight.category].icon}
                </Box>
                {selectedInsight.title}
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" paragraph>
                {selectedInsight.summary}
              </Typography>
              
              {selectedInsight.details.recommendations && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Recommendations
                  </Typography>
                  <ul>
                    {selectedInsight.details.recommendations.map((rec: string, i: number) => (
                      <li key={i}>
                        <Typography variant="body1">{rec}</Typography>
                      </li>
                    ))}
                  </ul>
                </Box>
              )}

              {selectedInsight.details.breakdown && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Expense Breakdown
                  </Typography>
                  {Object.entries(selectedInsight.details.breakdown).map(
                    ([category, amount]: [string, any]) => (
                      <Box key={category} sx={{ mb: 1 }}>
                        <Typography variant="body2">
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </Typography>
                        <Typography variant="h6">${amount}</Typography>
                      </Box>
                    )
                  )}
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowDetailDialog(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default FinancialInsights;
