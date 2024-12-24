import React, { useState } from 'react';
import { Box, Paper, TextField, Button, Typography, Grid, Tabs, Tab, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import Calculator from '../components/Calculator';

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
      id={`math-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const commonStyles = {
  pageContainer: {
    p: 3
  },
  pageTitle: {
    gutterBottom: true
  }
};

const MathSolver: React.FC = () => {
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSolve = () => {
    try {
      // Placeholder for actual math solving logic
      const steps = [
        'First, identify the type of equation',
        'Apply relevant mathematical rules',
        'Solve step by step',
        'Verify the solution'
      ];
      setSolution(steps);
      setError('');
    } catch (err) {
      setError('Error solving equation. Please check your input.');
    }
  };

  return (
    <Box sx={commonStyles.pageContainer}>
      <Typography variant="h4" sx={commonStyles.pageTitle}>
        Math Solver
      </Typography>
      
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Equation Solver" />
        <Tab label="Formula Reference" />
        <Tab label="Calculator" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Enter Your Equation
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={equation}
                onChange={(e) => setEquation(e.target.value)}
                placeholder="Enter your mathematical equation here..."
                sx={{ mb: 2 }}
              />
              <Button 
                variant="contained" 
                color="primary"
                onClick={handleSolve}
                fullWidth
              >
                Solve
              </Button>
              {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Solution Steps
              </Typography>
              {equation && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1">Your equation:</Typography>
                  <BlockMath>{equation}</BlockMath>
                </Box>
              )}
              {solution.length > 0 && (
                <Box>
                  {solution.map((step, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography variant="body1">
                        Step {index + 1}: {step}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={2}>
          {Object.entries(formulaCategories).map(([category, formulas]) => (
            <Grid item xs={12} key={category}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">{category}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {formulas.map((formula, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Paper sx={{ p: 2 }}>
                          <Typography variant="subtitle2">{formula.name}</Typography>
                          <InlineMath>{formula.latex}</InlineMath>
                          {formula.description && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              {formula.description}
                            </Typography>
                          )}
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Calculator 
              onAskAI={(question) => {
                // Here we can integrate with our AI agent
                // For now, we'll just show the question in the console
                console.log('AI Question:', question);
                // In a real implementation, this would call the AI service
                // and update the explanation in the calculator
              }}
            />
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  );
};

const formulaCategories = {
  'Algebra': [
    { name: 'Quadratic Formula', latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}', description: 'Solves ax² + bx + c = 0' },
    { name: 'Difference of Squares', latex: 'a^2 - b^2 = (a+b)(a-b)' },
    { name: 'Perfect Square', latex: 'a^2 \\pm 2ab + b^2 = (a \\pm b)^2' },
  ],
  'Geometry': [
    { name: 'Pythagorean Theorem', latex: 'a^2 + b^2 = c^2', description: 'For right triangles' },
    { name: 'Area of Circle', latex: 'A = \\pi r^2' },
    { name: 'Circumference', latex: 'C = 2\\pi r' },
    { name: 'Area of Triangle', latex: 'A = \\frac{1}{2}bh' },
    { name: 'Volume of Sphere', latex: 'V = \\frac{4}{3}\\pi r^3' },
  ],
  'Calculus': [
    { name: 'Power Rule', latex: '\\frac{d}{dx}x^n = nx^{n-1}' },
    { name: 'Product Rule', latex: '\\frac{d}{dx}(uv) = u\\frac{dv}{dx} + v\\frac{du}{dx}' },
    { name: 'Chain Rule', latex: '\\frac{d}{dx}f(g(x)) = f\'(g(x))g\'(x)' },
  ],
  'Trigonometry': [
    { name: 'Sine Law', latex: '\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}' },
    { name: 'Cosine Law', latex: 'c^2 = a^2 + b^2 - 2ab\\cos(C)' },
    { name: 'Pythagorean Identity', latex: '\\sin^2 \\theta + \\cos^2 \\theta = 1' },
  ],
  'Statistics': [
    { name: 'Mean', latex: '\\bar{x} = \\frac{1}{n}\\sum_{i=1}^n x_i' },
    { name: 'Standard Deviation', latex: 's = \\sqrt{\\frac{\\sum(x-\\bar{x})^2}{n-1}}' },
    { name: 'Normal Distribution', latex: 'f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}}e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}' },
  ]
};

export default MathSolver;