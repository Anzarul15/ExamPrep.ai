import React from 'react';
import { ExamType } from '../types';
import Layout from '../components/Layout';

interface HomeProps {
  onSelectExam: (exam: ExamType) => void;
}

const Home: React.FC<HomeProps> = ({ onSelectExam }) => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center gap-12 mt-4 md:mt-12">
        
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase border border-primary/20">
            AI-Powered Preparation
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
            Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Exams</span>
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed">
            Professional test practice for NEET and JEE aspirants. 
            Select your path to generate intelligent, syllabus-aligned questions instantly.
          </p>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          
          {/* NEET Card */}
          <button
            onClick={() => onSelectExam(ExamType.NEET)}
            className="group relative flex flex-col items-start p-8 rounded-2xl glass-panel hover:bg-zinc-800/80 hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1 text-left overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity group-hover:bg-primary/10"></div>
            
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center mb-6 shadow-lg shadow-teal-500/20 z-10">
               <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2 z-10">NEET Practice</h2>
            <p className="text-zinc-400 text-sm mb-6 z-10">
              Biology, Physics, Chemistry. Comprehensive coverage of Class 11 & 12 NCERT syllabus.
            </p>
            
            <div className="mt-auto flex items-center text-primary text-sm font-semibold z-10 group-hover:translate-x-1 transition-transform">
              Start Exam <span className="ml-2">&rarr;</span>
            </div>
          </button>

          {/* JEE Card */}
          <button
            onClick={() => onSelectExam(ExamType.JEE)}
            className="group relative flex flex-col items-start p-8 rounded-2xl glass-panel hover:bg-zinc-800/80 hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-1 text-left overflow-hidden"
          >
             <div className="absolute top-0 right-0 p-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity group-hover:bg-blue-500/10"></div>

            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20 z-10">
               <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2 z-10">JEE Practice</h2>
            <p className="text-zinc-400 text-sm mb-6 z-10">
              Mathematics, Physics, Chemistry. Advanced problem solving for Mains & Advanced.
            </p>
            
            <div className="mt-auto flex items-center text-blue-400 text-sm font-semibold z-10 group-hover:translate-x-1 transition-transform">
              Start Exam <span className="ml-2">&rarr;</span>
            </div>
          </button>

        </div>
      </div>
    </Layout>
  );
};

export default Home;