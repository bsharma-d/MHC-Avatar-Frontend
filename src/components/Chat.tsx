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
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
            <div className={`inline-block max-w-xs px-4 py-2 rounded-lg ${
              msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && <div className="text-gray-500">Avatar is thinking...</div>}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 border-t flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about the MHC..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
        >
          Send
        </button>
      </form>
    </div>
  );
};