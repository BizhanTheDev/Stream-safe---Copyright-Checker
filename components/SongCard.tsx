import React from 'react';
import { Link } from 'react-router-dom';
import { SongEntry } from '../types';
import StatusBadge from './StatusBadge';
import { useTheme } from '../contexts/ThemeContext';

interface Props {
  song: SongEntry;
}

const SongCard: React.FC<Props> = ({ song }) => {
  const { theme } = useTheme();

  // Dynamic card styles
  const getCardStyles = () => {
    switch (theme) {
      case 'dark':
        return 'bg-slate-800 border-slate-700 hover:border-violet-500 text-slate-100 shadow-slate-900/50';
      case 'liquid':
        // High Contrast Liquid: Darker backdrop (black/40) allows white text to pop against bright blobs
        return 'bg-black/40 backdrop-blur-xl border-white/10 hover:border-white/30 text-white shadow-black/20';
      default:
        return 'bg-white/60 backdrop-blur-sm border-white hover:border-violet-200 text-slate-800 shadow-slate-200/50';
    }
  };

  const subTextColor = theme === 'light' ? 'text-slate-500' : 'text-slate-400';
  const summaryColor = theme === 'light' ? 'text-slate-600' : 'text-slate-300';
  const tagBg = theme === 'light' ? 'bg-indigo-50 text-indigo-600' : 'bg-indigo-500/30 text-indigo-100 border border-indigo-500/20';

  // Confidence color
  const getConfidenceColor = (score: number) => {
    if (score >= 90) return 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]';
    if (score >= 70) return 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.6)]';
    return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]';
  };

  return (
    <Link 
      to={`/result/${song.id}`} 
      className={`group block rounded-3xl p-6 shadow-xl border transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl active:scale-[0.98] flex flex-col h-full ${getCardStyles()}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 mr-2">
          <h3 className={`text-xl font-bold line-clamp-1 group-hover:text-violet-400 transition-colors ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
            {song.title}
          </h3>
          <p className={`${subTextColor} font-medium line-clamp-1`}>{song.artist}</p>
        </div>
        <StatusBadge status={song.status} />
      </div>
      
      <p className={`${summaryColor} text-sm mb-4 line-clamp-2 leading-relaxed flex-grow`}>
        {song.summary}
      </p>

      {/* Services List (if any) */}
      {song.alternatives.length > 0 && (
        <div className="mb-4">
           <div className="flex flex-wrap gap-2">
             {song.alternatives.slice(0, 3).map((alt, i) => (
               <span key={i} className={`text-[10px] font-bold px-2 py-1 rounded-full ${tagBg}`}>
                 {alt}
               </span>
             ))}
             {song.alternatives.length > 3 && (
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full opacity-60 ${tagBg}`}>+</span>
             )}
           </div>
        </div>
      )}

      {/* Divider */}
      <div className={`h-px w-full mb-4 ${theme === 'light' ? 'bg-slate-200' : 'bg-white/10'}`}></div>

      <div className="flex flex-col gap-3">
        {/* Votes */}
        <div className={`flex items-center justify-between text-xs font-bold ${subTextColor}`}>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/5" title="Safe/Accurate Votes">
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${theme === 'light' ? 'text-green-500' : 'text-green-400'}`} viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
              <span>{song.votes.up}</span>
            </div>
            
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/5" title="Unsafe/Inaccurate Votes">
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${theme === 'light' ? 'text-red-400' : 'text-red-400'}`} viewBox="0 0 20 20" fill="currentColor">
                <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 6H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 16H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
              </svg>
              <span>{song.votes.down}</span>
            </div>
          </div>
        </div>

        {/* Confidence Meter */}
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider opacity-90">
          <div className={`h-2 flex-grow rounded-full overflow-hidden ${theme === 'light' ? 'bg-slate-100' : 'bg-white/10'}`}>
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out ${getConfidenceColor(song.confidence)}`} 
              style={{ width: `${song.confidence}%` }}
            ></div>
          </div>
          <span className={subTextColor}>{song.confidence}% Confidence</span>
        </div>
      </div>
    </Link>
  );
};

export default SongCard;