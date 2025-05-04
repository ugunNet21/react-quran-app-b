import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { motion } from 'framer-motion';
import { db, Surah } from '../services/db';
import { syncQuranData } from '../services/syncService';
import SurahCard from '../components/ui/SurahCard';
import { Loader2 } from 'lucide-react';

const HomePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'mekah' | 'madinah'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch all surahs from database
  const surahs = useLiveQuery(async () => {
    let query = db.surahs.orderBy('nomor');
    
    if (filterType === 'mekah') {
      query = query.filter(surah => surah.tempatTurun.toLowerCase() === 'mekah');
    } else if (filterType === 'madinah') {
      query = query.filter(surah => surah.tempatTurun.toLowerCase() === 'madinah');
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      query = query.filter(surah => 
        surah.namaLatin.toLowerCase().includes(term) || 
        surah.arti.toLowerCase().includes(term) ||
        surah.nomor.toString() === term
      );
    }
    
    return query.toArray();
  }, [filterType, searchTerm]);
  
  useEffect(() => {
    const init = async () => {
      try {
        await syncQuranData();
      } catch (error) {
        console.error('Error syncing data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    init();
  }, []);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <Loader2 size={48} className="text-primary-500 animate-spin mb-4" />
        <p className="text-neutral-600 dark:text-neutral-300">Loading Al-Quran data...</p>
      </div>
    );
  }
  
  return (
    <div className="py-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Al-Quran</h1>
        <p className="text-neutral-600 dark:text-neutral-300">
          Read, listen, and learn from the Holy Quran
        </p>
      </div>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search surah by name, number or meaning..."
          className="input"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
            filterType === 'all'
              ? 'bg-primary-500 text-white'
              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
          }`}
        >
          All Surahs
        </button>
        
        <button
          onClick={() => setFilterType('mekah')}
          className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
            filterType === 'mekah'
              ? 'bg-primary-500 text-white'
              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
          }`}
        >
          Mekah
        </button>
        
        <button
          onClick={() => setFilterType('madinah')}
          className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
            filterType === 'madinah'
              ? 'bg-primary-500 text-white'
              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
          }`}
        >
          Madinah
        </button>
      </div>
      
      {surahs && surahs.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {surahs.map((surah) => (
            <SurahCard key={surah.nomor} surah={surah} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-lg text-neutral-600 dark:text-neutral-300">
            {searchTerm
              ? 'No surahs match your search.'
              : 'No surahs available.'}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default HomePage;