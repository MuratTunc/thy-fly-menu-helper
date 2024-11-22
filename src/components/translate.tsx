// translate.ts
interface TranslateResponse {
    translatedText: string;
    status: boolean;
    message: string;
  }
  
  export const translate = async (text: string, to: string): Promise<string> => {
    try {
      const response = await fetch('http://mutubackend.com/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          to: to,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Translation request failed');
      }
  
      const data: TranslateResponse = await response.json();
  
      if (data.status) {
        return data.translatedText; // Return the translated text
      } else {
        console.error('Translation error:', data.message);
        return text; // Return original text if translation fails
      }
    } catch (error) {
      console.error('Error during translation:', error);
      return text; // Return original text if there was an error
    }
  };