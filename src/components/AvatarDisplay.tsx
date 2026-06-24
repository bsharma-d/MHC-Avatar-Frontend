import { useState, useEffect } from 'react';

interface AvatarDisplayProps {
  gesture?: string;
  isListening?: boolean;
  isSpeaking?: boolean;
}

export const AvatarDisplay = ({
  gesture = 'neutral',
  isListening = false,
  isSpeaking = false,
}: AvatarDisplayProps) => {
  const [displayGesture, setDisplayGesture] = useState(gesture);

  useEffect(() => {
    setDisplayGesture(gesture);
  }, [gesture]);

  const getGestureLabel = (g: string) => {
    const labels: Record<string, string> = {
      nodding: '👂 Listening',
      explaining: '💬 Explaining',
      listening: '👂 Listening',
      concerned: '❤️ Empathizing',
      happy: '😊 Happy',
      neutral: '😊 Ready',
    };
    return labels[g] || 'Ready';
  };

  const getStatusColor = () => {
    if (isSpeaking) return 'from-blue-400 to-blue-600';
    if (isListening) return 'from-green-400 to-green-600';
    return 'from-gray-300 to-gray-400';
  };

  const getStatusText = () => {
    if (isSpeaking) return 'Speaking';
    if (isListening) return 'Listening';
    return 'Ready';
  };

  return (
    <div 
      className="relative w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 rounded-lg sm:rounded-xl overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: 'url(/Background.jpg)',
      }}
    >
      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full gap-4 sm:gap-6 w-full">
        {/* Avatar container */}
        <div className="relative">
          {/* Outer glow ring */}
          <div
            className={`absolute inset-0 rounded-full blur-lg opacity-50 transition-all duration-300 bg-gradient-to-r ${getStatusColor()}`}
            style={{
              animation: isListening ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none',
            }}
          ></div>

          {/* Avatar Image */}
          <div className="relative w-24 sm:w-32 h-24 sm:h-32 rounded-full bg-white shadow-2xl flex items-center justify-center overflow-hidden animate-fadeIn border-4 border-white">
            <img
              src="/avatar.jpg"
              alt="Healthcare Assistant Avatar"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>

          {/* Status badge */}
          <div
            className={`absolute -bottom-2 -right-2 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold text-white shadow-lg transition-all duration-300 bg-gradient-to-r ${getStatusColor()}`}
          >
            {getStatusText()}
          </div>
        </div>

        {/* Gesture label */}
        <div className="text-center">
          <p className="text-xs sm:text-sm font-medium text-white mb-1 drop-shadow-lg">Current Gesture</p>
          <p className="text-base sm:text-lg font-semibold text-white animate-fadeIn drop-shadow-lg">
            {getGestureLabel(displayGesture)}
          </p>
        </div>

        {/* Listening indicator animation */}
        {isListening && (
          <div className="flex gap-1 items-center justify-center">
            <div className="w-1 h-4 sm:h-6 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
            <div className="w-1 h-5 sm:h-8 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-1 h-4 sm:h-6 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          </div>
        )}

        {/* Speaking indicator animation */}
        {isSpeaking && (
          <div className="flex gap-1 items-center justify-center">
            <div className="w-1 h-3 sm:h-4 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-1 h-4 sm:h-6 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-1 h-3 sm:h-4 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        )}
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};