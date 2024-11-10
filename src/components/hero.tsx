'use client'
import { useState } from 'react';
import type { StaticImageData } from 'next/image';
import Image from 'next/image';

interface HeroProps {
  imgData: StaticImageData;
  imgAlt: string;
  title: string;
}

export default function Hero(props: HeroProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // List of images in the lower-right corner with updated names
  const images = [
    '/menu1.jpg',
    '/menu2.jpg',
    '/menu3.jpg',
    '/menu4.jpg',
  ];

  const handleImageClick = (image: string): void => {
    setSelectedImage(image);
  };

  return (
    <div className="relative h-screen">
      {/* Background Image and Gradient Overlay */}
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

      {/* Title Centered */}
      <div className="pt-48 flex justify-center items-center">
        <h1 className="text-white text-6xl">{props.title}</h1>
      </div>

      {/* Thumbnails in Lower-Right Corner */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          display: 'flex',
          gap: '10px',
        }}
      >
        {images.map((image) => (
          <div key={image} onClick={() => handleImageClick(image)}>
            <Image
              src={image}
              alt={image}
              width={80} // Thumbnail width
              height={80} // Thumbnail height
              style={{
                cursor: 'pointer',
                // Removed white border to avoid background
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // Optional shadow for style
              }}
            />
          </div>
        ))}
      </div>

      {/* Display Selected Image Name */}
      {selectedImage && (
        <div
          style={{
            position: 'absolute',
            bottom: '100px',
            right: '20px',
            padding: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            borderRadius: '8px',
          }}
        >
          <p>Selected Image: {selectedImage}</p>
        </div>
      )}
    </div>
  );
}