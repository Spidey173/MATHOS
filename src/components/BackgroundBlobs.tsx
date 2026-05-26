import React from 'react';
import styles from './BackgroundBlobs.module.css';

export const BackgroundBlobs: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={`${styles.blob} ${styles.blob1}`} />
      <div className={`${styles.blob} ${styles.blob2}`} />
      <div className={`${styles.blob} ${styles.blob3}`} />
    </div>
  );
};
