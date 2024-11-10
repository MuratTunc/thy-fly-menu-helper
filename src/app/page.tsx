'use client'
import homeImg from 'public/home_3.jpg';
import Hero from '@/components/hero';
import { useState } from 'react';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // List of 4 images to display as clickable thumbnails
  const images = [
    'menu1.jpg',
    'menu2.jpg',
    'menu3.jpg',
    'menu4.jpg',
  ];

  const handleImageClick = (image: string) => {
    setSelectedImage(image); // Set the selected image
  };
  return (
    <Hero
      imgData={homeImg}
      imgAlt="FLY MENU ASSISTANT"
      title="Welcome to flight menu selection"
      
    />
    

  );
}