import * as THREE from 'three';
import { ThreeAvatarService } from '../services/avatarService';
import { PHONEME_MAP, PhonemeDefinition } from './phonemeMap';

console.log('[lipSync] Service initialized');

export interface PhonemeData {
  phoneme: string;
  offset: number; // milliseconds
  duration: number; // milliseconds
}

export interface VisemeData {
  visemeId: number;
  offset: number; // milliseconds
  duration: number; // milliseconds
}

export class LipSyncService {
  private avatarService: ThreeAvatarService;
  private audioElement: HTMLAudioElement | null = null;
  private phonemeData: PhonemeData[] = [];
  private visemeData: VisemeData[] = [];
  private isPlaying = false;
  private animationFrameId: number | null = null;
  private currentPhonemeIndex = 0;
  private blendshapeMesh: THREE.Mesh | null = null;

  constructor(avatarService: ThreeAvatarService) {
    console.log('[lipSync] Constructor called');
    this.avatarService = avatarService;
  }

  /**
   * Initialize lip-sync with audio element
   */
  initializeAudio(audioElement: HTMLAudioElement): void {
    console.log('[lipSync] Initializing audio');
    this.audioElement = audioElement;

    // Get blendshape mesh
    this.blendshapeMesh = this.avatarService.getBlendshape('');
    if (this.blendshapeMesh) {
      console.log('[lipSync] Blendshape mesh found:', this.blendshapeMesh.name);
    } else {
      console.warn('[lipSync] No blendshape mesh found - lip-sync may not work');
    }

    // Add event listeners
    this.audioElement.addEventListener('play', () => this.onAudioPlay());
    this.audioElement.addEventListener('pause', () => this.onAudioPause());
    this.audioElement.addEventListener('ended', () => this.onAudioEnded());

    console.log('[lipSync] Audio event listeners attached');
  }

  /**
   * Set phoneme data from backend response
   * COMMENTED: Awaiting backend to provide phoneme timing data
   */
  setPhonemeData(phonemes: PhonemeData[]): void {
    console.log('[lipSync] Setting phoneme data');
    console.log('[lipSync] Phoneme count:', phonemes.length);
    console.log('[lipSync] Phoneme data:', phonemes);

    this.phonemeData = phonemes;
    this.currentPhonemeIndex = 0;

    // Log phoneme details
    phonemes.forEach((p, i) => {
      console.log(`[lipSync] Phoneme ${i}:`, {
        phoneme: p.phoneme,
        offset: p.offset,
        duration: p.duration,
        endTime: p.offset + p.duration,
      });
    });
  }

  /**
   * Set viseme data from backend response (alternative to phoneme data)
   * COMMENTED: Awaiting backend to provide viseme timing data
   */
  setVisemeData(visemes: VisemeData[]): void {
    console.log('[lipSync] Setting viseme data');
    console.log('[lipSync] Viseme count:', visemes.length);
    console.log('[lipSync] Viseme data:', visemes);

    this.visemeData = visemes;
    this.currentPhonemeIndex = 0;

    // Log viseme details
    visemes.forEach((v, i) => {
      console.log(`[lipSync] Viseme ${i}:`, {
        visemeId: v.visemeId,
        offset: v.offset,
        duration: v.duration,
        endTime: v.offset + v.duration,
      });
    });
  }

  /**
   * Called when audio starts playing
   */
  private onAudioPlay(): void {
    console.log('[lipSync] Audio play event');
    this.isPlaying = true;
    this.startLipSyncLoop();
  }

  /**
   * Called when audio pauses
   */
  private onAudioPause(): void {
    console.log('[lipSync] Audio pause event');
    this.isPlaying = false;
    this.stopLipSyncLoop();
  }

  /**
   * Called when audio ends
   */
  private onAudioEnded(): void {
    console.log('[lipSync] Audio ended event');
    this.isPlaying = false;
    this.stopLipSyncLoop();
    this.resetBlendshapes();
  }

  /**
   * Start the lip-sync animation loop
   */
  private startLipSyncLoop(): void {
    console.log('[lipSync] Starting lip-sync loop');

    if (this.animationFrameId !== null) {
      console.warn('[lipSync] Lip-sync loop already running');
      return;
    }

    const updateLipSync = () => {
      if (!this.isPlaying || !this.audioElement) {
        console.log('[lipSync] Lip-sync loop stopped');
        return;
      }

      const currentTime = this.audioElement.currentTime * 1000; // Convert to milliseconds

      // COMMENTED: Phoneme data extraction and real-time sync
      // This section will be implemented once backend provides phoneme timing data
      /*
      if (this.phonemeData.length > 0) {
        this.updatePhonemeBlendshapes(currentTime);
      } else if (this.visemeData.length > 0) {
        this.updateVisemeBlendshapes(currentTime);
      } else {
        console.warn('[lipSync] No phoneme or viseme data available for lip-sync');
      }
      */

      // Placeholder: Log current time for debugging
      if (currentTime % 500 < 16) {
        // Log every ~500ms
        console.log('[lipSync] Audio playback time:', currentTime.toFixed(0) + 'ms');
      }

      this.animationFrameId = requestAnimationFrame(updateLipSync);
    };

    this.animationFrameId = requestAnimationFrame(updateLipSync);
  }

  /**
   * Stop the lip-sync animation loop
   */
  private stopLipSyncLoop(): void {
    console.log('[lipSync] Stopping lip-sync loop');

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
      console.log('[lipSync] Animation frame cancelled');
    }
  }

  /**
   * Update blendshapes based on phoneme data
   * COMMENTED: Awaiting backend phoneme timing data
   */
  private updatePhonemeBlendshapes(currentTime: number): void {
    // COMMENTED: Implementation pending backend integration
    /*
    if (this.phonemeData.length === 0) {
      console.warn('[lipSync] No phoneme data available');
      return;
    }

    // Find active phoneme
    let activePhoneme: PhonemeData | null = null;
    for (const phoneme of this.phonemeData) {
      if (currentTime >= phoneme.offset && currentTime < phoneme.offset + phoneme.duration) {
        activePhoneme = phoneme;
        break;
      }
    }

    if (activePhoneme) {
      const phonemeDef = PHONEME_MAP[activePhoneme.phoneme];
      if (phonemeDef) {
        this.applyBlendshape(phonemeDef);
      } else {
        console.warn('[lipSync] No blendshape mapping for phoneme:', activePhoneme.phoneme);
      }
    } else {
      // No active phoneme, reset to neutral
      this.resetBlendshapes();
    }
    */
  }

  /**
   * Update blendshapes based on viseme data
   * COMMENTED: Awaiting backend viseme timing data
   */
  private updateVisemeBlendshapes(currentTime: number): void {
    // COMMENTED: Implementation pending backend integration
    /*
    if (this.visemeData.length === 0) {
      console.warn('[lipSync] No viseme data available');
      return;
    }

    // Find active viseme
    let activeViseme: VisemeData | null = null;
    for (const viseme of this.visemeData) {
      if (currentTime >= viseme.offset && currentTime < viseme.offset + viseme.duration) {
        activeViseme = viseme;
        break;
      }
    }

    if (activeViseme) {
      // Map viseme ID to phoneme definition
      const phonemeDef = this.mapVisemeToPhoneme(activeViseme.visemeId);
      if (phonemeDef) {
        this.applyBlendshape(phonemeDef);
      } else {
        console.warn('[lipSync] No phoneme mapping for viseme:', activeViseme.visemeId);
      }
    } else {
      // No active viseme, reset to neutral
      this.resetBlendshapes();
    }
    */
  }

  /**
   * Apply blendshape with smooth interpolation
   */
  private applyBlendshape(phonemeDef: PhonemeDefinition): void {
    console.log('[lipSync] Applying blendshape:', phonemeDef.blendshapeName);

    // COMMENTED: Blendshape application pending backend data
    /*
    const smoothingFactor = 0.15; // Adjust for smoother/snappier transitions

    // Get current influence
    const currentInfluence = this.getCurrentBlendshapeInfluence(phonemeDef.blendshapeName) || 0;

    // Interpolate to target
    const targetInfluence = phonemeDef.influence;
    const newInfluence = currentInfluence + (targetInfluence - currentInfluence) * smoothingFactor;

    // Apply to avatar
    this.avatarService.updateBlendshape('', phonemeDef.blendshapeName, newInfluence);
    */
  }

  /**
   * Get current blendshape influence value
   */
  private getCurrentBlendshapeInfluence(blendshapeName: string): number | null {
    if (!this.blendshapeMesh || !this.blendshapeMesh.morphTargetDictionary) {
      console.warn('[lipSync] Cannot get blendshape influence - mesh not found');
      return null;
    }

    const index = this.blendshapeMesh.morphTargetDictionary[blendshapeName];
    if (index !== undefined && this.blendshapeMesh.morphTargetInfluences) {
      return this.blendshapeMesh.morphTargetInfluences[index];
    }

    console.warn('[lipSync] Blendshape not found:', blendshapeName);
    return null;
  }

  /**
   * Map viseme ID to phoneme definition
   * COMMENTED: Awaiting backend viseme format confirmation
   */
  private mapVisemeToPhoneme(visemeId: number): PhonemeDefinition | null {
    // COMMENTED: Viseme mapping pending backend integration
    // Viseme IDs (0-21) from Azure Speech Services
    // This mapping needs to be confirmed based on actual backend response
    /*
    const visemeToPhoneme: Record<number, string> = {
      0: 'silence',
      1: 'aa',
      2: 'aa',
      3: 'e',
      4: 'i',
      5: 'o',
      6: 'u',
      7: 'aa',
      8: 'aa',
      9: 'aa',
      10: 'aa',
      11: 'aa',
      12: 'aa',
      13: 'aa',
      14: 'aa',
      15: 'aa',
      16: 'aa',
      17: 'aa',
      18: 'aa',
      19: 'aa',
      20: 'aa',
      21: 'aa',
    };

    const phonemeName = visemeToPhoneme[visemeId];
    if (phonemeName) {
      return PHONEME_MAP[phonemeName] || null;
    }

    console.warn('[lipSync] Unknown viseme ID:', visemeId);
    return null;
    */

    return null;
  }

  /**
   * Reset all blendshapes to neutral
   */
  private resetBlendshapes(): void {
    console.log('[lipSync] Resetting blendshapes to neutral');

    // COMMENTED: Reset implementation pending backend data
    /*
    Object.keys(PHONEME_MAP).forEach((phonemeName) => {
      const phonemeDef = PHONEME_MAP[phonemeName];
      this.avatarService.updateBlendshape('', phonemeDef.blendshapeName, 0);
    });
    */
  }

  /**
   * Dispose of resources
   */
  dispose(): void {
    console.log('[lipSync] Disposing resources');

    this.stopLipSyncLoop();

    if (this.audioElement) {
      this.audioElement.removeEventListener('play', () => this.onAudioPlay());
      this.audioElement.removeEventListener('pause', () => this.onAudioPause());
      this.audioElement.removeEventListener('ended', () => this.onAudioEnded());
      console.log('[lipSync] Audio event listeners removed');
    }

    this.phonemeData = [];
    this.visemeData = [];
    console.log('[lipSync] Disposal complete');
  }

  /**
   * Get phoneme data
   */
  getPhonemeData(): PhonemeData[] {
    return this.phonemeData;
  }

  /**
   * Get viseme data
   */
  getVisemeData(): VisemeData[] {
    return this.visemeData;
  }

  /**
   * Get is playing status
   */
  getIsPlaying(): boolean {
    return this.isPlaying;
  }
}