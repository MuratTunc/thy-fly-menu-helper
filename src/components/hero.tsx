'use client';
import { useState, useRef, useEffect } from 'react';
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
  const [selectedMenuItems, setSelectedMenuItems] = useState<MenuItem[]>([]); // New state for selected items
  const [language, setLanguage] = useState<string>('en');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLanguageSelect = (code: string) => {
    setLanguage(code);
    setIsDropdownOpen(false);
  };

  const handleImageClick = (image: string): void => {
    setSelectedItems([]);
    setLoading(true);
    extractTextFromImage(image);
  };

  const extractTextFromImage = async (image: string): Promise<void> => {
    try {
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

            Tesseract.recognize(canvas, 'eng', { logger: (m) => console.log(m) })
              .then(async ({ data: { text } }) => {
                const translatedExtractedText = await translate(text, language);
                parseMenuItems(translatedExtractedText);
                setLoading(false);
              });
          }
        }
      };
    } catch (error) {
      console.error('Error extracting text from image:', error);
      setLoading(false);
    }
  };

  const parseMenuItems = (text: string) => {
    const lines = text.split('\n');
    const items: MenuItem[] = [];

    for (const line of lines) {
      const itemName = line.trim();
      items.push({ name: itemName, description: '' });
    }

    setMenuItems(items);
  };

  const toggleItemSelection = (index: number) => {
    const updatedSelectedItems = selectedItems.includes(index)
      ? selectedItems.filter((i) => i !== index)
      : [...selectedItems, index];

    setSelectedItems(updatedSelectedItems);

    const updatedSelectedMenuItems = menuItems.filter((_, i) => updatedSelectedItems.includes(i));
    setSelectedMenuItems(updatedSelectedMenuItems); // Update selected menu items based on toggle
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isDropdownOpen]);

    // Other imports and code remain unchanged

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
            width={150}
            height={100}
            className="hover:scale-110 transition-transform"
          />
        </div>
      ))}
    </div>

    {/* Language Selection Button */}
    <div className="flex justify-center mt-6">
      <button
        onClick={toggleDropdown}
        className="bg-blue-500 text-white p-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
        aria-expanded={isDropdownOpen}
        aria-controls="language-dropdown"
      >
        Select Language
      </button>
      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute mt-2 bg-white shadow-lg rounded-md overflow-hidden z-50 max-h-96 overflow-y-auto"
        >
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

    {/* Selected Menu Items Display - Position updated to appear below Language Selection */}
    {selectedMenuItems.length > 0 && (
      <div className="flex justify-center mt-4">
        <div className="p-3 bg-black-500 text-white rounded-lg max-w-xs max-h-fill overflow-y-auto">
          {selectedMenuItems.map((item, index) => (
            <div key={index} className="mb-1 p-2 rounded  bg-green-700 cursor-pointer flex justify-center items-center h-10">
              {item.name}
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Loading Spinner */}
    {loading && (
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="loader border-t-4 border-blue-500 rounded-full w-16 h-16 animate-spin"></div>
      </div>
    )}

    {/* Menu Items Display */}
    {menuItems.length > 0 && (
      <div className="absolute top-1 right-5 p-3 bg-black bg-opacity-70 text-white rounded-lg max-w-xs max-h-full overflow-y-auto">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`mb-1 p-2 rounded cursor-pointer flex justify-center items-center h-10 ${
              selectedItems.includes(index) ? 'bg-green-500' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            onClick={() => toggleItemSelection(index)}
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
