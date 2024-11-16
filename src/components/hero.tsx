'use client';
import { useState, useRef, useEffect } from 'react';
import { translate } from './translate';
import { languages } from './languages';
import { chatbotanswer } from './chatbotanswer';
import { images } from './images';
import Tesseract from 'tesseract.js';
import Image from 'next/image';
import type { StaticImageData } from 'next/image';
import { ReactNode } from 'react';

interface HeroProps {
  imgData: StaticImageData | string;
  imgAlt: string;
  title: ReactNode;  // Change from 'string' to 'ReactNode'
}

interface MenuItem {
  name: string;
  description: string;
}

export default function Hero(props: HeroProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedMenuItems, setSelectedMenuItems] = useState<MenuItem[]>([]);
  const [language, setLanguage] = useState<string>('en');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [userQuery, setUserQuery] = useState(''); // State for user input
  const [aiResponse, setAiResponse] = useState<string>(''); // State for AI response
  const [selectLabel, setSelectLabel] = useState('Select');
  const [deselectLabel, setDeselectLabel] = useState('Deselect');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Cache for OCR results, using localStorage
  const getOcrCache = () => {
    const cache = localStorage.getItem('ocrCache');
    return cache ? JSON.parse(cache) : {};
  };

  const setOcrCache = (cache: { [key: string]: string }) => {
    localStorage.setItem('ocrCache', JSON.stringify(cache));
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLanguageSelect = async (code: string) => {
    setLanguage(code);
    setIsDropdownOpen(false);
  
    // Translate the button labels
    const translatedSelect = await translate('Select', code);
    const translatedDeselect = await translate('Deselect', code);
  
    setSelectLabel(translatedSelect);
    setDeselectLabel(translatedDeselect);
  };

  const getLanguageName = (code: string) => {
    const lang = languages.find((lang) => lang.code === code);
    return lang ? lang.name : 'Select Language';
  };

  const handleImageClick = (image: string): void => {
    // Clear previous selections and chatbot text
    setSelectedItems([]);
    setSelectedMenuItems([]);
    setUserQuery('');
    setAiResponse('');
    
    setLoading(true);
    extractTextFromImage(image);
  };

  const extractTextFromImage = async (image: string): Promise<void> => {
    const ocrCache = getOcrCache();
  
    // If OCR text is cached, use it
    if (ocrCache[image]) {
      // Only translate if the selected language is not English
      const textToParse = language === 'en' ? ocrCache[image] : await translate(ocrCache[image], language);
      parseMenuItems(textToParse);
      setLoading(false);
      return;
    }
  
    try {
      const imgElement = document.createElement('img');
      imgElement.src = image;
  
      imgElement.onload = async () => {
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
  
            // Perform OCR using Tesseract
            const { data: { text } } = await Tesseract.recognize(canvas, 'eng');
  
            // Adding a 5-second wait after OCR
            //await new Promise(resolve => setTimeout(resolve, 5000)); // 5000ms = 5 seconds
  
            // Cache the extracted text for future use
            ocrCache[image] = text;
            setOcrCache(ocrCache);
  
            // If the language is not English, translate the text before parsing
            const textToParse = language === 'en' ? text : await translate(text, language);
            parseMenuItems(textToParse);
            setLoading(false);
          }
        }
      };
    } catch (error) {
      setLoading(false);
    }
  };
  

  const parseMenuItems = (text: string) => {
    const lines = text.split('\n');
    const items: MenuItem[] = [];
  
    for (const line of lines) {
      const itemName = line.trim();
  
      // Only add items that are longer than 1 character
      if (itemName.length > 1) {
        items.push({ name: itemName, description: '' });
      }
    }
  
    setMenuItems(items);
  };

  const toggleItemSelection = async (index: number): Promise<void> => {
    const updatedSelectedItems = selectedItems.includes(index)
      ? selectedItems.filter((i) => i !== index)
      : [...selectedItems, index];
  
    setSelectedItems(updatedSelectedItems);
  
    const updatedSelectedMenuItems = menuItems.filter((_, i) =>
      updatedSelectedItems.includes(i)
    );
    setSelectedMenuItems(updatedSelectedMenuItems); // Update selected menu items based on toggle
  
    // Send the selected item(s) to the chatbot
    if (updatedSelectedMenuItems.length > 0) {
      const selectedItemsText = updatedSelectedMenuItems.map(item => item.name).join(', ');
       const text_helper="Could you provide the diet properties, gluten-free status, and calorie values for them?";
      // Translate the text
      const translatedHelper = await translate(text_helper, language);
      await waitOneSecond();
      const queryText = `${selectedItemsText}. ${translatedHelper}?`;
      setUserQuery(queryText);  // Update the user query
      handleUserQuery(queryText);  // Trigger the chatbot with the updated user input
    }
  };

  function waitOneSecond(): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 1000); // 1000 milliseconds = 1 second
    });
}
  

  const handleOutsideClick = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  };

  const handleUserQuery = async (queryText: string) => {
    if (queryText.trim()) {
      
      setAiResponse('AI is typing...');
  
      try {
        const response = await chatbotanswer(queryText);  // Pass the correct user input
        setAiResponse(response);  // Update UI with the AI response
      } catch (error) {
        setAiResponse('Sorry, there was an error with the AI service.');
      }
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

       {/* Loading Spinner */}
  {loading && (
    <div className="absolute inset-0 flex justify-center items-center z-20">
      <div className="w-16 h-16 border-4 border-t-4 border-gray-300 rounded-e-md animate-spin"></div>
    </div>
  )}

      {/* Centered Title */}
  <div className={`pt-48 flex justify-center items-center ${loading ? 'opacity-50' : ''}`}>
    <h1 className="text-white text-4xl sm:text-6xl">{props.title}</h1>
  </div>

      {/* Centered Thumbnails */}
  <div className={`flex justify-center items-center gap-4 mt-6 flex-wrap ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
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
    className="bg-blue-500 text-white p-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-200 w-56" // w-56 for wider button
    aria-expanded={isDropdownOpen}
    aria-controls="language-dropdown"
  >
    {getLanguageName(language)} {/* Display the selected language name */}
  </button>
  {isDropdownOpen && (
    <div
      id="language-dropdown"
      ref={dropdownRef}
      className="absolute mt-2 bg-white rounded-lg shadow-lg w-56 max-h-60 overflow-y-auto"
    >
      {languages.map((lang) => (
        <div
          key={lang.code}
          className="p-2 hover:bg-gray-200 cursor-pointer"
          onClick={() => handleLanguageSelect(lang.code)}
        >
          {lang.name}
        </div>
      ))}
    </div>
  )}
</div>

{/* Selected Items Under Language Button */}
<div className="flex justify-center mt-4">
  {selectedMenuItems.length > 0 && (
    <div className="text-white">
      <ul className="list-none space-y-2">
        {selectedMenuItems.map((item, index) => (
          <li key={index} className="text-white font-bold">
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  )}
</div>

   
 {/* Menu Items on the Right */}
<div className="absolute right-0 bottom-20 w-1/3 max-w-lg px-6 overflow-y-auto max-h-80">
  {loading ? (
    <div className="text-center text-white font-bold">Loading...</div>
  ) : (
    <ul className="list-none space-y-4">
      {menuItems.map((item, index) => (
        <li
          key={index}
          className={`flex items-center justify-between font-bold ${
            selectedItems.includes(index) ? 'bg-green-800 text-green-200' : 'text-white'
          }`}
        >
          <span>{item.name}</span>
          <button
            onClick={() => toggleItemSelection(index)}
            className={`p-2 rounded-lg transition-colors ${
              selectedItems.includes(index) ? 'bg-blue-500' : 'bg-gray-700'
            }`}
          >
            {selectedItems.includes(index) ? deselectLabel : selectLabel}
          </button>
        </li>
      ))}
    </ul>
  )}
</div>


      {/* User Input & AI Response */}
<div className="absolute bottom-5 left-5 right-5 bg-white p-4 rounded-lg shadow-lg max-w-lg mx-auto">
  <textarea
    value={userQuery}
    onChange={(e) => setUserQuery(e.target.value)}
    className="w-full p-2 border rounded-lg resize-none"
    rows={3}
    onKeyDown={(e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleUserQuery(userQuery);
      }
    }}
    placeholder="Ask me about the menu..."
  />
  <div className="mt-4 text-gray-700 max-h-16 overflow-y-auto">
    {aiResponse}
  </div>
</div>


    </div>
  );
}
