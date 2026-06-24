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
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 sm:p-6 rounded-lg sm:rounded-xl overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-blue-100 rounded-full opacity-20 -mr-16 sm:-mr-20 -mt-16 sm:-mt-20"></div>
      <div className="absolute bottom-0 left-0 w-24 sm:w-32 h-24 sm:h-32 bg-green-100 rounded-full opacity-20 -ml-12 sm:-ml-16 -mb-12 sm:-mb-16"></div>

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

          {/* Avatar circle - Professional placeholder */}
          <div className="relative w-24 sm:w-32 h-24 sm:h-32 rounded-full bg-white shadow-2xl flex items-center justify-center overflow-hidden animate-fadeIn border-4 border-blue-100">
            {/* Head */}
            <div className="absolute top-4 sm:top-6 w-8 sm:w-12 h-8 sm:h-12 bg-amber-200 rounded-full shadow-md"></div>

            {/* Body */}
            <div className="absolute top-12 sm:top-16 w-16 sm:w-20 h-12 sm:h-16 bg-gradient-to-b from-blue-300 to-blue-500 rounded-t-3xl"></div>

            {/* Shoulders */}
            <div className="absolute top-16 sm:top-20 w-20 sm:w-24 h-3 sm:h-4 bg-blue-400 rounded-full opacity-70"></div>

            {/* Eyes */}
            <div className="absolute top-8 sm:top-10 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gray-700 rounded-full left-6 sm:left-8"></div>
            <div className="absolute top-8 sm:top-10 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gray-700 rounded-full right-6 sm:right-8"></div>

            {/* Smile */}
            <div className="absolute top-10 sm:top-12 w-3 sm:w-4 h-1.5 sm:h-2 border-b-2 border-gray-700 rounded-full left-1/2 transform -translate-x-1/2 opacity-70"></div>
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
          <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Current Gesture</p>
          <p className="text-base sm:text-lg font-semibold text-gray-900 animate-fadeIn">
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
