import React, { useState } from 'react';
import { Bookmark, BookmarkCheck, Volume2, Share2, Copy } from 'lucide-react';
import { useAudioStore } from '../../stores/audioStore';
import { motion } from 'framer-motion';
import { Ayat } from '../../services/db';
import { addBookmark, removeBookmark, isBookmarked } from '../../services/bookmarkService';

interface AyatItemProps {
  ayat: Ayat;
  surahName: string;
}

const AyatItem: React.FC<AyatItemProps> = ({ ayat, surahName }) => {
  const { 
    isPlaying, 
    currentSurah, 
    currentAyat,
    playingType,
    selectedQari,
    play, 
    pause, 
    setAudio,
    setCurrentSurah,
    setCurrentAyat,
    setPlayingType
  } = useAudioStore();
  
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkId, setBookmarkId] = useState<number | null>(null);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  
  // Check if this ayat is currently playing
  const isCurrentPlaying = 
    currentSurah === ayat.surahNumber && 
    currentAyat === ayat.nomorAyat && 
    isPlaying && 
    playingType === 'ayat';
  
  // Load bookmark status
  React.useEffect(() => {
    const checkBookmarkStatus = async () => {
      const result = await isBookmarked(ayat.surahNumber, ayat.nomorAyat);
      setIsBookmarked(result);
    };
    
    checkBookmarkStatus();
  }, [ayat.surahNumber, ayat.nomorAyat]);
  
  const handlePlayAudio = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (isCurrentPlaying) {
      pause();
    } else {
      const audio = ayat.audio[selectedQari];
      setAudio(audio);
      setCurrentSurah(ayat.surahNumber);
      setCurrentAyat(ayat.nomorAyat);
      setPlayingType('ayat');
      play();
    }
  };
  
  const toggleBookmark = async () => {
    try {
      if (isBookmarked && bookmarkId) {
        await removeBookmark(bookmarkId);
        setIsBookmarked(false);
        setBookmarkId(null);
      } else {
        const id = await addBookmark({
          surahNumber: ayat.surahNumber, 
          ayatNumber: ayat.nomorAyat,
          title: `${surahName} - Ayat ${ayat.nomorAyat}`
        });
        setIsBookmarked(true);
        setBookmarkId(id);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };
  
  const copyAyatToClipboard = () => {
    const textToCopy = `${ayat.teksArab}\n\n${ayat.teksLatin}\n\n${ayat.teksIndonesia}\n\n(${surahName}: ${ayat.nomorAyat})`;
    
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setShowCopiedMessage(true);
        setTimeout(() => setShowCopiedMessage(false), 2000);
      })
      .catch(err => {
        console.error('Error copying text: ', err);
      });
  };
  
  const shareAyat = () => {
    if (navigator.share) {
      const shareData = {
        title: `${surahName} - Ayat ${ayat.nomorAyat}`,
        text: `${ayat.teksArab}\n\n${ayat.teksLatin}\n\n${ayat.teksIndonesia}\n\n(${surahName}: ${ayat.nomorAyat})`,
        url: window.location.href
      };
      
      navigator.share(shareData)
        .catch(err => {
          console.error('Error sharing:', err);
        });
    } else {
      copyAyatToClipboard();
    }
  };
  
  return (
    <motion.div 
      className={`card my-4 relative ${
        isCurrentPlaying ? 'border-2 border-primary-500' : ''
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-500 font-medium text-sm">
        {ayat.nomorAyat}
      </div>
      
      <div className="mt-8 mb-6">
        <p className="arabic-text text-end leading-loose mb-6">{ayat.teksArab}</p>
        <p className="latin-text mb-4">{ayat.teksLatin}</p>
        <p className="translation-text">{ayat.teksIndonesia}</p>
      </div>
      
      <div className="flex justify-end border-t border-neutral-100 dark:border-neutral-700 pt-3 mt-3">
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
          
          <button
            onClick={toggleBookmark}
            className={`p-2 rounded-full ${
              isBookmarked
                ? 'bg-secondary-100 dark:bg-secondary-900 text-secondary-500'
                : 'hover:bg-neutral-100 dark:hover:bg-neutral-700'
            }`}
          >
            {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          </button>
          
          <button
            onClick={copyAyatToClipboard}
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 relative"
          >
            <Copy size={18} />
            {showCopiedMessage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-neutral-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap"
              >
                Copied!
              </motion.div>
            )}
          </button>
          
          <button
            onClick={shareAyat}
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AyatItem;