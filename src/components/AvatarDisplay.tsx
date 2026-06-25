import { useState, useEffect, useRef } from 'react';
import { ThreeAvatarService } from '../services/avatarService';
import { LipSyncService } from '../utils/lipSync';

console.log('[AVATAR-DISPLAY] Component initialized');

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const avatarServiceRef = useRef<ThreeAvatarService | null>(null);
  const lipSyncServiceRef = useRef<LipSyncService | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Initialize Three.js avatar service
  useEffect(() => {
    console.log('[AVATAR-DISPLAY] useEffect: Initialize Three.js avatar service');

    const initializeAvatar = async () => {
      try {
        if (!canvasRef.current || !containerRef.current) {
          throw new Error('Canvas or container ref not available');
        }

        console.log('[AVATAR-DISPLAY] Getting container dimensions');
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        console.log('[AVATAR-DISPLAY] Container dimensions:', { width, height });

        if (width === 0 || height === 0) {
          throw new Error('Container has zero dimensions');
        }

        setContainerSize({ width, height });

        // Create avatar service
        console.log('[AVATAR-DISPLAY] Creating ThreeAvatarService');
        const avatarService = new ThreeAvatarService();
        avatarServiceRef.current = avatarService;

        // Initialize with config
        console.log('[AVATAR-DISPLAY] Initializing avatar service');
        await avatarService.initialize(
          {
            containerWidth: width,
            containerHeight: height,
            modelPath: '/avatar_placeholder.glb',
          },
          canvasRef.current
        );

        console.log('[AVATAR-DISPLAY] Avatar service initialized successfully');

        // Create lip-sync service
        console.log('[AVATAR-DISPLAY] Creating LipSyncService');
        const lipSyncService = new LipSyncService(avatarService);
        lipSyncServiceRef.current = lipSyncService;

        // Create audio element for lip-sync
        console.log('[AVATAR-DISPLAY] Creating audio element');
        const audio = new Audio();
        audio.crossOrigin = 'anonymous';
        audioRef.current = audio;

        // Initialize lip-sync with audio
        lipSyncService.initializeAudio(audio);
        console.log('[AVATAR-DISPLAY] Lip-sync service initialized');

        setIsLoading(false);
        setError(null);
        console.log('[AVATAR-DISPLAY] Initialization complete');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('[AVATAR-DISPLAY] Initialization failed:', errorMessage);
        setError(errorMessage);
        setIsLoading(false);
      }
    };

    initializeAvatar();

    // Cleanup
    return () => {
      console.log('[AVATAR-DISPLAY] Cleanup: Disposing services');
      if (avatarServiceRef.current) {
        avatarServiceRef.current.dispose();
        avatarServiceRef.current = null;
      }
      if (lipSyncServiceRef.current) {
        lipSyncServiceRef.current.dispose();
        lipSyncServiceRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Handle gesture changes
  useEffect(() => {
    console.log('[AVATAR-DISPLAY] useEffect: Gesture changed to:', gesture);

    if (!avatarServiceRef.current) {
      console.warn('[AVATAR-DISPLAY] Avatar service not initialized yet');
      return;
    }

    avatarServiceRef.current.playGesture(gesture).catch((err) => {
      console.error('[AVATAR-DISPLAY] Error playing gesture:', err);
    });
  }, [gesture]);

  // Handle window resize
  useEffect(() => {
    console.log('[AVATAR-DISPLAY] useEffect: Setting up resize listener');

    const handleResize = () => {
      if (!containerRef.current) {
        console.warn('[AVATAR-DISPLAY] Container ref not available on resize');
        return;
      }

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      console.log('[AVATAR-DISPLAY] Window resized:', { width, height });

      if (width > 0 && height > 0) {
        setContainerSize({ width, height });

        if (avatarServiceRef.current) {
          avatarServiceRef.current.handleResize(width, height);
          console.log('[AVATAR-DISPLAY] Avatar service resize handled');
        }
      }
    };

    window.addEventListener('resize', handleResize);
    console.log('[AVATAR-DISPLAY] Resize listener attached');

    return () => {
      window.removeEventListener('resize', handleResize);
      console.log('[AVATAR-DISPLAY] Resize listener removed');
    };
  }, []);

  // Handle audio playback (for lip-sync)
  useEffect(() => {
    console.log('[AVATAR-DISPLAY] useEffect: Audio playback state changed');
    console.log('[AVATAR-DISPLAY] isSpeaking:', isSpeaking);

    // COMMENTED: Audio playback will be handled by Chat.tsx
    // This is a placeholder for future integration
    /*
    if (isSpeaking && audioRef.current) {
      console.log('[AVATAR-DISPLAY] Starting audio playback');
      audioRef.current.play().catch((err) => {
        console.error('[AVATAR-DISPLAY] Error playing audio:', err);
      });
    } else if (!isSpeaking && audioRef.current) {
      console.log('[AVATAR-DISPLAY] Pausing audio playback');
      audioRef.current.pause();
    }
    */
  }, [isSpeaking]);

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
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 rounded-lg sm:rounded-xl overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: 'url(/Background.jpg)',
      }}
    >
      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Three.js Canvas */}
      <div className="absolute inset-0 z-10">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20">
            <div className="text-center">
              <div className="spinner mb-4"></div>
              <p className="text-white text-sm">Loading 3D Avatar...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20">
            <div className="bg-red-900/80 text-white p-4 rounded-lg max-w-xs text-center">
              <p className="font-semibold mb-2">Error Loading Avatar</p>
              <p className="text-sm mb-3">{error}</p>
              <p className="text-xs text-red-200">
                Please check the console for more details
              </p>
            </div>
          </div>
        )}

        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ display: isLoading || error ? 'none' : 'block' }}
        />
      </div>

      {/* Status Badge and Info (Overlay on top of canvas) */}
      {!isLoading && !error && (
        <div className="relative z-30 flex flex-col items-center justify-center h-full gap-4 sm:gap-6 w-full pointer-events-none">
          {/* Status badge */}
          <div
            className={`absolute top-6 right-6 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold text-white shadow-lg transition-all duration-300 bg-gradient-to-r ${getStatusColor()}`}
          >
            {getStatusText()}
          </div>

          {/* Listening indicator animation */}
          {isListening && (
            <div className="absolute bottom-6 flex gap-1 items-center justify-center">
              <div
                className="w-1 h-4 sm:h-6 bg-green-500 rounded-full animate-pulse"
                style={{ animationDelay: '0s' }}
              ></div>
              <div
                className="w-1 h-5 sm:h-8 bg-green-500 rounded-full animate-pulse"
                style={{ animationDelay: '0.1s' }}
              ></div>
              <div
                className="w-1 h-4 sm:h-6 bg-green-500 rounded-full animate-pulse"
                style={{ animationDelay: '0.2s' }}
              ></div>
            </div>
          )}

          {/* Speaking indicator animation */}
          {isSpeaking && (
            <div className="absolute bottom-6 flex gap-1 items-center justify-center">
              <div
                className="w-1 h-3 sm:h-4 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: '0s' }}
              ></div>
              <div
                className="w-1 h-4 sm:h-6 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: '0.1s' }}
              ></div>
              <div
                className="w-1 h-3 sm:h-4 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: '0.2s' }}
              ></div>
            </div>
          )}
        </div>
      )}

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

        .spinner {
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top-color: #fff;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};
