import React from 'react';
import { useAudioStore, QariType } from '../../stores/audioStore';

const QariSelector: React.FC = () => {
  const { selectedQari, setQari } = useAudioStore();
  
  const qariOptions: { id: QariType; name: string }[] = [
    { id: '01', name: 'Abdullah Al-Juhany' },
    { id: '02', name: 'Abdul Muhsin Al-Qasim' },
    { id: '03', name: 'Abdurrahman as-Sudais' },
    { id: '04', name: 'Ibrahim Al-Dossari' },
    { id: '05', name: 'Misyari Rasyid Al-Afasi' },
  ];
  
  const handleQariChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQari(e.target.value as QariType);
  };
  
  return (
    <div className="flex items-center space-x-3">
      <label htmlFor="qari-select" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
        Qari:
      </label>
      <select
        id="qari-select"
        className="input text-sm py-1"
        value={selectedQari}
        onChange={handleQariChange}
      >
        {qariOptions.map(qari => (
          <option key={qari.id} value={qari.id}>
            {qari.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default QariSelector;