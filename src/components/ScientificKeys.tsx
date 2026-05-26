import React from 'react';
import { useCalculatorContext } from 'context/CalculatorContext';
import { motion } from 'framer-motion';
import styles from './ScientificKeys.module.css';

export const ScientificKeys: React.FC = () => {
  const {
    inputFunction,
    inputOperator,
    inputDigit,
    percentage
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
        className={styles.btn}
        onClick={() => inputFunction('sin')}
        title="Sine function"
      >
        sin
      </motion.button>
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className={styles.btn}
        onClick={() => inputFunction('cos')}
        title="Cosine function"
      >
        cos
      </motion.button>
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className={styles.btn}
        onClick={() => inputFunction('tan')}
        title="Tangent function"
      >
        tan
      </motion.button>
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className={`${styles.btn} ${styles.btnSpecial}`}
        onClick={() => inputOperator('^')}
        title="Exponentiation (x^y)"
      >
        x<sup>y</sup>
      </motion.button>

      {/* Row 2 */}
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className={styles.btn}
        onClick={() => inputFunction('ln')}
        title="Natural logarithm (base e)"
      >
        ln
      </motion.button>
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className={styles.btn}
        onClick={() => inputFunction('log')}
        title="Common logarithm (base 10)"
      >
        log
      </motion.button>
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className={styles.btn}
        onClick={() => inputFunction('sqrt')}
        title="Square root"
      >
        √
      </motion.button>
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className={`${styles.btn} ${styles.btnSpecial}`}
        onClick={percentage}
        title="Percent"
      >
        %
      </motion.button>

      {/* Row 3 */}
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className={styles.btn}
        onClick={() => inputDigit('pi')}
        title="Mathematical constant Pi (~3.14159)"
      >
        π
      </motion.button>
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className={styles.btn}
        onClick={() => inputDigit('e')}
        title="Euler's number (~2.71828)"
      >
        e
      </motion.button>
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className={styles.btn}
        onClick={() => inputFunction('abs')}
        title="Absolute value"
      >
        abs
      </motion.button>
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className={`${styles.btn} ${styles.btnSpecial}`}
        onClick={() => inputFunction('exp')}
        title="Exponential (e^x)"
      >
        exp
      </motion.button>
    </div>
  );
};
