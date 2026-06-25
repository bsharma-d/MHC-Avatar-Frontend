console.log('[PHONEME-MAP] Phoneme map initialized');

export interface PhonemeDefinition {
  phoneme: string;
  blendshapeName: string;
  influence: number; // 0-1
  description: string;
}

/**
 * Phoneme to blendshape mapping for English language
 * Maps 20 common English phonemes to blendshape targets
 * 
 * COMMENTED: This mapping should be adjusted based on your actual 3D model's blendshape names
 * Once you have the final avatar model, inspect it and update these names accordingly
 */
export const PHONEME_MAP: Record<string, PhonemeDefinition> = {
  // Vowels
  'aa': {
    phoneme: 'aa',
    blendshapeName: 'mouth_open_wide',
    influence: 0.9,
    description: 'Open mouth vowel (father, lot)',
  },
  'ae': {
    phoneme: 'ae',
    blendshapeName: 'mouth_open_wide',
    influence: 0.7,
    description: 'Short a vowel (cat, bad)',
  },
  'e': {
    phoneme: 'e',
    blendshapeName: 'mouth_smile',
    influence: 0.6,
    description: 'Front vowel (bed, pet)',
  },
  'i': {
    phoneme: 'i',
    blendshapeName: 'mouth_smile',
    influence: 0.8,
    description: 'High front vowel (see, feet)',
  },
  'o': {
    phoneme: 'o',
    blendshapeName: 'mouth_round',
    influence: 0.8,
    description: 'Back vowel (go, boat)',
  },
  'u': {
    phoneme: 'u',
    blendshapeName: 'mouth_round',
    influence: 0.9,
    description: 'High back vowel (blue, food)',
  },
  'uh': {
    phoneme: 'uh',
    blendshapeName: 'mouth_round',
    influence: 0.6,
    description: 'Short u vowel (book, put)',
  },

  // Consonants - Bilabial (lips together)
  'm': {
    phoneme: 'm',
    blendshapeName: 'mouth_closed',
    influence: 1.0,
    description: 'Bilabial nasal (mom, make)',
  },
  'p': {
    phoneme: 'p',
    blendshapeName: 'mouth_closed',
    influence: 1.0,
    description: 'Bilabial stop (pop, pat)',
  },
  'b': {
    phoneme: 'b',
    blendshapeName: 'mouth_closed',
    influence: 1.0,
    description: 'Bilabial stop (bob, bat)',
  },

  // Consonants - Labiodental (lower lip against upper teeth)
  'f': {
    phoneme: 'f',
    blendshapeName: 'mouth_open_narrow',
    influence: 0.7,
    description: 'Labiodental fricative (fun, if)',
  },
  'v': {
    phoneme: 'v',
    blendshapeName: 'mouth_open_narrow',
    influence: 0.7,
    description: 'Labiodental fricative (van, of)',
  },

  // Consonants - Alveolar (tongue against alveolar ridge)
  'n': {
    phoneme: 'n',
    blendshapeName: 'mouth_open_narrow',
    influence: 0.5,
    description: 'Alveolar nasal (no, nine)',
  },
  't': {
    phoneme: 't',
    blendshapeName: 'mouth_open_narrow',
    influence: 0.4,
    description: 'Alveolar stop (top, cat)',
  },
  'd': {
    phoneme: 'd',
    blendshapeName: 'mouth_open_narrow',
    influence: 0.4,
    description: 'Alveolar stop (dog, bad)',
  },
  's': {
    phoneme: 's',
    blendshapeName: 'mouth_open_narrow',
    influence: 0.6,
    description: 'Alveolar fricative (sun, see)',
  },
  'z': {
    phoneme: 'z',
    blendshapeName: 'mouth_open_narrow',
    influence: 0.6,
    description: 'Alveolar fricative (zoo, is)',
  },

  // Consonants - Velar (tongue against soft palate)
  'ng': {
    phoneme: 'ng',
    blendshapeName: 'mouth_open_narrow',
    influence: 0.5,
    description: 'Velar nasal (sing, ring)',
  },

  // Silence/Neutral
  'silence': {
    phoneme: 'silence',
    blendshapeName: 'mouth_neutral',
    influence: 0.0,
    description: 'Silence or neutral mouth position',
  },
};

/**
 * Get phoneme definition by name
 */
export function getPhonemeDefinition(phonemeName: string): PhonemeDefinition | null {
  console.log('[PHONEME-MAP] Getting definition for phoneme:', phonemeName);

  const definition = PHONEME_MAP[phonemeName];

  if (!definition) {
    console.warn('[PHONEME-MAP] No definition found for phoneme:', phonemeName);
    console.warn('[PHONEME-MAP] Available phonemes:', Object.keys(PHONEME_MAP));
    return null;
  }

  console.log('[PHONEME-MAP] Found definition:', definition);
  return definition;
}

/**
 * Get all available phonemes
 */
export function getAvailablePhonemes(): string[] {
  const phonemes = Object.keys(PHONEME_MAP);
  console.log('[PHONEME-MAP] Available phonemes:', phonemes);
  return phonemes;
}

/**
 * Validate phoneme name
 */
export function isValidPhoneme(phonemeName: string): boolean {
  const isValid = phonemeName in PHONEME_MAP;
  console.log('[PHONEME-MAP] Validating phoneme:', phonemeName, '- Valid:', isValid);
  return isValid;
}

/**
 * Get blendshape name for phoneme
 */
export function getBlendshapeForPhoneme(phonemeName: string): string | null {
  const definition = getPhonemeDefinition(phonemeName);
  if (definition) {
    console.log('[PHONEME-MAP] Blendshape for phoneme', phonemeName + ':', definition.blendshapeName);
    return definition.blendshapeName;
  }
  return null;
}

/**
 * Get influence value for phoneme
 */
export function getInfluenceForPhoneme(phonemeName: string): number | null {
  const definition = getPhonemeDefinition(phonemeName);
  if (definition) {
    console.log('[PHONEME-MAP] Influence for phoneme', phonemeName + ':', definition.influence);
    return definition.influence;
  }
  return null;
}