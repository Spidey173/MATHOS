import React, { useState } from 'react';
import { CalculatorProvider, useCalculatorContext } from 'context/CalculatorContext';
import { BackgroundBlobs } from 'components/BackgroundBlobs';
import { LoadingScreen } from 'components/LoadingScreen';
import { Calculator } from 'components/Calculator';
import { HistoryPanel } from 'components/HistoryPanel';
import { GraphPlotter } from 'components/GraphPlotter';
import { UnitConverter } from 'components/UnitConverter';
import { EquationSolver } from 'components/EquationSolver';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator as CalcIcon, 
  LineChart, 
  RefreshCw, 
  Compass, 
  GitBranch,
  Star
} from 'lucide-react';
import './styles/variables.css';
import styles from './App.module.css';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab } = useCalculatorContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  const tabList = [
    { id: 'calculator', name: 'Calculator', icon: CalcIcon },
    { id: 'grapher', name: 'Grapher', icon: LineChart },
    { id: 'converter', name: 'Converter', icon: RefreshCw },
    { id: 'solver', name: 'Solver', icon: Compass },
  ] as const;

  return (
    <div className={styles.appShell}>
      {/* Dynamic Animated Blobs */}
      <BackgroundBlobs />

      {/* Modern SaaS Header */}
      <header className={styles.header}>
        <div className={styles.brandRow}>
          <div className={styles.logo}>🧮</div>
          <div className={styles.brandText}>
            <h1>MATHOS</h1>
            <p>Premium Computational Suite</p>
          </div>
        </div>

        <div className={styles.githubBadges}>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.badge}
          >
            <Star size={12} className={styles.starIcon} />
            <span>Star 1.8k</span>
          </a>
          <div className={styles.badge}>
            <GitBranch size={12} />
            <span>v2.0.0</span>
          </div>
        </div>
      </header>

      {/* Unified Navigation Tabs */}
      <nav className={styles.navbar}>
        {tabList.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`${styles.navItem} ${isActive ? styles.navActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={16} />
              <span>{tab.name}</span>
              {isActive && (
                <motion.div 
                  layoutId="activeTabGlow"
                  className={styles.activeGlow}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Primary Tab Content Layout with side panel support for standard calc */}
      <main className={styles.mainContent}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -15 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className={styles.contentWrapper}
          >
            {activeTab === 'calculator' && (
              <div className={styles.calculatorSection}>
                <div className={styles.calculatorCardWrapper}>
                  <Calculator />
                </div>
                <div className={styles.historyCardWrapper}>
                  <HistoryPanel />
                </div>
              </div>
            )}

            {activeTab === 'grapher' && <GraphPlotter />}
            {activeTab === 'converter' && <UnitConverter />}
            {activeTab === 'solver' && <EquationSolver />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Modern SaaS Footer */}
      <footer className={styles.footer}>
        <p>© 2026 Mathos Computational Suite. Designed for ultimate premium UX on GitHub.</p>
        <div className={styles.footerLinks}>
          <span>MIT License</span>
          <span>•</span>
          <span>Contributions Open</span>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <CalculatorProvider>
      <AppContent />
    </CalculatorProvider>
  );
}

export default App;
