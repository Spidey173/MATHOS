import React, { useRef, useEffect } from 'react';
import { useCalculatorContext } from 'context/CalculatorContext';
import { Copy, Delete } from 'lucide-react';
import styles from './Display.module.css';

export const Display: React.FC = () => {
  const {
    expression,
    resultPreview,
    hasError,
    memoryValue,
    copyToClipboard,
    backspace
  } = useCalculatorContext();

  const exprEndRef = useRef<HTMLDivElement>(null);

  // Automatically scroll expression text to the right as the user types
  useEffect(() => {
    if (exprEndRef.current) {
      exprEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'end' });
    }
  }, [expression]);

  return (
    <div className={`${styles.displayWrapper} ${hasError ? styles.errorGlow : ''}`}>
      {/* Memory indicator */}
      {memoryValue !== 0 && (
        <div className={styles.memoryPill}>
          <span>M = {memoryValue}</span>
        </div>
      )}

      {/* Typing expression display */}
      <div className={styles.expressionContainer}>
        <div className={styles.expressionText}>
          {expression}
          <span className={styles.cursor}>|</span>
          <div ref={exprEndRef} />
        </div>
      </div>

      {/* Real-time result preview panel */}
      <div className={styles.previewContainer}>
        <div className={styles.previewValue}>
          {resultPreview ? `= ${resultPreview}` : ''}
        </div>
        <div className={styles.actions}>
          <button
            className={styles.actionBtn}
            onClick={backspace}
            title="Delete last character (Backspace)"
          >
            <Delete size={16} />
          </button>
          <button
            className={styles.actionBtn}
            onClick={copyToClipboard}
            title="Copy current value"
            disabled={expression === 'Syntax Error' || (!resultPreview && expression === '0')}
          >
            <Copy size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
