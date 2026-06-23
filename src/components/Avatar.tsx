import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useEffect, useRef } from 'react';

export const Avatar = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf9fafb);

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

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Load avatar model
    const loader = new GLTFLoader();
    loader.load(
      '/avatar.glb',
      (gltf) => {
        const avatar = gltf.scene;
        scene.add(avatar);

        if (loadingRef.current) {
          loadingRef.current.style.display = 'none';
        }

        if (gltf.animations.length > 0) {
          mixerRef.current = new THREE.AnimationMixer(avatar);
        }
      },
      undefined,
      (error) => {
        console.log('Avatar model not found. Using placeholder.');
        
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

        if (loadingRef.current) {
          loadingRef.current.style.display = 'none';
        }
      }
    );

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (mixerRef.current) {
        mixerRef.current.update(delta);
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

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full">
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

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
    </div>
  );
};
