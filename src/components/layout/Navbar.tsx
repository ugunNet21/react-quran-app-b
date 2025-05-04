import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Search, Moon, Sun, X } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';
import { db } from '../../services/db';
import { motion, AnimatePresence } from 'framer-motion';

type SearchResult = {
  nomor: number;
  namaLatin: string;
  nama: string;
  arti: string;
};

const Navbar: React.FC = () => {
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === '/') return 'Al-Quran';
    if (path === '/bookmarks') return 'Bookmarks';
    if (path === '/settings') return 'Settings';
    if (path.startsWith('/surah/')) return 'Surah';
    if (path.startsWith('/tafsir/')) return 'Tafsir';
    
    return 'Al-Quran';
  };
  
  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }
      
      try {
        const query = searchQuery.toLowerCase();
        const results = await db.surahs
          .filter(surah => 
            surah.namaLatin.toLowerCase().includes(query) || 
            surah.arti.toLowerCase().includes(query) ||
            surah.nomor.toString() === query
          )
          .limit(5)
          .toArray();
        
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching:', error);
      }
    };
    
    const debounce = setTimeout(performSearch, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);
  
  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      setSearchQuery('');
      setSearchResults([]);
    }
  };
  
  return (
    <header className="fixed w-full top-0 z-50 bg-white dark:bg-neutral-900 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 md:space-x-4">
            <button 
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu size={24} className="text-neutral-700 dark:text-neutral-200" />
            </button>
            
            <Link to="/" className="text-xl font-semibold text-primary-500">
              {getPageTitle()}
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`py-2 border-b-2 ${
                location.pathname === '/' 
                  ? 'border-primary-500 text-primary-500' 
                  : 'border-transparent hover:text-primary-500'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/bookmarks" 
              className={`py-2 border-b-2 ${
                location.pathname === '/bookmarks' 
                  ? 'border-primary-500 text-primary-500' 
                  : 'border-transparent hover:text-primary-500'
              }`}
            >
              Bookmarks
            </Link>
            <Link 
              to="/settings" 
              className={`py-2 border-b-2 ${
                location.pathname === '/settings' 
                  ? 'border-primary-500 text-primary-500' 
                  : 'border-transparent hover:text-primary-500'
              }`}
            >
              Settings
            </Link>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
              onClick={handleSearchToggle}
            >
              {isSearchOpen ? (
                <X size={22} className="text-neutral-700 dark:text-neutral-200" />
              ) : (
                <Search size={22} className="text-neutral-700 dark:text-neutral-200" />
              )}
            </button>
            
            <button 
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
              onClick={toggleTheme}
            >
              {isDarkMode ? (
                <Sun size={22} className="text-neutral-200" />
              ) : (
                <Moon size={22} className="text-neutral-700" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-white dark:bg-neutral-800 shadow-md py-2">
              <div className="container mx-auto px-4">
                <nav className="flex flex-col space-y-2">
                  <Link 
                    to="/" 
                    className={`p-2 rounded ${
                      location.pathname === '/' 
                        ? 'bg-primary-50 dark:bg-primary-900 text-primary-500' 
                        : 'hover:bg-neutral-100 dark:hover:bg-neutral-700'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link 
                    to="/bookmarks" 
                    className={`p-2 rounded ${
                      location.pathname === '/bookmarks' 
                        ? 'bg-primary-50 dark:bg-primary-900 text-primary-500' 
                        : 'hover:bg-neutral-100 dark:hover:bg-neutral-700'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Bookmarks
                  </Link>
                  <Link 
                    to="/settings" 
                    className={`p-2 rounded ${
                      location.pathname === '/settings' 
                        ? 'bg-primary-50 dark:bg-primary-900 text-primary-500' 
                        : 'hover:bg-neutral-100 dark:hover:bg-neutral-700'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Settings
                  </Link>
                </nav>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Search Panel */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            className="absolute top-full left-0 right-0 bg-white dark:bg-neutral-800 shadow-md z-50"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="container mx-auto p-4">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search surah by name, number or meaning..."
                  className="input w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
              
              {searchResults.length > 0 && (
                <div className="max-h-64 overflow-y-auto">
                  {searchResults.map(result => (
                    <Link 
                      key={result.nomor}
                      to={`/surah/${result.nomor}`}
                      className="block p-3 border-b border-neutral-100 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-lg font-medium">
                            {result.namaLatin} ({result.nomor})
                          </div>
                          <div className="text-sm text-neutral-600 dark:text-neutral-300">
                            {result.arti}
                          </div>
                        </div>
                        <div className="text-xl font-arabic">
                          {result.nama}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              
              {searchQuery.length >= 2 && searchResults.length === 0 && (
                <div className="p-4 text-center text-neutral-600 dark:text-neutral-300">
                  No results found for "{searchQuery}"
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;