import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addMessage, setLoading } from '../store/chatSlice';

export const VoiceInput = () => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.log('Speech Recognition not supported');
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = 'en-IE';
    recognitionRef.current.continuous = false;

    recognitionRef.current.onstart = () => setIsListening(true);
    recognitionRef.current.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      if (event.isFinal) {
        dispatch(addMessage({
          id: Date.now().toString(),
          role: 'user',
          content: transcript,
          timestamp: new Date(),
        }));
      }
    };
    recognitionRef.current.onend = () => setIsListening(false);
  }, [dispatch]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
  };

  return (
    <button
      onClick={toggleListening}
      className={`w-full py-3 rounded-lg font-semibold transition-all ${
        isListening
          ? 'bg-red-500 hover:bg-red-600 text-white shadow-md'
          : 'bg-blue-500 hover:bg-blue-600 text-white shadow-md'
      }`}
    >
      {isListening ? '🎤 Stop Listening' : '🎤 Start Voice'}
    </button>
  );
};
