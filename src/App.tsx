import { Provider } from 'react-redux';
import { store } from './store';
import { Chat } from './components/Chat';
import { VoiceInput } from './components/VoiceInput';
import { AvatarDisplay } from './components/AvatarDisplay';
import { useState } from 'react';

function App() {
  const [currentGesture, setCurrentGesture] = useState<string>('neutral');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  return (
    <Provider store={store}>
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            {/* Logo and branding */}
            <div className="flex items-center gap-3">
              <img 
                src="/mhc-logo.png" 
                alt="MHC Logo" 
                className="h-10 w-auto"
              />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">MHC Avatar</h1>
                <p className="text-xs sm:text-sm text-gray-500">Mental Health Commission</p>
              </div>
            </div>

            {/* Status indicator */}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs sm:text-sm font-medium text-gray-700">Ready</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 h-[calc(100vh-180px)]">
            {/* Avatar Section - Professional Display */}
            <div className="lg:col-span-1 min-h-[300px] lg:min-h-auto">
              <div className="h-full bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                <AvatarDisplay
                  gesture={currentGesture}
                  isListening={isListening}
                  isSpeaking={isSpeaking}
                />
              </div>
            </div>

            {/* Chat Section */}
            <div className="lg:col-span-2 flex flex-col gap-3 sm:gap-4 min-h-[500px] lg:min-h-auto">
              {/* Chat Messages */}
              <div className="flex-1 min-h-0 bg-white rounded-lg sm:rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <Chat
                  onGestureChange={setCurrentGesture}
                  onSpeakingChange={setIsSpeaking}
                />
              </div>

              {/* Voice Input */}
              <div className="flex-shrink-0 bg-white rounded-lg sm:rounded-xl shadow-md border border-gray-200 p-3 sm:p-4">
                <VoiceInput onListeningChange={setIsListening} />
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 mt-6 sm:mt-8 py-3 sm:py-4 text-center text-xs sm:text-sm text-gray-500">
          <p>© 2026 Mental Health Commission. All rights reserved.</p>
        </footer>
      </div>
    </Provider>
  );
}

export default App;
