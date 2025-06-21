import React, { useState, useEffect } from 'react';
import { TextField, TextFieldProps } from '@mui/material';

interface NumberInputWithKProps extends Omit<TextFieldProps, 'value' | 'onChange'> {
  value: number;
  onChange: (value: number) => void;
  allowK?: boolean;
  step?: number;
}

const NumberInputWithK: React.FC<NumberInputWithKProps> = ({
  value,
  onChange,
  allowK = true,
  step = 1,
  ...textFieldProps
}) => {
  const [displayValue, setDisplayValue] = useState('');

  // Convert number to display string (with K notation if appropriate)
  const numberToDisplay = (num: number): string => {
    if (num === 0) return '';
    if (allowK && num >= 1000) {
      const kValue = num / 1000;
      // Only use K notation if it results in a clean number (no more than 1 decimal place)
      if (kValue === Math.floor(kValue)) {
        return `${kValue}K`;
      } else if (kValue % 0.5 === 0) {
        return `${kValue}K`;
      }
    }
    return num.toString();
  };

  // Convert display string to number
  const displayToNumber = (str: string): number => {
    if (!str) return 0;
    
    const trimmed = str.trim().toUpperCase();
    
    if (trimmed.endsWith('K')) {
      const numPart = trimmed.slice(0, -1);
      const parsed = parseFloat(numPart);
      return isNaN(parsed) ? 0 : parsed * 1000;
    }
    
    const parsed = parseFloat(trimmed);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Update display value when the external value changes
  useEffect(() => {
    setDisplayValue(numberToDisplay(value));
  }, [value, allowK]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setDisplayValue(inputValue);
    
    // Convert to number and call onChange
    const numericValue = displayToNumber(inputValue);
    onChange(numericValue);
  };

  const handleBlur = () => {
    // Reformat the display value on blur to ensure consistency
    const numericValue = displayToNumber(displayValue);
    const formattedValue = numberToDisplay(numericValue);
    setDisplayValue(formattedValue);
  };

  return (
    <TextField
      {...textFieldProps}
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={allowK ? "e.g., 600K, 1.5K, or 150000" : undefined}
      helperText={
        allowK 
          ? textFieldProps.helperText || "Use 'K' for thousands: 600K = 600,000, 1.5K = 1,500"
          : textFieldProps.helperText
      }
    />
  );
};

export default NumberInputWithK; 