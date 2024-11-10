'use client'
import { useEffect, useState } from 'react';

export default function ImageUploader() {
  const [images, setImages] = useState<string[]>([]);
  const pdfUrl = '/menu1.pdf';

  useEffect(() => {
    // Fetch the list of image filenames from the API route
    fetch('/api/images')
      .then((response) => response.json())
      .then((data) => {
        setImages(data); // Set the image filenames in state
      })
      .catch((error) => {
        console.error('Error fetching image names:', error);
      });
  }, []);

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
          <div key={image} className="image-item">
            <img
              src={`/${image}`} // Images are directly under the public/ directory
              alt={image}
              style={{ width: '150px', height: '150px', cursor: 'pointer' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}