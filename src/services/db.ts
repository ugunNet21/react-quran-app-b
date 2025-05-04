import Dexie, { Table } from 'dexie';

// Define interfaces for our models
export interface Surah {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audioFull: SurahAudio;
  lastUpdated?: number;
}

export interface SurahAudio {
  '01': string;
  '02': string;
  '03': string;
  '04': string;
  '05': string;
}

export interface Ayat {
  surahNumber: number;
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: AyatAudio;
}

export interface AyatAudio {
  '01': string;
  '02': string;
  '03': string;
  '04': string;
  '05': string;
}

export interface Tafsir {
  surahNumber: number;
  ayat: number;
  teks: string;
}

export interface Bookmark {
  id?: number;
  surahNumber: number;
  ayatNumber?: number;
  timestamp: number;
  title: string;
}

// Define the database
class QuranDatabase extends Dexie {
  surahs!: Table<Surah, number>;
  ayats!: Table<Ayat, [number, number]>;
  tafsirs!: Table<Tafsir, [number, number]>;
  bookmarks!: Table<Bookmark, number>;
  
  constructor() {
    super('QuranDatabase');
    this.version(1).stores({
      surahs: 'nomor, namaLatin, tempatTurun',
      ayats: '[surahNumber+nomorAyat], surahNumber',
      tafsirs: '[surahNumber+ayat], surahNumber',
      bookmarks: '++id, surahNumber, ayatNumber, timestamp'
    });
  }
}

export const db = new QuranDatabase();

export default db;