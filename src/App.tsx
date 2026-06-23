import { Provider } from 'react-redux';
import { store } from './store';
import { Avatar } from './components/Avatar';
import { Chat } from './components/Chat';
import { VoiceInput } from './components/VoiceInput';

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <header className="bg-white shadow-sm p-4">
          <h1 className="text-2xl font-bold text-blue-900">MHC Avatar Assistant</h1>
        </header>
        <main className="p-4">
          <div className="grid grid-cols-2 gap-4 h-[calc(100vh-100px)]">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <Avatar />
            </div>
            <div className="flex flex-col gap-4">
              <Chat />
              <VoiceInput />
            </div>
          </div>
        </main>
      </div>
    </Provider>
  );
}

export default App;