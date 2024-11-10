'use client'
import { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';
import Image from 'next/image';
import type { StaticImageData } from 'next/image';


interface HeroProps {
  imgData: StaticImageData | string;  // Update to accept both StaticImageData and string
  imgAlt: string;
  title: string;
}
export default function Hero(props: HeroProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // List of images to select from (stored under public folder)
  const images = [
    '/menu1.png',
    '/menu2.png',
    '/menu3.png',
    '/menu4.png',
  ];

  const handleImageClick = (image: string): void => {
    setSelectedImage(image);
    extractTextFromImage(image);  // Trigger OCR when an image is selected
  };

  const extractTextFromImage = (image: string): void => {
    // Load the image using the HTML <img> element
    const imgElement = document.createElement('img');
    imgElement.src = image;

    imgElement.onload = () => {
      // Wait for the image to load, then draw the right part onto the canvas
      const canvas = canvasRef.current;
      if (canvas && imgElement.complete) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const imageWidth = imgElement.width;
          const imageHeight = imgElement.height;

          // Define cropping parameters to get the right half of the image
          const cropX = imageWidth / 2; // Start from the middle to crop the right half
          const cropWidth = imageWidth / 2; // Width of the right half

          // Set the canvas size
          canvas.width = cropWidth;
          canvas.height = imageHeight;

          // Draw the right side of the image onto the canvas
          ctx.drawImage(imgElement, cropX, 0, cropWidth, imageHeight, 0, 0, cropWidth, imageHeight);

          // Perform OCR on the cropped right-side image
          Tesseract.recognize(
            canvas,
            'eng', // Explicitly use English for OCR
            {
              logger: (m) => console.log(m), // Track OCR progress
            }
          ).then(({ data: { text } }) => {
            // Extracted text from OCR
            setExtractedText(text);
          });
        }
      }
    };
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

      {/* Display Extracted Text from OCR */}
      {extractedText && (
        <div
          style={{
            position: 'absolute',
            bottom: '160px',
            right: '20px',
            padding: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
