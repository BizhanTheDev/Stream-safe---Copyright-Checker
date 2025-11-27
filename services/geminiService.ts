import { GoogleGenAI } from "@google/genai";
import { SafetyStatus, SongEntry } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to generate a consistent ID
const generateId = (title: string, artist: string) => {
  return `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${artist.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
};

export const analyzeSong = async (query: string): Promise<SongEntry> => {
  const modelId = "gemini-2.5-flash"; 
  
  const prompt = `
    Task: Identify the song and analyze its copyright status for content creators (YouTube/Twitch).

    User Query: "${query}"

    Instructions:
    1. IDENTIFY: If the query is misspelled, vague, or just lyrics, MAKE A BEST GUESS at the specific song and artist.
    2. SEARCH: Use Google Search to find copyright policies, Content ID info, or licensing details.
    3. SAFETY FIRST (CRITICAL): 
       - **CONFLICT RULE**: If you find conflicting information (e.g. one site says "Royalty Free" and another says "Copyrighted"), you MUST default to **RISKY**. Do NOT guess "Safe".
       - **MAJOR LABEL RULE**: If the song is by a major label artist (e.g., Taylor Swift, Drake, Universal, Sony), it is **BLOCKED** or **RISKY** by default unless you find an EXPLICIT statement saying otherwise.
       - **SAFE CRITERIA**: Only mark as **SAFE** if you find an EXPLICIT license (e.g., NoCopyrightSounds, Kevin MacLeod, Thematic, Creative Commons) or an official statement from the artist.
    4. SERVICES: Identify if THIS SPECIFIC SONG is available on safe platforms.
       - Do NOT list generic services like "Epidemic Sound" unless the song is actually BY an Epidemic Sound artist.
       - If it is a mainstream pop song, the 'alternatives' list MUST BE EMPTY.
    5. CONFIDENCE: Give a score (0-100).
       - 90-100: Explicit policy found (Safe or Blocked).
       - 0-50: No specific info found, inferred from label (Risky).
    
    OUTPUT FORMAT:
    Return strictly a valid JSON object.
    
    JSON Schema:
    {
      "title": "Correct Song Title",
      "artist": "Correct Artist Name",
      "status": "SAFE" | "RISKY" | "BLOCKED",
      "confidence": number, // Integer 0-100
      "summary": "One concise sentence (max 15 words) summarizing the verdict.", 
      "details": "Strictly 2-4 sentences. Clearly state the copyright status, whether it is safe for YouTube/Twitch, and any attribution requirements. Do not add fluff.",
      "platforms": {
        "youtube": "Short status (e.g. 'Copyright Claim')",
        "twitch": "Short status (e.g. 'Muted')"
      },
      "alternatives": ["Name of service where THIS SONG is available"],
      "sources": [ { "title": "Source Name (e.g. NCS Policy)", "uri": "URL" } ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    let text = response.text;
    if (!text) throw new Error("No response from AI");

    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      text = jsonMatch[1];
    } else {
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    }

    const data = JSON.parse(text);

    // 1. Get Sources from JSON output (Backup)
    const finalSources: { title: string; uri: string }[] = data.sources || [];
    const seenUris = new Set<string>();
    
    // Add existing sources to set to prevent dupes
    finalSources.forEach(s => seenUris.add(s.uri));

    // 2. Get Sources from Grounding Metadata (Primary / High Quality)
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    groundingChunks.forEach(chunk => {
      const uri = chunk.web?.uri;
      if (uri && !seenUris.has(uri)) {
        // Filter out internal Google Search system URLs
        if (uri.includes('vertexaisearch.cloud.google.com')) return;
        if (uri.includes('googleusercontent.com')) return;

        seenUris.add(uri);
        
        // Use the title provided by Gemini, or fallback to hostname
        let title = chunk.web?.title;
        if (!title || title.trim() === '') {
            try {
                title = new URL(uri).hostname.replace('www.', '');
            } catch {
                title = 'External Source';
            }
        }

        finalSources.push({ title, uri });
      }
    });

    const songEntry: SongEntry = {
      id: generateId(data.title, data.artist),
      query: query,
      title: data.title,
      artist: data.artist,
      status: data.status as SafetyStatus,
      confidence: data.confidence || 70, // Default if AI misses it
      summary: data.summary,
      details: data.details,
      platforms: data.platforms,
      alternatives: data.alternatives || [],
      lastUpdated: Date.now(),
      votes: { up: 0, down: 0 },
      sources: finalSources.slice(0, 5) // Limit to top 5 unique sources
    };

    return songEntry;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("We couldn't identify that song or analyze it. Please try adding the artist name!");
  }
};