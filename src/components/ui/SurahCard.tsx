import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Volume2 } from 'lucide-react';
import { useAudioStore } from '../../stores/audioStore';
import { motion } from 'framer-motion';
import { Surah } from '../../services/db';

interface SurahCardProps {
  surah: Surah;
}

const SurahCard: React.FC<SurahCardProps> = ({ surah }) => {
  const { 
    isPlaying, 
    currentSurah, 
    playingType,
    selectedQari,
    play, 
    pause, 
    setAudio,
    setCurrentSurah,
    setCurrentAyat,
    setPlayingType
  } = useAudioStore();
  
  const isCurrentPlaying = currentSurah === surah.nomor && isPlaying && playingType === 'surah';
  
  const handlePlayAudio = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isCurrentPlaying) {
      pause();
    } else {
      const audio = `https://equran.nos.wjv-1.neo.id/audio-full/${getQariName(selectedQari)}/${surah.nomor.toString().padStart(3, '0')}.mp3`;
      setAudio(audio);
      setCurrentSurah(surah.nomor);
      setCurrentAyat(null);
      setPlayingType('surah');
      play();
    }
  };
  
  const getQariName = (qari: string): string => {
    const names: Record<string, string> = {
      '01': 'Abdullah-Al-Juhany',
      '02': 'Abdul-Muhsin-Al-Qasim',
      '03': 'Abdurrahman-as-Sudais',
      '04': 'Ibrahim-Al-Dossari',
      '05': 'Misyari-Rasyid-Al-Afasi'
    };
    return names[qari];
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/surah/${surah.nomor}`} className="block">
        <div className="card hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-500 font-medium">
                {surah.nomor}
              </div>
              
              <div>
                <h3 className="font-semibold text-lg">{surah.namaLatin}</h3>
                <p className="text-neutral-600 dark:text-neutral-300 text-sm">{surah.arti}</p>
                <div className="flex items-center mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  <span className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-700 rounded mr-2">
                    {surah.tempatTurun}
                  </span>
                  <span>{surah.jumlahAyat} Ayat</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <p className="font-arabic text-xl mb-2">{surah.nama}</p>
              
              <div className="flex space-x-2">
                <button
                  onClick={handlePlayAudio}
                  className={`p-2 rounded-full ${
                    isCurrentPlaying
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-500'
                      : 'hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  }`}
                >
                  <Volume2 size={18} />
                </button>
                
                <Link
                  to={`/tafsir/${surah.nomor}`}
                  className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700"
                >
                  <BookOpen size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default SurahCard;