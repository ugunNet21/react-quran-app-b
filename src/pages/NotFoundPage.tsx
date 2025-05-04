import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center">
      <div className="font-arabic text-6xl text-primary-500 mb-4">٤٠٤</div>
      <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
      <p className="text-neutral-600 dark:text-neutral-300 mb-6">
        The page you are looking for does not exist.
      </p>
      <Link to="/" className="btn btn-primary inline-flex items-center">
        <Home size={18} className="mr-2" />
        Return Home
      </Link>
    </div>
  );
};

export default NotFoundPage;