import axios from 'axios';

const API_URL = ((import.meta as unknown) as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL || 'http://localhost:7071';

const client = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

export const sendMessage = async (message: string) => {
  const response = await client.post('/api/GetAvatarResponse', {
    query: message,
    conversationHistory: [],
  });
  return response.data;
};