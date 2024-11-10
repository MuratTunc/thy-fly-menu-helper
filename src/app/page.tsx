'use client'
import homeImg from 'public/home_3.jpg';
import Hero from '@/components/hero';
import LanguageModal from '@/components/languageModal'; // Import LanguageModal
import { useState } from 'react';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Function to open/close modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="relative">
     

      {/* Hero Component */}
      <Hero
        imgData={homeImg}
        imgAlt="FLY MENU ASSISTANT"
        title="Welcome to flight menu selection"
      />

      {/* Main Language Selection Button */}
      <div className="fixed bottom-10 right-10 z-50">
        <button
          onClick={toggleModal}
          className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition duration-200"
        >
          Select Language
        </button>
      </div>

      {/* Language Modal Component */}
      {isModalOpen && <LanguageModal toggleModal={toggleModal} />}
    </div>
  );
}
