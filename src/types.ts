export interface NoteSynthesizerSettings {
  apiEndpoint: string;
  modelName: string;
  apiKey: string;
  summaryLength: 'brief' | 'medium' | 'comprehensive';
}

export const DEFAULT_SETTINGS: NoteSynthesizerSettings = {
  apiEndpoint: 'https://api.anthropic.com/v1/messages',
  modelName: 'claude-3-5-sonnet-20241022',
  apiKey: '',
  summaryLength: 'medium',
};

export interface ApiMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ApiRequest {
  model: string;
  max_tokens: number;
  system: string;
  messages: ApiMessage[];
}

export interface ApiContentBlock {
  type: string;
  text: string;
}

export interface ApiResponse {
  content: ApiContentBlock[];
  id: string;
  model: string;
  stop_reason: string;
  stop_sequence: string | null;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}
