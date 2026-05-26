// Pure synthesized mechanical and digital click sounds using the Web Audio API.
// Avoids loading static MP3/WAV files and works instantly on modern browsers.

let audioCtx: AudioContext | null = null;

export type SoundType = 'mechanical' | 'digital' | 'chime' | 'success';

export function playKeySound(type: SoundType = 'mechanical', isSoundEnabled = true) {
  if (!isSoundEnabled) return;

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    switch (type) {
      case 'mechanical':
        // A short tactile woody/plastic click (similar to physical calculator buttons)
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.03);

        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        
        osc.start(now);
        osc.stop(now + 0.03);
        break;

      case 'digital':
        // Classic high-tech digital sine wave beep
        osc.type = 'sine';
        osc.frequency.setValueAtTime(950, now);
        
        gainNode.gain.setValueAtTime(0.04, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        
        osc.start(now);
        osc.stop(now + 0.06);
        break;

      case 'chime':
        // High-pitched crystal bell sound
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1800, now);
        
        gainNode.gain.setValueAtTime(0.05, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        
        osc.start(now);
        osc.stop(now + 0.12);
        break;

      case 'success':
        // Upward arpeggio for computations or copying!
        // We can play two fast notes in succession
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
        
        gainNode.gain.setValueAtTime(0.06, now);
        gainNode.gain.setValueAtTime(0.06, now + 0.08);
        gainNode.gain.setValueAtTime(0.06, now + 0.16);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        
        osc.start(now);
        osc.stop(now + 0.3);
        break;
    }
  } catch (e) {
    console.warn('Web Audio synthesis was blocked or is not supported in this environment:', e);
  }
}
