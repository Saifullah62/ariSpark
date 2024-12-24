import { Unit, createUnit, unit } from 'mathjs';

// Define unit categories and their conversions
export interface UnitCategory {
  name: string;
  units: UnitOption[];
}

export interface UnitOption {
  name: string;
  symbol: string;
  type: string;
}

export const unitCategories: UnitCategory[] = [
  {
    name: 'Length',
    units: [
      { name: 'Meters', symbol: 'm', type: 'm' },
      { name: 'Kilometers', symbol: 'km', type: 'km' },
      { name: 'Centimeters', symbol: 'cm', type: 'cm' },
      { name: 'Millimeters', symbol: 'mm', type: 'mm' },
      { name: 'Miles', symbol: 'mi', type: 'mi' },
      { name: 'Yards', symbol: 'yd', type: 'yd' },
      { name: 'Feet', symbol: 'ft', type: 'ft' },
      { name: 'Inches', symbol: 'in', type: 'in' }
    ]
  },
  {
    name: 'Mass',
    units: [
      { name: 'Kilograms', symbol: 'kg', type: 'kg' },
      { name: 'Grams', symbol: 'g', type: 'g' },
      { name: 'Milligrams', symbol: 'mg', type: 'mg' },
      { name: 'Pounds', symbol: 'lb', type: 'lb' },
      { name: 'Ounces', symbol: 'oz', type: 'oz' }
    ]
  },
  {
    name: 'Temperature',
    units: [
      { name: 'Celsius', symbol: '°C', type: 'degC' },
      { name: 'Fahrenheit', symbol: '°F', type: 'degF' },
      { name: 'Kelvin', symbol: 'K', type: 'K' }
    ]
  },
  {
    name: 'Time',
    units: [
      { name: 'Seconds', symbol: 's', type: 's' },
      { name: 'Minutes', symbol: 'min', type: 'min' },
      { name: 'Hours', symbol: 'h', type: 'h' },
      { name: 'Days', symbol: 'd', type: 'd' }
    ]
  },
  {
    name: 'Volume',
    units: [
      { name: 'Liters', symbol: 'L', type: 'L' },
      { name: 'Milliliters', symbol: 'mL', type: 'mL' },
      { name: 'Cubic Meters', symbol: 'm³', type: 'm^3' },
      { name: 'Gallons', symbol: 'gal', type: 'gal' },
      { name: 'Quarts', symbol: 'qt', type: 'qt' },
      { name: 'Cups', symbol: 'cup', type: 'cup' },
      { name: 'Fluid Ounces', symbol: 'fl oz', type: 'floz' }
    ]
  },
  {
    name: 'Area',
    units: [
      { name: 'Square Meters', symbol: 'm²', type: 'm^2' },
      { name: 'Square Kilometers', symbol: 'km²', type: 'km^2' },
      { name: 'Square Miles', symbol: 'mi²', type: 'mi^2' },
      { name: 'Square Feet', symbol: 'ft²', type: 'ft^2' },
      { name: 'Square Inches', symbol: 'in²', type: 'in^2' },
      { name: 'Acres', symbol: 'ac', type: 'acre' },
      { name: 'Hectares', symbol: 'ha', type: 'hectare' }
    ]
  },
  {
    name: 'Speed',
    units: [
      { name: 'Meters per Second', symbol: 'm/s', type: 'm/s' },
      { name: 'Kilometers per Hour', symbol: 'km/h', type: 'km/h' },
      { name: 'Miles per Hour', symbol: 'mph', type: 'mi/h' },
      { name: 'Knots', symbol: 'kn', type: 'knot' }
    ]
  },
  {
    name: 'Data',
    units: [
      { name: 'Bytes', symbol: 'B', type: 'byte' },
      { name: 'Kilobytes', symbol: 'KB', type: 'kb' },
      { name: 'Megabytes', symbol: 'MB', type: 'mb' },
      { name: 'Gigabytes', symbol: 'GB', type: 'gb' },
      { name: 'Terabytes', symbol: 'TB', type: 'tb' }
    ]
  }
];

export function convertUnit(value: number, fromUnit: string, toUnit: string): number {
  try {
    const fromValue = unit(value, fromUnit);
    const result = fromValue.toNumber(toUnit);
    return Number(result.toFixed(8));
  } catch (error) {
    throw new Error('Invalid conversion');
  }
}

export function formatUnitValue(value: number): string {
  if (Math.abs(value) < 0.000001 || Math.abs(value) > 999999999) {
    return value.toExponential(6);
  }
  return value.toLocaleString(undefined, {
    maximumFractionDigits: 8,
    minimumFractionDigits: 0
  });
}

// Helper function to get common conversions for a unit type
export function getCommonConversions(unitType: string): UnitOption[] {
  for (const category of unitCategories) {
    const unit = category.units.find(u => u.type === unitType);
    if (unit) {
      return category.units;
    }
  }
  return [];
}
