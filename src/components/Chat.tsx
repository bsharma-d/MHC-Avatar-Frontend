import { useDispatch, useSelector } from 'react-redux';
import { addMessage, setLoading, clearMessages } from '../store/chatSlice';
import { RootState } from '../store';
import { useState, useRef, useEffect } from 'react';
import { sendMessage } from '../services/api';

interface ChatProps {
  onGestureChange?: (gesture: string) => void;
  onSpeakingChange?: (speaking: boolean) => void;
}

export const Chat = ({ onGestureChange, onSpeakingChange }: ChatProps) => {
  const dispatch = useDispatch();
  const { messages, isLoading } = useSelector((state: RootState) => state.chat);
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setError(null);

    dispatch(addMessage({
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    }));

    dispatch(setLoading(true));
    onGestureChange?.('listening');

    try {
      const response = await sendMessage(userMessage);
      
      const gesture = response.gesture || 'explaining';
      onGestureChange?.(gesture);

      dispatch(addMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        gesture: gesture,
        audioUrl: response.audioUrl,
      }));

      if (response.audioUrl) {
        onSpeakingChange?.(true);
        const audio = new Audio(response.audioUrl);
        audio.onended = () => {
          onSpeakingChange?.(false);
          onGestureChange?.('neutral');
        };
        audio.onerror = () => {
          onSpeakingChange?.(false);
          onGestureChange?.('neutral');
          setError('Failed to play audio');
        };
        audio.play().catch(() => {
          onSpeakingChange?.(false);
          onGestureChange?.('neutral');
          setError('Failed to play audio');
        });
      } else {
        onGestureChange?.('neutral');
      }
    } catch (err) {
      console.error('Error:', err);
      onGestureChange?.('concerned');
      
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);

      dispatch(addMessage({
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }));

      setTimeout(() => onGestureChange?.('neutral'), 2000);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleClearChat = () => {
    dispatch(clearMessages());
    setError(null);
    onGestureChange?.('neutral');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with clear button */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
        <h2 className="text-sm sm:text-base font-semibold text-gray-900">Conversation</h2>
        {messages.length > 0 && (
          <button
            onClick={handleClearChat}
            className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Clear conversation"
          >
            Clear
          </button>
        )}
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">💬</div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
              Start a Conversation
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 max-w-xs">
              Ask me anything about the National Quality Framework
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-900 rounded-bl-none'
                }`}
              >
                <p className="break-words">{msg.content}</p>
                <span className={`text-xs mt-1 block ${
                  msg.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))
        )}

        {/* Typing Indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-2 rounded-bl-none">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="flex justify-center">
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm text-red-700">
              {error}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-3 sm:p-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend(e as any);
            }
          }}
          placeholder="Ask about the MHC..."
          className="flex-1 px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
          aria-label="Message input"
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="px-4 sm:px-6 py-2 bg-blue-500 text-white text-xs sm:text-sm rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
          aria-label="Send message"
        >
          {isLoading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
};
