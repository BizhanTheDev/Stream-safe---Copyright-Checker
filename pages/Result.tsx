import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSongById, voteForSong } from '../services/storageService';
import { SongEntry } from '../types';
import StatusBadge from '../components/StatusBadge';
import { useTheme } from '../contexts/ThemeContext';

const Result: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { theme } = useTheme();
  const [song, setSong] = useState<SongEntry | undefined>(undefined);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    if (id) {
      const found = getSongById(id);
      setSong(found);
    }
  }, [id]);

  const handleVote = (type: 'up' | 'down') => {
    if (song && !hasVoted) {
      const updated = voteForSong(song.id, type);
      if (updated) {
        setSong(updated);
        setHasVoted(true);
      }
    }
  };

  if (!song) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold text-slate-400 mb-4">Song not found</h2>
        <Link to="/" className="text-violet-600 font-bold hover:underline">Go Back Home</Link>
      </div>
    );
  }

  // Theme Helpers
  const getMainCardStyles = () => {
    switch (theme) {
      case 'dark': return 'bg-slate-800 border-slate-700 text-white shadow-slate-900/50';
      case 'liquid': return 'bg-black/40 backdrop-blur-2xl border-white/10 text-white shadow-black/20'; // Darker for readability
      default: return 'bg-white/80 backdrop-blur-xl border-white text-slate-900 shadow-slate-200/50';
    }
  };

  const getSubCardStyles = () => {
    switch (theme) {
      case 'dark': return 'bg-slate-900 border-slate-700 text-slate-300';
      case 'liquid': return 'bg-black/30 border-white/10 text-slate-200';
      default: return 'bg-slate-50 border-slate-100 text-slate-700';
    }
  };
  
  const getConfidenceColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="animate-fade-in-up">
      <Link to="/" className={`inline-flex items-center font-bold hover:text-violet-600 transition-colors mb-8 group ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Search
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Info Card */}
        <div className="lg:col-span-2 space-y-8">
          <div className={`rounded-[2.5rem] p-8 md:p-10 shadow-2xl border ${getMainCardStyles()}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-2">{song.title}</h1>
                <p className={`text-xl font-semibold ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>{song.artist}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <StatusBadge status={song.status} large />
                <span className={`text-sm font-bold ${getConfidenceColor(song.confidence)}`}>
                   {song.confidence}% Confidence
                </span>
              </div>
            </div>

            <div className={`rounded-3xl p-6 mb-8 border ${getSubCardStyles()}`}>
               <h3 className="text-sm font-bold uppercase tracking-wider mb-3 opacity-60">AI Analysis Summary</h3>
               <p className="text-lg leading-relaxed font-medium">
                 {song.details}
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`rounded-3xl p-6 border ${theme === 'light' ? 'bg-red-50 border-red-100' : 'bg-red-900/20 border-red-900/30'}`}>
                 <div className="flex items-center gap-3 mb-2">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === 'light' ? 'bg-red-100 text-red-600' : 'bg-red-800 text-red-200'}`}>
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                       <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                     </svg>
                   </div>
                   <h4 className={`font-bold ${theme === 'light' ? 'text-red-900' : 'text-red-200'}`}>YouTube Status</h4>
                 </div>
                 <p className={`font-medium ml-11 ${theme === 'light' ? 'text-red-800' : 'text-red-100'}`}>{song.platforms.youtube}</p>
              </div>

              <div className={`rounded-3xl p-6 border ${theme === 'light' ? 'bg-purple-50 border-purple-100' : 'bg-purple-900/20 border-purple-900/30'}`}>
                 <div className="flex items-center gap-3 mb-2">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === 'light' ? 'bg-purple-100 text-purple-600' : 'bg-purple-800 text-purple-200'}`}>
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                       <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                     </svg>
                   </div>
                   <h4 className={`font-bold ${theme === 'light' ? 'text-purple-900' : 'text-purple-200'}`}>Twitch Status</h4>
                 </div>
                 <p className={`font-medium ml-11 ${theme === 'light' ? 'text-purple-800' : 'text-purple-100'}`}>{song.platforms.twitch}</p>
              </div>
            </div>
            
            {song.sources && song.sources.length > 0 && (
                <div className={`mt-8 pt-6 border-t ${theme === 'light' ? 'border-slate-100' : 'border-white/10'}`}>
                   <h4 className="text-xs font-bold opacity-50 uppercase tracking-wider mb-3">Information Sources</h4>
                   <ul className="space-y-2">
                      {song.sources.map((source, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 flex-shrink-0 ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`} viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                          </svg>
                          <a 
                            href={source.uri} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="font-semibold text-violet-400 hover:text-violet-300 hover:underline transition-colors"
                          >
                            {source.title}
                          </a>
                        </li>
                      ))}
                   </ul>
                </div>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          
          {/* Voting Card */}
          <div className={`rounded-3xl p-6 shadow-xl border ${getMainCardStyles()}`}>
            <h3 className="text-lg font-bold mb-4">Was this accurate?</h3>
            <p className="text-sm opacity-60 mb-6">Help the community by voting.</p>
            
            <div className="flex gap-4">
              <button 
                onClick={() => handleVote('up')}
                disabled={hasVoted}
                className={`flex-1 py-3 rounded-2xl font-bold flex flex-col items-center justify-center transition-all duration-200 ${hasVoted ? 'opacity-50 cursor-default' : 'hover:scale-105 active:scale-95'} ${theme === 'light' ? 'bg-green-50 text-green-600 hover:bg-green-100 border-green-200' : 'bg-green-900/30 text-green-300 border-green-800'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" viewBox="0 0 20 20" fill="currentColor">
                   <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                <span>Yes ({song.votes.up})</span>
              </button>

              <button 
                onClick={() => handleVote('down')}
                disabled={hasVoted}
                className={`flex-1 py-3 rounded-2xl font-bold flex flex-col items-center justify-center transition-all duration-200 ${hasVoted ? 'opacity-50 cursor-default' : 'hover:scale-105 active:scale-95'} ${theme === 'light' ? 'bg-red-50 text-red-600 hover:bg-red-100 border-red-200' : 'bg-red-900/30 text-red-300 border-red-800'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" viewBox="0 0 20 20" fill="currentColor">
                   <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 6H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 16H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                </svg>
                <span>No ({song.votes.down})</span>
              </button>
            </div>
          </div>

          {/* Alternatives */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg shadow-indigo-500/20">
             <h3 className="text-lg font-bold mb-4">Suggested Services</h3>
             <ul className="space-y-3">
               {song.alternatives.length > 0 ? song.alternatives.map((alt, index) => (
                 <li key={index} className="flex items-center gap-2 bg-white/20 rounded-xl px-4 py-3 font-semibold backdrop-blur-sm">
                   <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                   {alt}
                 </li>
               )) : (
                 <li className="text-white/80 italic">No specific alternatives found. Try searching for "NCS" or "StreamBeats".</li>
               )}
             </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Result;