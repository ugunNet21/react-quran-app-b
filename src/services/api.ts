import { Surah, Ayat, Tafsir } from './db';

const API_BASE_URL = 'https://equran.id/api/v2';

// Function to check if the network is available
export const isOnline = (): boolean => {
  return navigator.onLine;
};

// Fetch all surahs list
export const fetchSurahs = async (): Promise<Surah[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/surat`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching surahs:', error);
    throw error;
  }
};

// Fetch specific surah with ayats
export const fetchSurah = async (surahNumber: number): Promise<{
  surah: Surah;
  ayats: Ayat[];
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/surat/${surahNumber}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    
    // Map the API response to our data model
    const surah: Surah = {
      nomor: data.data.nomor,
      nama: data.data.nama,
      namaLatin: data.data.namaLatin,
      jumlahAyat: data.data.jumlahAyat,
      tempatTurun: data.data.tempatTurun,
      arti: data.data.arti,
      deskripsi: data.data.deskripsi,
      audioFull: data.data.audioFull,
      lastUpdated: Date.now(),
    };
    
    // Map ayats
    const ayats: Ayat[] = data.data.ayat.map((ayat: any) => ({
      surahNumber: data.data.nomor,
      nomorAyat: ayat.nomorAyat,
      teksArab: ayat.teksArab,
      teksLatin: ayat.teksLatin,
      teksIndonesia: ayat.teksIndonesia,
      audio: ayat.audio,
    }));
    
    return { surah, ayats };
  } catch (error) {
    console.error(`Error fetching surah ${surahNumber}:`, error);
    throw error;
  }
};

// Fetch tafsir for a specific surah
export const fetchTafsir = async (surahNumber: number): Promise<{
  surah: Surah;
  tafsirs: Tafsir[];
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tafsir/${surahNumber}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    
    // Map the API response to our data model
    const surah: Surah = {
      nomor: data.data.nomor,
      nama: data.data.nama,
      namaLatin: data.data.namaLatin,
      jumlahAyat: data.data.jumlahAyat,
      tempatTurun: data.data.tempatTurun,
      arti: data.data.arti,
      deskripsi: data.data.deskripsi,
      audioFull: data.data.audioFull,
      lastUpdated: Date.now(),
    };
    
    // Map tafsirs
    const tafsirs: Tafsir[] = data.data.tafsir.map((tafsir: any) => ({
      surahNumber: data.data.nomor,
      ayat: tafsir.ayat,
      teks: tafsir.teks,
    }));
    
    return { surah, tafsirs };
  } catch (error) {
    console.error(`Error fetching tafsir for surah ${surahNumber}:`, error);
    throw error;
  }
};