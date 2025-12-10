import React from 'react';

interface AdSpaceProps {
  location: 'top' | 'inline' | 'bottom';
  className?: string;
}

const AdSpace: React.FC<AdSpaceProps> = ({ location, className = '' }) => {
  return (
    <div 
      className={`w-full border border-dashed border-zinc-800 bg-zinc-900/30 rounded-xl flex flex-col items-center justify-center text-zinc-600 text-xs uppercase tracking-widest p-4 my-6 ${className}`}
      style={{ minHeight: location === 'top' ? '100px' : '160px' }}
    >
      <span className="mb-2 opacity-50">Advertisement Space ({location})</span>
      <div id="ad-space" className="w-full h-full bg-zinc-800/20 rounded-lg flex items-center justify-center text-zinc-700 font-medium">
        Google AdSense Container
      </div>
    </div>
  );
};

export default AdSpace;