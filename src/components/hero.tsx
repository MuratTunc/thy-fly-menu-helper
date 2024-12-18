'use client';
import { useState, useRef, useEffect } from 'react';
import { translate } from './translate';
import { languages } from './languages';
import { chatbotanswer } from './chatbotanswer';
import { images } from './images';
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
  const dropdownRef = useRef<HTMLDivElement | null>(null);


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
    // Remove the leading slash from the image name, if it exists
    const imageName = image.replace(/^\/+/, '');
  
    // Log the cleaned image name to the console
    console.log('Image clicked:', imageName);
    
    // Clear previous selections and chatbot text
    setSelectedItems([]);
    setSelectedMenuItems([]);
    setUserQuery('');
    setAiResponse('');
    
    setLoading(true);
    fetchMenuItemsFromBackend(imageName,language); // Fetch menu items from the backend
  };
  

  const fetchMenuItemsFromBackend = async (imageName: string, language_code: string): Promise<void> => {
    try {
      const response = await fetch('https://mutubackend.com/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageName: imageName,
          language_code: language_code,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch menu items from the backend');
      }
  
      // Parse the JSON response
      const data = await response.json();
      //console.log('Backend Response:', data); // Debugging
  
      // Ensure `translatedText` exists and is a string
      if (data.translatedText && typeof data.translatedText === 'string') {
        parseMenuItems(data.translatedText); // Pass the translated text to `parseMenuItems`
      } else {
        console.error('Unexpected response structure:', data);
      }
  
    } catch (error) {
      console.error('Error fetching menu items:', error);
      setLoading(false); // Ensure loading stops on error
    }
  };
  

  const parseMenuItems = (extractedText: string) => {
    if (typeof extractedText !== 'string') {
      console.error('Invalid extracted text format:', extractedText);
      return;
    }
  
    // Split text into clean lines
    const lines = extractedText
      .split('\n') // Split by newlines
      .map((line) => line.trim()) // Remove extra spaces
      .filter((line) => line.length > 0); // Remove empty lines
  
    //console.log('Parsed Lines:', lines);
  
    // Parsing logic to construct menu items
    const parsedItems: MenuItem[] = [];
    let currentItem: MenuItem | null = null;
  
    for (const line of lines) {
      // Skip irrelevant headers or sections
      //if (line.match(/menu|Your selection will be served with pleasure by our cabin crew|at your preferred time|dine on demand|before landing|prepared in accordance|thank you/i)) {
        //continue;
      //}
  
      if (line.includes('-')) {
        // Split lines with `-` into name and description
        const [name, ...descriptionParts] = line.split('-');
        currentItem = {
          name: name.trim(),
          description: descriptionParts.join('-').trim(),
        };
        parsedItems.push(currentItem);
      } else if (currentItem) {
        // Append additional lines to the description
        currentItem.description += ` ${line}`;
      } else {
        // Treat standalone lines as menu items with no description
        parsedItems.push({
          name: line,
          description: '',
        });
      }
    }
  
    //console.log('Parsed Menu Items:', parsedItems);
    setMenuItems(parsedItems); // Update the state
    setLoading(false); // Stop loading
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
        console.error('Error :setAiResponse', error);
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
