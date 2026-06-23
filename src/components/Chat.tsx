import { useDispatch, useSelector } from 'react-redux';
import { addMessage, setLoading } from '../store/chatSlice';
import { RootState } from '../store';
import { useState, useRef, useEffect } from 'react';
import { sendMessage } from '../services/api';

export const Chat = () => {
  const dispatch = useDispatch();
  const { messages, isLoading } = useSelector((state: RootState) => state.chat);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    dispatch(addMessage({
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }));

    setInput('');
    dispatch(setLoading(true));

    try {
      const response = await sendMessage(input);
      
      dispatch(addMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        gesture: response.gesture,
        audioUrl: response.audioUrl,
      }));

      if (response.audioUrl) {
        const audio = new Audio(response.audioUrl);
        audio.play();
      }
    } catch (error) {
      console.error('Error:', error);
      dispatch(addMessage({
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-5xl mb-4">💬</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Start a Conversation
            </h3>
            <p className="text-gray-500 max-w-xs">
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
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-900 rounded-bl-none'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
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

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 flex gap-2">
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
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
};
