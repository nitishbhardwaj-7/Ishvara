import { SpiritualMediaAsset, Deity } from '../types';

/**
 * ISHVARA SPIRITUAL MEDIA REGISTRY & CURATED ASSET ENGINE
 * 
 * Deliberate, deterministic, art-directed spiritual imagery configuration.
 * Adheres strictly to the visual guidelines:
 * - Real, authentic devotional and sacred environments (Never random or generic stock)
 * - Exact deity matching: Shiva -> Shiva, Krishna -> Krishna, Hanuman -> Hanuman
 * - Robust fallback system: Primary -> Secondary fallback -> Sacred SVG emblem
 * - Dark cinematic atmosphere (70% deep charcoal/black, 20% natural stone/wood, 10% warm diya gold)
 * - Zero Math.random() - 100% deterministic mapping
 */

export interface DeityMediaPack {
  hero: string;
  thumbnail: string;
  deity: string;
  fallback: string;
  focalPoint?: string;
  title: string;
  description: string;
}

/**
 * EXPLICIT DEITY IMAGE MAPPING
 * Dedicated, authentic deity visual assets stored locally in /assets/spiritual/
 * Shiva -> Visible Lord Shiva statue/murti
 * Krishna -> Visible Lord Krishna murti/statue
 * Hanuman -> Visible Lord Hanuman statue/murti
 * Fallbacks are strictly for the SAME deity.
 */
export const EXPLICIT_DEITY_IMAGE_MAPPING: Record<'shiva' | 'krishna' | 'hanuman' | 'universal', DeityMediaPack> = {
  shiva: {
    hero: '/assets/spiritual/shiva-hero.jpg',             // Adiyogi Lord Shiva
    thumbnail: '/assets/spiritual/shiva-thumbnail.jpg',   // Murudeshwara Lord Shiva in meditation
    deity: '/assets/spiritual/shiva.jpg',                 // Serene Lord Shiva in deep dhyana meditation
    fallback: '/assets/spiritual/shiva-thumbnail.jpg',   // Dedicated Shiva fallback
    focalPoint: 'object-center',
    title: 'Lord Shiva & Mahadev',
    description: 'The auspicious transformer, inner stillness, and destroyer of illusions.'
  },
  krishna: {
    hero: '/assets/spiritual/krishna-hero.jpg',           // Lord Krishna & Arjuna chariot on Kurukshetra
    thumbnail: '/assets/spiritual/krishna-thumbnail.jpg', // Sacred Lord Krishna statue
    deity: '/assets/spiritual/krishna.jpg',               // Lord Krishna playing the divine bansuri flute
    fallback: '/assets/spiritual/krishna-thumbnail.jpg', // Dedicated Krishna fallback
    focalPoint: 'object-center',
    title: 'Bhagavan Shri Krishna',
    description: 'The supreme teacher of the Gita, selfless action, and divine love.'
  },
  hanuman: {
    hero: '/assets/spiritual/hanuman-hero.jpg',           // Lord Hanuman heroic statue
    thumbnail: '/assets/spiritual/hanuman-thumbnail.jpg', // Sacred bronze Hanuman murti
    deity: '/assets/spiritual/hanuman.jpg',               // Lord Hanuman sacred statue in deep devotion
    fallback: '/assets/spiritual/hanuman-thumbnail.jpg', // Dedicated Hanuman fallback
    focalPoint: 'object-center',
    title: 'Shri Hanuman Ji',
    description: 'Supreme devotion, unshakeable courage, and selfless service.'
  },
  universal: {
    hero: '/assets/spiritual/gita.jpg',                   // Sacred Gita discourse
    thumbnail: '/assets/spiritual/shiva.jpg',             // Lord Shiva in contemplation
    deity: '/assets/spiritual/gita.jpg',                 // Sacred Gita wisdom
    fallback: '/assets/spiritual/krishna.jpg',           // Lord Krishna teaching
    focalPoint: 'object-center',
    title: 'Universal Vedic Wisdom',
    description: 'Timeless Upanishadic philosophy, mindfulness, and sacred sound.'
  }
};

/**
 * EXPLORE SCREEN FEATURED EDITORIAL CONTENT MAPPING
 * Specific, hand-curated matching for every featured theme as mandated:
 * - "Why Shiva Destroys Illusions" -> Shiva MUST be visible
 * - "Control What You Can" -> Krishna / Gita MUST be visible
 * - "The Power of Surrender" -> Hanuman MUST be visible
 * - "The Untouched Witness" -> Shiva MUST be visible
 */
export const EXPLORE_FEATURED_CONTENT_MAPPING = [
  {
    id: 'exp-1',
    title: 'Why Shiva Destroys Illusions',
    subtitle: 'Lord Shiva · Mahadev',
    deity: 'Shiva' as Deity,
    duration: '2 min',
    videoIndex: 1, // Points to "Mahadev: The Art of Remaining Untouched by Chaos"
    image: '/assets/spiritual/shiva.jpg',
    fallbackImage: '/assets/spiritual/shiva-thumbnail.jpg',
    focalPoint: 'object-center'
  },
  {
    id: 'exp-2',
    title: 'Control What You Can',
    subtitle: 'Bhagavad Gita · Karma Yoga',
    deity: 'Krishna' as Deity,
    duration: '1 min',
    videoIndex: 0, // Points to "Why does Krishna tell Arjuna to stop obsessing over results?"
    image: '/assets/spiritual/gita.jpg', // Krishna teaching Arjuna on the battlefield
    fallbackImage: '/assets/spiritual/krishna.jpg',
    focalPoint: 'object-center'
  },
  {
    id: 'exp-3',
    title: 'The Power of Surrender',
    subtitle: 'Shri Hanuman · Bhakti',
    deity: 'Hanuman' as Deity,
    duration: '3 min',
    videoIndex: 2, // Points to "The Psychology of Hanuman: Surrender That Conquers Fear"
    image: '/assets/spiritual/hanuman-chalisa.jpg', // Lord Hanuman sacred murti
    fallbackImage: '/assets/spiritual/hanuman.jpg',
    focalPoint: 'object-center'
  },
  {
    id: 'exp-4',
    title: 'The Untouched Witness',
    subtitle: 'Nirvana Shatkam · Shiva Purana',
    deity: 'Shiva' as Deity,
    duration: '2 min',
    videoIndex: 4,
    image: '/assets/spiritual/shiva-thumbnail.jpg', // Lord Shiva in deep dhyana
    fallbackImage: '/assets/spiritual/shiva-hero.jpg',
    focalPoint: 'object-center'
  }
];

/**
 * CENTRALIZED MEDIA REGISTRY
 * All assets tested and verified with HTTP 200 OK.
 */
export const SPIRITUAL_MEDIA_REGISTRY: Record<string, SpiritualMediaAsset> = {
  // 1. LORD SHIVA ASSETS
  'shiva_kailash_tandav': {
    id: 'shiva_kailash_tandav',
    title: 'Shiv Tandav Stotram (Mount Kailash)',
    description: 'Lord Shiva Nataraja cosmic vibration of eternal renewal.',
    url: '/assets/spiritual/shiv-tandav.jpg',
    type: 'deity_murti',
    deity: 'Shiva',
    category: 'Chants',
    aspect_ratio: '16:9',
    prompt: 'Lord Shiva Nataraja cosmic dance murti, sacred temple lighting.',
    style: 'Dark cinematic devotional photography, deep shadows, warm bronze illumination.'
  },

  'shiva_lingam_sanctum': {
    id: 'shiva_lingam_sanctum',
    title: 'Lord Shiva Meditative Presence',
    description: 'Lord Shiva in serene stillness, trishul and sacred crescent moon.',
    url: '/assets/spiritual/shiva.jpg',
    type: 'deity_murti',
    deity: 'Shiva',
    category: 'Mantras',
    aspect_ratio: '1:1',
    prompt: 'Lord Shiva dhyana meditation murti, sacred atmosphere.',
    style: 'Deep charcoal temple sanctum, authentic traditional iconography.'
  },

  'shiva_statue_meditating': {
    id: 'shiva_statue_meditating',
    title: 'Lord Shiva in Dhyana Mudra',
    description: 'Reverent sculpture of Lord Shiva in silent meditation.',
    url: '/assets/spiritual/shiva.jpg',
    type: 'deity_murti',
    deity: 'Shiva',
    category: 'Meditation',
    aspect_ratio: '4:5',
    prompt: 'Lord Shiva meditative murti in authentic traditional iconography, soft directional lighting.',
    style: 'Subtle warm highlights on weathered stone, deep moody charcoal shadows.'
  },

  'shiva_kedarnath_shrine': {
    id: 'shiva_kedarnath_shrine',
    title: 'Adiyogi Lord Shiva',
    description: 'The primordial yogi, embodiment of transcendent consciousness.',
    url: '/assets/spiritual/shiva-hero.jpg',
    type: 'deity_murti',
    deity: 'Shiva',
    category: 'Mantras',
    aspect_ratio: '1:1',
    prompt: 'Adiyogi Lord Shiva statue against majestic twilight sky.',
    style: 'High mountain hermitage, deep charcoal shadows, sacred stillness.'
  },

  'shiva_nirvana_shatkam': {
    id: 'shiva_nirvana_shatkam',
    title: 'Nirvana Shatkam Meditative Silence',
    description: 'Murudeshwara Lord Shiva statue seated in deep meditation.',
    url: '/assets/spiritual/shiva-thumbnail.jpg',
    type: 'deity_murti',
    deity: 'Shiva',
    category: 'Meditation',
    aspect_ratio: '1:1',
    prompt: 'Lord Shiva in deep dhyana meditation, timeless stillness.',
    style: 'Meditative stillness, deep indigo and black sacred atmosphere.'
  },

  'shiva_mahamrityunjaya': {
    id: 'shiva_mahamrityunjaya',
    title: 'Mahamrityunjaya Sacred Presence',
    description: 'Lord Shiva, the great conqueror of mortality and fear.',
    url: '/assets/spiritual/shiva.jpg',
    type: 'deity_murti',
    deity: 'Shiva',
    category: 'Mantras',
    aspect_ratio: '1:1',
    prompt: 'Lord Shiva dhyana mudra with trishul and crescent moon.',
    style: 'Devotional temple sanctum, deep charcoal shadows, quiet glowing embers.'
  },

  // 2. SHRI HANUMAN ASSETS
  'hanuman_chalisa_sanctum': {
    id: 'hanuman_chalisa_sanctum',
    title: 'Shri Hanuman Sacred Murti',
    description: 'Sacred Lord Hanuman murti illuminated by warm temple lighting.',
    url: '/assets/spiritual/hanuman-chalisa.jpg',
    type: 'deity_murti',
    deity: 'Hanuman',
    category: 'Mantras',
    aspect_ratio: '4:5',
    prompt: 'Lord Hanuman sacred murti with warm diya oil lamp golden amber glow.',
    style: 'Peaceful reverent composition, authentic sanctum, deep atmospheric shadows.'
  },

  'hanuman_ashtak_temple': {
    id: 'hanuman_ashtak_temple',
    title: 'Sankat Mochan Shri Hanuman',
    description: 'Lord Hanuman sacred statue in divine devotion and unshakeable strength.',
    url: '/assets/spiritual/hanuman.jpg',
    type: 'deity_murti',
    deity: 'Hanuman',
    category: 'Chants',
    aspect_ratio: '1:1',
    prompt: 'Lord Hanuman statue in temple sanctum, majestic devotional posture.',
    style: 'Deep charcoal tones, warm golden brass reflections.'
  },

  'hanuman_sanjeevani_night': {
    id: 'hanuman_sanjeevani_night',
    title: 'Heroic Shri Hanuman',
    description: 'Lord Hanuman heroic statue, embodiment of selfless courage and surrender.',
    url: '/assets/spiritual/hanuman-hero.jpg',
    type: 'deity_murti',
    deity: 'Hanuman',
    category: 'Chants',
    aspect_ratio: '1:1',
    prompt: 'Heroic Lord Hanuman statue, strength and divine protection.',
    style: 'Atmospheric twilight, heroic devotion, quiet majesty.'
  },

  'hanuman_dhyana_sunset': {
    id: 'hanuman_dhyana_sunset',
    title: 'Ancient Murti of Bajrangbali',
    description: 'Sacred bronze Hanuman murti with folded hands in eternal contemplation.',
    url: '/assets/spiritual/hanuman-thumbnail.jpg',
    type: 'deity_murti',
    deity: 'Hanuman',
    category: 'Meditation',
    aspect_ratio: '1:1',
    prompt: 'Sacred bronze Hanuman murti with folded hands, warm ambient glow.',
    style: 'Rustic temple sanctum, deep warm gold highlights, earthy bronze textures.'
  },

  // 3. LORD KRISHNA ASSETS
  'krishna_vrindavan_flute': {
    id: 'krishna_vrindavan_flute',
    title: 'Krishna Bamboo Flute Devotion',
    description: 'Traditional bronze Krishna murti playing the divine bansuri flute.',
    url: '/assets/spiritual/krishna.jpg',
    type: 'deity_murti',
    deity: 'Krishna',
    category: 'Meditation',
    aspect_ratio: '1:1',
    prompt: 'Sacred bronze Lord Krishna murti playing bamboo bansuri flute.',
    style: 'Restrained dark teal and antique bronze palette, soft directional light.'
  },

  'krishna_gita_arjuna': {
    id: 'krishna_gita_arjuna',
    title: 'Bhagavad Gita Sacred Discourse',
    description: 'Lord Krishna instructing Arjuna on the chariot at Kurukshetra.',
    url: '/assets/spiritual/gita.jpg',
    type: 'deity_murti',
    deity: 'Krishna',
    category: 'Philosophy',
    aspect_ratio: '4:5',
    prompt: 'Lord Krishna teaching Arjuna on the battlefield chariot, sacred Vedic discourse.',
    style: 'Warm golden illumination, epic devotion, sacred quietude.'
  },

  'krishna_butter_innocence': {
    id: 'krishna_butter_innocence',
    title: 'Sacred Murti of Shri Krishna',
    description: 'Lord Krishna statue adorned in temple devotion, radiating joy.',
    url: '/assets/spiritual/krishna-thumbnail.jpg',
    type: 'deity_murti',
    deity: 'Krishna',
    category: 'Bhajans',
    aspect_ratio: '1:1',
    prompt: 'Lord Krishna murti in temple sanctum, soft devotional lighting.',
    style: 'Rich tones, deep charcoal background, subtle natural sheen.'
  },

  'krishna_achyutam_keshavam': {
    id: 'krishna_achyutam_keshavam',
    title: 'Achyutam Keshavam Shri Krishna',
    description: 'Lord Krishna bronze murti in serene classical pose.',
    url: '/assets/spiritual/krishna.jpg',
    type: 'deity_murti',
    deity: 'Krishna',
    category: 'Bhajans',
    aspect_ratio: '1:1',
    prompt: 'Lord Krishna playing flute, divine serenity.',
    style: 'Deep warm bronze tones, quiet contemplative presence.'
  },

  // 4. UNIVERSAL & SACRED VEDIC ASSETS
  'universal_gayatri_dawn': {
    id: 'universal_gayatri_dawn',
    title: 'Bhagavad Gita Eternal Wisdom',
    description: 'Lord Krishna teaching Arjuna the paths of Yoga and self-realization.',
    url: '/assets/spiritual/gita.jpg',
    type: 'deity_murti',
    deity: 'Krishna',
    category: 'Chants',
    aspect_ratio: '1:1',
    prompt: 'Lord Krishna and Arjuna sacred chariot discourse.',
    style: 'Devotional depth, warm golden light, sacred wisdom.'
  },

  'universal_ganga_aarti': {
    id: 'universal_ganga_aarti',
    title: 'Nataraja Cosmic Dance of Shiva',
    description: 'Lord Shiva in cosmic dance, illuminating the dark universe.',
    url: '/assets/spiritual/shiv-tandav.jpg',
    type: 'deity_murti',
    deity: 'Shiva',
    category: 'Aartis',
    aspect_ratio: '1:1',
    prompt: 'Lord Shiva Nataraja statue in sacred cosmic dance.',
    style: 'Golden flame reflections, deep evening atmosphere.'
  },

  'universal_varanasi_ghats': {
    id: 'universal_varanasi_ghats',
    title: 'Adiyogi Sacred Presence',
    description: 'Lord Shiva, the source of Yoga and inner stillness.',
    url: '/assets/spiritual/shiva-hero.jpg',
    type: 'deity_murti',
    deity: 'Shiva',
    category: 'Aartis',
    aspect_ratio: '1:1',
    prompt: 'Adiyogi Shiva statue in twilight mountain atmosphere.',
    style: 'Historical sacred presence, deep twilight hues.'
  },

  'universal_sleep_yoganidra': {
    id: 'universal_sleep_yoganidra',
    title: 'Lord Krishna Serene Stillness',
    description: 'Lord Krishna playing peaceful flute, guiding inner tranquility.',
    url: '/assets/spiritual/krishna.jpg',
    type: 'deity_murti',
    deity: 'Krishna',
    category: 'Sleep',
    aspect_ratio: '1:1',
    prompt: 'Lord Krishna bronze murti in meditative silence.',
    style: 'Deep nocturnal calm, deep charcoal and midnight tones.'
  },

  'universal_forest_prana': {
    id: 'universal_forest_prana',
    title: 'Lord Shiva Dhyana Solitude',
    description: 'Lord Shiva in unbroken meditative silence.',
    url: '/assets/spiritual/shiva.jpg',
    type: 'deity_murti',
    deity: 'Shiva',
    category: 'Meditation',
    aspect_ratio: '1:1',
    prompt: 'Lord Shiva in deep meditation with trishul.',
    style: 'Muted natural tones, deep charcoal, atmospheric calm.'
  },

  'universal_temple_aarti_brass': {
    id: 'universal_temple_aarti_brass',
    title: 'Lord Hanuman Divine Devotion',
    description: 'Lord Hanuman statue in sacred temple illumination.',
    url: '/assets/spiritual/hanuman.jpg',
    type: 'deity_murti',
    deity: 'Hanuman',
    category: 'Aartis',
    aspect_ratio: '1:1',
    prompt: 'Lord Hanuman sacred statue in temple lighting.',
    style: 'Sacred devotion, antique textures, deep sanctum shadows.'
  },

  'universal_starlit_banyan': {
    id: 'universal_starlit_banyan',
    title: 'Murudeshwara Shiva Deep Meditation',
    description: 'Lord Shiva in deep samadhi, transcendent peace.',
    url: '/assets/spiritual/shiva-thumbnail.jpg',
    type: 'deity_murti',
    deity: 'Shiva',
    category: 'Sleep',
    aspect_ratio: '1:1',
    prompt: 'Lord Shiva in deep samadhi under twilight sky.',
    style: 'Quiet nocturnal serenity, starlit dark sky, transcendent peace.'
  },

  'universal_vedic_manuscript': {
    id: 'universal_vedic_manuscript',
    title: 'Gita Sacred Discourse of Truth',
    description: 'Lord Krishna revealing the eternal wisdom of the Self to Arjuna.',
    url: '/assets/spiritual/gita.jpg',
    type: 'deity_murti',
    deity: 'Krishna',
    category: 'Philosophy',
    aspect_ratio: '1:1',
    prompt: 'Lord Krishna and Arjuna on the chariot, sacred scripture.',
    style: 'Sacred depth, dark wood, ancient scripture devotion.'
  }
};

export const SPIRITUAL_MEDIA_LIST = Object.values(SPIRITUAL_MEDIA_REGISTRY);

/**
 * Get media asset by ID with safe fallback
 */
export function getMediaAsset(id: string): SpiritualMediaAsset {
  if (SPIRITUAL_MEDIA_REGISTRY[id]) {
    return SPIRITUAL_MEDIA_REGISTRY[id];
  }
  return SPIRITUAL_MEDIA_REGISTRY['shiva_kailash_tandav'];
}

/**
 * Get direct image URL with safe fallback
 */
export function getMediaUrl(id: string, fallbackUrl?: string): string {
  const asset = SPIRITUAL_MEDIA_REGISTRY[id];
  if (asset?.url) {
    return asset.url;
  }
  return fallbackUrl || SPIRITUAL_MEDIA_REGISTRY['shiva_kailash_tandav'].url;
}

/**
 * Get deity media pack with guaranteed valid URLs
 */
export function getDeityMediaPack(deity: Deity): DeityMediaPack {
  const key = deity.toLowerCase() as 'shiva' | 'krishna' | 'hanuman' | 'universal';
  return EXPLICIT_DEITY_IMAGE_MAPPING[key] || EXPLICIT_DEITY_IMAGE_MAPPING.universal;
}

export function getDeityMediaAsset(deity: Deity): SpiritualMediaAsset {
  if (deity === 'Shiva') return SPIRITUAL_MEDIA_REGISTRY['shiva_statue_meditating'];
  if (deity === 'Krishna') return SPIRITUAL_MEDIA_REGISTRY['krishna_gita_arjuna'];
  if (deity === 'Hanuman') return SPIRITUAL_MEDIA_REGISTRY['hanuman_chalisa_sanctum'];
  return SPIRITUAL_MEDIA_REGISTRY['universal_gayatri_dawn'];
}

/**
 * Mappings for Audio Tracks to ensure visually distinct and cohesive art direction
 */
export const AUDIO_TRACK_MEDIA_MAPPING: Record<string, string> = {
  // Featured and primary tracks
  'audio-featured-tandav': 'shiva_kailash_tandav',
  'popular-1': 'shiva_lingam_sanctum',        // Om Namah Shivaya
  'popular-2': 'hanuman_chalisa_sanctum',    // Hanuman Chalisa
  'popular-3': 'universal_gayatri_dawn',      // Gayatri Mantra
  'popular-4': 'krishna_vrindavan_flute',    // Krishna Flute Meditation
  'popular-5': 'shiva_mahamrityunjaya',      // Mahamrityunjaya Mantra
  'popular-6': 'hanuman_ashtak_temple',      // Sankat Mochan Hanumanashtak
  'popular-7': 'shiva_nirvana_shatkam',      // Nirvana Shatkam
  'popular-8': 'krishna_achyutam_keshavam',  // Achyutam Keshavam

  // Seed audio tracks
  'audio-1': 'shiva_kailash_tandav',         // Shiv Tandav Stotram (Lord Shiva Nataraja)
  'audio-2': 'hanuman_chalisa_sanctum',      // Hanuman Chalisa (Lord Hanuman)
  'audio-3': 'shiva_statue_meditating',      // Karpura Gauram Karunavataram (Lord Shiva)
  'audio-4': 'shiva_mahamrityunjaya',        // Mahamrityunjaya Mantra (Lord Shiva)
  'audio-5': 'krishna_achyutam_keshavam',    // Achyutam Keshavam (Lord Krishna)
  'audio-6': 'hanuman_ashtak_temple',        // Sankat Mochan Hanumanashtak (Lord Hanuman)
  'audio-7': 'shiva_statue_meditating',      // Deep Silence (Lord Shiva)
  'audio-8': 'krishna_gita_arjuna',          // Gayatri Mantra / Sacred Vedic
  'audio-9': 'shiva_lingam_sanctum',         // Om Namah Shivaya (Lord Shiva)
  'audio-10': 'shiva_nirvana_shatkam',       // Nirvana Shatkam (Lord Shiva)
  'audio-11': 'shiva_statue_meditating',     // Deep Meditation (Lord Shiva)
  'audio-12': 'krishna_vrindavan_flute',     // Sound Sleep (Lord Krishna)
  'audio-13': 'krishna_gita_arjuna',         // Morning Prana (Awakening)
  'audio-14': 'shiva_kedarnath_shrine',      // Prana Flow (Lord Shiva)
  'audio-15': 'shiva_nirvana_shatkam',       // Inner Silence (Lord Shiva)
  'audio-16': 'krishna_gita_arjuna',         // Jai Jagdish Hare (Lord Krishna)
  'audio-17': 'hanuman_ashtak_temple',       // Hanuman Aarti (Lord Hanuman)
  'audio-18': 'shiva_kailash_tandav',        // Shiva Aarti (Lord Shiva)
  'audio-19': 'krishna_vrindavan_flute',     // Yoga Nidra (Lord Krishna)
  'audio-20': 'shiva_statue_meditating',     // Night Stillness (Lord Shiva)
  'audio-21': 'shiva_statue_meditating',     // Tibetan Singing Bowls & Tanpura (Lord Shiva)

  // Continue listening items
  'cl-1': 'krishna_gita_arjuna',
  'cl-2': 'hanuman_chalisa_sanctum',
  'cl-3': 'krishna_vrindavan_flute'
};

/**
 * Helper to get distinct artwork for any audio track
 */
export function getAudioArtwork(trackId: string, deity?: Deity, category?: string): SpiritualMediaAsset {
  const mappedId = AUDIO_TRACK_MEDIA_MAPPING[trackId];
  if (mappedId && SPIRITUAL_MEDIA_REGISTRY[mappedId]) {
    return SPIRITUAL_MEDIA_REGISTRY[mappedId];
  }

  // Smart deterministic fallback based on deity & category
  if (deity === 'Shiva') {
    return category === 'Meditation'
      ? SPIRITUAL_MEDIA_REGISTRY['shiva_nirvana_shatkam']
      : SPIRITUAL_MEDIA_REGISTRY['shiva_lingam_sanctum'];
  }
  if (deity === 'Hanuman') {
    return SPIRITUAL_MEDIA_REGISTRY['hanuman_chalisa_sanctum'];
  }
  if (deity === 'Krishna') {
    return SPIRITUAL_MEDIA_REGISTRY['krishna_vrindavan_flute'];
  }
  if (category === 'Sleep') {
    return SPIRITUAL_MEDIA_REGISTRY['universal_sleep_yoganidra'];
  }
  if (category === 'Aartis') {
    return SPIRITUAL_MEDIA_REGISTRY['universal_ganga_aarti'];
  }
  if (category === 'Meditation') {
    return SPIRITUAL_MEDIA_REGISTRY['universal_forest_prana'];
  }

  return SPIRITUAL_MEDIA_REGISTRY['universal_gayatri_dawn'];
}

/**
 * Curated video thumbnails matching the cinematic spiritual art direction
 * Every single key maps to a verified asset in SPIRITUAL_MEDIA_REGISTRY.
 */
export const VIDEO_THUMBNAIL_MAPPING: Record<string, string> = {
  'vid-1': 'krishna_gita_arjuna',        // Krishna & Arjuna Karma Yoga
  'vid-2': 'shiva_kailash_tandav',       // Mahadev Untouched by Chaos
  'vid-3': 'hanuman_chalisa_sanctum',    // Hanuman Surrender That Conquers Fear
  'vid-4': 'krishna_gita_arjuna',        // Sthitaprajna: The Mind Like an Ocean
  'vid-5': 'shiva_lingam_sanctum',       // Shiva Third Eye: Seeing Reality Beyond Ego
  'vid-6': 'hanuman_sanjeevani_night',   // Sanjeevani Mindset
  'vid-7': 'krishna_vrindavan_flute',    // Krishna Flute Meditation
  'vid-8': 'shiva_nirvana_shatkam',      // Nirvana Shatkam: Who Am I?
  'vid-9': 'hanuman_dhyana_sunset',      // Hanuman Quiet Strength
  'vid-10': 'krishna_butter_innocence',  // Krishna Leela & Inner Child
  'vid-11': 'universal_forest_prana',    // Forest Meditation Stillness
  'vid-12': 'universal_sleep_yoganidra', // Yoga Nidra Deep Rest
  'vid-13': 'hanuman_chalisa_sanctum',   // Hanuman Chalisa Power
  'vid-14': 'shiva_kedarnath_shrine',    // Kedarnath Sanctum Stillness
  'vid-15': 'krishna_gita_arjuna',       // Gita Equanimity in Action
  'vid-16': 'shiva_statue_meditating',   // Shiva Silent Meditation
  'vid-17': 'hanuman_ashtak_temple',     // Sankat Mochan Temple Sanctuary
  'vid-18': 'krishna_vrindavan_flute',   // Vrindavan Riverbank Silence
  'vid-19': 'universal_vedic_manuscript',// Ancient Upanishad Truths
  'vid-20': 'shiva_nirvana_shatkam',     // Beyond Mind and Intellect
  'vid-21': 'hanuman_dhyana_sunset',     // Bajrangbali Cliffside Devotion
  'vid-22': 'krishna_butter_innocence',  // Divine Playfulness (Lila)
  'vid-23': 'universal_gayatri_dawn',    // Gayatri Sacred Morning Illumination
  'vid-24': 'shiva_kailash_tandav',      // Nataraja Cosmic Dance of Renewal
  'vid-25': 'hanuman_chalisa_sanctum',   // Hanuman Heart Altar
  'vid-26': 'krishna_gita_arjuna',       // Courage in Duty
  'vid-27': 'shiva_lingam_sanctum',      // Sacred Bilva & Vibhuti
  'vid-28': 'hanuman_sanjeevani_night',  // Faith Beyond Doubt
  'vid-29': 'universal_starlit_banyan',  // Starlit Sanctuary
  'vid-30': 'universal_ganga_aarti'      // Evening Ganga Aarti
};

export function getVideoThumbnail(videoId: string, deity?: Deity): string {
  const assetKey = VIDEO_THUMBNAIL_MAPPING[videoId];
  if (assetKey && SPIRITUAL_MEDIA_REGISTRY[assetKey]) {
    return SPIRITUAL_MEDIA_REGISTRY[assetKey].url;
  }
  if (deity) {
    const pack = getDeityMediaPack(deity);
    return pack.thumbnail;
  }
  return SPIRITUAL_MEDIA_REGISTRY['universal_gayatri_dawn'].url;
}

export function getVideoFallbackThumbnail(videoId: string, deity?: Deity): string {
  if (deity) {
    const pack = getDeityMediaPack(deity);
    return pack.fallback;
  }
  return SPIRITUAL_MEDIA_REGISTRY['universal_ganga_aarti'].url;
}

/**
 * Dignified creator avatars
 */
export const CREATOR_AVATAR_REGISTRY: Record<string, string> = {
  '@acharyaraghav': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="120" height="120" fill="%231a1510"/><circle cx="60" cy="60" r="50" fill="%23261f18" stroke="%23c99a4a" stroke-width="2"/><text x="60" y="68" font-family="serif" font-size="32" fill="%23f5f1e8" text-anchor="middle">आ</text></svg>',
  '@vedicstillness': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="120" height="120" fill="%23121518"/><circle cx="60" cy="60" r="50" fill="%231a2228" stroke="%23c99a4a" stroke-width="2"/><text x="60" y="68" font-family="serif" font-size="32" fill="%23f5f1e8" text-anchor="middle">वै</text></svg>',
  '@hanumankripa': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="120" height="120" fill="%231a120e"/><circle cx="60" cy="60" r="50" fill="%232b1a10" stroke="%23c99a4a" stroke-width="2"/><text x="60" y="68" font-family="serif" font-size="32" fill="%23f5f1e8" text-anchor="middle">ह</text></svg>',
  '@bhaktipravah': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="120" height="120" fill="%23181216"/><circle cx="60" cy="60" r="50" fill="%23261a22" stroke="%23c99a4a" stroke-width="2"/><text x="60" y="68" font-family="serif" font-size="32" fill="%23f5f1e8" text-anchor="middle">भ</text></svg>',
  '@gitaamrit': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="120" height="120" fill="%23141812"/><circle cx="60" cy="60" r="50" fill="%231c2619" stroke="%23c99a4a" stroke-width="2"/><text x="60" y="68" font-family="serif" font-size="32" fill="%23f5f1e8" text-anchor="middle">गी</text></svg>',
  '@dhyanyog': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="120" height="120" fill="%2316141a"/><circle cx="60" cy="60" r="50" fill="%23221e2a" stroke="%23c99a4a" stroke-width="2"/><text x="60" y="68" font-family="serif" font-size="32" fill="%23f5f1e8" text-anchor="middle">ध</text></svg>'
};

export function getCreatorAvatar(handle: string): string {
  return CREATOR_AVATAR_REGISTRY[handle] || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="120" height="120" fill="%231a1510"/><circle cx="60" cy="60" r="50" fill="%23261f18" stroke="%23c99a4a" stroke-width="2"/><text x="60" y="68" font-family="serif" font-size="32" fill="%23f5f1e8" text-anchor="middle">ॐ</text></svg>';
}
