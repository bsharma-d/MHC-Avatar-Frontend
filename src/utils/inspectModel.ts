import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * Inspect a GLB model and log all available animations
 * Run this in your browser console or as a utility
 */
export const inspectAvatarModel = async () => {
  const loader = new GLTFLoader();
  
  return new Promise((resolve, reject) => {
    loader.load(
      '/avatar.glb',
      (gltf) => {
        console.log('=== AVATAR MODEL INSPECTION ===');
        console.log('Model loaded successfully');
        console.log('');
        
        // Log scene structure
        console.log('Scene Structure:');
        gltf.scene.traverse((node) => {
          if (node instanceof THREE.Mesh) {
            console.log(`  Mesh: ${node.name}`);
          }
          if (node instanceof THREE.Bone) {
            console.log(`  Bone: ${node.name}`);
          }
          if (node.type === 'Armature') {
            console.log(`  Armature: ${node.name}`);
          }
        });
        console.log('');
        
        // Log all animations
        console.log('Available Animations:');
        if (gltf.animations.length === 0) {
          console.log('  ⚠️ No animations found in model');
        } else {
          gltf.animations.forEach((clip, index) => {
            console.log(`  ${index + 1}. "${clip.name}" (${clip.duration.toFixed(2)}s)`);
          });
        }
        console.log('');
        
        // Create animation mixer to test
        const mixer = new THREE.AnimationMixer(gltf.scene);
        console.log('Animation Mixer created successfully');
        console.log('');
        
        // Return data for programmatic use
        const animationData = {
          animationNames: gltf.animations.map(clip => clip.name),
          animationCount: gltf.animations.length,
          animations: gltf.animations.map(clip => ({
            name: clip.name,
            duration: clip.duration,
          })),
        };
        
        console.log('Copy this for your code:');
        console.log(JSON.stringify(animationData, null, 2));
        
        resolve(animationData);
      },
      undefined,
      (error) => {
        console.error('Error loading model:', error);
        reject(error);
      }
    );
  });
};

// Export for use in browser console
(window as any).inspectAvatarModel = inspectAvatarModel;