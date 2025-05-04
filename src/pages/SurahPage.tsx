import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Surah, Ayat } from '../services/db';
import { loadSurah } from '../services/syncService';
import { ChevronLeft, Bookmark, BookmarkCheck, BookOpen, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import AyatItem from '../components/ui/AyatItem';
import AudioPlayer from '../components/ui/AudioPlayer';
import QariSelector from '../components/ui/QariSelector';
import { addBookmark, removeBookmark, isBookmarked } from '../services/bookmarkService';

const SurahPage: React.FC = () => {
  const { surahNumber } = useParams<{ surahNumber: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkId, setBookmarkId] = useState<number | null>(null);
  
  const numericSurahNumber = parseInt(surahNumber || '1', 10);
  
  // Load surah data from database
  const surahData = useLiveQuery(async () => {
    if (!surahNumber) return null;
    
    try {
      const surah = await db.surahs.get(numericSurahNumber);
      const ayats = await db.ayats
        .where('surahNumber')
        .equals(numericSurahNumber)
        .toArray();
      
      return { surah, ayats };
    } catch (error) {
      console.error('Error fetching surah data:', error);
      return null;
    }
  }, [surahNumber]);
  
  // Load surah data
  useEffect(() => {
    const fetchSurah = async () => {
      if (!surahNumber) return;
      
      setLoading(true);
      try {
        await loadSurah(numericSurahNumber);
        setError(null);
      } catch (error) {
        console.error('Error loading surah:', error);
        setError('Failed to load surah data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSurah();
  }, [surahNumber, numericSurahNumber]);
  
  // Check if this surah is bookmarked
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (!surahNumber) return;
      
      try {
        const result = await isBookmarked(numericSurahNumber);
        setIsBookmarked(result);
      } catch (error) {
        console.error('Error checking bookmark status:', error);
      }
    };
    
    checkBookmarkStatus();
  }, [surahNumber, numericSurahNumber]);
  
  const toggleBookmark = async () => {
    if (!surahData?.surah) return;
    
    try {
      if (isBookmarked && bookmarkId) {
        await removeBookmark(bookmarkId);
        setIsBookmarked(false);
        setBookmarkId(null);
      } else {
        const id = await addBookmark({
          surahNumber: numericSurahNumber,
          title: `${surahData.surah.namaLatin} (${surahData.surah.arti})`
        });
        setIsBookmarked(true);
        setBookmarkId(id);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <Loader2 size={48} className="text-primary-500 animate-spin mb-4" />
        <p className="text-neutral-600 dark:text-neutral-300">Loading surah...</p>
      </div>
    );
  }
  
  if (error || !surahData || !surahData.surah || !surahData.ayats) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-error-500 mb-4">{error || 'Surah not found'}</p>
        <Link to="/" className="btn btn-primary">
          Return Home
        </Link>
      </div>
    );
  }
  
  const { surah, ayats } = surahData;
  
  return (
    <div className="py-4">
      <div className="flex items-center mb-4">
        <Link to="/" className="mr-2">
          <ChevronLeft size={24} className="text-neutral-700 dark:text-neutral-300" />
        </Link>
        <h1 className="text-xl font-bold">Surah {surah.namaLatin}</h1>
      </div>
      
      <motion.div 
        className="card mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-1">{surah.namaLatin}</h2>
            <p className="text-neutral-600 dark:text-neutral-300 mb-2">{surah.arti}</p>
            <div className="flex items-center space-x-3 text-sm">
              <span className="px-2 py-1 bg-neutral-100 dark:bg-neutral-700 rounded">
                {surah.tempatTurun}
              </span>
              <span>{surah.jumlahAyat} Ayat</span>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <p className="font-arabic text-arabic-xl mb-3">{surah.nama}</p>
            
            <div className="flex space-x-2">
              <button
                onClick={toggleBookmark}
                className={`p-2 rounded-full ${
                  isBookmarked
                    ? 'bg-secondary-100 dark:bg-secondary-900 text-secondary-500'
                    : 'hover:bg-neutral-100 dark:hover:bg-neutral-700'
                }`}
              >
                {isBookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
              </button>
              
              <Link
                to={`/tafsir/${surah.nomor}`}
                className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700"
              >
                <BookOpen size={20} />
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-neutral-600 dark:text-neutral-300">
          <p dangerouslySetInnerHTML={{ __html: surah.deskripsi }} />
        </div>
      </motion.div>
      
      <div className="mb-6 flex items-center justify-between">
        <QariSelector />
      </div>
      
      <AudioPlayer surahNumber={surah.nomor} totalAyats={surah.jumlahAyat} />
      
      <div className="mt-6 mb-4">
        <div className="bg-primary-50 dark:bg-primary-900/30 text-center py-4 rounded-lg">
          <p className="font-arabic text-2xl">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-2">
            Dengan nama Allah Yang Maha Pengasih, Maha Penyayang
          </p>
        </div>
      </div>
      
      <div className="mt-8">
        {ayats.map((ayat) => (
          <AyatItem key={ayat.nomorAyat} ayat={ayat} surahName={surah.namaLatin} />
        ))}
      </div>
    </div>
  );
};

export default SurahPage;