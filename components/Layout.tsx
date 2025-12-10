import React from 'react';
import AdSpace from './AdSpace';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  headerAction?: React.ReactNode;
  showAd?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, title, headerAction, showAd = true }) => {
  return (
    <div className="min-h-screen flex flex-col text-white font-sans">
      
      {/* Sticky Glass Header */}
      {title && (
        <header className="glass-header sticky top-0 z-50 w-full py-4 px-6 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
             {/* Logo Placeholder or Simple Title */}
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
               <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h1 className="text-lg font-semibold text-white tracking-tight">
              {title}
            </h1>
          </div>
          {headerAction && (
            <div>
              {headerAction}
            </div>
          )}
        </header>
      )}

      {showAd && <AdSpace location="top" className="max-w-5xl mx-auto mt-6 px-4" />}
      
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-12 animate-slide-up">
        {children}
      </main>

      <footer className="py-8 text-center text-zinc-600 text-sm">
        <p>&copy; {new Date().getFullYear()} ExamPrep AI. Designed for Excellence.</p>
      </footer>
    </div>
  );
};

export default Layout;