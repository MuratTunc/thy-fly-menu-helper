'use client';
import { useState } from 'react';

interface LanguageModalProps {
  toggleModal: () => void;
}

export default function LanguageModal({ toggleModal }: LanguageModalProps) {
  const [language, setLanguage] = useState<string>('eng');

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
      <div className="bg-white p-6 rounded shadow-lg w-1/3">
        <h2 className="text-xl mb-4">Select Language</h2>
        <select
          value={language}
          onChange={handleLanguageChange}
          className="bg-gray-100 p-2 rounded w-full"
        >
          <option value="eng">English</option>
          <option value="spa">Spanish</option>
          <option value="fra">French</option>
          <option value="deu">German</option>
        </select>

        <div className="mt-4 flex justify-between">
          <button
            onClick={toggleModal}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
          <button
            onClick={toggleModal}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
