'use client';
import { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';
import Image from 'next/image';
import type { StaticImageData } from 'next/image';

interface HeroProps {
  imgData: StaticImageData | string;
  imgAlt: string;
  title: string;
}

export default function Hero(props: HeroProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const images = [
    '/menu1.png',
    '/menu2.png',
    '/menu3.png',
    '/menu4.png',
  ];

  const handleImageClick = (image: string): void => {
    setSelectedImage(image);
    extractTextFromImage(image);
  };

  const extractTextFromImage = (image: string): void => {
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
            {
              logger: (m) => console.log(m),
            }
          ).then(({ data: { text } }) => {
            setExtractedText(text);
          });
        }
      }
    };
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

      {/* Centered Thumbnails with Hover Enlarge Effect */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '15px',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {images.map((image) => (
          <div key={image} onClick={() => handleImageClick(image)}>
            <Image
              src={image}
              alt={image}
              width={100}
              height={100}
              style={{
                cursor: 'pointer',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                transition: 'transform 0.3s ease',
              }}
              className="hover:scale-150" // Increased the scale to 150%
            />
          </div>
        ))}
      </div>

      {/* Selected Image Name */}
      {selectedImage && (
        <div
          style={{
            position: 'absolute',
            bottom: '100px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            borderRadius: '8px',
          }}
        >
          <p>Selected Image: {selectedImage}</p>
        </div>
      )}

      {/* Extracted Text on the Right Side */}
      {extractedText && (
        <div
          style={{
            position: 'absolute',
            top: '20%',
            right: '20px',
            padding: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            borderRadius: '8px',
            maxWidth: '300px',
            overflowY: 'auto',
          }}
        >
          <h3>Extracted Text:</h3>
          <p>{extractedText}</p>
        </div>
      )}

      {/* Hidden Canvas for OCR Processing */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
