'use client';

import { useState, useRef, useEffect } from 'react';
import ZuZu, { ZuZuExpression } from './ZuZu';

interface AskScreenProps {
  age: number;
  onReset: () => void;
}

type ScreenState = 'idle' | 'loading' | 'answered' | 'error';

interface AnswerResult {
  answer: string;
  wasRedirected: boolean;
}

export default function AskScreen({ age, onReset }: AskScreenProps) {
  const [question, setQuestion] = useState('');
  const [screenState, setScreenState] = useState<ScreenState>('idle');
  const [result, setResult] = useState<AnswerResult | null>(null);
  const answerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Scroll answer into view after it appears
  useEffect(() => {
    if (screenState === 'answered' || screenState === 'error') {
      setTimeout(() => answerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
    }
  }, [screenState]);

  const zuZuExpression = (): ZuZuExpression => {
    if (screenState === 'loading') return 'thinking';
    if (screenState === 'answered' && result?.wasRedirected) return 'gentle';
    if (screenState === 'answered') return 'happy';
    return 'idle';
  };

  async function handleAsk() {
    const trimmed = question.trim();
    if (!trimmed || screenState === 'loading') return;

    setScreenState('loading');
    setResult(null);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: trimmed, age }),
      });

      const data: AnswerResult = await res.json();
      setResult(data);
      setScreenState('answered');
    } catch {
      setResult({
        answer: "ZuZu is taking a little nap right now — try again in a moment! 💤",
        wasRedirected: false,
      });
      setScreenState('error');
    }
  }

  function handleAskAnother() {
    setQuestion('');
    setResult(null);
    setScreenState('idle');
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleAsk();
  }

  return (
    <div className="min-h-screen bg-zuzu-bg flex flex-col items-center px-4 py-8 gap-6">

      {/* Top bar: ZuZu + age indicator */}
      <div className="w-full max-w-xl flex items-center justify-between">
        <button
          onClick={onReset}
          className="text-zuzu-teal font-bold text-lg px-4 py-2 rounded-2xl hover:bg-zuzu-teal-bg transition-colors focus:outline-none focus:ring-4 focus:ring-teal-200"
          aria-label="Go back to age picker"
        >
          ← Back
        </button>
        <span className="text-slate-500 font-semibold text-base">
          Age {age}
        </span>
      </div>

      {/* ZuZu robot */}
      <div
        className="transition-all duration-500"
        aria-live="polite"
        aria-label={`ZuZu is ${zuZuExpression()}`}
      >
        <ZuZu expression={zuZuExpression()} size="small" />
      </div>

      {/* Main content card */}
      <div className="w-full max-w-xl flex flex-col gap-5">

        {/* Question input */}
        <div className="flex flex-col gap-3">
          <input
            ref={inputRef}
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What do you want to know?"
            maxLength={500}
            disabled={screenState === 'loading'}
            className="
              w-full text-xl font-semibold
              bg-white border-3 border-zuzu-teal-bg
              rounded-3xl px-6 py-5
              placeholder:text-slate-300 text-slate-700
              focus:outline-none focus:ring-4 focus:ring-teal-200 focus:border-zuzu-teal
              disabled:opacity-60 disabled:cursor-not-allowed
              shadow-sm transition-all duration-150
            "
            aria-label="Type your question for ZuZu"
          />

          {/* Ask button */}
          <button
            onClick={handleAsk}
            disabled={!question.trim() || screenState === 'loading'}
            className={`
              w-full font-extrabold text-2xl
              px-8 py-5 rounded-3xl
              shadow-lg transition-all duration-150
              focus:outline-none focus:ring-4 focus:ring-teal-300
              ${screenState === 'loading'
                ? 'bg-slate-300 text-slate-400 cursor-not-allowed'
                : !question.trim()
                  ? 'bg-zuzu-teal opacity-50 text-white cursor-not-allowed'
                  : 'bg-zuzu-teal hover:bg-zuzu-teal-dark active:scale-95 text-white shadow-teal-200 animate-gentle-bounce'
              }
            `}
            aria-label="Ask ZuZu your question"
          >
            {screenState === 'loading' ? '🤔  Thinking…' : 'Ask ZuZu! ✨'}
          </button>
        </div>

        {/* Answer card */}
        {(screenState === 'answered' || screenState === 'error') && result && (
          <div
            ref={answerRef}
            className="animate-fade-in"
          >
            <div
              className={`
                rounded-3xl p-6 shadow-md
                ${result.wasRedirected
                  ? 'bg-amber-50 border-2 border-amber-200'
                  : 'bg-white border-2 border-zuzu-teal-bg'
                }
              `}
            >
              {result.wasRedirected && (
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">💙</span>
                  <span className="text-amber-700 font-bold text-base">ZuZu says</span>
                </div>
              )}
              <p className="text-slate-700 text-xl font-semibold leading-relaxed">
                {result.answer}
              </p>
            </div>

            {/* Ask another button */}
            <button
              onClick={handleAskAnother}
              className="
                mt-4 w-full
                bg-zuzu-teal-bg hover:bg-teal-100 active:scale-95
                text-zuzu-teal-dark font-extrabold text-lg
                px-6 py-4 rounded-3xl
                border-2 border-zuzu-teal-light
                transition-all duration-150
                focus:outline-none focus:ring-4 focus:ring-teal-200
              "
              aria-label="Ask another question"
            >
              Ask another question 🔄
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
