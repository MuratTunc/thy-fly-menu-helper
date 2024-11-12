'use client';
import { useState, useRef } from 'react';
import { translate } from './translate';
import { languages } from './languages';
import { images } from './images';
import Tesseract from 'tesseract.js';
import Image from 'next/image';
import type { StaticImageData } from 'next/image';

interface HeroProps {
  imgData: StaticImageData | string;
  imgAlt: string;
  title: string;
}

interface MenuItem {
  name: string;
  description: string;
}

export default function Hero(props: HeroProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [language, setLanguage] = useState<string>('en'); // Default language
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLanguageSelect = (code: string) => {
    setLanguage(code);
    setIsDropdownOpen(false);
  };

  const handleImageClick = (image: string): void => {
    extractTextFromImage(image);
  };

  const extractTextFromImage = async (image: string): Promise<void> => {
    const imgElement = document.createElement('img');
    imgElement.src = image;

    imgElement.onload = () => {
      const canvas = canvasRef.current;
      if (canvas && imgElement.complete) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const imageWidth = imgElement.width;
          const imageHeight = imgElement.height;

          const cropX = imageWidth / 2;
          const cropWidth = imageWidth / 2;

          canvas.width = cropWidth;
          canvas.height = imageHeight;

          ctx.drawImage(imgElement, cropX, 0, cropWidth, imageHeight, 0, 0, cropWidth, imageHeight);

          Tesseract.recognize(
            canvas,
            'eng',
            { logger: (m) => console.log(m) }
          ).then(async ({ data: { text } }) => {
            console.log('Extracted Text:', text);
            const translatedExtractedText = await translate(text, language);
            parseMenuItems(translatedExtractedText);
          });
        }
      }
    };
  };

  const parseMenuItems = async (text: string) => {
    const lines = text.split('\n');
    const items: MenuItem[] = [];

    for (const line of lines) {
        const itemName = line.trim();
        items.push({ name: itemName, description: '' });
    }

    setMenuItems(items);
  };

  return (
    <div className="relative h-screen">
      {/* Background Image */}
      <div className="absolute -z-10 inset-0">
        <Image
          src={props.imgData}
          alt={props.imgAlt}
          fill
          priority
          style={{ objectFit: 'cover' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900" />
      </div>

      {/* Centered Title */}
      <div className="pt-48 flex justify-center items-center">
        <h1 className="text-white text-6xl">{props.title}</h1>
      </div>

      {/* Centered Thumbnails */}
      <div className="flex justify-center items-center gap-4 mt-6">
        {images.map((image) => (
          <div key={image} onClick={() => handleImageClick(image)}>
            <Image
              src={image}
              alt={image}
              width={100}
              height={100}
              className="hover:scale-110 transition-transform"
            />
          </div>
        ))}
      </div>

      {/* Language Selection Button Below Thumbnails */}
      <div className="flex justify-center mt-6">
        <button
          onClick={toggleDropdown}
          className="bg-blue-500 text-white p-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
        >
          Select Language
        </button>
        {isDropdownOpen && (
          <div className="absolute mt-2 bg-white shadow-lg rounded-md overflow-hidden z-50">
            {languages.map((lang) => (
              <div
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className="cursor-pointer px-4 py-2 hover:bg-blue-100"
              >
                {lang.name} ({lang.code})
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Menu Items Display */}
      {menuItems.length > 0 && (
        <div className="absolute top-1 right-5 p-3 bg-black bg-opacity-70 text-white rounded-lg max-w-xs">
          <h3 className="font-bold mb-2">Menu Items:</h3>
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="mb-1 p-2 bg-gray-700 rounded cursor-pointer hover:bg-gray-600 flex justify-center items-center h-10"
              onClick={() => handleImageClick(item.name)}
            >
              {item.name}
            </div>
          ))}
        </div>
      )}

      {/* Hidden Canvas */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
