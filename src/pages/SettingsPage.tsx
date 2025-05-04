import React from 'react';
import { Moon, Sun, Volume2, RefreshCcw, Database, Info } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';
import { useAudioStore, QariType } from '../stores/audioStore';
import { motion } from 'framer-motion';
import { syncQuranData } from '../services/syncService';

const SettingsPage: React.FC = () => {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { volume, selectedQari, setVolume, setQari } = useAudioStore();
  const [syncing, setSyncing] = React.useState(false);
  const [syncSuccess, setSyncSuccess] = React.useState(false);
  const [syncError, setSyncError] = React.useState<string | null>(null);
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value) / 100;
    setVolume(newVolume);
  };
  
  const handleQariChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQari(e.target.value as QariType);
  };
  
  const handleSyncData = async () => {
    setSyncing(true);
    setSyncSuccess(false);
    setSyncError(null);
    
    try {
      await syncQuranData();
      setSyncSuccess(true);
    } catch (error) {
      console.error('Error syncing data:', error);
      setSyncError((error as Error).message || 'Failed to sync data');
    } finally {
      setSyncing(false);
    }
  };
  
  return (
    <div className="py-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-neutral-600 dark:text-neutral-300">
          Customize your Quran app experience
        </p>
      </div>
      
      <div className="space-y-6">
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-lg font-semibold mb-4">Appearance</h2>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isDarkMode ? (
                <Moon size={20} className="text-secondary-500" />
              ) : (
                <Sun size={20} className="text-secondary-500" />
              )}
              <span>Dark Mode</span>
            </div>
            
            <div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={isDarkMode}
                  onChange={toggleTheme}
                />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-primary-500"></div>
              </label>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h2 className="text-lg font-semibold mb-4">Audio Settings</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Volume2 size={20} className="text-primary-500" />
                <span>Audio Volume</span>
              </div>
              
              <div className="w-40">
                <input
                  type="range"
                  className="w-full accent-primary-500"
                  min="0"
                  max="100"
                  value={volume * 100}
                  onChange={handleVolumeChange}
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                <Volume2 size={20} className="text-primary-500" />
                <span>Default Qari</span>
              </div>
              
              <div className="w-full sm:w-60">
                <select 
                  className="input"
                  value={selectedQari}
                  onChange={handleQariChange}
                >
                  <option value="01">Abdullah Al-Juhany</option>
                  <option value="02">Abdul Muhsin Al-Qasim</option>
                  <option value="03">Abdurrahman as-Sudais</option>
                  <option value="04">Ibrahim Al-Dossari</option>
                  <option value="05">Misyari Rasyid Al-Afasi</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold mb-4">Data Management</h2>
          
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-1">
                  <Database size={20} className="text-primary-500" />
                  <span className="font-medium">Sync Data</span>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 ml-8">
                  Update Quran data from the server
                </p>
              </div>
              
              <button
                onClick={handleSyncData}
                disabled={syncing}
                className={`px-4 py-2 rounded-lg text-white ${
                  syncing 
                    ? 'bg-neutral-400 dark:bg-neutral-600' 
                    : 'bg-primary-500 hover:bg-primary-600'
                }`}
              >
                <div className="flex items-center">
                  <RefreshCcw size={18} className={`mr-2 ${syncing ? 'animate-spin' : ''}`} />
                  {syncing ? 'Syncing...' : 'Sync Now'}
                </div>
              </button>
            </div>
            
            {syncSuccess && (
              <div className="p-3 bg-success-500/10 text-success-500 rounded-lg">
                Data synchronized successfully!
              </div>
            )}
            
            {syncError && (
              <div className="p-3 bg-error-500/10 text-error-500 rounded-lg">
                {syncError}
              </div>
            )}
          </div>
        </motion.div>
        
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold mb-4">About</h2>
          
          <div className="space-y-3">
            <div className="flex items-start">
              <Info size={20} className="text-primary-500 mt-0.5 mr-3" />
              <div>
                <h3 className="font-medium">Quran App</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Version 1.0.0
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Database size={20} className="text-primary-500 mt-0.5 mr-3" />
              <div>
                <h3 className="font-medium">Data Source</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  equran.id API
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;