import React, { useState } from 'react';
import { Box, Paper, Grid, Button, Typography, TextField, IconButton, Tabs, Tab } from '@mui/material';
import { BlockMath } from 'react-katex';
import BackspaceIcon from '@mui/icons-material/Backspace';
import HistoryIcon from '@mui/icons-material/History';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { evaluate } from 'mathjs';
import UnitConverter from './UnitConverter';

interface CalculatorProps {
  onAskAI?: (question: string) => void;
}

interface HistoryEntry {
  expression: string;
  result: string;
  explanation?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`calculator-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
};

const Calculator: React.FC<CalculatorProps> = ({ onAskAI }) => {
  const [display, setDisplay] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const buttons = [
    ['(', ')', '^', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '=', 'C']
  ];

  const specialFunctions = [
    'sin', 'cos', 'tan',
    'sqrt', 'log', 'ln',
    'π', 'e', '%'
  ];

  const handleButtonClick = (value: string) => {
    setError('');
    
    if (value === 'C') {
      setDisplay('');
      setResult('');
      setAiExplanation('');
    } else if (value === '=') {
      calculateResult();
    } else {
      let newValue = value;
      if (value === '×') newValue = '*';
      if (value === '÷') newValue = '/';
      if (value === 'π') newValue = 'pi';
      setDisplay(prev => prev + newValue);
    }
  };

  const handleSpecialFunction = (func: string) => {
    let addition = '';
    switch (func) {
      case 'sin':
      case 'cos':
      case 'tan':
      case 'log':
      case 'sqrt':
        addition = `${func}(`;
        break;
      case 'ln':
        addition = 'log(';
        break;
      case 'π':
        addition = 'pi';
        break;
      case 'e':
        addition = 'e';
        break;
      case '%':
        addition = '/100';
        break;
    }
    setDisplay(prev => prev + addition);
  };

  const handleBackspace = () => {
    setDisplay(prev => prev.slice(0, -1));
    setError('');
  };

  const calculateResult = async () => {
    try {
      const calculatedResult = evaluate(display).toString();
      setResult(calculatedResult);
      
      const newEntry: HistoryEntry = {
        expression: display,
        result: calculatedResult
      };
      
      setHistory(prev => [newEntry, ...prev]);

      // Ask AI for explanation
      if (onAskAI) {
        const question = `Please explain the calculation: ${display} = ${calculatedResult}`;
        onAskAI(question);
      }
    } catch (err) {
      setError('Invalid expression');
    }
  };

  const formatExpression = (expr: string): string => {
    return expr
      .replace(/\*/g, '×')
      .replace(/\//g, '÷')
      .replace(/pi/g, 'π')
      .replace(/sqrt/g, '√');
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto' }}>
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Calculator" />
        <Tab label="Unit Converter" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <TextField
                fullWidth
                value={display}
                onChange={(e) => setDisplay(e.target.value)}
                placeholder="Enter expression"
                sx={{ mb: 1 }}
                error={!!error}
                helperText={error}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <IconButton onClick={handleBackspace}>
                  <BackspaceIcon />
                </IconButton>
                <Typography variant="h5">
                  {result && `= ${result}`}
                </Typography>
                <IconButton onClick={() => setShowHistory(!showHistory)}>
                  <HistoryIcon />
                </IconButton>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              <Grid container spacing={1}>
                {buttons.map((row, i) => (
                  <Grid item xs={12} key={i}>
                    <Grid container spacing={1}>
                      {row.map((btn) => (
                        <Grid item xs={3} key={btn}>
                          <Button
                            fullWidth
                            variant="contained"
                            onClick={() => handleButtonClick(btn)}
                            sx={{
                              bgcolor: ['C', '='].includes(btn) ? 'primary.main' : 'background.paper',
                              color: ['C', '='].includes(btn) ? 'white' : 'text.primary'
                            }}
                          >
                            {btn}
                          </Button>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Functions
              </Typography>
              <Grid container spacing={1}>
                {specialFunctions.map((func) => (
                  <Grid item xs={4} key={func}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => handleSpecialFunction(func)}
                      sx={{ minWidth: 0 }}
                    >
                      {func}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          {showHistory && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2, mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  History
                </Typography>
                {history.map((entry, index) => (
                  <Box key={index} sx={{ mb: 2, p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                    <Typography>
                      {formatExpression(entry.expression)} = {entry.result}
                    </Typography>
                    {entry.explanation && (
                      <Typography variant="body2" color="text.secondary">
                        {entry.explanation}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Paper>
            </Grid>
          )}

          {aiExplanation && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2, mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AutoFixHighIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">AI Explanation</Typography>
                </Box>
                <Typography>{aiExplanation}</Typography>
                {result && <BlockMath>{`${display} = ${result}`}</BlockMath>}
              </Paper>
            </Grid>
          )}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <UnitConverter 
          onConversion={(from, to, value, result) => {
            // Add conversion to history
            const newEntry: HistoryEntry = {
              expression: `${value} ${from} → ${to}`,
              result: result.toString(),
              explanation: `Converted from ${from} to ${to}`
            };
            setHistory(prev => [newEntry, ...prev]);

            // Ask AI for explanation if needed
            if (onAskAI) {
              const question = `Please explain the conversion from ${value} ${from} to ${result} ${to}`;
              onAskAI(question);
            }
          }}
        />
      </TabPanel>

      {showHistory && (
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              History
            </Typography>
            {history.map((entry, index) => (
              <Box key={index} sx={{ mb: 2, p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography>
                  {entry.expression} = {entry.result}
                </Typography>
                {entry.explanation && (
                  <Typography variant="body2" color="text.secondary">
                    {entry.explanation}
                  </Typography>
                )}
              </Box>
            ))}
          </Paper>
        </Grid>
      )}

      {aiExplanation && (
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AutoFixHighIcon sx={{ mr: 1 }} />
              <Typography variant="h6">AI Explanation</Typography>
            </Box>
            <Typography>{aiExplanation}</Typography>
            {result && <BlockMath>{`${display} = ${result}`}</BlockMath>}
          </Paper>
        </Grid>
      )}
    </Box>
  );
};

export default Calculator;
