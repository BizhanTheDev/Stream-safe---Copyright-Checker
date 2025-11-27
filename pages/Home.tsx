import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeSong } from '../services/geminiService';
import { findSongInDb, saveSongToDb, getRecentSongs, getUserHistorySongs } from '../services/storageService';
import SongCard from '../components/SongCard';
import DisclaimerModal from '../components/DisclaimerModal';
import { SongEntry } from '../types';
import { useTheme } from '../contexts/ThemeContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [recentSongs, setRecentSongs] = useState<SongEntry[]>([]);
  const [userHistory, setUserHistory] = useState<SongEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'recent' | 'history'>('recent');

  useEffect(() => {
    setRecentSongs(getRecentSongs());
    setUserHistory(getUserHistorySongs());
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setError(null);

    try {
      // 1. Check Local DB first (fuzzy check)
      const existing = findSongInDb(query);
      if (existing) {
        // Fake delay for effect if found locally
        await new Promise(r => setTimeout(r, 800)); 
        navigate(`/result/${existing.id}`);
        saveSongToDb(existing); 
        return;
      }

      // 2. Query API if not found
      const result = await analyzeSong(query);
      saveSongToDb(result);
      navigate(`/result/${result.id}`);

    } catch (err: any) {
      setError(err.message || 'Oops! We couldn\'t analyze that song. Try adding the artist name.');
    } finally {
      setIsSearching(false);
    }
  };

  // Theme-based Input Styles
  const getInputStyles = () => {
    switch (theme) {
      case 'dark':
        return 'bg-slate-800 text-white placeholder-slate-500 shadow-slate-900/50 border border-slate-700 focus-within:ring-2 focus-within:ring-violet-500/50';
      case 'liquid':
        // Darker backdrop for better text contrast
        return 'bg-black/50 text-white placeholder-white/50 backdrop-blur-xl shadow-black/20 border border-white/20 focus-within:bg-black/60 focus-within:border-white/40';
      default:
        return 'bg-white text-slate-700 placeholder-slate-400 shadow-xl border border-transparent focus-within:ring-2 focus-within:ring-violet-200';
    }
  };

  const displayedSongs = activeTab === 'recent' ? recentSongs : userHistory;

  return (
    <div className="flex flex-col items-center pt-10">
      
      <DisclaimerModal />

      {/* Custom Styles for Bubbly Loader and Animations */}
      <style>{`
        @keyframes float-bubble {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.1); }
        }
        @keyframes fade-in-up {
           0% { opacity: 0; transform: translateY(20px); }
           100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-down {
           0% { opacity: 0; transform: translateY(-20px); }
           100% { opacity: 1; transform: translateY(0); }
        }
        .bubble-anim {
          animation: float-bubble 3s ease-in-out infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        .animate-fade-in-down {
           animation: fade-in-down 0.6s ease-out forwards;
        }
        .delay-100 { animation-delay: 0.2s; }
        .delay-200 { animation-delay: 0.4s; }
      `}</style>

      <div className="text-center max-w-2xl mx-auto mb-12 animate-fade-in-down">
        <h1 className={`text-5xl md:text-7xl font-extrabold mb-6 tracking-tight drop-shadow-sm ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
          Is it <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">Copyright Free?</span>
        </h1>
        <p className={`text-xl leading-relaxed ${theme === 'light' ? 'text-slate-600' : 'text-slate-200 opacity-90'}`}>
          Don't get striked. Check any song instantly for YouTube and Twitch safety using the power of <strong>Gemini AI</strong>.
        </p>
      </div>

      <div className="w-full max-w-2xl mb-16 relative animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <form onSubmit={handleSearch} className="relative group z-20">
          <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-pink-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className={`relative flex items-center rounded-full p-2 transition-all duration-300 ${getInputStyles()}`}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Paste a song link or type 'Song Name - Artist'..."
              className="flex-1 bg-transparent px-6 py-4 text-lg font-medium focus:outline-none"
              disabled={isSearching}
            />
            <button
              type="submit"
              disabled={isSearching || !query}
              className={`px-8 py-4 rounded-full font-bold text-white shadow-lg transition-all duration-200 flex items-center gap-2
                ${isSearching 
                  ? 'bg-slate-500/50 cursor-not-allowed scale-95' 
                  : 'bg-gradient-to-r from-violet-600 to-pink-600 hover:scale-105 active:scale-95 hover:shadow-pink-500/25 active:shadow-inner'
                }`}
            >
              {isSearching ? (
                <>
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                  </span>
                  <span className="ml-2">Searching...</span>
                </>
              ) : (
                <>
                  <span>Search</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-200 text-red-700 rounded-2xl animate-bounce text-center shadow-lg">
            {error}
          </div>
        )}
      </div>

      {/* Content Area: Loader vs Recent Checks */}
      <div className="w-full min-h-[300px]">
        {isSearching ? (
          <div className="flex flex-col items-center justify-center py-12 animate-fade-in-up">
            {/* Bubbly Loader Animation */}
            <div className="relative w-40 h-40 mb-8">
              {/* Central blurring glowing effect */}
              <div className="absolute inset-0 bg-violet-500/30 rounded-full filter blur-2xl animate-pulse"></div>
              
              {/* Three bouncing bubbles */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-violet-400 to-fuchsia-500 rounded-full bubble-anim shadow-lg shadow-violet-500/40 border border-white/20"></div>
              <div className="absolute bottom-2 left-2 w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full bubble-anim delay-100 shadow-lg shadow-cyan-500/40 border border-white/20"></div>
              <div className="absolute bottom-2 right-2 w-14 h-14 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full bubble-anim delay-200 shadow-lg shadow-pink-500/40 border border-white/20"></div>
            </div>
            
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 animate-pulse">
              Gemini AI is analyzing...
            </h3>
            <p className={`mt-2 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
              Finding copyright policies & alternatives
            </p>
          </div>
        ) : (
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-8 px-2 border-b border-white/10 pb-4">
              <div className="flex gap-6">
                 <button 
                  onClick={() => setActiveTab('recent')}
                  className={`text-2xl font-bold transition-all hover:scale-105 active:scale-95 ${activeTab === 'recent' ? (theme === 'light' ? 'text-slate-800' : 'text-white') : (theme === 'light' ? 'text-slate-400 hover:text-slate-600' : 'text-slate-500 hover:text-slate-300')}`}
                 >
                   Global Recents
                 </button>
                 <button 
                  onClick={() => setActiveTab('history')}
                  className={`text-2xl font-bold transition-all hover:scale-105 active:scale-95 ${activeTab === 'history' ? (theme === 'light' ? 'text-slate-800' : 'text-white') : (theme === 'light' ? 'text-slate-400 hover:text-slate-600' : 'text-slate-500 hover:text-slate-300')}`}
                 >
                   My History
                 </button>
              </div>
              <span className={`text-sm font-semibold hidden md:block ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>
                {activeTab === 'recent' ? 'Latest community searches' : 'Your personal lookups'}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedSongs.map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
              
              {displayedSongs.length === 0 && (
                <div className={`col-span-3 text-center py-12 ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>
                   <p className="text-lg">No songs found here yet. Be the first to search!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;