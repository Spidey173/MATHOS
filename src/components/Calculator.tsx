import React from 'react';
import { useCalculatorContext } from 'context/CalculatorContext';
import { Display } from './Display';
import { MemoryKeys } from './MemoryKeys';
import { StandardKeys } from './StandardKeys';
import { ScientificKeys } from './ScientificKeys';
import { VoiceInput } from './VoiceInput';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, 
  VolumeX, 
  Sparkles,
  Layers,
  Flame,
  Sun,
  Laptop
} from 'lucide-react';
import styles from './Calculator.module.css';

export const Calculator: React.FC = () => {
  const {
    isScientific,
    setIsScientific,
    isSoundEnabled,
    setIsSoundEnabled,
    soundType,
    setSoundType,
    theme,
    setTheme
  } = useCalculatorContext();

  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
  };

  const cycleTheme = () => {
    const themes: ('glass' | 'neo' | 'neon' | 'retro')[] = ['glass', 'neo', 'neon', 'retro'];
    const nextIdx = (themes.indexOf(theme) + 1) % themes.length;
    setTheme(themes[nextIdx]);
  };

  const cycleSoundType = () => {
    const types: ('mechanical' | 'digital' | 'chime')[] = ['mechanical', 'digital', 'chime'];
    const nextIdx = (types.indexOf(soundType as any) + 1) % types.length;
    setSoundType(types[nextIdx]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className={styles.calculatorCard}
    >
      {/* Dynamic calculator toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarTitle}>
          <Sparkles size={16} className={styles.sparkIcon} />
          <span>Calculations</span>
        </div>
        
        <div className={styles.controls}>
          {/* Voice Input */}
          <VoiceInput />

          {/* Sound toggle & type cycles */}
          <div className={styles.soundControls}>
            <button
              className={styles.toolBtn}
              onClick={toggleSound}
              title={isSoundEnabled ? "Mute sounds" : "Unmute sounds"}
            >
              {isSoundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            {isSoundEnabled && (
              <button
                className={styles.badgeBtn}
                onClick={cycleSoundType}
                title="Change mechanical/digital oscillator sounds"
              >
                <span>{soundType}</span>
              </button>
            )}
          </div>

          {/* Theme Cycler */}
          <button
            className={styles.toolBtn}
            onClick={cycleTheme}
            title={`Active Theme: ${theme.toUpperCase()}. Click to cycle.`}
          >
            {theme === 'glass' && <Layers size={16} />}
            {theme === 'neo' && <Sun size={16} />}
            {theme === 'neon' && <Flame size={16} />}
            {theme === 'retro' && <Laptop size={16} />}
          </button>

          {/* Scientific mode switch */}
          <div className={styles.modeSwitch}>
            <button
              className={`${styles.modeBtn} ${!isScientific ? styles.modeBtnActive : ''}`}
              onClick={() => setIsScientific(false)}
            >
              Std
            </button>
            <button
              className={`${styles.modeBtn} ${isScientific ? styles.modeBtnActive : ''}`}
              onClick={() => setIsScientific(true)}
            >
              Sci
            </button>
          </div>
        </div>
      </div>

      {/* Primary Display */}
      <Display />

      {/* Memory Panel */}
      <MemoryKeys />

      {/* Keypads layout */}
      <div className={styles.keypadsLayout}>
        <AnimatePresence initial={false}>
          {isScientific && (
            <motion.div
              initial={{ opacity: 0, width: 0, scale: 0.95 }}
              animate={{ opacity: 1, width: 'auto', scale: 1 }}
              exit={{ opacity: 0, width: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className={styles.scientificContainer}
            >
              <div className={styles.sciSpacer}>
                <ScientificKeys />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={styles.standardContainer}>
          <StandardKeys />
        </div>
      </div>
    </motion.div>
  );
};
