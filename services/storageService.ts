import { SongEntry } from '../types';
import { SEED_SONGS } from '../data/seedSongs';

// We now use a stable key so data persists between code updates.
const DB_KEY = 'streamsafe_db_master'; 
const HISTORY_KEY = 'streamsafe_user_history_master';

// Keys used in previous versions to check for data migration
const LEGACY_KEYS = ['streamsafe_db_v3', 'streamsafe_db_v2', 'streamsafe_db_v1'];

// --- Global Database (Simulating a real backend) ---

const loadDb = (): SongEntry[] => {
  const stored = localStorage.getItem(DB_KEY);
  
  if (!stored) {
    // MIGRATION ATTEMPT: Check if user has data in old keys before resetting
    for (const legacyKey of LEGACY_KEYS) {
        const legacyData = localStorage.getItem(legacyKey);
        if (legacyData) {
            try {
                const parsed = JSON.parse(legacyData);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    console.log(`Migrated data from ${legacyKey}`);
                    saveDb(parsed); // Save to new master key
                    return parsed;
                }
            } catch (e) {
                console.warn(`Failed to migrate ${legacyKey}`, e);
            }
        }
    }

    // Initial load if no legacy data: Write seed data
    localStorage.setItem(DB_KEY, JSON.stringify(SEED_SONGS));
    return SEED_SONGS;
  }
  
  try {
    const parsed = JSON.parse(stored);
    // Basic migration check: ensure array
    if (!Array.isArray(parsed)) return SEED_SONGS;
    return parsed;
  } catch (e) {
    console.error("Database corruption, resetting to seed.");
    localStorage.setItem(DB_KEY, JSON.stringify(SEED_SONGS));
    return SEED_SONGS;
  }
};

const saveDb = (data: SongEntry[]) => {
  localStorage.setItem(DB_KEY, JSON.stringify(data));
};

// --- User Specific History (Cookies/Local for just this user) ---

const loadUserHistoryIds = (): string[] => {
  const stored = localStorage.getItem(HISTORY_KEY);
  if (!stored) {
     // Try migration for history too
     const legacyHistory = localStorage.getItem('streamsafe_user_history_v1');
     if (legacyHistory) {
         localStorage.setItem(HISTORY_KEY, legacyHistory);
         return JSON.parse(legacyHistory);
     }
     return [];
  }
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

const addToUserHistory = (songId: string) => {
  const ids = loadUserHistoryIds();
  // Remove if exists (to move to top)
  const filtered = ids.filter(id => id !== songId);
  // Add to front
  filtered.unshift(songId);
  // Limit to 20 items
  const trimmed = filtered.slice(0, 20);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
};

// --- Public API ---

export const findSongInDb = (query: string): SongEntry | undefined => {
  const db = loadDb();
  // Normalize: lowercase, remove special chars, trim
  const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  const q = normalize(query);
  
  if (!q) return undefined;

  return db.find(s => {
    // 1. Exact ID match (e.g. from URL)
    if (s.id === query) return true;
    
    // 2. Exact previous query match (Highest reliability)
    if (normalize(s.query) === q) return true;

    const title = normalize(s.title);
    const artist = normalize(s.artist);
    
    // 3. Smart Match: Query contains both Title AND Artist (Order independent)
    // Example: Query "fade alan walker" matches Title "Fade" Artist "Alan Walker"
    if (q.includes(title) && q.includes(artist)) return true;

    // 4. Reverse Match: DB Entry (Title + Artist) contains Query
    // Only if query is specific enough (> 5 chars) to avoid false positives on short words
    const combined = `${title} ${artist}`;
    if (combined.includes(q) && q.length > 5) return true;
    
    return false;
  });
};

export const getRecentSongs = (limit: number = 6): SongEntry[] => {
  const db = loadDb();
  // Sort by lastUpdated desc
  return db.sort((a, b) => b.lastUpdated - a.lastUpdated).slice(0, limit);
};

export const getUserHistorySongs = (): SongEntry[] => {
  const db = loadDb();
  const historyIds = loadUserHistoryIds();
  // Map IDs to actual song objects
  return historyIds
    .map(id => db.find(s => s.id === id))
    .filter((s): s is SongEntry => !!s); // Remove undefineds
};

export const getSongById = (id: string): SongEntry | undefined => {
  const db = loadDb();
  return db.find(s => s.id === id);
};

export const saveSongToDb = (song: SongEntry): void => {
  const db = loadDb();
  const existingIndex = db.findIndex(s => s.id === song.id);
  
  if (existingIndex >= 0) {
    // Update existing, but keep votes and merge other stats
    const existing = db[existingIndex];
    db[existingIndex] = { 
      ...song, 
      votes: existing.votes 
    };
  } else {
    db.push(song);
  }
  
  saveDb(db);
  addToUserHistory(song.id); // Also track that the user looked this up
};

export const voteForSong = (id: string, type: 'up' | 'down'): SongEntry | undefined => {
  const db = loadDb();
  const index = db.findIndex(s => s.id === id);
  if (index === -1) return undefined;

  const song = db[index];
  if (type === 'up') song.votes.up += 1;
  else song.votes.down += 1;

  db[index] = song;
  saveDb(db);
  return song;
};