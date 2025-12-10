import React, { useState } from 'react';
import { Question, TestConfig } from '../types';
import Layout from '../components/Layout';
import AdSpace from '../components/AdSpace';

interface ResultsProps {
  questions: Question[];
  userAnswers: Record<number, number>;
  config: TestConfig;
  onRetake: () => void;
  onNewTest: () => void;
  onBackToHome: () => void;
}

const Results: React.FC<ResultsProps> = ({ questions, userAnswers, config, onRetake, onNewTest, onBackToHome }) => {
  const [showExplanation, setShowExplanation] = useState<number | null>(null);

  const total = questions.length;
  const attempted = Object.keys(userAnswers).length;
  let correct = 0;
  questions.forEach((q, idx) => {
    if (userAnswers[idx] === q.correctAnswerIndex) correct++;
  });
  const wrong = attempted - correct;
  const percentage = Math.round((correct / total) * 100);

  // Determine Grade
  let grade = 'Needs Improvement';
  let gradeColor = 'text-red-400';
  if (percentage >= 90) { grade = 'Excellent'; gradeColor = 'text-primary'; }
  else if (percentage >= 75) { grade = 'Very Good'; gradeColor = 'text-green-400'; }
  else if (percentage >= 50) { grade = 'Average'; gradeColor = 'text-yellow-400'; }

  return (
    <Layout 
      title="Performance Analysis"
      headerAction={
        <button 
          onClick={onBackToHome}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium transition-colors border border-zinc-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          Home
        </button>
      }
    >
      
      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Main Score Card */}
        <div className="col-span-1 md:col-span-2 glass-panel p-6 rounded-2xl flex flex-col justify-center items-center relative overflow-hidden">
           <div className="absolute top-0 right-0 p-24 bg-primary/5 blur-3xl rounded-full -mr-12 -mt-12"></div>
           <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Overall Score</span>
           <div className="flex items-baseline gap-1">
             <span className={`text-5xl md:text-6xl font-bold tracking-tighter ${gradeColor}`}>{percentage}%</span>
           </div>
           <span className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-800 border border-zinc-700 ${gradeColor}`}>
             {grade}
           </span>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center items-center">
          <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Correct</span>
          <span className="text-4xl font-bold text-green-400">{correct}</span>
          <span className="text-zinc-600 text-sm mt-1">Questions</span>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center items-center">
          <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Wrong / Skipped</span>
          <span className="text-4xl font-bold text-red-400">{total - correct}</span>
          <span className="text-zinc-600 text-sm mt-1">Questions</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10 justify-center">
        <button onClick={onRetake} className="px-8 py-3 rounded-xl border border-zinc-700 text-zinc-300 font-medium hover:bg-zinc-800 hover:text-white transition-colors">
          Retake This Test
        </button>
        <button onClick={onNewTest} className="px-8 py-3 rounded-xl bg-primary text-black font-bold hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all">
          Start New Practice
        </button>
      </div>

      {/* Answer Key */}
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
            <h3 className="text-xl font-bold text-white">Answer Key Analysis</h3>
            <div className="h-px bg-zinc-800 flex-1"></div>
        </div>
        
        {questions.map((q, index) => {
          const userAnswer = userAnswers[index];
          const isCorrect = userAnswer === q.correctAnswerIndex;
          const isSkipped = userAnswer === undefined;
          
          let borderColor = "border-zinc-800";
          if (isCorrect) borderColor = "border-green-500/30";
          else if (!isSkipped) borderColor = "border-red-500/30";

          return (
            <div key={q.id} className={`glass-panel p-6 rounded-2xl border ${borderColor} transition-all`}>
              <div className="flex items-start gap-4">
                <span className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold mt-1
                  ${isCorrect ? 'bg-green-500/10 text-green-500' : isSkipped ? 'bg-zinc-800 text-zinc-500' : 'bg-red-500/10 text-red-500'}
                `}>
                  {index + 1}
                </span>
                <div className="flex-1">
                  <p className="text-white text-base md:text-lg mb-4 leading-relaxed">{q.text}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {q.options.map((opt, optIdx) => {
                      const isOptCorrect = optIdx === q.correctAnswerIndex;
                      const isOptSelected = optIdx === userAnswer;
                      
                      let styleClass = "bg-zinc-800/50 border-zinc-700/50 text-zinc-400";
                      
                      if (isOptCorrect) {
                        styleClass = "bg-green-500/10 border-green-500/50 text-green-400";
                      } else if (isOptSelected && !isCorrect) {
                        styleClass = "bg-red-500/10 border-red-500/50 text-red-400";
                      }

                      return (
                        <div key={optIdx} className={`p-3 rounded-lg border text-sm flex items-center justify-between ${styleClass}`}>
                          <span><span className="opacity-50 mr-2">{String.fromCharCode(65 + optIdx)}.</span> {opt}</span>
                          {isOptCorrect && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                          {isOptSelected && !isOptCorrect && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4">
                     <button 
                        onClick={() => setShowExplanation(showExplanation === index ? null : index)}
                        className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-1 focus:outline-none"
                    >
                        {showExplanation === index ? "Hide Explanation" : "View Explanation"}
                        <svg className={`w-3 h-3 transform transition-transform ${showExplanation === index ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    
                    {showExplanation === index && (
                        <div className="mt-3 p-4 bg-zinc-800/50 rounded-lg text-zinc-300 text-sm border border-zinc-700 animate-fade-in leading-relaxed">
                        <span className="font-bold text-white block mb-1">Reasoning:</span>
                        {q.explanation}
                        </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AdSpace location="bottom" className="mt-12 opacity-60 hover:opacity-100 transition-opacity" />
    </Layout>
  );
};

export default Results;