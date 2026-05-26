import React from 'react';
import { useCalculatorContext } from 'context/CalculatorContext';
import { Trash2, CornerDownLeft, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './HistoryPanel.module.css';

export const HistoryPanel: React.FC = () => {
  const { history, clearHistory, setExpression } = useCalculatorContext();

  const handleItemClick = (calcString: string) => {
    // A calcString is of the form "expression = result"
    const parts = calcString.split(' = ');
    if (parts.length === 2) {
      const result = parts[1];
      setExpression(result);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.15 } }
  } as const;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <Clock size={16} className={styles.clockIcon} />
          <h3>Calculation History</h3>
        </div>
        {history.length > 0 && (
          <button
            className={styles.clearBtn}
            onClick={clearHistory}
            title="Clear all history"
          >
            <Trash2 size={14} />
            <span>Clear</span>
          </button>
        )}
      </div>

      <div className={styles.scrollArea}>
        <AnimatePresence mode="popLayout">
          {history.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={styles.emptyState}
            >
              <p>No calculations yet</p>
              <span>Equations you solve will appear here</span>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className={styles.list}
            >
              {history.map((calc, index) => {
                const parts = calc.split(' = ');
                const expr = parts[0] || '';
                const res = parts[1] || '';

                return (
                  <motion.div
                    key={`${calc}-${index}`}
                    variants={itemVariants}
                    layout
                    className={styles.item}
                    onClick={() => handleItemClick(calc)}
                    title="Click to load result into calculator"
                  >
                    <div className={styles.itemExpr}>{expr}</div>
                    <div className={styles.itemResRow}>
                      <CornerDownLeft size={10} className={styles.insertIcon} />
                      <span className={styles.itemRes}>{res}</span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
