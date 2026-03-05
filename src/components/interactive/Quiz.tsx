'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserChrome } from './BrowserChrome';

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface QuizProps {
  id: string;
  title?: string;
  questions: QuizQuestion[];
}

export function Quiz({ id, title = 'Knowledge Check', questions }: QuizProps) {
  const storageKey = `goal-quiz-${id}`;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed)) {
          setScore(parsed);
          setCompleted(true);
        }
      }
    } catch {
      // ignore
    }
  }, [storageKey]);

  function handleSelect(index: number) {
    if (answered) return;
    setSelectedAnswer(index);
  }

  function handleSubmit() {
    if (selectedAnswer === null || answered) return;
    setAnswered(true);
    if (selectedAnswer === questions[currentQuestion].correctIndex) {
      setScore((s) => s + 1);
    }
  }

  function handleNext() {
    const nextQ = currentQuestion + 1;
    if (nextQ >= questions.length) {
      setCompleted(true);
      try {
        localStorage.setItem(storageKey, String(score));
      } catch {
        // ignore
      }
    } else {
      setCurrentQuestion(nextQ);
      setSelectedAnswer(null);
      setAnswered(false);
    }
  }

  function handleRetake() {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setScore(0);
    setCompleted(false);
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
  }

  const q = questions[currentQuestion];

  return (
    <div className="my-6">
      <BrowserChrome
        title={title}
        trailing={
          !completed ? (
            <span className="text-[10px] text-white/30">
              {currentQuestion + 1}/{questions.length}
            </span>
          ) : undefined
        }
      >
      <div className="p-5 sm:p-6">
        <AnimatePresence mode="wait">
          {completed ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="text-center"
            >
              <div className="mb-4 text-4xl font-bold text-white">
                {score}/{questions.length}
              </div>
              <p className="mb-2 text-sm text-white/70">
                {score === questions.length
                  ? 'Perfect score! You\'ve mastered this material.'
                  : score >= questions.length * 0.75
                    ? 'Great job! You have a solid understanding.'
                    : score >= questions.length * 0.5
                      ? 'Good effort! Review the sections you missed.'
                      : 'Consider reviewing the guide and trying again.'}
              </p>
              <button
                type="button"
                onClick={handleRetake}
                className="mt-4 min-h-[44px] rounded-lg bg-white/10 px-6 py-3 text-sm font-medium text-white/90 transition-colors hover:bg-white/20"
              >
                Retake Quiz
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <p className="mb-5 text-sm font-semibold leading-relaxed text-white/90">
                {q.question}
              </p>

              <div role="radiogroup" aria-label={q.question} className="space-y-2">
                {q.options.map((option, i) => {
                  const isCorrect = i === q.correctIndex;
                  const isSelected = i === selectedAnswer;

                  let optionStyle = 'border-white/10 bg-white/5 hover:bg-white/10';
                  if (answered) {
                    if (isCorrect) {
                      optionStyle = 'border-green-500/50 bg-green-500/15';
                    } else if (isSelected && !isCorrect) {
                      optionStyle = 'border-red-500/50 bg-red-500/15';
                    } else {
                      optionStyle = 'border-white/5 bg-white/[0.02] opacity-50';
                    }
                  } else if (isSelected) {
                    optionStyle = 'border-blue-500/50 bg-blue-500/15';
                  }

                  return (
                    <label
                      key={i}
                      className={`flex min-h-[44px] cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm transition-colors ${optionStyle} ${answered ? 'cursor-default' : ''}`}
                    >
                      <input
                        type="radio"
                        name={`quiz-${id}-q${currentQuestion}`}
                        checked={isSelected}
                        onChange={() => handleSelect(i)}
                        disabled={answered}
                        className="sr-only"
                      />
                      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${
                        isSelected
                          ? answered
                            ? isCorrect
                              ? 'border-green-400 bg-green-500/30 text-green-300'
                              : 'border-red-400 bg-red-500/30 text-red-300'
                            : 'border-blue-400 bg-blue-500/30 text-blue-300'
                          : 'border-white/20 text-white/40'
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="text-white/80">{option}</span>
                      {answered && isCorrect && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="ml-auto shrink-0">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                      {answered && isSelected && !isCorrect && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="ml-auto shrink-0">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      )}
                    </label>
                  );
                })}
              </div>

              {/* Explanation */}
              <AnimatePresence>
                {answered && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                    aria-live="polite"
                  >
                    <p className="mt-4 rounded-lg bg-white/5 px-4 py-3 text-xs leading-relaxed text-white/60">
                      {q.explanation}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions */}
              <div className="mt-5 flex justify-end gap-3">
                {!answered ? (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={selectedAnswer === null}
                    className="min-h-[44px] rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Check Answer
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="min-h-[44px] rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
                  >
                    {currentQuestion === questions.length - 1 ? 'See Results' : 'Next Question'}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </BrowserChrome>
    </div>
  );
}
