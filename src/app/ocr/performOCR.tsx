import Tesseract from 'tesseract.js';

export const performOCR = async (imagePath: string): Promise<string | null> => {
  try {
    const { data: { text } } = await Tesseract.recognize(
      imagePath,
      'eng', // Specify language(s) if needed, e.g., 'eng+fra'
      {
        logger: (m) => console.log(m) // Optional: logs progress
      }
    );
    return text;
  } catch (error) {
    console.error("OCR failed:", error);
    return null;
  }
};