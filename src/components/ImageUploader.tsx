'use client'
import { useState } from 'react';
import Image from 'next/image'; // Import the Image component

export default function ImageUploader() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Manually list all the images under the public folder (add your actual image names here)
  const images = [
    'menu1.jpg',
    'menu2.jpg',
    'menu3.jpg',
    'menu4.jpg',
  ];

  const pdfUrl = '/menu1.pdf';

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  return (
    <div>
      <h1>PDF Viewer</h1>
      <iframe
        src={pdfUrl}
        width="100%"
        height="600px"
        style={{ border: 'none' }}
      />

      <h2>Image Gallery</h2>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {images.map((image) => (
          <div key={image} className="image-item" onClick={() => handleImageClick(image)}>
            <Image
              src={`/${image}`} // Images are directly under the public/ directory
              alt={image}
              width={150} // Set width
              height={150} // Set height
              style={{ cursor: 'pointer' }}
            />
          </div>
        ))}
      </div>

      {selectedImage && (
        <div>
          <h3>Selected Image: {selectedImage}</h3>
        </div>
      )}
    </div>
  );
}
