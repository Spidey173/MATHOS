import React, { useState, useEffect, useRef } from 'react';
import { parseAndEvaluate } from 'utils/mathParser';
import { ZoomIn, ZoomOut, RotateCcw, LineChart, HelpCircle } from 'lucide-react';
import styles from './GraphPlotter.module.css';

interface Preset {
  name: string;
  expression: string;
}

export const GraphPlotter: React.FC = () => {
  const [equation, setEquation] = useState<string>('sin(x)');
  const [zoom, setZoom] = useState<number>(30); // pixels per unit
  const [errorMsg, setErrorMsg] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const presets: Preset[] = [
    { name: 'Sine Wave', expression: 'sin(x)' },
    { name: 'Double Cosine', expression: '2*cos(x)' },
    { name: 'Parabola', expression: 'x^2 - 4' },
    { name: 'Cubic Curve', expression: 'x^3 - 3*x' },
    { name: 'Absolute V', expression: 'abs(x)' },
  ];

  // Draw coordinate grids and function curve
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Grid details
    const centerX = width / 2;
    const centerY = height / 2;

    // Draw Grid Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    for (let x = centerX % zoom; x < width; x += zoom) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    // Horizontal grid lines
    for (let y = centerY % zoom; y < height; y += zoom) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw Main Axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 2;
    
    // X Axis
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // Y Axis
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Axis Labels/Ticks
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '10px Share Tech Mono';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    // Draw X numbers
    const xUnitsLimit = Math.ceil(width / 2 / zoom);
    for (let i = -xUnitsLimit; i <= xUnitsLimit; i++) {
      if (i === 0) continue;
      const xPos = centerX + i * zoom;
      ctx.fillText(String(i), xPos, centerY + 5);
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.moveTo(xPos, centerY - 3);
      ctx.lineTo(xPos, centerY + 3);
      ctx.stroke();
    }

    // Draw Y numbers
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    const yUnitsLimit = Math.ceil(height / 2 / zoom);
    for (let i = -yUnitsLimit; i <= yUnitsLimit; i++) {
      if (i === 0) continue;
      const yPos = centerY - i * zoom;
      ctx.fillText(String(i), centerX - 5, yPos);
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.moveTo(centerX - 3, yPos);
      ctx.lineTo(centerX + 3, yPos);
      ctx.stroke();
    }

    // Draw equation curve
    ctx.beginPath();
    ctx.strokeStyle = '#22d3ee'; // beautiful glowing cyan
    ctx.lineWidth = 3.5;
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#0891b2';
    
    let pathStarted = false;
    let errorsFound = false;

    // Loop through every pixel column in the canvas
    for (let pixelX = 0; pixelX < width; pixelX++) {
      // Convert pixel position to math coordinate x value
      const x = (pixelX - centerX) / zoom;
      
      try {
        // Evaluate the equation
        // Safely replace standard letters/symbols. Handle x values.
        // We will replace "x" in our expression with parenthesized coordinate values.
        const evaluatedExpr = equation.toLowerCase()
          .replace(/\bx\b/g, `(${x})`);

        const y = parseAndEvaluate(evaluatedExpr);

        // Convert math coordinate y back to pixel position
        const pixelY = centerY - y * zoom;

        // Skip coordinates that are off the viewport
        if (pixelY >= 0 && pixelY <= height) {
          if (!pathStarted) {
            ctx.moveTo(pixelX, pixelY);
            pathStarted = true;
          } else {
            ctx.lineTo(pixelX, pixelY);
          }
        } else {
          pathStarted = false;
        }
      } catch (err) {
        errorsFound = true;
        pathStarted = false;
      }
    }

    if (pathStarted) {
      ctx.stroke();
    }
    
    // Clear shadow blur for next renders
    ctx.shadowBlur = 0;

    if (errorsFound && equation.trim().length > 0) {
      setErrorMsg('Syntax warning: Ensure correct syntax (e.g. use 2*x instead of 2x)');
    } else {
      setErrorMsg('');
    }

  }, [equation, zoom]);

  const handlePresetClick = (presetExpr: string) => {
    setEquation(presetExpr);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <LineChart size={18} className={styles.icon} />
          <h3>Interactive Function Grapher</h3>
        </div>
        <div className={styles.zoomControls}>
          <button className={styles.ctrlBtn} onClick={() => setZoom(prev => Math.min(prev + 5, 80))} title="Zoom In">
            <ZoomIn size={14} />
          </button>
          <button className={styles.ctrlBtn} onClick={() => setZoom(prev => Math.max(prev - 5, 10))} title="Zoom Out">
            <ZoomOut size={14} />
          </button>
          <button className={styles.ctrlBtn} onClick={() => setZoom(30)} title="Reset View">
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      <div className={styles.inputArea}>
        <span className={styles.prefix}>y =</span>
        <input
          type="text"
          className={styles.equationInput}
          value={equation}
          onChange={(e) => setEquation(e.target.value)}
          placeholder="e.g. sin(x), x^2 - 4, cos(x)"
        />
      </div>

      {errorMsg && <p className={styles.errorText}>{errorMsg}</p>}

      <div className={styles.canvasWrapper}>
        <canvas
          ref={canvasRef}
          width={500}
          height={320}
          className={styles.canvas}
        />
      </div>

      <div className={styles.presetsWrapper}>
        <span className={styles.presetLabel}>Quick Presets:</span>
        <div className={styles.presetsList}>
          {presets.map((preset) => (
            <button
              key={preset.name}
              className={`${styles.presetBtn} ${equation === preset.expression ? styles.presetActive : ''}`}
              onClick={() => handlePresetClick(preset.expression)}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.tipBox}>
        <HelpCircle size={14} className={styles.tipIcon} />
        <span>Use explicit operators (e.g. <code>2*x</code> instead of <code>2x</code>). Exponents use <code>^</code>.</span>
      </div>
    </div>
  );
};
