import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const isLegalPage = location.pathname === '/privacy';

  // Dynamic Theme Classes
  const getThemeWrapperClass = () => {
    switch (theme) {
      case 'dark': return 'bg-slate-950 text-slate-100';
      case 'liquid': return 'bg-slate-950 text-white'; // Darker base for liquid to make blobs pop and text readable
      default: return 'bg-slate-50 text-slate-800';
    }
  };

  const getBlobColors = () => {
    switch (theme) {
      case 'dark': return {
        a: 'bg-indigo-900', b: 'bg-purple-900', c: 'bg-blue-900'
      };
      case 'liquid': return {
        a: 'bg-cyan-600', b: 'bg-fuchsia-600', c: 'bg-violet-600' // Richer colors for liquid mode
      };
      default: return {
        a: 'bg-purple-300', b: 'bg-yellow-300', c: 'bg-pink-300'
      };
    }
  };

  const blobColors = getBlobColors();

  return (
    <div className={`min-h-screen relative overflow-x-hidden transition-colors duration-500 ${getThemeWrapperClass()}`}>
      {/* Background Blobs - Now with distinct motion paths */}
      <div className={`blob-bg fixed inset-0 z-0 ${theme === 'liquid' ? 'opacity-80' : 'opacity-40'}`}>
        <div className={`blob blob-motion-1 ${blobColors.a} w-[500px] h-[500px] rounded-full top-[-100px] -left-20 mix-blend-screen filter blur-[100px]`}></div>
        <div className={`blob blob-motion-2 ${blobColors.b} w-[400px] h-[400px] rounded-full top-20 -right-20 mix-blend-screen filter blur-[100px]`}></div>
        <div className={`blob blob-motion-3 ${blobColors.c} w-[450px] h-[450px] rounded-full -bottom-32 left-1/3 mix-blend-screen filter blur-[100px]`}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
        <Link to="/" className="group flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-tr from-violet-500 to-fuchsia-500 rounded-xl shadow-lg shadow-violet-500/30 flex items-center justify-center transform transition-transform group-hover:rotate-12 group-hover:scale-110 active:scale-90 duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-600 tracking-tight">
            StreamSafe
          </span>
        </Link>
        
        <div className="flex items-center gap-4">
           {/* Theme Toggle */}
           <div className={`flex items-center p-1 rounded-full border shadow-sm ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-black/30 backdrop-blur-md border-white/10'}`}>
              <button 
                onClick={() => setTheme('light')} 
                className={`p-2 rounded-full transition-all active:scale-90 ${theme === 'light' ? 'bg-orange-100 text-orange-500 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                title="Light Mode"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </button>
              <button 
                onClick={() => setTheme('dark')} 
                className={`p-2 rounded-full transition-all active:scale-90 ${theme === 'dark' ? 'bg-indigo-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                title="Dark Mode"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </button>
              <button 
                onClick={() => setTheme('liquid')} 
                className={`p-2 rounded-full transition-all active:scale-90 ${theme === 'liquid' ? 'bg-cyan-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                title="Liquid Glass Mode"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </button>
           </div>

           {!isLegalPage && (
             <Link to="/privacy" className={`text-sm font-semibold transition-colors hover:scale-105 ${theme === 'light' ? 'text-slate-500 hover:text-violet-600' : 'text-slate-300 hover:text-white'}`}>
               Legal
             </Link>
           )}
        </div>
      </nav>

      <main className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-20">
        {children}
      </main>

      <footer className={`relative z-10 text-center py-8 text-sm ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>
        <p>© {new Date().getFullYear()} StreamSafe. Powered by Google Gemini AI.</p>
        <div className="mt-2 space-x-4">
           <Link to="/privacy" className="hover:text-violet-500 transition-colors">Privacy Policy</Link>
           <Link to="/privacy" className="hover:text-violet-500 transition-colors">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
};

export default Layout;