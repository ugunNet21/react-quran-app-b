import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { useAudioStore, QariType } from '../../stores/audioStore';
import { motion } from 'framer-motion';

interface AudioPlayerProps {
  surahNumber: number;
  totalAyats: number;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ surahNumber, totalAyats }) => {
  const { 
    isPlaying, 
    currentAudio, 
    currentSurah,
    currentAyat,
    playingType,
    selectedQari,
    volume,
    play, 
    pause, 
    stop,
    setAudio,
    setCurrentSurah,
    setCurrentAyat,
    setPlayingType,
    setVolume
  } = useAudioStore();
  
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio when component mounts
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    
    // Set up event listeners
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      // Clean up event listeners
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, []);
  
  // Update audio src when currentAudio changes
  useEffect(() => {
    if (audioRef.current && currentAudio) {
      audioRef.current.src = currentAudio;
      audioRef.current.volume = volume;
      
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
          pause();
        });
      }
    }
  }, [currentAudio, volume]);
  
  // Handle play/pause state changes
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
          pause();
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);
  
  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);
  
  const updateProgress = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setCurrentTime(current);
      setProgress((current / total) * 100);
    }
  };
  
  const updateDuration = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };
  
  const handleEnded = () => {
    if (playingType === 'ayat' && currentAyat && currentAyat < totalAyats) {
      // Play next ayat
      playAyat(currentAyat + 1);
    } else {
      // Stop playing
      stop();
    }
  };
  
  const playFullSurah = () => {
    const audio = `https://equran.nos.wjv-1.neo.id/audio-full/${getQariName(selectedQari)}/${surahNumber.toString().padStart(3, '0')}.mp3`;
    setAudio(audio);
    setCurrentSurah(surahNumber);
    setCurrentAyat(null);
    setPlayingType('surah');
    play();
  };
  
  const playAyat = (ayatNumber: number) => {
    const audio = `https://equran.nos.wjv-1.neo.id/audio-partial/${getQariName(selectedQari)}/${surahNumber.toString().padStart(3, '0')}${ayatNumber.toString().padStart(3, '0')}.mp3`;
    setAudio(audio);
    setCurrentSurah(surahNumber);
    setCurrentAyat(ayatNumber);
    setPlayingType('ayat');
    play();
  };
  
  const handlePlayPause = () => {
    if (currentSurah !== surahNumber || !currentAudio) {
      playFullSurah();
    } else {
      isPlaying ? pause() : play();
    }
  };
  
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPosition = parseFloat(e.target.value);
    if (audioRef.current) {
      const newTime = (newPosition * audioRef.current.duration) / 100;
      audioRef.current.currentTime = newTime;
      setProgress(newPosition);
    }
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value) / 100;
    setVolume(newVolume);
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const getQariName = (qari: QariType): string => {
    const names: Record<QariType, string> = {
      '01': 'Abdullah-Al-Juhany',
      '02': 'Abdul-Muhsin-Al-Qasim',
      '03': 'Abdurrahman-as-Sudais',
      '04': 'Ibrahim-Al-Dossari',
      '05': 'Misyari-Rasyid-Al-Afasi'
    };
    return names[qari];
  };
  
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-4 mt-4">
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <button
              onClick={handlePlayPause}
              className="w-12 h-12 flex items-center justify-center bg-primary-500 text-white rounded-full hover:bg-primary-600 transition"
            >
              {isPlaying && currentSurah === surahNumber ? (
                <Pause size={24} />
              ) : (
                <Play size={24} className="ml-1" />
              )}
            </button>
            
            <div className="ml-4">
              <div className="text-lg font-medium">Surah {surahNumber}</div>
              <div className="text-sm text-neutral-500 dark:text-neutral-400">
                {playingType === 'ayat' && currentAyat
                  ? `Ayat ${currentAyat}`
                  : 'Full Surah'}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={toggleMute}
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700"
            >
              {isMuted ? (
                <VolumeX size={20} className="text-neutral-600 dark:text-neutral-400" />
              ) : (
                <Volume2 size={20} className="text-neutral-600 dark:text-neutral-400" />
              )}
            </button>
            
            <input
              type="range"
              className="w-20 accent-primary-500"
              min="0"
              max="100"
              value={isMuted ? 0 : volume * 100}
              onChange={handleVolumeChange}
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-xs text-neutral-500 dark:text-neutral-400 w-10 text-right">
            {formatTime(currentTime)}
          </span>
          
          <div className="flex-1 relative h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-primary-500"
              style={{ width: `${progress}%` }}
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear", duration: 0.1 }}
            />
            <input
              type="range"
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              min="0"
              max="100"
              step="0.1"
              value={progress}
              onChange={handleSeek}
            />
          </div>
          
          <span className="text-xs text-neutral-500 dark:text-neutral-400 w-10">
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;