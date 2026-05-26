import React, { useState, useEffect } from 'react';
import { useCalculatorContext } from 'context/CalculatorContext';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import styles from './VoiceInput.module.css';

export const VoiceInput: React.FC = () => {
  const { setExpression, clearAll, evaluate } = useCalculatorContext();
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [supportSpeech, setSupportSpeech] = useState<boolean>(true);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Check Speech Recognition support
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSupportSpeech(false);
      return;
    }

    const recObj = new SpeechRecognition();
    recObj.continuous = false;
    recObj.interimResults = false;
    recObj.lang = 'en-US';

    recObj.onstart = () => {
      setIsListening(true);
      setTranscript('Listening...');
    };

    recObj.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      setIsListening(false);
      setTranscript('Error, try again');
    };

    recObj.onend = () => {
      setIsListening(false);
    };

    recObj.onresult = (event: any) => {
      const resultText = event.results[0][0].transcript;
      setTranscript(resultText);
      parseSpeechToMath(resultText);
    };

    setRecognition(recObj);
  }, []);

  const parseSpeechToMath = (speech: string) => {
    let cleanText = speech.toLowerCase().trim();

    // Direct actions
    if (cleanText === 'clear' || cleanText === 'reset') {
      clearAll();
      setTranscript('Cleared!');
      return;
    }

    if (cleanText === 'equals' || cleanText === 'evaluate' || cleanText === 'calculate') {
      evaluate();
      setTranscript('Evaluating...');
      return;
    }

    // Word mapping dictionary
    const replacements: [RegExp, string][] = [
      [/\bplus\b/g, '+'],
      [/\bminus\b/g, '-'],
      [/\btimes\b/g, '*'],
      [/\bmultiplied\s+by\b/g, '*'],
      [/\bx\b/g, '*'],
      [/\bdivided\s+by\b/g, '/'],
      [/\bover\b/g, '/'],
      [/\bto\s+the\s+power\s+of\b/g, '^'],
      [/\bopen\s+bracket\b/g, '('],
      [/\bclose\s+bracket\b/g, ')'],
      [/\bsine\s+of\b/g, 'sin('],
      [/\bcosine\s+of\b/g, 'cos('],
      [/\btangent\s+of\b/g, 'tan('],
      [/\bsquare\s+root\s+of\b/g, 'sqrt('],
      [/\bsin\b/g, 'sin('],
      [/\bcos\b/g, 'cos('],
      [/\btan\b/g, 'tan('],
      [/\bsqrt\b/g, 'sqrt('],
      [/\bpi\b/g, 'pi'],
      [/\bpoint\b/g, '.'],
    ];

    // Numbers word dictionary mapping (simplistic support for digit words)
    const numWords: Record<string, string> = {
      zero: '0', one: '1', two: '2', three: '3', four: '4',
      five: '5', six: '6', seven: '7', eight: '8', nine: '9'
    };

    // Replace words
    for (const [regex, replacement] of replacements) {
      cleanText = cleanText.replace(regex, replacement);
    }

    // Replace numeric words
    Object.entries(numWords).forEach(([word, digit]) => {
      const reg = new RegExp(`\\b${word}\\b`, 'g');
      cleanText = cleanText.replace(reg, digit);
    });

    // Strip out non-allowed mathematical characters (safety buffer)
    const mathExpression = cleanText.replace(/[^0-9\+\-\*\/\.\(\)\^%e\spi]/g, '');

    if (mathExpression.trim()) {
      setExpression(mathExpression.replace(/\s+/g, ''));
    } else {
      setTranscript(`Couldn't translate: "${speech}"`);
    }
  };

  const toggleListening = () => {
    if (!supportSpeech || !recognition) return;

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  if (!supportSpeech) {
    return (
      <button
        className={styles.micBtnDisabled}
        title="Speech recognition not supported in this browser"
        disabled
      >
        <MicOff size={16} />
      </button>
    );
  }

  return (
    <div className={styles.voiceWrapper}>
      {transcript && isListening && (
        <div className={styles.transcriptTip}>
          <Loader2 size={10} className={styles.spin} />
          <span>{transcript}</span>
        </div>
      )}
      <button
        className={`${styles.micBtn} ${isListening ? styles.micActive : ''}`}
        onClick={toggleListening}
        title="Voice calculation (Click & Speak e.g., '5 plus 10 times 2')"
      >
        <Mic size={16} />
      </button>
    </div>
  );
};
