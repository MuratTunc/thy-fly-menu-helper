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
          <option value="eng">English (US)</option>
          <option value="eng-GB">English (UK)</option>
          <option value="spa">Spanish (Spain)</option>
          <option value="spa-MX">Spanish (Mexico)</option>
          <option value="fra">French (France)</option>
          <option value="deu">German (Germany)</option>
          <option value="ita">Italian (Italy)</option>
          <option value="jpn">Japanese (Japan)</option>
          <option value="kor">Korean (South Korea)</option>
          <option value="zho">Chinese (China)</option>
          <option value="rus">Russian (Russia)</option>
          <option value="por">Portuguese (Brazil)</option>
          <option value="ara">Arabic (Saudi Arabia)</option>
          <option value="hin">Hindi (India)</option>
          <option value="tur">Turkish (Turkey)</option>
          <option value="pol">Polish (Poland)</option>
          <option value="dut">Dutch (Netherlands)</option>
          <option value="swe">Swedish (Sweden)</option>
          <option value="nor">Norwegian (Norway)</option>
          <option value="dan">Danish (Denmark)</option>
          <option value="fin">Finnish (Finland)</option>
          <option value="hun">Hungarian (Hungary)</option>
          <option value="che">Czech (Czech Republic)</option>
          <option value="gre">Greek (Greece)</option>
          <option value="bul">Bulgarian (Bulgaria)</option>
          <option value="ukr">Ukrainian (Ukraine)</option>
          <option value="rom">Romanian (Romania)</option>
          <option value="slk">Slovak (Slovakia)</option>
          <option value="lit">Lithuanian (Lithuania)</option>
          <option value="est">Estonian (Estonia)</option>
          <option value="lat">Latvian (Latvia)</option>
          <option value="ben">Bengali (Bangladesh, India)</option>
          <option value="guj">Gujarati (India)</option>
          <option value="pan">Punjabi (India, Pakistan)</option>
          <option value="mar">Marathi (India)</option>
          <option value="tam">Tamil (India, Sri Lanka)</option>
          <option value="tel">Telugu (India)</option>
          <option value="mal">Malayalam (India)</option>
          <option value="kan">Kannada (India)</option>
          <option value="ori">Odia (India)</option>
          <option value="ass">Assamese (India)</option>
          <option value="sin">Sinhala (Sri Lanka)</option>
          <option value="my">Burmese (Myanmar)</option>
          <option value="khm">Khmer (Cambodia)</option>
          <option value="vnm">Vietnamese (Vietnam)</option>
          <option value="tha">Thai (Thailand)</option>
          <option value="ind">Indonesian (Indonesia)</option>
          <option value="mlt">Maltese (Malta)</option>
          <option value="tgl">Tagalog (Philippines)</option>
          <option value="ceb">Cebuano (Philippines)</option>
          <option value="haw">Haitian Creole (Haiti)</option>
          <option value="nld">Dutch (Belgium, Netherlands)</option>
          <option value="swa">Swahili (Kenya, Tanzania)</option>
          <option value="som">Somali (Somalia)</option>
          <option value="yor">Yoruba (Nigeria)</option>
          <option value="hau">Hausa (Nigeria, Niger)</option>
          <option value="ibo">Igbo (Nigeria)</option>
          <option value="am">Amharic (Ethiopia)</option>
          <option value="uzb">Uzbek (Uzbekistan)</option>
          <option value="geo">Georgian (Georgia)</option>
          <option value="arm">Armenian (Armenia)</option>
          <option value="alb">Albanian (Albania)</option>
          <option value="mac">Macedonian (North Macedonia)</option>
          <option value="ser">Serbian (Serbia)</option>
          <option value="bos">Bosnian (Bosnia and Herzegovina)</option>
          <option value="mlg">Malagasy (Madagascar)</option>
          <option value="nep">Nepali (Nepal)</option>
          <option value="bel">Belarusian (Belarus)</option>
          <option value="kaz">Kazakh (Kazakhstan)</option>
          <option value="kir">Kyrgyz (Kyrgyzstan)</option>
          <option value="taj">Tajik (Tajikistan)</option>
          <option value="turkmen">Turkmen (Turkmenistan)</option>
          <option value="mng">Mongolian (Mongolia)</option>
          <option value="qu">Quechua (South America)</option>
          <option value="aym">Aymara (Bolivia, Peru)</option>
          <option value="guaran">Guarani (Paraguay)</option>
          <option value="chinese">Chinese (Simplified)</option>
          <option value="chinese-traditional">Chinese (Traditional)</option>
          <option value="twi">Twi (Ghana)</option>
          <option value="haw">Hawaiian (Hawaii)</option>
          <option value="som">Somali (Somalia)</option>
          <option value="kat">Kazakh (Kazakhstan)</option>
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
