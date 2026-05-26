# 🧮 MATHOS — Premium Computational Suite

<div align="center">

**MATHOS** is an ultra-premium, feature-rich scientific calculator and mathematical utility suite designed as a world-class portfolio showcase. Converting standard calculators into complete mathematical sandboxes, it couples high-performance algebraic parsing with next-level visual design (Glassmorphism, tactile Neumorphism, and glowing Neon themes).
</div>

---

## 🎨 Visual Aesthetics & Themes

Mathos features **four hand-crafted styling engines** built with modern CSS variables, fluid backdrops, and active shadow casting:

1. **🔮 Glassmorphism Dark (Default)**: Deep translucent backdrop-blurs overlaying organic slow-drifting color blobs.
2. **🧼 Neumorphic Light**: Soft tactile physical beveled keys with realistic offset double shadows simulating depth.
3. **👾 Cyberpunk Neon**: Ultra-high contrast dark interfaces, hot pink borders, and cyan glowing labels.
4. **📟 Retro LCD**: 80s liquid-crystal green grid with classic digital monospace layouts.

---

## 🚀 Advanced Feature Matrix

| Module | Sub-Features | Under the Hood |
| :--- | :--- | :--- |
| **🧮 Scientific Calculator** | Standard arithmetic, braces, `sin`/`cos`/`tan`, `log`/`ln`, powers `^`, and absolute rules | **Pratt Tokenizer & Shunting-Yard Parser** executing equations safely without standard `eval` |
| **📈 Canvas Grapher** | Plot any custom function `y = f(x)` (e.g., `sin(x)`, `x^2 - 4`) live in interactive viewports | Fast pixel-to-grid map scaling with mathematical range loops, ticks, axes, and neon sweeps |
| **🔄 Multi-Converter** | Convert Length, Weight, Temp, and Area. Simulated live **Currency Exchange** API | Ratios conversion tables + synthetic fetch load delays, and live updates status badges |
| **📐 Equation Solver** | Solves Quadratic forms ($ax^2+bx+c=0$) and 2x2 Linear Systems in real-time | Automated discriminant evaluation (real/imaginary complex roots) and **Cramer's Determinant Rule** |
| **🗣️ Voice Dictation** | Speak computational queries e.g. *"ten plus sine of ninety equals"* to solve instantly | Integrated **HTML5 Speech Recognition** API mapping english verbal terms to math symbols |

---

## 🎵 Dynamic Sensory Micro-Interactions

* **Oscillator Key Sound Synthesis**: Toggling sounds plays mechanical clicks, digital high-tech sweeps, or success chimes generated *natively* on the fly via browser **Web Audio API** (requires zero static asset fetches).
* **Framer Motion Tactile Keyboards**: All buttons scale down and pop back during clicks utilizing custom spring physics. All screen transitions and lists use fluid staggering.
* **Victory Confetti Burst**: Solving equations or copying results triggers celebratory floating physics confetti.

---

## 📁 Repository Directory Structure

The project has been refactored into a highly clean, modular, and type-safe architecture:

```
src/
├── components/           # Modular UI Components
│   ├── BackgroundBlobs.tsx    # Slow floating dynamic glow blobs
│   ├── LoadingScreen.tsx      # SVG-driven high-tech loader sequence
│   ├── Calculator.tsx         # Resizing card shell (Std vs Sci)
│   ├── Display.tsx            # Main scrollable typing screen & result preview
│   ├── StandardKeys.tsx       # Standard arithmetic number keys grid
│   ├── ScientificKeys.tsx     # Extended trigonometric and function keys
│   ├── MemoryKeys.tsx         # MC, MR, M+, M- persistent memory slot pad
│   ├── HistoryPanel.tsx       # Scrolling side history displaying past results
│   ├── GraphPlotter.tsx       # Graphing board leveraging html5 canvas
│   ├── UnitConverter.tsx      # Combined Units and simulated Currency exchange board
│   ├── EquationSolver.tsx     # Solves and breaks down Quadratic and Linear system equations
│   └── VoiceInput.tsx         # Voice dictation mapping engine
├── hooks/                # Custom stateful hooks
│   └── useLocalStorage.ts     # Synchronizes states (history, memory, theme) to LocalStorage
├── utils/                # Pure logic computations
│   ├── mathParser.ts          # Custom Pratt tokenization & Shunting-Yard math evaluator
│   ├── audioSynth.ts          # Physical audio waveforms synthesizer (sine/triangle oscillators)
│   └── conversion.ts          # Conversion ratio configurations
├── context/              # Central State Provider
│   └── CalculatorContext.tsx  # Centralized logic, keyboard hotkeys, and triggers
├── styles/               # Global Design Systems
│   └── variables.css          # Dynamic CSS custom tokens defining theme palettes
├── App.tsx               # Main visual route layout manager
├── index.tsx             # DOM mount script
└── react-app-env.d.ts    # React TS declarations
```

---

## 🛠️ Installation & Setup

Ensure you have **Node.js (v16.0.0 or higher)** installed.

1. Clone the repository and navigate into it:
   ```bash
   cd react-calculator
   ```

2. Install premium dependencies:
   ```bash
   npm install
   ```

3. Run the development suite:
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the suite running in real-time.

---

## 📦 Suggested NPM Packages Incorporated

* **`framer-motion`** — Utilized for spring button presses and sidebar fade entries.
* **`lucide-react`** — Used for modern, lightweight, stroke-based minimal icons.
* **`canvas-confetti`** — Triggers beautiful satisfaction feedback upon evaluations.

---

## 🤝 Contribution Guidelines

We highly encourage mathematical and stylistic contributions! 
* Open an issue to discuss design enhancements.
* Create a branch (`feature/math-addition`) and submit a pull request.
* Please ensure code builds without compilation warnings and adheres to standard ESLint parameters.

---

## 📄 License
This project is open-source under the terms of the [MIT License](./LICENSE).

---

<div align="center">
  <sub>Built with mathematical precision and design love by the Mathos Team. 🧮✨</sub>
</div>
