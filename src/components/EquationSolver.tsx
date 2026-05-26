import React, { useState, useEffect } from 'react';
import { Compass, HelpCircle } from 'lucide-react';
import styles from './EquationSolver.module.css';

export const EquationSolver: React.FC = () => {
  const [solveMode, setSolveMode] = useState<'quadratic' | 'linear'>('quadratic');

  // Quadratic inputs: ax^2 + bx + c = 0
  const [quadA, setQuadA] = useState<string>('1');
  const [quadB, setQuadB] = useState<string>('-5');
  const [quadC, setQuadC] = useState<string>('6');
  const [quadResult, setQuadResult] = useState<{
    roots: string;
    discriminant: number;
    type: string;
  } | null>(null);

  // Linear inputs:
  // a1 x + b1 y = c1
  // a2 x + b2 y = c2
  const [linA1, setLinA1] = useState<string>('2');
  const [linB1, setLinB1] = useState<string>('1');
  const [linC1, setLinC1] = useState<string>('11');
  const [linA2, setLinA2] = useState<string>('1');
  const [linB2, setLinB2] = useState<string>('-3');
  const [linC2, setLinC2] = useState<string>('-5');
  const [linResult, setLinResult] = useState<{
    x: number;
    y: number;
    determinant: number;
    msg: string;
  } | null>(null);

  // Solve Quadratic Equation
  const solveQuadratic = () => {
    const a = parseFloat(quadA);
    const b = parseFloat(quadB);
    const c = parseFloat(quadC);

    if (isNaN(a) || isNaN(b) || isNaN(c)) {
      setQuadResult(null);
      return;
    }

    if (a === 0) {
      // Linear equation: bx + c = 0 -> x = -c/b
      if (b === 0) {
        setQuadResult({
          roots: c === 0 ? 'Infinite solutions' : 'No solution',
          discriminant: 0,
          type: 'Degenerate Linear',
        });
      } else {
        const rootVal = -c / b;
        setQuadResult({
          roots: `x = ${rootVal.toFixed(4)}`,
          discriminant: 0,
          type: 'Linear Override (a=0)',
        });
      }
      return;
    }

    const disc = b * b - 4 * a * c;

    if (disc > 0) {
      const root1 = (-b + Math.sqrt(disc)) / (2 * a);
      const root2 = (-b - Math.sqrt(disc)) / (2 * a);
      setQuadResult({
        roots: `x₁ = ${root1.toFixed(4)}\nx₂ = ${root2.toFixed(4)}`,
        discriminant: disc,
        type: 'Two Distinct Real Roots',
      });
    } else if (disc === 0) {
      const root = -b / (2 * a);
      setQuadResult({
        roots: `x = ${root.toFixed(4)} (Double Root)`,
        discriminant: disc,
        type: 'One Real Double Root',
      });
    } else {
      // Complex imaginary roots
      const realPart = -b / (2 * a);
      const imagPart = Math.sqrt(-disc) / (2 * a);
      setQuadResult({
        roots: `x₁ = ${realPart.toFixed(4)} + ${imagPart.toFixed(4)}i\nx₂ = ${realPart.toFixed(4)} - ${imagPart.toFixed(4)}i`,
        discriminant: disc,
        type: 'Complex Imaginary Roots',
      });
    }
  };

  // Solve Linear Equations System (Cramer's Rule)
  const solveLinear = () => {
    const a1 = parseFloat(linA1);
    const b1 = parseFloat(linB1);
    const c1 = parseFloat(linC1);
    const a2 = parseFloat(linA2);
    const b2 = parseFloat(linB2);
    const c2 = parseFloat(linC2);

    if ([a1, b1, c1, a2, b2, c2].some(isNaN)) {
      setLinResult(null);
      return;
    }

    // Determinants
    const D = a1 * b2 - b1 * a2;
    const Dx = c1 * b2 - b1 * c2;
    const Dy = a1 * c2 - c1 * a2;

    if (D !== 0) {
      const xVal = Dx / D;
      const yVal = Dy / D;
      setLinResult({
        x: Math.round(xVal * 1e4) / 1e4,
        y: Math.round(yVal * 1e4) / 1e4,
        determinant: D,
        msg: 'Unique solution found',
      });
    } else {
      if (Dx === 0 && Dy === 0) {
        setLinResult({
          x: 0,
          y: 0,
          determinant: D,
          msg: 'Infinite solutions (Collinear lines)',
        });
      } else {
        setLinResult({
          x: 0,
          y: 0,
          determinant: D,
          msg: 'No solution (Parallel lines)',
        });
      }
    }
  };

  useEffect(() => {
    if (solveMode === 'quadratic') solveQuadratic();
  }, [quadA, quadB, quadC, solveMode]);

  useEffect(() => {
    if (solveMode === 'linear') solveLinear();
  }, [linA1, linB1, linC1, linA2, linB2, linC2, solveMode]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <Compass size={18} className={styles.icon} />
          <h3>Advanced Equation Solver</h3>
        </div>
        <div className={styles.solverSwitch}>
          <button
            className={`${styles.switchBtn} ${solveMode === 'quadratic' ? styles.switchBtnActive : ''}`}
            onClick={() => setSolveMode('quadratic')}
          >
            Quadratic
          </button>
          <button
            className={`${styles.switchBtn} ${solveMode === 'linear' ? styles.switchBtnActive : ''}`}
            onClick={() => setSolveMode('linear')}
          >
            2x2 System
          </button>
        </div>
      </div>

      {solveMode === 'quadratic' ? (
        <div className={styles.solverBody}>
          <p className={styles.subtext}>Solves equations of form ax² + bx + c = 0</p>
          <div className={styles.inputsRow}>
            <div className={styles.inputCol}>
              <span className={styles.varLabel}>a</span>
              <input
                type="number"
                className={styles.solverInput}
                value={quadA}
                onChange={(e) => setQuadA(e.target.value)}
              />
            </div>
            <div className={styles.inputCol}>
              <span className={styles.varLabel}>b</span>
              <input
                type="number"
                className={styles.solverInput}
                value={quadB}
                onChange={(e) => setQuadB(e.target.value)}
              />
            </div>
            <div className={styles.inputCol}>
              <span className={styles.varLabel}>c</span>
              <input
                type="number"
                className={styles.solverInput}
                value={quadC}
                onChange={(e) => setQuadC(e.target.value)}
              />
            </div>
          </div>

          {quadResult && (
            <div className={styles.resultBox}>
              <div className={styles.resultMeta}>
                <span className={styles.metaBadge}>{quadResult.type}</span>
                <span className={styles.discBadge}>D = {quadResult.discriminant}</span>
              </div>
              <pre className={styles.rootsText}>{quadResult.roots}</pre>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.solverBody}>
          <p className={styles.subtext}>Solves a system of equations: a₁x + b₁y = c₁ & a₂x + b₂y = c₂</p>
          <div className={styles.linearInputs}>
            <div className={styles.linRow}>
              <span>Eq 1:</span>
              <input
                type="number"
                className={styles.solverInputCompact}
                value={linA1}
                onChange={(e) => setLinA1(e.target.value)}
                placeholder="a1"
              />
              <span className={styles.mathSign}>x +</span>
              <input
                type="number"
                className={styles.solverInputCompact}
                value={linB1}
                onChange={(e) => setLinB1(e.target.value)}
                placeholder="b1"
              />
              <span className={styles.mathSign}>y =</span>
              <input
                type="number"
                className={styles.solverInputCompact}
                value={linC1}
                onChange={(e) => setLinC1(e.target.value)}
                placeholder="c1"
              />
            </div>

            <div className={styles.linRow}>
              <span>Eq 2:</span>
              <input
                type="number"
                className={styles.solverInputCompact}
                value={linA2}
                onChange={(e) => setLinA2(e.target.value)}
                placeholder="a2"
              />
              <span className={styles.mathSign}>x +</span>
              <input
                type="number"
                className={styles.solverInputCompact}
                value={linB2}
                onChange={(e) => setLinB2(e.target.value)}
                placeholder="b2"
              />
              <span className={styles.mathSign}>y =</span>
              <input
                type="number"
                className={styles.solverInputCompact}
                value={linC2}
                onChange={(e) => setLinC2(e.target.value)}
                placeholder="c2"
              />
            </div>
          </div>

          {linResult && (
            <div className={styles.resultBox}>
              <div className={styles.resultMeta}>
                <span className={styles.metaBadge}>{linResult.msg}</span>
                <span className={styles.discBadge}>Determinant = {linResult.determinant}</span>
              </div>
              {linResult.determinant !== 0 ? (
                <pre className={styles.rootsText}>
                  {`x = ${linResult.x}\ny = ${linResult.y}`}
                </pre>
              ) : (
                <span className={styles.noRootMsg}>{linResult.msg}</span>
              )}
            </div>
          )}
        </div>
      )}

      <div className={styles.solverTip}>
        <HelpCircle size={14} className={styles.tipIcon} />
        <span>Roots are calculated instantly on parameter updates. All calculations are rounded to 4 decimals.</span>
      </div>
    </div>
  );
};
