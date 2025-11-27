import { SongEntry, SafetyStatus } from '../types';

export const SEED_SONGS: SongEntry[] = [
  {
    id: 'never-gonna-give-you-up-rick-astley',
    query: 'Never Gonna Give You Up',
    title: 'Never Gonna Give You Up',
    artist: 'Rick Astley',
    status: SafetyStatus.BLOCKED,
    confidence: 98,
    summary: 'High risk of copyright strike; likely to be claimed or blocked.',
    details: 'This song is heavily protected by copyright and is distributed by major labels who actively enforce their IP. Using it on YouTube will likely result in a Content ID claim or a worldwide block. Twitch VODs containing this track will almost certainly be muted.',
    platforms: {
      youtube: 'Content ID Claim / Block',
      twitch: 'Muted VODs',
    },
    alternatives: [], 
    lastUpdated: Date.now(),
    votes: { up: 4, down: 1 },
    sources: []
  },
  {
    id: 'fade-alan-walker',
    query: 'Fade Alan Walker',
    title: 'Fade',
    artist: 'Alan Walker',
    status: SafetyStatus.SAFE,
    confidence: 90,
    summary: 'Safe to use if you credit the artist properly (NCS Release).',
    details: 'This track was released under NoCopyrightSounds (NCS) and is free to use for creators. You must credit the artist and track in your video description exactly as specified by NCS. Note that the vocal version "Faded" is not safe and is fully copyrighted.',
    platforms: {
      youtube: 'Safe (with credit)',
      twitch: 'Safe',
    },
    alternatives: ['NCS Library'],
    lastUpdated: Date.now(),
    votes: { up: 15, down: 2 },
    sources: [
        { title: "NoCopyrightSounds - Usage Policy", uri: "https://ncs.io/usage-policy" }
    ]
  }
];