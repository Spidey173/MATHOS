import React, { useState, useEffect } from 'react';
import styles from './LoadingScreen.module.css';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing Systems...');

  useEffect(() => {
    const statuses = [
      'Initializing Systems...',
      'Loading Math Engine...',
      'Compiling Constants...',
      'Configuring Themes...',
      'Systems Ready!',
    ];

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 400);
          return 100;
        }
        
        const next = prev + Math.floor(Math.random() * 15) + 6;
        const currentProgress = Math.min(next, 100);
        
        const idx = Math.min(
          Math.floor((currentProgress / 100) * statuses.length),
          statuses.length - 1
        );
        setStatus(statuses[idx]);
        
        return currentProgress;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className={styles.loadingContainer}>
      <div className={styles.content}>
        <div className={styles.logoWrapper}>
          <svg className={styles.spinnerSvg} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" className={styles.track} />
            <circle
              cx="50"
              cy="50"
              r="45"
              className={styles.indicator}
              style={{ strokeDashoffset: 283 - (283 * progress) / 100 }}
            />
          </svg>
          <div className={styles.icon}>🧮</div>
        </div>
        <h2 className={styles.title}>
          MATHOS <span className={styles.version}>v2.0</span>
        </h2>
        <p className={styles.subtitle}>Premium Open Source Computing</p>
        <div className={styles.progressBarBg}>
          <div className={styles.progressBar} style={{ width: `${progress}%` }} />
        </div>
        <div className={styles.statusRow}>
          <span>{status}</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
};
