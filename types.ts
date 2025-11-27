export enum SafetyStatus {
  SAFE = 'SAFE',
  RISKY = 'RISKY',
  BLOCKED = 'BLOCKED',
  UNKNOWN = 'UNKNOWN'
}

export interface VoteStats {
  up: number;
  down: number;
}

export interface SongEntry {
  id: string; // unique ID based on artist + title
  query: string; // Original search query
  title: string;
  artist: string;
  coverUrl?: string; // Optional cover image
  status: SafetyStatus;
  confidence: number; // 0-100 score of AI certainty
  summary: string; // Short summary
  details: string; // Markdown detailed analysis
  platforms: {
    youtube: string;
    twitch: string;
  };
  alternatives: string[]; // List of recommended services (Epidemic, NCS, etc)
  lastUpdated: number;
  votes: VoteStats;
  sources: { title: string; uri: string }[]; // Updated from string[] to object array
}

export interface SearchState {
  isLoading: boolean;
  error: string | null;
}