import { requestUrl } from 'obsidian';
import { ApiRequest, ApiResponse } from './types';

export async function sendToApi(
  endpoint: string,
  apiKey: string,
  model: string,
  systemPrompt: string,
  userContent: string
): Promise<string> {
  if (!apiKey) {
    throw new Error('API key is not configured. Please set it in plugin settings.');
  }

  const request: ApiRequest = {
    model,
    max_tokens: 4096,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: userContent,
      },
    ],
  };

  try {
    const response = await requestUrl({
      url: endpoint,
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      contentType: 'application/json',
      body: JSON.stringify(request),
    });

    if (response.status !== 200) {
      let errorMessage = `API Error: ${response.status}`;
      try {
        const errorData = response.json;
        if (errorData?.error?.message) {
          errorMessage = `API Error: ${errorData.error.message}`;
        }
      } catch (e) {
        // Use default error message if parsing fails
      }
      throw new Error(errorMessage);
    }

    const data: ApiResponse = response.json;
    if (!data.content || data.content.length === 0) {
      throw new Error('Empty response from API');
    }

    return data.content[0].text;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to connect to API endpoint');
  }
}
