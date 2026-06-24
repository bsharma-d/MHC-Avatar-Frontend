import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addMessage, setLoading } from '../store/chatSlice';
import { sendMessage } from '../services/api';

interface VoiceInputProps {
  onListeningChange?: (listening: boolean) => void;
}

export const VoiceInput = ({ onListeningChange }: VoiceInputProps) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Speech Recognition not supported in your browser');
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = 'en-IE';
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      onListeningChange?.(true);
      setError(null);
    };

    recognitionRef.current.onresult = async (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      if (event.isFinal && transcript.trim()) {
        setIsListening(false);
        onListeningChange?.(false);

        // Add user message
        dispatch(addMessage({
          id: Date.now().toString(),
          role: 'user',
          content: transcript,
          timestamp: new Date(),
        }));

        // Send to backend
        dispatch(setLoading(true));
        try {
          const response = await sendMessage(transcript);
          
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
            audio.play().catch(() => {
              setError('Failed to play audio');
            });
          }
        } catch (err) {
          console.error('Error:', err);
          setError('Failed to get response');
          dispatch(addMessage({
            id: (Date.now() + 2).toString(),
            role: 'assistant',
            content: 'Sorry, I encountered an error. Please try again.',
            timestamp: new Date(),
          }));
        } finally {
          dispatch(setLoading(false));
        }
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      setIsListening(false);
      onListeningChange?.(false);
      
      const errorMessages: Record<string, string> = {
        'no-speech': 'No speech detected. Please try again.',
        'audio-capture': 'No microphone found. Please check your device.',
        'network': 'Network error. Please check your connection.',
        'not-allowed': 'Microphone access denied. Please allow access.',
      };
      
      setError(errorMessages[event.error] || `Error: ${event.error}`);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
      onListeningChange?.(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [dispatch, onListeningChange]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      onListeningChange?.(false);
    } else {
      setError(null);
      recognitionRef.current?.start();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={toggleListening}
        className={`w-full py-2 sm:py-3 rounded-lg font-semibold transition-all text-xs sm:text-base ${
          isListening
            ? 'bg-red-500 hover:bg-red-600 text-white shadow-md'
            : 'bg-blue-500 hover:bg-blue-600 text-white shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed'
        }`}
        aria-label={isListening ? 'Stop listening' : 'Start voice input'}
      >
        {isListening ? '🎤 Stop Listening' : '🎤 Start Voice'}
      </button>
      
      {error && (
        <div className="text-xs sm:text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
          {error}
        </div>
      )}
    </div>
  );
};
