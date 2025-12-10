import React, { useState, useEffect } from 'react';
import { ExamType, Subject, Difficulty, TestConfig, Question } from '../types';
import { SYLLABUS, SUBJECTS_BY_EXAM } from '../constants';
import Layout from '../components/Layout';
import { generateQuestions } from '../services/geminiService';

interface ConfigProps {
  examType: ExamType;
  onBack: () => void;
  onStart: (config: TestConfig, questions: Question[]) => void;
}

const Config: React.FC<ConfigProps> = ({ examType, onBack, onStart }) => {
  const [subject, setSubject] = useState<Subject | ''>('');
  const [classLevel, setClassLevel] = useState<'11' | '12' | ''>('');
  const [chapter, setChapter] = useState<string>('');
  const [topic, setTopic] = useState<string>('');
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [count, setCount] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableSubjects = SUBJECTS_BY_EXAM[examType];
  
  const getChapters = () => {
    if (!subject || !classLevel) return [];
    const subData = SYLLABUS[subject];
    if (!subData) return [];
    return Object.keys(classLevel === '11' ? subData.class11 : subData.class12);
  };

  const getTopics = () => {
    if (!subject || !classLevel || !chapter) return [];
    const subData = SYLLABUS[subject];
    if (!subData) return [];
    const chapters = classLevel === '11' ? subData.class11 : subData.class12;
    return chapters[chapter] || [];
  };

  // Reset dependent fields when parent fields change
  useEffect(() => {
    setTopic(''); 
  }, [chapter, subject, classLevel]);

  const handleStart = async () => {
    if (!subject || !classLevel || !chapter) return;
    setLoading(true);
    setError(null);

    const config: TestConfig = {
      examType,
      subject,
      classLevel,
      chapter,
      topic,
      difficulty,
      questionCount: count
    };

    try {
      const questions = await generateQuestions(config);
      onStart(config, questions);
    } catch (err: any) {
        let msg = "Failed to generate questions. Please check your connection.";
        if (err.message && err.message.includes("API Key")) {
            msg = "Missing API Key. Please configure the environment.";
        }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title={`${examType} Configuration`} headerAction={
      <button onClick={onBack} className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">
        Cancel
      </button>
    }>
      <div className="glass-panel rounded-2xl p-6 md:p-8 max-w-2xl mx-auto mt-4">
        <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
          <span className="w-1 h-6 bg-primary rounded-full"></span>
          Setup Your Test
        </h2>
        
        <div className="space-y-8">
          
          {/* Section: Subject */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Subject</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {availableSubjects.map((s) => (
                <button
                  key={s}
                  onClick={() => { setSubject(s); setClassLevel(''); setChapter(''); setTopic(''); }}
                  className={`py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 border ${
                    subject === s 
                      ? 'bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(34,211,238,0.1)]' 
                      : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:border-zinc-600'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Section: Class */}
          {subject && (
            <div className="animate-slide-up">
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Class Level</label>
              <div className="flex gap-4">
                {['11', '12'].map((c) => (
                  <button
                    key={c}
                    onClick={() => { setClassLevel(c as '11' | '12'); setChapter(''); setTopic(''); }}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
                      classLevel === c
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:bg-zinc-800'
                    }`}
                  >
                    Class {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Section: Details */}
          {classLevel && (
            <div className="space-y-6 animate-slide-up">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Chapter</label>
                <div className="relative">
                  <select 
                    value={chapter}
                    onChange={(e) => { setChapter(e.target.value); }}
                    className="w-full appearance-none bg-zinc-900 border border-zinc-700 text-white rounded-xl p-4 pr-10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                  >
                    <option value="">Select a Chapter</option>
                    {getChapters().map(ch => <option key={ch} value={ch}>{ch}</option>)}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              {chapter && (
                <div>
                   <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Topic</label>
                   <div className="relative">
                    <select 
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full appearance-none bg-zinc-900 border border-zinc-700 text-white rounded-xl p-4 pr-10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                    >
                      <option value="">Entire Chapter (All Topics)</option>
                      {getTopics().map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-500">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
              )}
              
              {chapter && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Difficulty</label>
                    <div className="relative">
                        <select 
                        value={difficulty} 
                        onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                        className="w-full appearance-none bg-zinc-900 border border-zinc-700 text-white rounded-xl p-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
                        >
                        {Object.values(Difficulty).map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-500">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Question Count</label>
                    <div className="relative">
                        <select 
                        value={count} 
                        onChange={(e) => setCount(Number(e.target.value))}
                        className="w-full appearance-none bg-zinc-900 border border-zinc-700 text-white rounded-xl p-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
                        >
                        {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n} Questions</option>)}
                        </select>
                         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-500">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm flex items-center gap-3">
               <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {error}
            </div>
          )}

          <button
            disabled={!chapter || loading}
            onClick={handleStart}
            className={`w-full py-4 mt-6 rounded-xl font-bold text-base tracking-wide transition-all duration-300 transform active:scale-[0.99]
              ${!chapter || loading 
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700' 
                : 'bg-primary text-black hover:bg-primary-hover shadow-lg shadow-primary/25'
              }
            `}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Test...
              </span>
            ) : "Generate & Start Test"}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Config;