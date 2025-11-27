import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const DISCLAIMER_KEY = 'streamsafe_disclaimer_accepted_session';

const DisclaimerModal: React.FC = () => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check session storage so it resets when they close the browser/tab
    const accepted = sessionStorage.getItem(DISCLAIMER_KEY);
    if (!accepted) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    sessionStorage.setItem(DISCLAIMER_KEY, 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const getModalStyles = () => {
    switch (theme) {
      case 'dark': return 'bg-slate-900 border-slate-700 text-white';
      case 'liquid': return 'bg-white/10 backdrop-blur-xl border-white/20 text-white shadow-2xl';
      default: return 'bg-white text-slate-800 border-slate-200 shadow-2xl';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className={`max-w-md w-full rounded-3xl p-8 border ${getModalStyles()} transform transition-all scale-100`}>
        <div className="flex items-center justify-center mb-6">
           <div className="w-16 h-16 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
             </svg>
           </div>
        </div>
        
        <h2 className="text-2xl font-extrabold text-center mb-4">Heads Up!</h2>
        
        <div className="prose prose-sm max-w-none mb-8 opacity-80 leading-relaxed text-center">
          <p>
            StreamSafe uses AI to analyze copyright policies, but <strong>we cannot guarantee 100% accuracy</strong>.
          </p>
          <p>
            We are not responsible for any copyright strikes, muted VODs, or banned accounts. Always verify permissions with the official rights holder or platform.
          </p>
        </div>

        <button
          onClick={handleAccept}
          className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-violet-500/25"
        >
          I Understand & Accept
        </button>
      </div>
    </div>
  );
};

export default DisclaimerModal;