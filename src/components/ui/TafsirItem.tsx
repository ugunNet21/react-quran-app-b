import React from 'react';
import { motion } from 'framer-motion';
import { Tafsir } from '../../services/db';

interface TafsirItemProps {
  tafsir: Tafsir;
}

const TafsirItem: React.FC<TafsirItemProps> = ({ tafsir }) => {
  // Convert HTML entities to their actual characters
  const processText = (text: string) => {
    const div = document.createElement('div');
    div.innerHTML = text;
    return div.textContent || div.innerText || '';
  };
  
  return (
    <motion.div 
      className="card my-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center mb-3">
        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-500 font-medium text-sm">
          {tafsir.ayat}
        </div>
        <h3 className="font-medium ml-2">Tafsir Ayat {tafsir.ayat}</h3>
      </div>
      
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
          {processText(tafsir.teks)}
        </p>
      </div>
    </motion.div>
  );
};

export default TafsirItem;