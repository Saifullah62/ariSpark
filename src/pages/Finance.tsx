import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Edit as EditIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

interface Transaction {
  id: number;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'income' | 'expense';
}

interface Budget {
  id: number;
  category: string;
  limit: number;
  spent: number;
}

const categories = [
  'Tuition',
  'Books',
  'Housing',
  'Food',
  'Transportation',
  'Entertainment',
  'Healthcare',
  'Other',
];

const commonStyles = {
  pageContainer: {
    p: 3,
  },
  pageTitle: {
    mb: 3,
  },
};

const Finance: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'transaction' | 'budget'>('transaction');
  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    type: 'expense',
    category: categories[0],
  });
  const [newBudget, setNewBudget] = useState<Partial<Budget>>({
    category: categories[0],
    limit: 0,
  });

  useEffect(() => {
    // Load saved data from localStorage
    const savedTransactions = localStorage.getItem('transactions');
    const savedBudgets = localStorage.getItem('budgets');
    
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets));
    }
  }, []);

  useEffect(() => {
    // Save to localStorage when data changes
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [transactions, budgets]);

  const handleOpenDialog = (type: 'transaction' | 'budget') => {
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewTransaction({ type: 'expense', category: categories[0] });
    setNewBudget({ category: categories[0], limit: 0 });
  };

  const handleAddTransaction = () => {
    if (newTransaction.amount && newTransaction.category) {
      const transaction: Transaction = {
        id: Date.now(),
        amount: Number(newTransaction.amount),
        category: newTransaction.category,
        description: newTransaction.description || '',
        date: new Date().toISOString().split('T')[0],
        type: newTransaction.type || 'expense',
      };
      setTransactions([...transactions, transaction]);
      handleCloseDialog();
    }
  };

  const handleAddBudget = () => {
    if (newBudget.category && newBudget.limit) {
      const budget: Budget = {
        id: Date.now(),
        category: newBudget.category,
        limit: Number(newBudget.limit),
        spent: 0,
      };
      setBudgets([...budgets, budget]);
      handleCloseDialog();
    }
  };

  const handleDeleteTransaction = (id: number) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const handleDeleteBudget = (id: number) => {
    setBudgets(budgets.filter((b) => b.id !== id));
  };

  const calculateTotalIncome = () => {
    return transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const calculateTotalExpenses = () => {
    return transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const calculateBudgetProgress = (category: string) => {
    const spent = transactions
      .filter((t) => t.category === category && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const budget = budgets.find((b) => b.category === category);
    return budget ? (spent / budget.limit) * 100 : 0;
  };

  return (
    <Box sx={commonStyles.pageContainer}>
      <Typography variant="h4" sx={commonStyles.pageTitle}>
        Finance
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      Total Income
                    </Typography>
                    <Typography variant="h4">
                      ${calculateTotalIncome().toFixed(2)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="error">
                      Total Expenses
                    </Typography>
                    <Typography variant="h4">
                      ${calculateTotalExpenses().toFixed(2)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="success.main">
                      Balance
                    </Typography>
                    <Typography variant="h4">
                      ${(calculateTotalIncome() - calculateTotalExpenses()).toFixed(2)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Transactions</Typography>
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                onClick={() => handleOpenDialog('transaction')}
              >
                Add Transaction
              </Button>
            </Box>
            <List>
              {transactions.map((transaction) => (
                <ListItem
                  key={transaction.id}
                  sx={{
                    mb: 1,
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    border: 1,
                    borderColor: 'divider',
                  }}
                >
                  <ListItemText
                    primary={transaction.description || transaction.category}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color={transaction.type === 'income' ? 'success.main' : 'error'}
                        >
                          {transaction.type === 'income' ? '+' : '-'}$
                          {transaction.amount.toFixed(2)}
                        </Typography>
                        {' • '}
                        {transaction.date}
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteTransaction(transaction.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Budgets</Typography>
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                onClick={() => handleOpenDialog('budget')}
              >
                Add Budget
              </Button>
            </Box>
            <List>
              {budgets.map((budget) => (
                <ListItem
                  key={budget.id}
                  sx={{
                    mb: 1,
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    border: 1,
                    borderColor: 'divider',
                  }}
                >
                  <ListItemText
                    primary={budget.category}
                    secondary={
                      <Box sx={{ width: '100%' }}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            mb: 1,
                          }}
                        >
                          <Typography variant="body2">
                            ${calculateBudgetProgress(budget.category).toFixed(2)} of ${budget.limit}
                          </Typography>
                          <Typography variant="body2">
                            {(calculateBudgetProgress(budget.category)).toFixed(1)}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(calculateBudgetProgress(budget.category), 100)}
                          color={
                            calculateBudgetProgress(budget.category) > 90
                              ? 'error'
                              : 'primary'
                          }
                        />
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteBudget(budget.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogType === 'transaction' ? 'Add Transaction' : 'Add Budget'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, '& > *': { mb: 2 } }}>
            {dialogType === 'transaction' ? (
              <>
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  value={newTransaction.amount || ''}
                  onChange={(e) =>
                    setNewTransaction({ ...newTransaction, amount: Number(e.target.value) })
                  }
                />
                <TextField
                  fullWidth
                  label="Description"
                  value={newTransaction.description || ''}
                  onChange={(e) =>
                    setNewTransaction({ ...newTransaction, description: e.target.value })
                  }
                />
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={newTransaction.type || 'expense'}
                    label="Type"
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        type: e.target.value as 'income' | 'expense',
                      })
                    }
                  >
                    <MenuItem value="income">Income</MenuItem>
                    <MenuItem value="expense">Expense</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={newTransaction.category || categories[0]}
                    label="Category"
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        category: e.target.value,
                      })
                    }
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            ) : (
              <>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={newBudget.category || categories[0]}
                    label="Category"
                    onChange={(e) =>
                      setNewBudget({ ...newBudget, category: e.target.value })
                    }
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Budget Limit"
                  type="number"
                  value={newBudget.limit || ''}
                  onChange={(e) =>
                    setNewBudget({ ...newBudget, limit: Number(e.target.value) })
                  }
                />
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={dialogType === 'transaction' ? handleAddTransaction : handleAddBudget}
            variant="contained"
            color="primary"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Finance;