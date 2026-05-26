import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { parseAndEvaluate } from 'utils/mathParser';
import { playKeySound, SoundType } from 'utils/audioSynth';
import confetti from 'canvas-confetti';

export type ThemeType = 'glass' | 'neo' | 'neon' | 'retro';
export type TabType = 'calculator' | 'grapher' | 'converter' | 'solver';

interface CalculatorContextProps {
  // Tabs & Settings
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  isSoundEnabled: boolean;
  setIsSoundEnabled: (enabled: boolean) => void;
  soundType: SoundType;
  setSoundType: (type: SoundType) => void;
  isScientific: boolean;
  setIsScientific: (sci: boolean) => void;

  // State Variables
  expression: string;
  setExpression: (expr: string) => void;
  resultPreview: string;
  history: string[];
  clearHistory: () => void;
  memoryValue: number;
  setMemoryValue: (val: number) => void;
  hasError: boolean;

  // Actions
  inputDigit: (digit: string) => void;
  inputDecimal: () => void;
  inputOperator: (op: string) => void;
  inputFunction: (func: string) => void;
  inputParenthesis: (paren: '(' | ')') => void;
  clearAll: () => void;
  backspace: () => void;
  evaluate: () => void;
  toggleSign: () => void;
  percentage: () => void;
  copyToClipboard: () => void;

  // Memory operations
  memoryAdd: () => void;
  memorySubtract: () => void;
  memoryRecall: () => void;
  memoryClear: () => void;
}

const CalculatorContext = createContext<CalculatorContextProps | undefined>(undefined);

export const CalculatorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Persisted settings
  const [theme, setTheme] = useLocalStorage<ThemeType>('mathos_theme', 'glass');
  const [isSoundEnabled, setIsSoundEnabled] = useLocalStorage<boolean>('mathos_sound_enabled', true);
  const [soundType, setSoundType] = useLocalStorage<SoundType>('mathos_sound_type', 'mechanical');
  const [history, setHistory] = useLocalStorage<string[]>('mathos_history', []);
  const [memoryValue, setMemoryValue] = useLocalStorage<number>('mathos_memory', 0);

  // App UI states
  const [activeTab, setActiveTab] = useState<TabType>('calculator');
  const [isScientific, setIsScientific] = useState<boolean>(false);
  const [expression, setExpression] = useState<string>('0');
  const [resultPreview, setResultPreview] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);

  // Trigger sound effect on click
  const triggerSound = (type: SoundType = soundType) => {
    playKeySound(type, isSoundEnabled);
  };

  // Safe Real-time expression evaluation
  useEffect(() => {
    if (!expression || expression === '0' || expression === 'Syntax Error') {
      setResultPreview('');
      setHasError(false);
      return;
    }

    // Don't evaluate if ends with standard binary operators or open paren
    if (/[+\-*/^%]$/.test(expression) || expression.endsWith('(')) {
      return;
    }

    try {
      // Check parenthesis balance to prevent preview crashes on unbalanced ones
      const openCount = (expression.match(/\(/g) || []).length;
      const closeCount = (expression.match(/\)/g) || []).length;
      let checkExpression = expression;
      
      // Auto close parentheses for preview safety
      if (openCount > closeCount) {
        checkExpression += ')'.repeat(openCount - closeCount);
      }

      const val = parseAndEvaluate(checkExpression);
      setResultPreview(String(val));
      setHasError(false);
    } catch {
      // Quietly wait for more keypresses on preview errors
    }
  }, [expression]);

  const inputDigit = (digit: string) => {
    triggerSound();
    setExpression((prev) => {
      if (prev === '0' || prev === 'Syntax Error') {
        return digit;
      }
      return prev + digit;
    });
  };

  const inputDecimal = () => {
    triggerSound();
    setExpression((prev) => {
      if (prev === 'Syntax Error') return '0.';
      
      // Look at the last token/number to check if it already has a decimal point
      const parts = prev.split(/[\+\-\*\/%^()]/);
      const lastToken = parts[parts.length - 1];
      
      if (lastToken.includes('.')) {
        return prev; // Ignore duplicate decimal in the same number
      }
      
      if (prev === '' || prev.endsWith('(') || /[\+\-\*\/%^]$/.test(prev)) {
        return prev + '0.';
      }
      
      return prev + '.';
    });
  };

  const inputOperator = (op: string) => {
    triggerSound();
    setExpression((prev) => {
      if (prev === 'Syntax Error') return '0' + op;
      
      // Replace last operator if already exists
      if (/[\+\-\*\/%^]$/.test(prev)) {
        return prev.slice(0, -1) + op;
      }
      
      return prev + op;
    });
  };

  const inputFunction = (func: string) => {
    triggerSound();
    setExpression((prev) => {
      if (prev === '0' || prev === 'Syntax Error') {
        return func + '(';
      }
      return prev + func + '(';
    });
  };

  const inputParenthesis = (paren: '(' | ')') => {
    triggerSound();
    setExpression((prev) => {
      if (prev === '0' && paren === '(') {
        return '(';
      }
      if (prev === 'Syntax Error') {
        return paren;
      }
      return prev + paren;
    });
  };

  const clearAll = () => {
    triggerSound('chime');
    setExpression('0');
    setResultPreview('');
    setHasError(false);
  };

  const backspace = () => {
    triggerSound();
    setExpression((prev) => {
      if (prev === 'Syntax Error' || prev.length <= 1) {
        return '0';
      }
      
      // Handle backspacing full scientific functions e.g. "sin(" -> delete all 4 chars
      const functions = ['sin(', 'cos(', 'tan(', 'log(', 'sqrt(', 'abs(', 'exp('];
      for (const fn of functions) {
        if (prev.endsWith(fn)) {
          return prev.slice(0, -fn.length) || '0';
        }
      }
      if (prev.endsWith('ln(')) {
        return prev.slice(0, -3) || '0';
      }

      return prev.slice(0, -1);
    });
  };

  const evaluate = () => {
    try {
      if (expression === 'Syntax Error') return;

      const trimmedExpr = expression.trim();
      if (!trimmedExpr || trimmedExpr === '0') return;

      const resultValue = parseAndEvaluate(trimmedExpr);
      const equationString = `${trimmedExpr} = ${resultValue}`;

      // Push to history
      setHistory((prev) => [equationString, ...prev.slice(0, 19)]);
      
      // Play a high-quality success chime and flash confetti
      triggerSound('success');
      
      // Simple celebration explosion
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.85 },
        colors: ['#a855f7', '#ec4899', '#3b82f6'],
      });

      setExpression(String(resultValue));
      setResultPreview('');
      setHasError(false);
    } catch (err: any) {
      triggerSound('chime'); // play error alarm tone
      setExpression('Syntax Error');
      setResultPreview('');
      setHasError(true);
    }
  };

  const toggleSign = () => {
    triggerSound();
    setExpression((prev) => {
      if (prev === '0' || prev === 'Syntax Error') return prev;

      // Wrap the whole expression inside negative negation if it's complex,
      // or negate the single trailing number. For general safety:
      if (/^\(-.+\)$/.test(prev)) {
        // Strip out the wrapper negation (-X) -> X
        return prev.slice(2, -1);
      } else {
        return `(-${prev})`;
      }
    });
  };

  const percentage = () => {
    triggerSound();
    setExpression((prev) => {
      if (prev === '0' || prev === 'Syntax Error') return prev;
      return prev + '%';
    });
  };

  const copyToClipboard = () => {
    const valToCopy = resultPreview || expression;
    if (valToCopy === 'Syntax Error') return;

    navigator.clipboard.writeText(valToCopy).then(() => {
      triggerSound('chime');
      confetti({
        particleCount: 20,
        spread: 30,
        origin: { y: 0.75 }
      });
    }).catch(err => {
      console.error('Failed to copy to clipboard:', err);
    });
  };

  // Memory Slots
  const memoryAdd = () => {
    triggerSound();
    try {
      const currentVal = parseFloat(resultPreview || expression) || 0;
      setMemoryValue((prev) => prev + currentVal);
      
      confetti({
        particleCount: 15,
        spread: 20,
        origin: { y: 0.8 }
      });
    } catch {}
  };

  const memorySubtract = () => {
    triggerSound();
    try {
      const currentVal = parseFloat(resultPreview || expression) || 0;
      setMemoryValue((prev) => prev - currentVal);
    } catch {}
  };

  const memoryRecall = () => {
    triggerSound();
    setExpression((prev) => {
      if (prev === '0' || prev === 'Syntax Error') return String(memoryValue);
      // Append memory value
      const suffix = /[\+\-\*\/%^]$/.test(prev) || prev.endsWith('(') ? '' : '*';
      return prev + suffix + String(memoryValue);
    });
  };

  const memoryClear = () => {
    triggerSound('chime');
    setMemoryValue(0);
  };

  const clearHistory = () => {
    triggerSound('chime');
    setHistory([]);
  };

  // Bind Keyboard Inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcut triggers if they're focused in text fields (e.g. AI or Converter inputs)
      const targetTag = (e.target as HTMLElement).tagName;
      if (targetTag === 'INPUT' || targetTag === 'TEXTAREA') {
        return;
      }

      const key = e.key;

      if (key >= '0' && key <= '9') {
        e.preventDefault();
        inputDigit(key);
      } else if (key === '.') {
        e.preventDefault();
        inputDecimal();
      } else if (key === '+') {
        e.preventDefault();
        inputOperator('+');
      } else if (key === '-') {
        e.preventDefault();
        inputOperator('-');
      } else if (key === '*') {
        e.preventDefault();
        inputOperator('*');
      } else if (key === '/') {
        e.preventDefault();
        inputOperator('/');
      } else if (key === '^') {
        e.preventDefault();
        inputOperator('^');
      } else if (key === '%') {
        e.preventDefault();
        percentage();
      } else if (key === '(') {
        e.preventDefault();
        inputParenthesis('(');
      } else if (key === ')') {
        e.preventDefault();
        inputParenthesis(')');
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        evaluate();
      } else if (key === 'Backspace') {
        e.preventDefault();
        backspace();
      } else if (key === 'Escape') {
        e.preventDefault();
        clearAll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expression, resultPreview, soundType, isSoundEnabled, memoryValue]);

  return (
    <CalculatorContext.Provider
      value={{
        activeTab,
        setActiveTab,
        theme,
        setTheme,
        isSoundEnabled,
        setIsSoundEnabled,
        soundType,
        setSoundType,
        isScientific,
        setIsScientific,
        expression,
        setExpression,
        resultPreview,
        history,
        clearHistory,
        memoryValue,
        setMemoryValue,
        hasError,
        inputDigit,
        inputDecimal,
        inputOperator,
        inputFunction,
        inputParenthesis,
        clearAll,
        backspace,
        evaluate,
        toggleSign,
        percentage,
        copyToClipboard,
        memoryAdd,
        memorySubtract,
        memoryRecall,
        memoryClear,
      }}
    >
      <div className={`theme-${theme}`} style={{ width: '100%', minHeight: '100vh', background: 'var(--bg-page)', transition: 'background var(--transition-slow)' }}>
        {children}
      </div>
    </CalculatorContext.Provider>
  );
};

export const useCalculatorContext = () => {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error('useCalculatorContext must be used within a CalculatorProvider');
  }
  return context;
};
