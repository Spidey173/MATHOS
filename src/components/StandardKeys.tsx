import React from 'react';
import { useCalculatorContext } from 'context/CalculatorContext';
import { motion } from 'framer-motion';
import styles from './StandardKeys.module.css';

export const StandardKeys: React.FC = () => {
  const {
    inputDigit,
    inputDecimal,
    inputOperator,
    inputParenthesis,
    clearAll,
    evaluate,
    toggleSign
  } = useCalculatorContext();

  const buttonVariants = {
    hover: { 
      scale: 1.04,
      boxShadow: 'var(--shadow-button-hover)',
      transition: { duration: 0.1 }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.05 }
    }
  };

  return (
    <div className={styles.grid}>
      {/* Row 1 */}
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className={`${styles.btn} ${styles.btnFunction}`}
        onClick={clearAll}
      >
        C
      </motion.button>
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className={`${styles.btn} ${styles.btnFunction}`}
        onClick={() => inputParenthesis('(')}
      >
        (
      </motion.button>
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className={`${styles.btn} ${styles.btnFunction}`}
        onClick={() => inputParenthesis(')')}
      >
        )
      </motion.button>
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className={`${styles.btn} ${styles.btnOperator}`}
        onClick={() => inputOperator('/')}
      >
        ÷
      </motion.button>

      {/* Row 2 */}
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className={styles.btn}
        onClick={() => inputDigit('7')}
      >
        7
      </motion.button>
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className={styles.btn}
        onClick={() => inputDigit('8')}
      >
        8
      </motion.button>
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className={styles.btn}
        onClick={() => inputDigit('9')}
      >
        9
      </motion.button>
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className={`${styles.btn} ${styles.btnOperator}`}
        onClick={() => inputOperator('*')}
      >
        ×
      </motion.button>

      {/* Row 3 */}
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className={styles.btn}
        onClick={() => inputDigit('4')}
      >
        4
      </motion.button>
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className={styles.btn}
        onClick={() => inputDigit('5')}
      >
        5
      </motion.button>
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className={styles.btn}
        onClick={() => inputDigit('6')}
      >
        6
      </motion.button>
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className={`${styles.btn} ${styles.btnOperator}`}
        onClick={() => inputOperator('-')}
      >
        −
      </motion.button>

      {/* Row 4 */}
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className={styles.btn}
        onClick={() => inputDigit('1')}
      >
        1
      </motion.button>
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className={styles.btn}
        onClick={() => inputDigit('2')}
      >
        2
      </motion.button>
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className={styles.btn}
        onClick={() => inputDigit('3')}
      >
        3
      </motion.button>
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className={`${styles.btn} ${styles.btnOperator}`}
        onClick={() => inputOperator('+')}
      >
        +
      </motion.button>

      {/* Row 5 */}
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className={styles.btn}
        onClick={toggleSign}
      >
        ±
      </motion.button>
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className={styles.btn}
        onClick={() => inputDigit('0')}
      >
        0
      </motion.button>
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className={styles.btn}
        onClick={inputDecimal}
      >
        .
      </motion.button>
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className={`${styles.btn} ${styles.btnEquals}`}
        onClick={evaluate}
      >
        =
      </motion.button>
    </div>
  );
};
