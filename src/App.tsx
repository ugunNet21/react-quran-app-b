import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useThemeStore } from './stores/themeStore';
import Navbar from './components/layout/Navbar';
import BottomNav from './components/layout/BottomNav';
import HomePage from './pages/HomePage';
import SurahPage from './pages/SurahPage';
import TafsirPage from './pages/TafsirPage';
import SettingsPage from './pages/SettingsPage';
import BookmarksPage from './pages/BookmarksPage';
import NotFoundPage from './pages/NotFoundPage';
import { syncQuranData } from './services/syncService';

function App() {
  const { isDarkMode } = useThemeStore();
  
  useEffect(() => {
    // Initialize database and sync data
    const initData = async () => {
      try {
        await syncQuranData();
      } catch (error) {
        console.error('Error syncing data:', error);
      }
    };
    
    initData();
  }, []);

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark' : ''}`}>
      <Navbar />
      <main className="flex-1 container mx-auto px-4 pb-20 pt-16 md:pb-4 md:pt-20">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/surah/:surahNumber" element={<SurahPage />} />
          <Route path="/tafsir/:surahNumber" element={<TafsirPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  );
}

export default App;