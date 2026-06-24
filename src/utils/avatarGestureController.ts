import * as THREE from 'three';

export type GestureType = 'nodding' | 'explaining' | 'listening' | 'concerned' | 'happy' | 'neutral';

export interface GestureConfig {
  duration: number; // seconds
  intensity: number; // 0-1
  repeat: number; // how many times to repeat
}

export class AvatarGestureController {
  private mixer: THREE.AnimationMixer | null = null;
  private scene: THREE.Scene;
  private headBone: THREE.Bone | null = null;
  private leftArmBone: THREE.Bone | null = null;
  private rightArmBone: THREE.Bone | null = null;
  private spineBone: THREE.Bone | null = null;
  private currentGesture: GestureType = 'neutral';
  private gestureInProgress = false;

  constructor(scene: THREE.Scene, mixer: THREE.AnimationMixer | null = null) {
    this.scene = scene;
    this.mixer = mixer;
    this.findBones();
  }

  /**
   * Find important bones in the skeleton for procedural gestures
   */
  private findBones() {
    this.scene.traverse((node) => {
      if (node instanceof THREE.Bone) {
        if (node.name.includes('Head') && !node.name.includes('Top')) {
          this.headBone = node;
        }
        if (node.name.includes('LeftArm') && !node.name.includes('Shoulder')) {
          this.leftArmBone = node;
        }
        if (node.name.includes('RightArm') && !node.name.includes('Shoulder')) {
          this.rightArmBone = node;
        }
        if (node.name.includes('Spine') && !node.name.includes('1') && !node.name.includes('2')) {
          this.spineBone = node;
        }
      }
    });
  }

  /**
   * Play a gesture animation
   */
  async playGesture(gesture: GestureType, config?: Partial<GestureConfig>) {
    if (this.gestureInProgress) return;

    this.gestureInProgress = true;
    this.currentGesture = gesture;

    const defaultConfig: GestureConfig = {
      duration: 1.5,
      intensity: 0.5,
      repeat: 1,
      ...config,
    };

    try {
      switch (gesture) {
        case 'nodding':
          await this.performNod(defaultConfig);
          break;
        case 'explaining':
          await this.performExplaining(defaultConfig);
          break;
        case 'listening':
          await this.performListening(defaultConfig);
          break;
        case 'concerned':
          await this.performConcerned(defaultConfig);
          break;
        case 'happy':
          await this.performHappy(defaultConfig);
          break;
        case 'neutral':
          await this.performNeutral(defaultConfig);
          break;
      }
    } finally {
      this.gestureInProgress = false;
    }
  }

  /**
   * Nodding gesture - head rotates up and down
   */
  private performNod(config: GestureConfig): Promise<void> {
    return new Promise((resolve) => {
      if (!this.headBone) {
        resolve();
        return;
      }

      const startRotation = this.headBone.rotation.clone();
      const startTime = Date.now();
      const totalDuration = config.duration * 1000;
      const nodCount = config.repeat;
      const nodDuration = totalDuration / nodCount;

      const animate = () => {
        const elapsed = Date.now() - startTime;

        if (elapsed >= totalDuration) {
          this.headBone!.rotation.copy(startRotation);
          resolve();
          return;
        }

        // Calculate which nod we're in and progress within that nod
        const nodProgress = (elapsed % nodDuration) / nodDuration;
        const nodPhase = Math.sin(nodProgress * Math.PI); // 0 to 1 to 0

        // Rotate head forward and back
        this.headBone!.rotation.x = startRotation.x + nodPhase * config.intensity * 0.3;

        requestAnimationFrame(animate);
      };

      animate();
    });
  }

  /**
   * Explaining gesture - arms move outward, head tilts
   */
  private performExplaining(config: GestureConfig): Promise<void> {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const totalDuration = config.duration * 1000;

      const leftArmStart = this.leftArmBone?.rotation.clone();
      const rightArmStart = this.rightArmBone?.rotation.clone();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / totalDuration, 1);

        if (progress >= 1) {
          if (this.leftArmBone && leftArmStart) this.leftArmBone.rotation.copy(leftArmStart);
          if (this.rightArmBone && rightArmStart) this.rightArmBone.rotation.copy(rightArmStart);
          resolve();
          return;
        }

        // Oscillate arms outward
        const armPhase = Math.sin(progress * Math.PI * 2) * config.intensity;

        if (this.leftArmBone && leftArmStart) {
          this.leftArmBone.rotation.z = leftArmStart.z + armPhase * 0.4;
        }
        if (this.rightArmBone && rightArmStart) {
          this.rightArmBone.rotation.z = rightArmStart.z - armPhase * 0.4;
        }

        requestAnimationFrame(animate);
      };

      animate();
    });
  }

  /**
   * Listening gesture - slight head tilt, subtle body sway
   */
  private performListening(config: GestureConfig): Promise<void> {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const totalDuration = config.duration * 1000;

      const headStart = this.headBone?.rotation.clone();
      const spineStart = this.spineBone?.rotation.clone();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / totalDuration, 1);

        if (progress >= 1) {
          if (this.headBone && headStart) this.headBone.rotation.copy(headStart);
          if (this.spineBone && spineStart) this.spineBone.rotation.copy(spineStart);
          resolve();
          return;
        }

        // Gentle head tilt
        const tiltPhase = Math.sin(progress * Math.PI * 2) * config.intensity;

        if (this.headBone && headStart) {
          this.headBone.rotation.z = headStart.z + tiltPhase * 0.15;
        }
        if (this.spineBone && spineStart) {
          this.spineBone.rotation.z = spineStart.z + tiltPhase * 0.1;
        }

        requestAnimationFrame(animate);
      };

      animate();
    });
  }

  /**
   * Concerned gesture - head down, arms crossed
   */
  private performConcerned(config: GestureConfig): Promise<void> {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const totalDuration = config.duration * 1000;

      const headStart = this.headBone?.rotation.clone();
      const leftArmStart = this.leftArmBone?.rotation.clone();
      const rightArmStart = this.rightArmBone?.rotation.clone();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / totalDuration, 1);

        if (progress >= 1) {
          if (this.headBone && headStart) this.headBone.rotation.copy(headStart);
          if (this.leftArmBone && leftArmStart) this.leftArmBone.rotation.copy(leftArmStart);
          if (this.rightArmBone && rightArmStart) this.rightArmBone.rotation.copy(rightArmStart);
          resolve();
          return;
        }

        // Head down
        if (this.headBone && headStart) {
          this.headBone.rotation.x = headStart.x + progress * config.intensity * 0.4;
        }

        // Arms slightly crossed
        if (this.leftArmBone && leftArmStart) {
          this.leftArmBone.rotation.z = leftArmStart.z + progress * config.intensity * 0.3;
        }
        if (this.rightArmBone && rightArmStart) {
          this.rightArmBone.rotation.z = rightArmStart.z - progress * config.intensity * 0.3;
        }

        requestAnimationFrame(animate);
      };

      animate();
    });
  }

  /**
   * Happy gesture - head up, arms raised
   */
  private performHappy(config: GestureConfig): Promise<void> {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const totalDuration = config.duration * 1000;

      const headStart = this.headBone?.rotation.clone();
      const leftArmStart = this.leftArmBone?.rotation.clone();
      const rightArmStart = this.rightArmBone?.rotation.clone();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / totalDuration, 1);

        if (progress >= 1) {
          if (this.headBone && headStart) this.headBone.rotation.copy(headStart);
          if (this.leftArmBone && leftArmStart) this.leftArmBone.rotation.copy(leftArmStart);
          if (this.rightArmBone && rightArmStart) this.rightArmBone.rotation.copy(rightArmStart);
          resolve();
          return;
        }

        // Head up
        if (this.headBone && headStart) {
          this.headBone.rotation.x = headStart.x - progress * config.intensity * 0.3;
        }

        // Arms raised
        if (this.leftArmBone && leftArmStart) {
          this.leftArmBone.rotation.x = leftArmStart.x - progress * config.intensity * 0.5;
        }
        if (this.rightArmBone && rightArmStart) {
          this.rightArmBone.rotation.x = rightArmStart.x - progress * config.intensity * 0.5;
        }

        requestAnimationFrame(animate);
      };

      animate();
    });
  }

  /**
   * Neutral gesture - return to idle
   */
  private performNeutral(config: GestureConfig): Promise<void> {
    return new Promise((resolve) => {
      // Just reset to default pose
      if (this.mixer) {
        const root = this.mixer.getRoot();
        if (root instanceof THREE.Object3D && root.animations && root.animations.length > 0) {
          // Play idle animation if available
        }
      }
      resolve();
    });
  }

  /**
   * Get current gesture
   */
  getCurrentGesture(): GestureType {
    return this.currentGesture;
  }

  /**
   * Check if gesture is in progress
   */
  isGestureInProgress(): boolean {
    return this.gestureInProgress;
  }

  /**
   * Update mixer (call this in animation loop)
   */
  update(delta: number) {
    if (this.mixer) {
      this.mixer.update(delta);
    }
  }
}