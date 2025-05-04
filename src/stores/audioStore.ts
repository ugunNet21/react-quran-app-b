import { create } from 'zustand';

export type QariType = '01' | '02' | '03' | '04' | '05';
export type PlayingType = 'ayat' | 'surah' | 'none';

interface AudioState {
  isPlaying: boolean;
  currentAudio: string | null;
  currentSurah: number | null;
  currentAyat: number | null;
  playingType: PlayingType;
  selectedQari: QariType;
  volume: number;
  
  setAudio: (audio: string | null) => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  setCurrentSurah: (surah: number | null) => void;
  setCurrentAyat: (ayat: number | null) => void;
  setPlayingType: (type: PlayingType) => void;
  setQari: (qari: QariType) => void;
  setVolume: (volume: number) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  isPlaying: false,
  currentAudio: null,
  currentSurah: null,
  currentAyat: null,
  playingType: 'none',
  selectedQari: '05', // Default to Misyari Rasyid Al-Afasi
  volume: 0.8,
  
  setAudio: (audio) => set({ currentAudio: audio }),
  
  play: () => set({ isPlaying: true }),
  
  pause: () => set({ isPlaying: false }),
  
  stop: () => set({ 
    isPlaying: false, 
    currentAudio: null,
    currentAyat: null,
    playingType: 'none'
  }),
  
  setCurrentSurah: (surah) => set({ currentSurah: surah }),
  
  setCurrentAyat: (ayat) => set({ currentAyat: ayat }),
  
  setPlayingType: (type) => set({ playingType: type }),
  
  setQari: (qari) => set({ selectedQari: qari }),
  
  setVolume: (volume) => set({ volume: volume }),
}));