import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Bookmark, Settings } from 'lucide-react';

const BottomNav: React.FC = () => {
  const location = useLocation();
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-40">
      <div className="flex justify-around items-center h-16">
        <Link
          to="/"
          className={`flex flex-col items-center justify-center w-full h-full ${
            location.pathname === '/' ? 'text-primary-500' : 'text-neutral-500'
          }`}
        >
          <Home size={22} />
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link
          to="/bookmarks"
          className={`flex flex-col items-center justify-center w-full h-full ${
            location.pathname === '/bookmarks' ? 'text-primary-500' : 'text-neutral-500'
          }`}
        >
          <Bookmark size={22} />
          <span className="text-xs mt-1">Bookmarks</span>
        </Link>
        
        <Link
          to="/settings"
          className={`flex flex-col items-center justify-center w-full h-full ${
            location.pathname === '/settings' ? 'text-primary-500' : 'text-neutral-500'
          }`}
        >
          <Settings size={22} />
          <span className="text-xs mt-1">Settings</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNav;