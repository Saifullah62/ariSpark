export const config = {
  appName: 'College Dashboard',
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  },
  apiEndpoints: {
    openai: 'https://api.openai.com/v1',
  },
  models: {
    default: 'gpt-4-1106-preview',
    chat: 'gpt-4-1106-preview',
    completion: 'gpt-4-1106-preview',
  },
  maxTokens: 4000,
  tinymce: {
    apiKey: import.meta.env.VITE_TINYMCE_API_KEY,
  },
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
};

export default config;
