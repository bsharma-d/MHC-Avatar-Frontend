import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useEffect, useRef, useState } from 'react';
import { AvatarGestureController, GestureType } from '../utils/avatarGestureController';

interface AvatarState {
  isLoading: boolean;
  isLoaded: boolean;
  error: string | null;
  currentGesture: GestureType;
}

export const Avatar = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gestureControllerRef = useRef<AvatarGestureController | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  const [state, setState] = useState<AvatarState>({
    isLoading: true,
    isLoaded: false,
    error: null,
    currentGesture: 'neutral',
  });

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf9fafb);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.6, 2);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    rendererRef.current = renderer;

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Load avatar model
    const loader = new GLTFLoader();
    loader.load(
      '/avatar.glb',
      (gltf) => {
        const avatar = gltf.scene;
        scene.add(avatar);

        // Enable shadows for all meshes
        avatar.traverse((node) => {
          if (node instanceof THREE.Mesh) {
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });

        // Create gesture controller
        let mixer: THREE.AnimationMixer | null = null;
        if (gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(avatar);
          // Play the default animation
          const action = mixer.clipAction(gltf.animations[0]);
          action.play();
        }

        gestureControllerRef.current = new AvatarGestureController(scene, mixer);

        // Update state
        setState((prev) => ({
          ...prev,
          isLoading: false,
          isLoaded: true,
          error: null,
        }));

        if (loadingRef.current) {
          loadingRef.current.style.display = 'none';
        }

        console.log('✅ Avatar loaded successfully');
        console.log(`📊 Animations found: ${gltf.animations.length}`);
        console.log(`🎭 Gesture controller ready`);
      },
      (progress) => {
        // Optional: Log loading progress
        const percentComplete = (progress.loaded / progress.total) * 100;
        console.log(`📦 Loading avatar: ${percentComplete.toFixed(0)}%`);
      },
      (error) => {
        console.error('❌ Error loading avatar model:', error);
        
        // Create a simple placeholder
        const geometry = new THREE.BoxGeometry(1, 2, 1);
        const material = new THREE.MeshStandardMaterial({
          color: 0x3b82f6,
          metalness: 0.3,
          roughness: 0.4,
        });
        const cube = new THREE.Mesh(geometry, material);
        cube.castShadow = true;
        scene.add(cube);

        // Create fallback gesture controller
        gestureControllerRef.current = new AvatarGestureController(scene, null);

        setState((prev) => ({
          ...prev,
          isLoading: false,
          isLoaded: false,
          error: 'Avatar model not found. Using placeholder.',
        }));

        if (loadingRef.current) {
          loadingRef.current.style.display = 'none';
        }

        console.log('⚠️ Avatar model not found. Using placeholder.');
      }
    );

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (gestureControllerRef.current) {
        gestureControllerRef.current.update(delta);
        
        // Update current gesture state
        setState((prev) => ({
          ...prev,
          currentGesture: gestureControllerRef.current!.getCurrentGesture(),
        }));
      }

      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!canvasRef.current) return;

      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Expose gesture controller to window for testing
    (window as any).avatarGestureController = gestureControllerRef.current;
    (window as any).playAvatarGesture = (gesture: GestureType) => {
      gestureControllerRef.current?.playGesture(gesture);
    };

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-gray-50">
      {/* Loading Indicator */}
      <div
        ref={loadingRef}
        className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10"
      >
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-600 font-medium">Loading Avatar...</p>
        </div>
      </div>

      {/* Error Message */}
      {state.error && (
        <div className="absolute bottom-4 left-4 right-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 z-20">
          <p className="text-sm text-yellow-800">⚠️ {state.error}</p>
        </div>
      )}

      {/* Status Indicator */}
      {state.isLoaded && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-sm px-3 py-2 z-20">
          <p className="text-xs text-gray-600">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Avatar Ready
          </p>
          {state.currentGesture !== 'neutral' && (
            <p className="text-xs text-blue-600 mt-1">
              🎭 {state.currentGesture}
            </p>
          )}
        </div>
      )}

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
    </div>
  );
};