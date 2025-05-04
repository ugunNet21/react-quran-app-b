import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Surah, Tafsir } from '../services/db';
import { loadTafsir } from '../services/syncService';
import { ChevronLeft, Book, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import TafsirItem from '../components/ui/TafsirItem';

const TafsirPage: React.FC = () => {
  const { surahNumber } = useParams<{ surahNumber: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const numericSurahNumber = parseInt(surahNumber || '1', 10);
  
  // Load tafsir data from database
  const tafsirData = useLiveQuery(async () => {
    if (!surahNumber) return null;
    
    try {
      const surah = await db.surahs.get(numericSurahNumber);
      const tafsirs = await db.tafsirs
        .where('surahNumber')
        .equals(numericSurahNumber)
        .toArray();
      
      return { surah, tafsirs };
    } catch (error) {
      console.error('Error fetching tafsir data:', error);
      return null;
    }
  }, [surahNumber]);
  
  // Load tafsir data
  useEffect(() => {
    const fetchTafsir = async () => {
      if (!surahNumber) return;
      
      setLoading(true);
      try {
        await loadTafsir(numericSurahNumber);
        setError(null);
      } catch (error) {
        console.error('Error loading tafsir:', error);
        setError('Failed to load tafsir data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTafsir();
  }, [surahNumber, numericSurahNumber]);
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <Loader2 size={48} className="text-primary-500 animate-spin mb-4" />
        <p className="text-neutral-600 dark:text-neutral-300">Loading tafsir...</p>
      </div>
    );
  }
  
  if (error || !tafsirData || !tafsirData.surah || !tafsirData.tafsirs) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-error-500 mb-4">{error || 'Tafsir not found'}</p>
        <Link to="/" className="btn btn-primary">
          Return Home
        </Link>
      </div>
    );
  }
  
  const { surah, tafsirs } = tafsirData;
  
  return (
    <div className="py-4">
      <div className="flex items-center mb-4">
        <Link to={`/surah/${surah.nomor}`} className="mr-2">
          <ChevronLeft size={24} className="text-neutral-700 dark:text-neutral-300" />
        </Link>
        <h1 className="text-xl font-bold">Tafsir {surah.namaLatin}</h1>
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
          
          <div className="text-end">
            <p className="font-arabic text-arabic-xl mb-3">{surah.nama}</p>
            <Link
              to={`/surah/${surah.nomor}`}
              className="inline-flex items-center px-3 py-1.5 bg-primary-500 text-white rounded-lg text-sm"
            >
              <Book size={16} className="mr-1" />
              Read Surah
            </Link>
          </div>
        </div>
      </motion.div>
      
      <div className="mt-8">
        {tafsirs.map((tafsir) => (
          <TafsirItem key={tafsir.ayat} tafsir={tafsir} />
        ))}
      </div>
    </div>
  );
};

export default TafsirPage;