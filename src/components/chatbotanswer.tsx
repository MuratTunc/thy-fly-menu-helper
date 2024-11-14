interface AiResponse {
    openai_response: string; // Change from 'result' to 'openai_response'
    status: boolean;
    message: string;
}

export async function chatbotanswer(text: string): Promise<string> {
    try {
        console.log('Sending to server:', text);  // Log to see if the input is correct

        const response = await fetch('http://143.198.157.18:8000/openai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
        }

        const data: AiResponse = await response.json();

        console.log('Full Server Response:', data);  // Log the server's full response

        if (data && data.openai_response) {
            return data.openai_response;
        } else {
            console.error('Invalid response from server:', data);
            return 'No valid response from server';
        }

    } catch (error) {
        console.error('Error in chatbotanswer:', error);
        return 'Error communicating with server';
    }
}
