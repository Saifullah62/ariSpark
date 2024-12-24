import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Paper,
  Grid,
  IconButton,
  SelectChangeEvent,
  Tooltip,
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { unitCategories, convertUnit, formatUnitValue, UnitOption } from '../utils/unitConversions';

interface UnitConverterProps {
  onConversion?: (from: string, to: string, value: number, result: number) => void;
}

const UnitConverter: React.FC<UnitConverterProps> = ({ onConversion }) => {
  const [category, setCategory] = useState(unitCategories[0].name);
  const [fromUnit, setFromUnit] = useState(unitCategories[0].units[0].type);
  const [toUnit, setToUnit] = useState(unitCategories[0].units[1].type);
  const [value, setValue] = useState('1');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleCategoryChange = (event: SelectChangeEvent) => {
    const newCategory = event.target.value;
    setCategory(newCategory);
    const categoryUnits = unitCategories.find(c => c.name === newCategory)?.units || [];
    setFromUnit(categoryUnits[0]?.type || '');
    setToUnit(categoryUnits[1]?.type || '');
  };

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleFromUnitChange = (event: SelectChangeEvent) => {
    setFromUnit(event.target.value);
  };

  const handleToUnitChange = (event: SelectChangeEvent) => {
    setToUnit(event.target.value);
  };

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const getUnitSymbol = (unitType: string): string => {
    for (const category of unitCategories) {
      const unit = category.units.find(u => u.type === unitType);
      if (unit) return unit.symbol;
    }
    return unitType;
  };

  useEffect(() => {
    try {
      if (!value || !fromUnit || !toUnit) {
        setResult('');
        setError('');
        return;
      }

      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        setError('Please enter a valid number');
        setResult('');
        return;
      }

      const convertedValue = convertUnit(numValue, fromUnit, toUnit);
      setResult(formatUnitValue(convertedValue));
      setError('');

      if (onConversion) {
        onConversion(fromUnit, toUnit, numValue, convertedValue);
      }
    } catch (err) {
      setError('Invalid conversion');
      setResult('');
    }
  }, [value, fromUnit, toUnit]);

  const getCurrentUnits = (): UnitOption[] => {
    return unitCategories.find(c => c.name === category)?.units || [];
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={handleCategoryChange}
            >
              {unitCategories.map((cat) => (
                <MenuItem key={cat.name} value={cat.name}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={5}>
          <TextField
            fullWidth
            label="Value"
            value={value}
            onChange={handleValueChange}
            error={!!error}
            helperText={error}
            type="number"
          />
        </Grid>

        <Grid item xs={12} sm={5}>
          <TextField
            fullWidth
            label="Result"
            value={result}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>

        <Grid item xs={12} sm={5}>
          <FormControl fullWidth>
            <InputLabel>From</InputLabel>
            <Select
              value={fromUnit}
              label="From"
              onChange={handleFromUnitChange}
            >
              {getCurrentUnits().map((unit) => (
                <MenuItem key={unit.type} value={unit.type}>
                  {unit.name} ({unit.symbol})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Tooltip title="Swap units">
            <IconButton onClick={swapUnits} color="primary">
              <SwapHorizIcon />
            </IconButton>
          </Tooltip>
        </Grid>

        <Grid item xs={12} sm={5}>
          <FormControl fullWidth>
            <InputLabel>To</InputLabel>
            <Select
              value={toUnit}
              label="To"
              onChange={handleToUnitChange}
            >
              {getCurrentUnits().map((unit) => (
                <MenuItem key={unit.type} value={unit.type}>
                  {unit.name} ({unit.symbol})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {result && (
          <Grid item xs={12}>
            <Typography variant="body1" align="center">
              {value} {getUnitSymbol(fromUnit)} = {result} {getUnitSymbol(toUnit)}
            </Typography>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

export default UnitConverter;
