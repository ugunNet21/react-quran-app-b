import { db, Bookmark } from './db';

// Add a bookmark
export const addBookmark = async (bookmark: Omit<Bookmark, 'id' | 'timestamp'>): Promise<number> => {
  try {
    const newBookmark: Omit<Bookmark, 'id'> = {
      ...bookmark,
      timestamp: Date.now()
    };
    
    const id = await db.bookmarks.add(newBookmark);
    return id;
  } catch (error) {
    console.error('Error adding bookmark:', error);
    throw error;
  }
};

// Get all bookmarks
export const getBookmarks = async (): Promise<Bookmark[]> => {
  try {
    const bookmarks = await db.bookmarks
      .orderBy('timestamp')
      .reverse()
      .toArray();
    return bookmarks;
  } catch (error) {
    console.error('Error getting bookmarks:', error);
    throw error;
  }
};

// Remove a bookmark
export const removeBookmark = async (id: number): Promise<void> => {
  try {
    await db.bookmarks.delete(id);
  } catch (error) {
    console.error(`Error removing bookmark ${id}:`, error);
    throw error;
  }
};

// Check if a surah or ayat is bookmarked
export const isBookmarked = async (
  surahNumber: number,
  ayatNumber?: number
): Promise<boolean> => {
  try {
    if (ayatNumber) {
      // Check for specific ayat bookmark
      const count = await db.bookmarks
        .where({ surahNumber, ayatNumber })
        .count();
      return count > 0;
    } else {
      // Check for surah bookmark (with no ayatNumber)
      const count = await db.bookmarks
        .where('surahNumber')
        .equals(surahNumber)
        .filter(bookmark => bookmark.ayatNumber === undefined)
        .count();
      return count > 0;
    }
  } catch (error) {
    console.error('Error checking bookmark status:', error);
    return false;
  }
};