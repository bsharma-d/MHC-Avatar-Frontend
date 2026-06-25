import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

console.log('[AVATARSERVICE] Service initialized');

export interface AvatarSceneConfig {
  containerWidth: number;
  containerHeight: number;
  modelPath: string;
}

export class ThreeAvatarService {
  private scene: THREE.Scene | null = null;
  private camera: THREE.OrthographicCamera | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private model: THREE.Group | null = null;
  private mixer: THREE.AnimationMixer | null = null;
  private animationClips: Map<string, THREE.AnimationClip> = new Map();
  private currentAnimation: THREE.AnimationAction | null = null;
  private clock: THREE.Clock = new THREE.Clock();
  private animationFrameId: number | null = null;
  private isInitialized = false;

  constructor() {
    console.log('[AVATARSERVICE] Constructor called');
  }

  /**
   * Initialize the Three.js scene and load the avatar model
   */
  async initialize(config: AvatarSceneConfig, canvasElement: HTMLCanvasElement): Promise<void> {
    console.log('[AVATARSERVICE] Initializing with config:', config);

    try {
      // Create scene
      this.scene = new THREE.Scene();
      console.log('[AVATARSERVICE] Scene created');

      // Create orthographic camera
      const width = config.containerWidth;
      const height = config.containerHeight;
      const aspect = width / height;

      this.camera = new THREE.OrthographicCamera(
        -aspect * 5,
        aspect * 5,
        5,
        -5,
        0.1,
        1000
      );
      this.camera.position.z = 5;
      console.log('[AVATARSERVICE] Orthographic camera created:', {
        width,
        height,
        aspect,
        position: this.camera.position,
      });

      // Create renderer
      this.renderer = new THREE.WebGLRenderer({
        canvas: canvasElement,
        antialias: true,
        alpha: true,
      });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setClearColor(0x000000, 0);
      console.log('[AVATARSERVICE] WebGL renderer created');

      // Add default lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      this.scene.add(ambientLight);
      console.log('[AVATARSERVICE] Ambient light added');

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
      directionalLight.position.set(5, 5, 5);
      this.scene.add(directionalLight);
      console.log('[AVATARSERVICE] Directional light added');

      // Load model
      await this.loadModel(config.modelPath);

      // Start animation loop
      this.startAnimationLoop();

      this.isInitialized = true;
      console.log('[AVATARSERVICE] Initialization complete');
    } catch (error) {
      console.error('[AVATARSERVICE] Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Load the GLB model
   */
  private async loadModel(modelPath: string): Promise<void> {
    console.log('[AVATARSERVICE] Loading model from:', modelPath);

    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader();

      loader.load(
        modelPath,
        (gltf) => {
          console.log('[AVATARSERVICE] Model loaded successfully');
          console.log('[AVATARSERVICE] Model structure:', gltf);

          this.model = gltf.scene;
          console.log('[AVATARSERVICE] Model added to scene');

          // Auto-fit model to camera view
          this.fitModelToCamera();

          // Create animation mixer
          if (this.model) {
            this.mixer = new THREE.AnimationMixer(this.model);
            console.log('[AVATARSERVICE] Animation mixer created');

            // Store all animation clips
            gltf.animations.forEach((clip) => {
              this.animationClips.set(clip.name, clip);
              console.log('[AVATARSERVICE] Animation clip registered:', clip.name, `(${clip.duration}s)`);
            });

            console.log('[AVATARSERVICE] Total animations available:', gltf.animations.length);
            console.log('[AVATARSERVICE] Animation names:', Array.from(this.animationClips.keys()));
          }

          // Add model to scene
          if (this.scene && this.model) {
            this.scene.add(this.model);
            console.log('[AVATARSERVICE] Model added to scene');
          }

          resolve();
        },
        (progress) => {
          const percentComplete = (progress.loaded / progress.total) * 100;
          console.log('[AVATARSERVICE] Model loading progress:', percentComplete.toFixed(2) + '%');
        },
        (error) => {
          console.error('[AVATARSERVICE] Model loading failed:', error);
          const errorMessage = error instanceof Error ? error.message : String(error);
          reject(new Error(`Failed to load model from ${modelPath}: ${errorMessage}`));
        }
      );
    });
  }

  /**
   * Auto-fit model to camera view
   */
  private fitModelToCamera(): void {
    if (!this.model || !this.camera) {
      console.error('[AVATARSERVICE] Cannot fit model - model or camera is null');
      return;
    }

    console.log('[AVATARSERVICE] Fitting model to camera view');

    const box = new THREE.Box3().setFromObject(this.model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    console.log('[AVATARSERVICE] Model bounding box:', {
      size: { x: size.x, y: size.y, z: size.z },
      center: { x: center.x, y: center.y, z: center.z },
    });

    // Center model
    this.model.position.sub(center);

    // Scale to fit camera
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 4 / maxDim;
    this.model.scale.multiplyScalar(scale);

    console.log('[AVATARSERVICE] Model scaled by:', scale);
  }

  /**
   * Start the animation loop
   */
  private startAnimationLoop(): void {
    console.log('[AVATARSERVICE] Starting animation loop');

    const animate = () => {
      this.animationFrameId = requestAnimationFrame(animate);

      const delta = this.clock.getDelta();

      // Update mixer
      if (this.mixer) {
        this.mixer.update(delta);
      }

      // Render scene
      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
    };

    animate();
  }

  /**
   * Play a gesture animation
   */
  async playGesture(gestureName: string): Promise<void> {
    if (!this.mixer || !this.model) {
      console.error('[AVATARSERVICE] Cannot play gesture - mixer or model is null');
      return;
    }

    console.log('[AVATARSERVICE] Playing gesture:', gestureName);

    // Try to find animation with various naming patterns
    const animationName = this.findAnimationByGesture(gestureName);

    if (!animationName) {
      console.warn('[AVATARSERVICE] No animation found for gesture:', gestureName);
      console.warn('[AVATARSERVICE] Available animations:', Array.from(this.animationClips.keys()));
      return;
    }

    const clip = this.animationClips.get(animationName);
    if (!clip) {
      console.error('[AVATARSERVICE] Animation clip not found:', animationName);
      return;
    }

    console.log('[AVATARSERVICE] Playing animation:', animationName);

    // Stop current animation
    if (this.currentAnimation) {
      this.currentAnimation.stop();
      console.log('[AVATARSERVICE] Stopped previous animation');
    }

    // Play new animation
    this.currentAnimation = this.mixer.clipAction(clip);
    this.currentAnimation.clampWhenFinished = true;
    this.currentAnimation.play();

    console.log('[AVATARSERVICE] Animation started:', animationName, `(duration: ${clip.duration}s)`);
  }

  /**
   * Find animation by gesture name using pattern matching
   */
  private findAnimationByGesture(gestureName: string): string | null {
    console.log('[AVATARSERVICE] Finding animation for gesture:', gestureName);

    const patterns = [
      gestureName, // exact match
      gestureName.toLowerCase(),
      gestureName.toUpperCase(),
      `gesture_${gestureName}`,
      `${gestureName}_gesture`,
      `anim_${gestureName}`,
      `${gestureName}_anim`,
    ];

    console.log('[AVATARSERVICE] Trying patterns:', patterns);

    for (const pattern of patterns) {
      if (this.animationClips.has(pattern)) {
        console.log('[AVATARSERVICE] Found animation with pattern:', pattern);
        return pattern;
      }
    }

    console.warn('[AVATARSERVICE] No animation found for gesture:', gestureName);
    return null;
  }

  /**
   * Get blendshape (morph target) by name
   */
  getBlendshape(name: string): THREE.Mesh | null {
    if (!this.model) {
      console.error('[AVATARSERVICE] Cannot get blendshape - model is null');
      return null;
    }

    let targetMesh: THREE.Mesh | null = null;

    this.model.traverse((node) => {
        if (node instanceof THREE.Mesh && node.morphTargetInfluences && node.morphTargetDictionary) {
            targetMesh = node;
        }
    });

    if (!targetMesh) {
      console.warn('[AVATARSERVICE] No mesh with morph targets found');
      return null;
    }

    console.log('[AVATARSERVICE] Found mesh with morph targets:', targetMesh.name);
    console.log('[AVATARSERVICE] Available morph targets:', targetMesh.morphTargetDictionary);

    return targetMesh;
  }

  /**
   * Update blendshape influence
   */
  updateBlendshape(meshName: string, blendshapeName: string, influence: number): void {
    if (!this.model) {
      console.error('[AVATARSERVICE] Cannot update blendshape - model is null');
      return;
    }

    let updated = false;

    this.model.traverse((node) => {
      if (node instanceof THREE.Mesh && node.morphTargetInfluences && node.morphTargetDictionary) {
        const index = node.morphTargetDictionary[blendshapeName];

        if (index !== undefined) {
          node.morphTargetInfluences[index] = Math.max(0, Math.min(1, influence));
          updated = true;
          console.log('[AVATARSERVICE] Blendshape updated:', {
            mesh: node.name,
            blendshape: blendshapeName,
            influence: influence.toFixed(2),
          });
        }
      }
    });

    if (!updated) {
      console.warn('[AVATARSERVICE] Blendshape not found:', blendshapeName);
    }
  }

  /**
   * Handle window resize
   */
  handleResize(width: number, height: number): void {
    console.log('[AVATARSERVICE] Handling resize:', { width, height });

    if (!this.camera || !this.renderer) {
      console.error('[AVATARSERVICE] Cannot resize - camera or renderer is null');
      return;
    }

    const aspect = width / height;

    this.camera.left = -aspect * 5;
    this.camera.right = aspect * 5;
    this.camera.top = 5;
    this.camera.bottom = -5;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    console.log('[AVATARSERVICE] Resize complete');
  }

  /**
   * Dispose of resources
   */
  dispose(): void {
    console.log('[AVATARSERVICE] Disposing resources');

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      console.log('[AVATARSERVICE] Animation frame cancelled');
    }

    if (this.renderer) {
      this.renderer.dispose();
      console.log('[AVATARSERVICE] Renderer disposed');
    }

    if (this.scene) {
      this.scene.traverse((node) => {
        if (node instanceof THREE.Mesh) {
          node.geometry.dispose();
          if (Array.isArray(node.material)) {
            node.material.forEach((mat) => mat.dispose());
          } else {
            node.material.dispose();
          }
        }
      });
      console.log('[AVATARSERVICE] Scene resources disposed');
    }

    this.isInitialized = false;
    console.log('[AVATARSERVICE] Disposal complete');
  }

  /**
   * Get initialization status
   */
  getIsInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Get scene
   */
  getScene(): THREE.Scene | null {
    return this.scene;
  }

  /**
   * Get model
   */
  getModel(): THREE.Group | null {
    return this.model;
  }

  /**
   * Get mixer
   */
  getMixer(): THREE.AnimationMixer | null {
    return this.mixer;
  }
}