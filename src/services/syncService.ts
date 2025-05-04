import { db, Surah, Ayat, Tafsir } from './db';
import { fetchSurahs, fetchSurah, fetchTafsir, isOnline } from './api';

// Time constants
const ONE_DAY = 24 * 60 * 60 * 1000; // 1 day in milliseconds

// Initialize and sync Quran data
export const syncQuranData = async (): Promise<void> => {
  try {
    // Check if we need to initialize or update data
    const surahCount = await db.surahs.count();
    
    // If no surahs in database, populate from API if online, else show error
    if (surahCount === 0) {
      if (!isOnline()) {
        throw new Error('No data available. Please connect to the internet for first-time setup.');
      }
      
      console.log('Initializing database with Quran data...');
      
      // Fetch all surahs from API
      const surahs = await fetchSurahs();
      
      // Store all surahs in the database
      await db.surahs.bulkAdd(surahs);
      
      console.log('Initial data loaded successfully.');
    } else {
      // If online, check for updates to surahs that are older than 1 day
      if (isOnline()) {
        console.log('Checking for updates...');
        
        // Get all surahs that need updating
        const now = Date.now();
        const outdatedSurahs = await db.surahs
          .filter(surah => !surah.lastUpdated || now - surah.lastUpdated > ONE_DAY)
          .toArray();
        
        console.log(`Found ${outdatedSurahs.length} surahs that need updating.`);
        
        // Update outdated surahs one by one
        for (const surah of outdatedSurahs) {
          await updateSurahData(surah.nomor);
        }
      }
    }
  } catch (error) {
    console.error('Error in syncQuranData:', error);
    throw error;
  }
};

// Update surah data, including ayats
export const updateSurahData = async (surahNumber: number): Promise<void> => {
  if (!isOnline()) {
    console.log('Offline: using cached data for surah', surahNumber);
    return;
  }
  
  try {
    console.log(`Updating data for surah ${surahNumber}...`);
    
    // Fetch surah with ayats
    const { surah, ayats } = await fetchSurah(surahNumber);
    
    // Update surah in database
    await db.surahs.put(surah);
    
    // Update ayats in database (delete old ones first)
    await db.ayats.where('surahNumber').equals(surahNumber).delete();
    await db.ayats.bulkAdd(ayats);
    
    console.log(`Updated data for surah ${surahNumber}`);
  } catch (error) {
    console.error(`Error updating data for surah ${surahNumber}:`, error);
    throw error;
  }
};

// Update tafsir data for a surah
export const updateTafsirData = async (surahNumber: number): Promise<void> => {
  if (!isOnline()) {
    console.log('Offline: using cached data for tafsir of surah', surahNumber);
    return;
  }
  
  try {
    console.log(`Updating tafsir for surah ${surahNumber}...`);
    
    // Fetch tafsir
    const { surah, tafsirs } = await fetchTafsir(surahNumber);
    
    // No need to update surah again as it would've been updated in updateSurahData
    
    // Update tafsirs in database (delete old ones first)
    await db.tafsirs.where('surahNumber').equals(surahNumber).delete();
    await db.tafsirs.bulkAdd(tafsirs);
    
    console.log(`Updated tafsir for surah ${surahNumber}`);
  } catch (error) {
    console.error(`Error updating tafsir for surah ${surahNumber}:`, error);
    throw error;
  }
};

// Load a specific surah with its ayats
export const loadSurah = async (surahNumber: number): Promise<{
  surah: Surah;
  ayats: Ayat[];
}> => {
  try {
    // Try to update the surah data if online
    try {
      if (isOnline()) {
        await updateSurahData(surahNumber);
      }
    } catch (error) {
      console.log('Could not update surah data, using cached data');
    }
    
    // Get surah from database
    const surah = await db.surahs.get(surahNumber);
    if (!surah) {
      throw new Error(`Surah ${surahNumber} not found`);
    }
    
    // Get ayats from database
    const ayats = await db.ayats
      .where('surahNumber')
      .equals(surahNumber)
      .toArray();
    
    return { surah, ayats };
  } catch (error) {
    console.error(`Error loading surah ${surahNumber}:`, error);
    throw error;
  }
};

// Load tafsir for a specific surah
export const loadTafsir = async (surahNumber: number): Promise<{
  surah: Surah;
  tafsirs: Tafsir[];
}> => {
  try {
    // Try to update the tafsir data if online
    try {
      if (isOnline()) {
        await updateTafsirData(surahNumber);
      }
    } catch (error) {
      console.log('Could not update tafsir data, using cached data');
    }
    
    // Get surah from database
    const surah = await db.surahs.get(surahNumber);
    if (!surah) {
      throw new Error(`Surah ${surahNumber} not found`);
    }
    
    // Get tafsirs from database
    const tafsirs = await db.tafsirs
      .where('surahNumber')
      .equals(surahNumber)
      .toArray();
    
    return { surah, tafsirs };
  } catch (error) {
    console.error(`Error loading tafsir for surah ${surahNumber}:`, error);
    throw error;
  }
};