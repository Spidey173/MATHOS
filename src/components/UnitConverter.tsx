import React, { useState, useEffect } from 'react';
import { 
  convertUnits, 
  convertCurrency, 
  UNIT_FACTORS, 
  CURRENCY_RATES, 
  UnitCategory 
} from 'utils/conversion';
import { RefreshCw, ArrowRightLeft, Scale, Coins, Loader2 } from 'lucide-react';
import styles from './UnitConverter.module.css';

export const UnitConverter: React.FC = () => {
  const [subMode, setSubMode] = useState<'units' | 'currency'>('units');

  // Units state
  const [unitCategory, setUnitCategory] = useState<UnitCategory>('length');
  const [unitFrom, setUnitFrom] = useState<string>('m');
  const [unitTo, setUnitTo] = useState<string>('km');
  const [unitInputValue, setUnitInputValue] = useState<string>('1');
  const [unitResultValue, setUnitResultValue] = useState<string>('0.001');

  // Currency state
  const [currencyFrom, setCurrencyFrom] = useState<string>('USD');
  const [currencyTo, setCurrencyTo] = useState<string>('EUR');
  const [currencyInputValue, setCurrencyInputValue] = useState<string>('100');
  const [currencyResultValue, setCurrencyResultValue] = useState<string>('92.00');
  const [isFetchingRates, setIsFetchingRates] = useState<boolean>(false);
  const [ratesTimestamp, setRatesTimestamp] = useState<string>('Static Cache');

  // Auto convert units on input updates
  useEffect(() => {
    const val = parseFloat(unitInputValue);
    if (isNaN(val)) {
      setUnitResultValue('');
      return;
    }
    const result = convertUnits(val, unitFrom, unitTo, unitCategory);
    setUnitResultValue(String(result));
  }, [unitInputValue, unitFrom, unitTo, unitCategory]);

  // Adjust unit selectors automatically when changing categories
  const handleCategoryChange = (cat: UnitCategory) => {
    setUnitCategory(cat);
    const keys = Object.keys(UNIT_FACTORS[cat]);
    if (keys.length >= 2) {
      setUnitFrom(keys[0]);
      setUnitTo(keys[1]);
    }
  };

  // Convert Currency logic
  const handleCurrencyConvert = () => {
    const val = parseFloat(currencyInputValue);
    if (isNaN(val)) {
      setCurrencyResultValue('');
      return;
    }
    const result = convertCurrency(val, currencyFrom, currencyTo);
    setCurrencyResultValue(result.toFixed(2));
  };

  useEffect(() => {
    handleCurrencyConvert();
  }, [currencyInputValue, currencyFrom, currencyTo]);

  // Simulate API rate fetch
  const handleFetchRates = () => {
    setIsFetchingRates(true);
    setTimeout(() => {
      setIsFetchingRates(false);
      const now = new Date();
      setRatesTimestamp(`Updated: ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`);
      handleCurrencyConvert();
    }, 900);
  };

  const swapUnits = () => {
    setUnitFrom(unitTo);
    setUnitTo(unitFrom);
  };

  const swapCurrency = () => {
    setCurrencyFrom(currencyTo);
    setCurrencyTo(currencyFrom);
  };

  return (
    <div className={styles.container}>
      {/* Submode toggler */}
      <div className={styles.tabHeader}>
        <button
          className={`${styles.tabBtn} ${subMode === 'units' ? styles.tabBtnActive : ''}`}
          onClick={() => setSubMode('units')}
        >
          <Scale size={14} />
          <span>Unit Converter</span>
        </button>
        <button
          className={`${styles.tabBtn} ${subMode === 'currency' ? styles.tabBtnActive : ''}`}
          onClick={() => setSubMode('currency')}
        >
          <Coins size={14} />
          <span>Currency exchange</span>
        </button>
      </div>

      {subMode === 'units' ? (
        <div className={styles.sectionBody}>
          {/* Category Tabs */}
          <div className={styles.categoryBar}>
            {(['length', 'weight', 'temperature', 'area'] as UnitCategory[]).map((cat) => (
              <button
                key={cat}
                className={`${styles.categoryBtn} ${unitCategory === cat ? styles.categoryActive : ''}`}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Grid Layout Converter */}
          <div className={styles.converterGrid}>
            <div className={styles.convertCol}>
              <label>From</label>
              <select
                className={styles.select}
                value={unitFrom}
                onChange={(e) => setUnitFrom(e.target.value)}
              >
                {Object.entries(UNIT_FACTORS[unitCategory]).map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                className={styles.inputField}
                value={unitInputValue}
                onChange={(e) => setUnitInputValue(e.target.value)}
                placeholder="Enter value"
              />
            </div>

            <button className={styles.swapBtn} onClick={swapUnits} title="Swap Units">
              <ArrowRightLeft size={16} />
            </button>

            <div className={styles.convertCol}>
              <label>To</label>
              <select
                className={styles.select}
                value={unitTo}
                onChange={(e) => setUnitTo(e.target.value)}
              >
                {Object.entries(UNIT_FACTORS[unitCategory]).map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                className={`${styles.inputField} ${styles.resultField}`}
                value={unitResultValue}
                readOnly
                placeholder="Result"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.sectionBody}>
          <div className={styles.currencyHeader}>
            <div className={styles.badgeRow}>
              <span className={styles.ratesBadge}>{ratesTimestamp}</span>
            </div>
            <button
              className={styles.fetchBtn}
              onClick={handleFetchRates}
              disabled={isFetchingRates}
            >
              {isFetchingRates ? (
                <>
                  <Loader2 size={14} className={styles.spin} />
                  <span>Syncing...</span>
                </>
              ) : (
                <>
                  <RefreshCw size={14} />
                  <span>Fetch Live Rates</span>
                </>
              )}
            </button>
          </div>

          <div className={styles.converterGrid}>
            <div className={styles.convertCol}>
              <label>From Currency</label>
              <select
                className={styles.select}
                value={currencyFrom}
                onChange={(e) => setCurrencyFrom(e.target.value)}
              >
                {Object.entries(CURRENCY_RATES).map(([key, item]) => (
                  <option key={key} value={key}>
                    {key} - {item.name} ({item.symbol})
                  </option>
                ))}
              </select>
              <input
                type="number"
                className={styles.inputField}
                value={currencyInputValue}
                onChange={(e) => setCurrencyInputValue(e.target.value)}
                placeholder="USD amount"
              />
            </div>

            <button className={styles.swapBtn} onClick={swapCurrency} title="Swap Currency">
              <ArrowRightLeft size={16} />
            </button>

            <div className={styles.convertCol}>
              <label>To Currency</label>
              <select
                className={styles.select}
                value={currencyTo}
                onChange={(e) => setCurrencyTo(e.target.value)}
              >
                {Object.entries(CURRENCY_RATES).map(([key, item]) => (
                  <option key={key} value={key}>
                    {key} - {item.name} ({item.symbol})
                  </option>
                ))}
              </select>
              <input
                type="text"
                className={`${styles.inputField} ${styles.resultField}`}
                value={currencyResultValue}
                readOnly
                placeholder="Converted amount"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
