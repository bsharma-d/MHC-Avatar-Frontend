import { Provider } from 'react-redux';
import { store } from './store';
import { Avatar } from './components/Avatar';
import { Chat } from './components/Chat';
import { VoiceInput } from './components/VoiceInput';

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🤖</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">MHC Avatar</h1>
                <p className="text-sm text-gray-500">
                  National Quality Framework Guide
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-sm font-medium text-gray-700">Ready</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-180px)]">
            {/* Avatar Section */}
            <div className="lg:col-span-1">
              <div className="h-full bg-gray-50 rounded-xl overflow-hidden shadow-sm border border-gray-200">
                <Avatar />
              </div>
            </div>

            {/* Chat Section */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {/* Chat Messages */}
              <div className="flex-1 min-h-0 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <Chat />
              </div>

              {/* Voice Input */}
              <div className="flex-shrink-0 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <VoiceInput />
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 mt-8 py-4 text-center text-sm text-gray-500">
          <p>
            © 2026 Mental Health Commission. All rights reserved.
          </p>
        </footer>
      </div>
    </Provider>
  );
}

export default App;
