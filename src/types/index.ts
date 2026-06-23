export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  gesture?: string;
  audioUrl?: string;
}

export interface AvatarResponse {
  content: string;
  gesture: string;
  audioUrl: string;
  metadata?: any;
}