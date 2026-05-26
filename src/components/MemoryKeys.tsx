import React from 'react';
import { useCalculatorContext } from 'context/CalculatorContext';
import { motion } from 'framer-motion';
import styles from './MemoryKeys.module.css';

export const MemoryKeys: React.FC = () => {
  const {
    memoryAdd,
    memorySubtract,
    memoryRecall,
    memoryClear,
    memoryValue
  } = useCalculatorContext();

  const buttonVariants = {
    hover: { 
      scale: 1.04,
      transition: { duration: 0.1 }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.05 }
    }
  };

  return (
    <div className={styles.container}>
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className={`${styles.btn} ${memoryValue === 0 ? styles.disabledClear : ''}`}
        onClick={memoryClear}
        title="Clear memory (MC)"
        disabled={memoryValue === 0}
      >
        MC
      </motion.button>
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className={`${styles.btn} ${styles.btnHighlight}`}
        onClick={memoryRecall}
        title="Recall memory (MR)"
      >
        MR
      </motion.button>
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className={styles.btn}
        onClick={memoryAdd}
        title="Add current result to memory (M+)"
      >
        M+
      </motion.button>
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className={styles.btn}
        onClick={memorySubtract}
        title="Subtract current result from memory (M-)"
      >
        M-
      </motion.button>
    </div>
  );
};
