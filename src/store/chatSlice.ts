import { createSlice, PayloadAction } from '@reduxjs/toolkit';

console.log('[CHAT-SLICE] Redux slice initialized');

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string; // ISO string instead of Date object
  gesture?: string;
  audioUrl?: string;
}

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Omit<Message, 'timestamp'> & { timestamp?: string | Date }>) => {
      console.log('[CHAT-SLICE] Adding message:', action.payload);

      // Convert Date to ISO string if needed
      const timestamp = action.payload.timestamp instanceof Date
        ? action.payload.timestamp.toISOString()
        : action.payload.timestamp || new Date().toISOString();

      console.log('[CHAT-SLICE] Timestamp converted to ISO string:', timestamp);

      const message: Message = {
        ...action.payload,
        timestamp,
      };

      state.messages.push(message);
      console.log('[CHAT-SLICE] Message added. Total messages:', state.messages.length);
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      console.log('[CHAT-SLICE] Setting loading state:', action.payload);
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      console.log('[CHAT-SLICE] Setting error:', action.payload);
      state.error = action.payload;
    },

    clearMessages: (state) => {
      console.log('[CHAT-SLICE] Clearing all messages');
      state.messages = [];
    },
  },
});

export const { addMessage, setLoading, setError, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;