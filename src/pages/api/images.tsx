import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  // Get the path to the public folder
  const publicDir = path.join(process.cwd(), 'public');
  
  // Read all files in the public directory
  fs.readdir(publicDir, (err, files) => {
    if (err) {
      res.status(500).json({ error: 'Failed to read public directory' });
      return;
    }

    // Filter only image files (optional based on extensions like jpg, png)
    const imageFiles = files.filter(file =>
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );

    // Return the filenames as a response
    res.status(200).json(imageFiles);
  });
}
