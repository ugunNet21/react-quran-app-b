import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Bookmark } from '../services/db';
import { Trash2, BookOpen, Bookmark as BookmarkIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { removeBookmark } from '../services/bookmarkService';

const BookmarksPage: React.FC = () => {
  const [deleting, setDeleting] = useState<number | null>(null);
  
  // Fetch bookmarks from database
  const bookmarks = useLiveQuery(() => {
    return db.bookmarks.orderBy('timestamp').reverse().toArray();
  }, []);
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const handleDeleteBookmark = async (id: number) => {
    try {
      setDeleting(id);
      await removeBookmark(id);
    } catch (error) {
      console.error('Error removing bookmark:', error);
    } finally {
      setDeleting(null);
    }
  };
  
  return (
    <div className="py-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Bookmarks</h1>
        <p className="text-neutral-600 dark:text-neutral-300">
          Your saved surahs and ayats
        </p>
      </div>
      
      {bookmarks && bookmarks.length > 0 ? (
        <div className="space-y-4">
          <AnimatePresence>
            {bookmarks.map((bookmark) => (
              <motion.div
                key={bookmark.id}
                className="card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                layout
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center mb-1">
                      <BookmarkIcon size={16} className="text-secondary-500 mr-2" />
                      <h3 className="font-semibold">{bookmark.title}</h3>
                    </div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Bookmarked on {formatDate(bookmark.timestamp)}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Link
                      to={bookmark.ayatNumber 
                        ? `/surah/${bookmark.surahNumber}#ayat-${bookmark.ayatNumber}`
                        : `/surah/${bookmark.surahNumber}`
                      }
                      className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-500"
                    >
                      <BookOpen size={18} />
                    </Link>
                    
                    <button
                      onClick={() => bookmark.id && handleDeleteBookmark(bookmark.id)}
                      className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-error-50 hover:text-error-500 dark:hover:text-error-400"
                      disabled={deleting === bookmark.id}
                    >
                      <Trash2 size={18} className={deleting === bookmark.id ? 'animate-pulse' : ''} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-neutral-800 rounded-xl shadow-md">
          <BookmarkIcon size={48} className="mx-auto mb-4 text-neutral-300 dark:text-neutral-600" />
          <h3 className="text-lg font-medium mb-1">No bookmarks yet</h3>
          <p className="text-neutral-500 dark:text-neutral-400 mb-4">
            Bookmark your favorite surahs and ayats for quick access
          </p>
          <Link to="/" className="btn btn-primary">
            Browse Quran
          </Link>
        </div>
      )}
    </div>
  );
};

export default BookmarksPage;