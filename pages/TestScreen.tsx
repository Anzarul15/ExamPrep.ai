import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import Layout from '../components/Layout';
import AdSpace from '../components/AdSpace';

interface TestScreenProps {
  questions: Question[];
  onFinish: (answers: Record<number, number>) => void;
}

const TestScreen: React.FC<TestScreenProps> = ({ questions, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(questions.length * 72);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onFinish(answers);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [answers, onFinish, questions.length]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSelect = (optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: optionIndex }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const isLast = currentIndex === questions.length - 1;
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <Layout 
      title={`Question ${currentIndex + 1} of ${questions.length}`}
      headerAction={
        <div className={`px-4 py-2 rounded-lg font-mono text-sm font-bold border ${timeLeft < 60 ? 'bg-red-500/10 border-red-500 text-red-500 animate-pulse' : 'bg-zinc-800 border-zinc-700 text-primary'}`}>
          ⏱ {formatTime(timeLeft)}
        </div>
      }
    >
      {/* Progress Bar */}
      <div className="fixed top-[73px] left-0 w-full h-1 bg-zinc-800 z-40">
        <div 
          className="h-full bg-primary transition-all duration-300 ease-out shadow-[0_0_10px_rgba(34,211,238,0.5)]" 
          style={{ width: `${progress}%` }} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        
        {/* Main Question Area */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-panel p-6 md:p-10 rounded-2xl min-h-[400px] flex flex-col">
            <h3 className="text-xl md:text-2xl font-medium leading-relaxed text-white mb-8">
              {currentQuestion.text}
            </h3>

            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = answers[currentIndex] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    className={`w-full text-left p-5 rounded-xl border transition-all duration-200 flex items-center group relative overflow-hidden
                      ${isSelected 
                        ? 'bg-primary/10 border-primary text-white shadow-[inset_0_0_0_1px_rgba(34,211,238,0.5)]' 
                        : 'bg-zinc-800/30 border-zinc-700/50 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-600'
                      }
                    `}
                  >
                    <span className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold mr-4 transition-colors
                       ${isSelected ? 'bg-primary text-black' : 'bg-zinc-700 text-zinc-400 group-hover:bg-zinc-600'}
                    `}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="relative z-10 text-base">{option}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-auto pt-8 flex justify-between items-center">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  currentIndex === 0 
                    ? 'text-zinc-600 cursor-not-allowed' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                Previous
              </button>

              {isLast ? (
                <button
                  onClick={() => onFinish(answers)}
                  className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-xl font-bold shadow-lg shadow-red-500/20 transform hover:-translate-y-0.5 transition-all"
                >
                  Submit Test
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-8 py-3 bg-primary text-black rounded-xl font-bold hover:bg-primary-hover shadow-lg shadow-primary/20 transform hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                  Next <span className="text-lg">&rarr;</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar / Ad Area */}
        <div className="lg:col-span-4 space-y-6">
           <div className="glass-panel p-6 rounded-2xl hidden lg:block">
              <h4 className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-4">Question Navigator</h4>
              <div className="grid grid-cols-5 gap-2">
                  {questions.map((_, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-full aspect-square rounded-md text-xs font-medium transition-colors border
                            ${currentIndex === idx 
                                ? 'bg-primary text-black border-primary'
                                : answers[idx] !== undefined 
                                    ? 'bg-zinc-800 text-primary border-primary/30'
                                    : 'bg-zinc-900/50 text-zinc-500 border-zinc-800 hover:border-zinc-700'
                            }
                        `}
                      >
                          {idx + 1}
                      </button>
                  ))}
              </div>
           </div>

           <AdSpace location="inline" className="!my-0" />
        </div>

      </div>
      
       {/* Mobile Ad Space below */}
      <AdSpace location="bottom" className="lg:hidden mt-8 opacity-60" />

    </Layout>
  );
};

export default TestScreen;