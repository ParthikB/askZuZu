'use client';

import { useState, useRef, useEffect } from 'react';
import ZuZu, { ZuZuExpression } from './ZuZu';
import { pickMysteryQuestion } from '@/lib/mystery-questions';
import AnnotatedAnswer from './AnnotatedAnswer';

interface AskScreenProps {
  age: number;
  sessionToken: string;
  onReset: () => void;
}

type ScreenState = 'idle' | 'loading' | 'answered' | 'error';
type FeedbackState = 'none' | 'selecting-down' | 'submitted';

interface AnswerResult {
  answer: string;
  wasRedirected: boolean;
  logId: number | null;
}

const DOWN_TAGS = [
  'Response was boring',
  'Response was too complex',
  'Response was incorrect',
];

export default function AskScreen({ age, sessionToken, onReset }: AskScreenProps) {
  const [question, setQuestion]           = useState('');
  const [screenState, setScreenState]     = useState<ScreenState>('idle');
  const [result, setResult]               = useState<AnswerResult | null>(null);
  const [answerDisplayedAt, setAnswerDisplayedAt] = useState<number | null>(null);
  const [feedbackState, setFeedbackState] = useState<FeedbackState>('none');
  const [selectedTags, setSelectedTags]   = useState<Set<string>>(new Set());
  const answerRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    if (screenState === 'answered' || screenState === 'error') {
      setTimeout(() => answerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
    }
  }, [screenState]);

  // Reset feedback state whenever a new answer arrives
  useEffect(() => {
    if (screenState === 'answered') {
      setFeedbackState('none');
      setSelectedTags(new Set());
    }
  }, [screenState]);

  const zuZuExpression = (): ZuZuExpression => {
    if (screenState === 'loading') return 'thinking';
    if (screenState === 'answered' && result?.wasRedirected) return 'gentle';
    if (screenState === 'answered') return 'happy';
    return 'idle';
  };

  function handleMystery() {
    if (screenState === 'loading') return;
    const q = pickMysteryQuestion(age);
    setQuestion(q);
    handleAsk(q);
  }

  async function handleAsk(questionOverride?: string) {
    const trimmed = (questionOverride ?? question).trim();
    if (!trimmed || screenState === 'loading') return;
    setScreenState('loading');
    setResult(null);
    setAnswerDisplayedAt(null);
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: trimmed, age, sessionToken }),
      });
      const data: AnswerResult = await res.json();
      setResult(data);
      setAnswerDisplayedAt(Date.now());
      setScreenState('answered');
    } catch {
      setResult({ answer: "ZuZu is taking a little nap right now — try again in a moment! 💤", wasRedirected: false, logId: null });
      setScreenState('error');
    }
  }

  function submitFeedback(rating: 'up' | 'down', tags: string[]) {
    if (!result?.logId) return;
    fetch('/api/log/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logId: result.logId, rating, tags }),
    }).catch(() => {});
  }

  function handleThumbsUp() {
    submitFeedback('up', []);
    setFeedbackState('submitted');
  }

  function handleThumbsDown() {
    setFeedbackState('selecting-down');
  }

  function toggleTag(tag: string) {
    setSelectedTags(prev => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });
  }

  function handleDone() {
    submitFeedback('down', Array.from(selectedTags));
    setFeedbackState('submitted');
  }

  function handleAskAnother() {
    if (result?.logId && answerDisplayedAt) {
      const timeSpentSeconds = Math.round((Date.now() - answerDisplayedAt) / 1000);
      fetch('/api/log/time', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logId: result.logId, timeSpentSeconds }),
      }).catch(() => {});
    }
    setQuestion('');
    setResult(null);
    setAnswerDisplayedAt(null);
    setFeedbackState('none');
    setSelectedTags(new Set());
    setScreenState('idle');
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleAsk();
  }

  return (
    <div className="min-h-screen bg-zuzu-bg flex flex-col items-center px-4 py-8 gap-6">

      <div className="w-full max-w-xl flex items-center justify-between">
        <button
          onClick={onReset}
          className="text-zuzu-teal font-bold text-lg px-4 py-2 rounded-2xl hover:bg-zuzu-teal-bg transition-colors focus:outline-none focus:ring-4 focus:ring-teal-200"
        >
          ← Back
        </button>
        <span className="text-slate-500 font-semibold text-base">Age {age}</span>
      </div>

      <div className="transition-all duration-500" aria-live="polite">
        <ZuZu expression={zuZuExpression()} size="small" />
      </div>

      <div className="w-full max-w-xl flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <div className="flex gap-2 items-stretch">
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
                flex-1 text-xl font-semibold bg-white border-3 border-zuzu-teal-bg
                rounded-3xl px-6 py-5 placeholder:text-slate-300 text-slate-700
                focus:outline-none focus:ring-4 focus:ring-teal-200 focus:border-zuzu-teal
                disabled:opacity-60 disabled:cursor-not-allowed shadow-sm transition-all duration-150
              "
            />
            <button
              onClick={handleMystery}
              disabled={screenState === 'loading'}
              title="Mystery question"
              aria-label="Pick a random mystery question"
              className="
                w-16 shrink-0 rounded-3xl border-3 border-zuzu-teal-bg bg-white
                text-3xl flex items-center justify-center shadow-sm
                hover:bg-zuzu-teal-bg active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-150
                focus:outline-none focus:ring-4 focus:ring-teal-200
              "
            >
              🎲
            </button>
          </div>
          <button
            onClick={() => handleAsk()}
            disabled={!question.trim() || screenState === 'loading'}
            className={`
              w-full font-extrabold text-2xl px-8 py-5 rounded-3xl shadow-lg
              transition-all duration-150 focus:outline-none focus:ring-4 focus:ring-teal-300
              ${screenState === 'loading'
                ? 'bg-slate-300 text-slate-400 cursor-not-allowed'
                : !question.trim()
                  ? 'bg-zuzu-teal opacity-50 text-white cursor-not-allowed'
                  : 'bg-zuzu-teal hover:bg-zuzu-teal-dark active:scale-95 text-white shadow-teal-200 animate-gentle-bounce'
              }
            `}
          >
            {screenState === 'loading' ? '🤔  Thinking…' : 'Ask ZuZu! ✨'}
          </button>
        </div>

        {(screenState === 'answered' || screenState === 'error') && result && (
          <div ref={answerRef} className="animate-fade-in flex flex-col gap-3">

            {/* Answer card */}
            <div className={`
              rounded-3xl p-6 shadow-md
              ${result.wasRedirected ? 'bg-amber-50 border-2 border-amber-200' : 'bg-white border-2 border-zuzu-teal-bg'}
            `}>
              {result.wasRedirected && (
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">💙</span>
                  <span className="text-amber-700 font-bold text-base">ZuZu says</span>
                </div>
              )}
              <AnnotatedAnswer text={result.answer} />
            </div>

            {/* Feedback section — only shown when there's a logId to attach it to */}
            {result.logId && (
              <div className="flex flex-col gap-3">

                {feedbackState !== 'submitted' && (
                  <div className="flex gap-3">
                    <button
                      onClick={handleThumbsUp}
                      disabled={feedbackState === 'selecting-down'}
                      className="
                        flex-1 flex items-center justify-center gap-2
                        bg-white border-2 border-zuzu-teal-bg hover:border-zuzu-teal
                        hover:bg-zuzu-teal-bg active:scale-95
                        text-slate-700 font-bold text-lg
                        py-4 rounded-2xl transition-all duration-150
                        focus:outline-none focus:ring-4 focus:ring-teal-200
                        disabled:opacity-40 disabled:cursor-not-allowed
                      "
                      aria-label="Thumbs up — happy with the response"
                    >
                      <span className="text-2xl">👍</span>
                      <span>Helpful!</span>
                    </button>

                    <button
                      onClick={handleThumbsDown}
                      disabled={feedbackState === 'selecting-down'}
                      className="
                        flex-1 flex items-center justify-center gap-2
                        bg-white border-2 border-orange-100 hover:border-orange-300
                        hover:bg-orange-50 active:scale-95
                        text-slate-700 font-bold text-lg
                        py-4 rounded-2xl transition-all duration-150
                        focus:outline-none focus:ring-4 focus:ring-orange-200
                        disabled:opacity-40 disabled:cursor-not-allowed
                      "
                      aria-label="Thumbs down — not happy with the response"
                    >
                      <span className="text-2xl">👎</span>
                      <span>Not quite</span>
                    </button>
                  </div>
                )}

                {/* Thumbs-down reason picker */}
                {feedbackState === 'selecting-down' && (
                  <div className="animate-fade-in bg-orange-50 border-2 border-orange-200 rounded-3xl p-5 flex flex-col gap-4">
                    <p className="text-slate-700 font-bold text-lg text-center">
                      What wasn&apos;t great? <span className="text-slate-400 font-semibold text-base">(pick any)</span>
                    </p>
                    <div className="flex flex-col gap-2">
                      {DOWN_TAGS.map(tag => {
                        const selected = selectedTags.has(tag);
                        return (
                          <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={`
                              w-full text-left px-5 py-4 rounded-2xl font-semibold text-base
                              border-2 transition-all duration-150 active:scale-95
                              focus:outline-none focus:ring-4 focus:ring-orange-200
                              ${selected
                                ? 'bg-orange-400 border-orange-400 text-white'
                                : 'bg-white border-orange-200 text-slate-700 hover:border-orange-400 hover:bg-orange-100'
                              }
                            `}
                          >
                            {selected ? '✓ ' : ''}{tag}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={handleDone}
                      className="
                        w-full bg-orange-400 hover:bg-orange-500 active:scale-95
                        text-white font-extrabold text-lg
                        py-4 rounded-2xl transition-all duration-150
                        focus:outline-none focus:ring-4 focus:ring-orange-300
                      "
                    >
                      Done
                    </button>
                  </div>
                )}

                {/* Confirmation after feedback submitted */}
                {feedbackState === 'submitted' && (
                  <p className="animate-fade-in text-center text-slate-500 font-semibold text-base py-1">
                    Thanks for the feedback! 💙
                  </p>
                )}
              </div>
            )}

            {/* Ask another */}
            <button
              onClick={handleAskAnother}
              className="
                w-full bg-zuzu-teal-bg hover:bg-teal-100 active:scale-95
                text-zuzu-teal-dark font-extrabold text-lg
                px-6 py-4 rounded-3xl border-2 border-zuzu-teal-light
                transition-all duration-150 focus:outline-none focus:ring-4 focus:ring-teal-200
              "
            >
              Ask another question 🔄
            </button>

          </div>
        )}
      </div>
    </div>
  );
}
