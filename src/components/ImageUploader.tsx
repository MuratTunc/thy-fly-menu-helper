'use client'
import {  useState } from 'react';

export default function ImageUploader() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Manually list all the images under the public folder (as Next.js doesn't allow reading the public folder dynamically)
  const images = [
    'menu1.jpg',
    'menu2.jpg',
    'menu3.jpg',
    'menu4.jpg',
  ];

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {images.map((image) => (
          <div key={image} className="image-item" onClick={() => handleImageClick(image)}>
            <img
              src={`/${image}`} // Images are directly under the public/ directory
              alt={image}
              style={{ width: '900px', height: '900px', cursor: 'pointer' }}
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