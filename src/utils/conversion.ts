// Conversion maps and tables for Units & Currencies.

export type UnitCategory = 'length' | 'weight' | 'temperature' | 'area';

export interface ConversionFactor {
  name: string;
  factor: number; // Factor relative to base unit (m, kg, m², or special functions for Temp)
}

export const UNIT_FACTORS: Record<UnitCategory, Record<string, ConversionFactor>> = {
  length: {
    m: { name: 'Meters (m)', factor: 1 },
    km: { name: 'Kilometers (km)', factor: 1000 },
    mi: { name: 'Miles (mi)', factor: 1609.34 },
    ft: { name: 'Feet (ft)', factor: 0.3048 },
    in: { name: 'Inches (in)', factor: 0.0254 },
  },
  weight: {
    kg: { name: 'Kilograms (kg)', factor: 1 },
    g: { name: 'Grams (g)', factor: 0.001 },
    lb: { name: 'Pounds (lb)', factor: 0.453592 },
    oz: { name: 'Ounces (oz)', factor: 0.0283495 },
  },
  temperature: {
    c: { name: 'Celsius (°C)', factor: 1 },
    f: { name: 'Fahrenheit (°F)', factor: 1 },
    k: { name: 'Kelvin (K)', factor: 1 },
  },
  area: {
    sqm: { name: 'Sq. Meters (m²)', factor: 1 },
    sqkm: { name: 'Sq. Kilometers (km²)', factor: 1000000 },
    sqmi: { name: 'Sq. Miles (mi²)', factor: 2589988 },
    acre: { name: 'Acres', factor: 4046.86 },
  },
};

export function convertUnits(
  value: number,
  from: string,
  to: string,
  category: UnitCategory
): number {
  if (from === to) return value;

  // Temperature special cases
  if (category === 'temperature') {
    if (from === 'c' && to === 'f') return (value * 9) / 5 + 32;
    if (from === 'c' && to === 'k') return value + 273.15;
    if (from === 'f' && to === 'c') return ((value - 32) * 5) / 9;
    if (from === 'f' && to === 'k') return ((value - 32) * 5) / 9 + 273.15;
    if (from === 'k' && to === 'c') return value - 273.15;
    if (from === 'k' && to === 'f') return ((value - 273.15) * 9) / 5 + 32;
    return value;
  }

  const categoryFactors = UNIT_FACTORS[category];
  const fromFactor = categoryFactors[from]?.factor;
  const toFactor = categoryFactors[to]?.factor;

  if (!fromFactor || !toFactor) return 0;

  // Convert to base unit first, then to target unit
  const baseValue = value * fromFactor;
  const targetValue = baseValue / toFactor;

  // Round to 6 decimal places to avoid precision errors
  return Math.round(targetValue * 1e6) / 1e6;
}

// Mock Currency Exchange Rates relative to USD
export const CURRENCY_RATES: Record<string, { name: string; symbol: string; rate: number }> = {
  USD: { name: 'United States Dollar', symbol: '$', rate: 1.0 },
  EUR: { name: 'Euro', symbol: '€', rate: 0.92 },
  GBP: { name: 'British Pound Sterling', symbol: '£', rate: 0.79 },
  INR: { name: 'Indian Rupee', symbol: '₹', rate: 83.25 },
  JPY: { name: 'Japanese Yen', symbol: '¥', rate: 156.40 },
  AUD: { name: 'Australian Dollar', symbol: 'A$', rate: 1.51 },
  CAD: { name: 'Canadian Dollar', symbol: 'C$', rate: 1.37 },
  CHF: { name: 'Swiss Franc', symbol: 'CHF', rate: 0.91 },
};

export function convertCurrency(value: number, from: string, to: string): number {
  if (from === to) return value;
  const fromRate = CURRENCY_RATES[from]?.rate;
  const toRate = CURRENCY_RATES[to]?.rate;

  if (!fromRate || !toRate) return 0;

  // Convert to USD base first, then to target currency
  const usdValue = value / fromRate;
  const targetValue = usdValue * toRate;

  return Math.round(targetValue * 1e4) / 1e4;
}
