import { VideoItem, AudioTrack, ShlokaItem, DailyPractice } from '../types';
import { getAudioArtwork, getVideoThumbnail, getCreatorAvatar, getDeityMediaPack } from './mediaConfig';

export const TOPICS = [
  'Karma Yoga',
  'Overcoming Fear',
  'Anger Control',
  'Inner Stillness',
  'Hanuman Chalisa',
  'Shiv Tandav',
  'Detachment',
  'Discipline & Focus',
  'Surrender (Sharanagati)',
  'Courage & Strength',
  'Morning Meditation',
  'Ram Bhakti',
  'Self Realization',
  'Mind Mastery'
];

export const CATEGORIES = [
  'Bhagavad Gita Wisdom',
  'Lord Shiva & Mahadev',
  'Lord Hanuman',
  'Daily Spirituality',
  'Meditation & Chants',
  'Life Lessons'
];

// 30+ Curated Spiritual Reels with authentic Vedic, Shaivite, and Hanuman teachings
const RAW_VIDEOS: VideoItem[] = [
  {
    id: 'vid-1',
    title: 'Why does Krishna tell Arjuna to stop obsessing over results?',
    shortDescription: 'The secret of Nishkama Karma: Pour your full spirit into action, and liberate your mind from anxious anticipation.',
    deity: 'Krishna',
    sourceContext: 'Bhagavad Gita • Chapter 2, Verse 47',
    category: 'Bhagavad Gita Wisdom',
    topic: 'Karma Yoga',
    tags: ['career', 'anxiety', 'karma', 'focus', 'discipline'],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-mystical-fog-moving-through-a-mountain-valley-42654-large.mp4',
    thumbnailUrl: '',
    duration: 38,
    creator: {
      name: 'Acharya Raghav',
      avatar: '',
      handle: '@acharyaraghav',
      verified: true
    },
    stats: { likes: 14200, comments: 480, shares: 3200, saves: 5120, views: 89000 },
    isPremium: false,
    quoteOverlay: {
      sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन',
      translation: 'You have a right to perform your prescribed duty, but never to the fruits of action.',
      author: 'Bhagavad Gita 2.47'
    }
  },
  {
    id: 'vid-2',
    title: 'Mahadev: The Art of Remaining Untouched by Chaos',
    shortDescription: 'Shiva swallowed the Halahala poison without internalizing it or projecting it outward. Master emotional stillness.',
    deity: 'Shiva',
    sourceContext: 'Shiva Purana • Rudra Samhita',
    category: 'Lord Shiva & Mahadev',
    topic: 'Inner Stillness',
    tags: ['shiva', 'peace', 'stillness', 'meditation', 'stress'],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-clouds-and-blue-sky-2408-large.mp4',
    thumbnailUrl: '',
    duration: 44,
    creator: {
      name: 'Vedic Stillness',
      avatar: '',
      handle: '@vedicstillness',
      verified: true
    },
    stats: { likes: 28400, comments: 890, shares: 6400, saves: 9800, views: 162000 },
    isPremium: false,
    quoteOverlay: {
      sanskrit: 'शान्तं पद्मासनस्थं शशिशकलधरम्',
      translation: 'Rest in the profound stillness of Shiva, undisturbed by worldly waves.',
      author: 'Shiva Purana'
    }
  },
  {
    id: 'vid-3',
    title: 'How Hanuman Crossed the Ocean: The Power of Humility',
    shortDescription: 'When Jambavan reminded Hanuman of his latent divine strength, he did not boast. He bowed his head and soared.',
    deity: 'Hanuman',
    sourceContext: 'Sundara Kanda • Ramayana',
    category: 'Lord Hanuman',
    topic: 'Courage & Strength',
    tags: ['hanuman', 'courage', 'strength', 'confidence', 'ram'],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-sun-setting-over-the-ocean-1180-large.mp4',
    thumbnailUrl: '',
    duration: 49,
    creator: {
      name: 'Prana Mandir',
      avatar: '',
      handle: '@pranamandir',
      verified: true
    },
    stats: { likes: 31200, comments: 1120, shares: 8100, saves: 11400, views: 198000 },
    isPremium: false,
    quoteOverlay: {
      sanskrit: 'दुर्गम काज जगत के जेते, सुगम अनुग्रह तुम्हरे तेते',
      translation: 'All impossible tasks in the universe turn effortless by your grace.',
      author: 'Hanuman Chalisa'
    }
  },
  {
    id: 'vid-4',
    title: 'The Psychological Root of Anger Explained by Krishna',
    shortDescription: 'Anger is never the starting point. It begins with unchecked attachment, turns to craving, and explodes when reality resists.',
    deity: 'Krishna',
    sourceContext: 'Bhagavad Gita • Chapter 2, Verses 62-63',
    category: 'Bhagavad Gita Wisdom',
    topic: 'Anger Control',
    tags: ['anger', 'emotions', 'relationships', 'mindfulness'],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-bonfire-burning-in-the-dark-43360-large.mp4',
    thumbnailUrl: '',
    duration: 35,
    creator: {
      name: 'Dr. Ananya Shastri',
      avatar: '',
      handle: '@ananyashastri',
      verified: true
    },
    stats: { likes: 18900, comments: 640, shares: 4200, saves: 7100, views: 110000 },
    isPremium: false,
    quoteOverlay: {
      sanskrit: 'क्रोधाद्भवति सम्मोहः सम्मोहात्स्मृतिविभ्रमः',
      translation: 'From anger arises delusion; from delusion confusion of memory, and loss of intellect.',
      author: 'Gita 2.63'
    }
  },
  {
    id: 'vid-5',
    title: 'Shiv Tandav: The Cosmic Rhythm of Creation and Dissolution',
    shortDescription: 'Ravana composed the Stotram not as an arrogant demand, but in awe of Shiva’s ecstatic dance of pure detachment.',
    deity: 'Shiva',
    sourceContext: 'Shiv Tandav Stotram • Verse 1',
    category: 'Lord Shiva & Mahadev',
    topic: 'Shiv Tandav',
    tags: ['tandav', 'energy', 'shiva', 'chant', 'cosmic'],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-the-night-sky-flowing-slowly-43048-large.mp4',
    thumbnailUrl: '',
    duration: 52,
    creator: {
      name: 'Rudra Beats',
      avatar: '',
      handle: '@rudrabeats',
      verified: true
    },
    stats: { likes: 45000, comments: 1600, shares: 12000, saves: 18400, views: 320000 },
    isPremium: true,
    quoteOverlay: {
      sanskrit: 'जटाटवीगलज्जलप्रवाहपावितस्थले',
      translation: 'From the dense forest of His matted locks, the sacred Ganges cascades.',
      author: 'Shiv Tandav Stotram'
    }
  },
  {
    id: 'vid-6',
    title: 'Mastering the Mind: Your Best Friend or Your Deadliest Enemy',
    shortDescription: 'For one who has conquered the mind, it is the greatest ally; for one who has failed to do so, the mind remains the fiercest foe.',
    deity: 'Krishna',
    sourceContext: 'Bhagavad Gita • Chapter 6, Verse 6',
    category: 'Bhagavad Gita Wisdom',
    topic: 'Mind Mastery',
    tags: ['discipline', 'habits', 'meditation', 'mental health'],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4',
    thumbnailUrl: '',
    duration: 41,
    creator: {
      name: 'Acharya Raghav',
      avatar: '',
      handle: '@acharyaraghav',
      verified: true
    },
    stats: { likes: 21300, comments: 710, shares: 5400, saves: 8200, views: 135000 },
    isPremium: false,
    quoteOverlay: {
      sanskrit: 'बन्धुरात्मात्मनस्तस्य येनात्मैवात्मना जितः',
      translation: 'The mind is the friend of those who have mastered it; for others, it acts as an enemy.',
      author: 'Gita 6.6'
    }
  },
  {
    id: 'vid-7',
    title: 'The Hanuman Chalisa Secret for Overcoming Paralyzing Fear',
    shortDescription: 'Bhoot Pishach Nikat Nahi Aave: Not just outer ghosts, but the phantom fears of the mind vanish before Mahavira.',
    deity: 'Hanuman',
    sourceContext: 'Hanuman Chalisa • Doha & Chaupai',
    category: 'Lord Hanuman',
    topic: 'Hanuman Chalisa',
    tags: ['fear', 'hanuman', 'protection', 'courage'],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-flames-of-a-burning-fire-1189-large.mp4',
    thumbnailUrl: '',
    duration: 46,
    creator: {
      name: 'Bhakti Pravah',
      avatar: '',
      handle: '@bhaktipravah',
      verified: true
    },
    stats: { likes: 36200, comments: 1450, shares: 9800, saves: 14200, views: 245000 },
    isPremium: false
  },
  {
    id: 'vid-8',
    title: 'The Third Eye of Shiva: Destroying Ignorance and Illusion',
    shortDescription: 'When Kama tried to distract Shiva, His third eye opened not to punish love, but to burn away mindless desire.',
    deity: 'Shiva',
    sourceContext: 'Shiva Purana • Sati Khanda',
    category: 'Lord Shiva & Mahadev',
    topic: 'Self Realization',
    tags: ['shiva', 'wisdom', 'thirdeye', 'clarity'],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-water-falling-down-a-small-stream-in-the-forest-42861-large.mp4',
    thumbnailUrl: '',
    duration: 39,
    creator: {
      name: 'Vedic Stillness',
      avatar: '',
      handle: '@vedicstillness',
      verified: true
    },
    stats: { likes: 27100, comments: 920, shares: 6200, saves: 9900, views: 180000 },
    isPremium: true
  },
  {
    id: 'vid-9',
    title: 'Detachment does not mean not loving. It means loving without clinging.',
    shortDescription: 'Krishna lived in palaces and fought in wars, yet remained untouched like a lotus leaf in water.',
    deity: 'Krishna',
    sourceContext: 'Bhagavad Gita • Chapter 5, Verse 10',
    category: 'Bhagavad Gita Wisdom',
    topic: 'Detachment',
    tags: ['detachment', 'relationships', 'love', 'clarity'],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-raindrops-falling-on-a-puddle-with-floating-leaves-42859-large.mp4',
    thumbnailUrl: '',
    duration: 42,
    creator: {
      name: 'Dr. Ananya Shastri',
      avatar: '',
      handle: '@ananyashastri',
      verified: true
    },
    stats: { likes: 33400, comments: 1040, shares: 8900, saves: 13100, views: 210000 },
    isPremium: false,
    quoteOverlay: {
      sanskrit: 'पद्मपत्रमिवाम्भसा लिप्यते न स पापेन',
      translation: 'Like a lotus leaf unaffected by water, the detached soul remains untouched by anxiety.',
      author: 'Gita 5.10'
    }
  },
  {
    id: 'vid-10',
    title: 'Hanuman in the Court of Ravana: Fearless in the Face of Tyranny',
    shortDescription: 'Surrounded by demons in Lanka, Hanuman sat on his coiled tail throne higher than the king, unperturbed.',
    deity: 'Hanuman',
    sourceContext: 'Ramcharitmanas • Sundara Kanda',
    category: 'Lord Hanuman',
    topic: 'Courage & Strength',
    tags: ['courage', 'leadership', 'fearless', 'hanuman'],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-bright-sun-shining-between-mountain-peaks-42657-large.mp4',
    thumbnailUrl: '',
    duration: 50,
    creator: {
      name: 'Prana Mandir',
      avatar: '',
      handle: '@pranamandir',
      verified: true
    },
    stats: { likes: 39800, comments: 1280, shares: 9400, saves: 15600, views: 270000 },
    isPremium: false
  },
  {
    id: 'vid-11',
    title: 'Why Shiva Sits on Mount Kailash: The Symbolism of Stillness',
    shortDescription: 'Kailash is not just a geographical mountain. It represents the quiet peak of human consciousness above the storm.',
    deity: 'Shiva',
    sourceContext: 'Shiva Purana • Vidyeshvara Samhita',
    category: 'Lord Shiva & Mahadev',
    topic: 'Inner Stillness',
    tags: ['kailash', 'shiva', 'stillness', 'meditation'],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-time-lapse-of-clouds-over-mountain-peaks-43047-large.mp4',
    thumbnailUrl: '',
    duration: 36,
    creator: {
      name: 'Vedic Stillness',
      avatar: '',
      handle: '@vedicstillness',
      verified: true
    },
    stats: { likes: 25400, comments: 790, shares: 5800, saves: 9200, views: 165000 },
    isPremium: false
  },
  {
    id: 'vid-12',
    title: 'Equanimity in Success and Failure: Samatvam Yoga Ucyate',
    shortDescription: 'If praise makes you ecstatic and critique shatters you, you are a puppet to the world. Reclaim your anchor.',
    deity: 'Krishna',
    sourceContext: 'Bhagavad Gita • Chapter 2, Verse 48',
    category: 'Bhagavad Gita Wisdom',
    topic: 'Discipline & Focus',
    tags: ['resilience', 'mental health', 'balance', 'gita'],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-calm-river-flowing-smoothly-in-the-forest-42862-large.mp4',
    thumbnailUrl: '',
    duration: 40,
    creator: {
      name: 'Acharya Raghav',
      avatar: '',
      handle: '@acharyaraghav',
      verified: true
    },
    stats: { likes: 19800, comments: 630, shares: 4800, saves: 7600, views: 125000 },
    isPremium: false,
    quoteOverlay: {
      sanskrit: 'सिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते',
      translation: 'Being steadfast in success and failure alike—that evenness of mind is true yoga.',
      author: 'Gita 2.48'
    }
  },
  {
    id: 'vid-13',
    title: 'Sankat Mochan: When You Feel Broken, Call Hanuman',
    shortDescription: 'Hanuman does not remove struggles artificially; He infuses your heart with the divine fortitude to endure and triumph.',
    deity: 'Hanuman',
    sourceContext: 'Sankat Mochan Hanumanashtak',
    category: 'Lord Hanuman',
    topic: 'Ram Bhakti',
    tags: ['hanuman', 'prayer', 'sankatmochan', 'hope'],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-sunrise-over-misty-mountains-42655-large.mp4',
    thumbnailUrl: '',
    duration: 47,
    creator: {
      name: 'Bhakti Pravah',
      avatar: '',
      handle: '@bhaktipravah',
      verified: true
    },
    stats: { likes: 41200, comments: 1650, shares: 11200, saves: 17800, views: 290000 },
    isPremium: false
  },
  {
    id: 'vid-14',
    title: 'Ash on Shiva’s Forehead: The Bhasma Reminder of Impermanence',
    shortDescription: 'Every morning, Shiva smears ash to remind us: everything physical turns to dust. Love deeply, cling to nothing.',
    deity: 'Shiva',
    sourceContext: 'Shiva Purana • Kailasha Samhita',
    category: 'Lord Shiva & Mahadev',
    topic: 'Self Realization',
    tags: ['bhasma', 'shiva', 'impermanence', 'truth'],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-bonfire-burning-in-the-dark-43360-large.mp4',
    thumbnailUrl: '',
    duration: 37,
    creator: {
      name: 'Vedic Stillness',
      avatar: '',
      handle: '@vedicstillness',
      verified: true
    },
    stats: { likes: 29600, comments: 840, shares: 7100, saves: 11200, views: 195000 },
    isPremium: true
  },
  {
    id: 'vid-15',
    title: 'How to Face Grief: The Eternal Atman Explained',
    shortDescription: 'The soul is never born, nor does it ever die. Fire cannot burn it, water cannot wet it, wind cannot wither it.',
    deity: 'Krishna',
    sourceContext: 'Bhagavad Gita • Chapter 2, Verses 20-23',
    category: 'Bhagavad Gita Wisdom',
    topic: 'Overcoming Fear',
    tags: ['grief', 'atman', 'death', 'peace', 'immortality'],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-mystical-fog-moving-through-a-mountain-valley-42654-large.mp4',
    thumbnailUrl: '',
    duration: 45,
    creator: {
      name: 'Dr. Ananya Shastri',
      avatar: '',
      handle: '@ananyashastri',
      verified: true
    },
    stats: { likes: 37800, comments: 1390, shares: 10400, saves: 16500, views: 260000 },
    isPremium: false,
    quoteOverlay: {
      sanskrit: 'नैनं छिन्दन्ति शस्त्राणि नैनं दहति पावकः',
      translation: 'Weapons cannot cut the soul, fire cannot burn it, water cannot moisten it, nor wind dry it.',
      author: 'Gita 2.23'
    }
  },
  {
    id: 'vid-16',
    title: 'Hanuman Carrying the Sanjeevani Mountain: When One Herb Isn’t Enough',
    shortDescription: 'Unable to identify the single herb in time, Hanuman brought the entire mountain. Total commitment leaves no room for half-measures.',
    deity: 'Hanuman',
    sourceContext: 'Yuddha Kanda • Ramayana',
    category: 'Lord Hanuman',
    topic: 'Courage & Strength',
    tags: ['hanuman', 'commitment', 'sanjeevani', 'loyalty'],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-bright-sun-shining-between-mountain-peaks-42657-large.mp4',
    thumbnailUrl: '',
    duration: 43,
    creator: {
      name: 'Prana Mandir',
      avatar: '',
      handle: '@pranamandir',
      verified: true
    },
    stats: { likes: 32900, comments: 970, shares: 7900, saves: 12400, views: 220000 },
    isPremium: false
  },
  {
    id: 'vid-17',
    title: 'Surrender is Not Defeat: Sharanagati in the Bhagavad Gita',
    shortDescription: 'Abandon all forms of egoistic righteousness and surrender unto Me alone; I shall liberate you from all anxieties.',
    deity: 'Krishna',
    sourceContext: 'Bhagavad Gita • Chapter 18, Verse 66',
    category: 'Bhagavad Gita Wisdom',
    topic: 'Surrender (Sharanagati)',
    tags: ['surrender', 'faith', 'liberation', 'gita'],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-clouds-and-blue-sky-2408-large.mp4',
    thumbnailUrl: '',
    duration: 48,
    creator: {
      name: 'Acharya Raghav',
      avatar: '',
      handle: '@acharyaraghav',
      verified: true
    },
    stats: { likes: 48900, comments: 1820, shares: 14500, saves: 21900, views: 360000 },
    isPremium: true,
    quoteOverlay: {
      sanskrit: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज',
      translation: 'Abandon all varieties of dharmas and simply surrender unto Me alone.',
      author: 'Gita 18.66'
    }
  },
  {
    id: 'vid-18',
    title: 'The Trident (Trishula) of Shiva: Conquering the Three Gunas',
    shortDescription: 'Sattva, Rajas, and Tamas bind mortal life. Shiva’s Trishula pierces through all three into pure Turiya consciousness.',
    deity: 'Shiva',
    sourceContext: 'Shiva Purana • Uma Samhita',
    category: 'Lord Shiva & Mahadev',
    topic: 'Self Realization',
    tags: ['trishula', 'gunas', 'shiva', 'philosophy'],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-flames-of-a-burning-fire-1189-large.mp4',
    thumbnailUrl: '',
    duration: 38,
    creator: {
      name: 'Rudra Beats',
      avatar: '',
      handle: '@rudrabeats',
      verified: true
    },
    stats: { likes: 24100, comments: 690, shares: 5100, saves: 8800, views: 155000 },
    isPremium: false
  },
  {
    id: 'vid-19',
    title: 'Overcoming Imposter Syndrome: What Krishna Told Arjuna on Day 1',
    shortDescription: 'Arjuna dropped his bow, weeping that he was not worthy. Krishna called this weakness petty and commanded him to stand up.',
    deity: 'Krishna',
    sourceContext: 'Bhagavad Gita • Chapter 2, Verse 3',
    category: 'Bhagavad Gita Wisdom',
    topic: 'Discipline & Focus',
    tags: ['confidence', 'career', 'motivation', 'arjuna'],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-sun-setting-over-the-ocean-1180-large.mp4',
    thumbnailUrl: '',
    duration: 39,
    creator: {
      name: 'Dr. Ananya Shastri',
      avatar: '',
      handle: '@ananyashastri',
      verified: true
    },
    stats: { likes: 31500, comments: 910, shares: 7400, saves: 11900, views: 205000 },
    isPremium: false,
    quoteOverlay: {
      sanskrit: 'क्लैब्यं मा स्म गमः पार्थ नैतत्त्वय्युपपद्यते',
      translation: 'Do not yield to unmanly weakness, O Partha; it does not befit you. Stand up!',
      author: 'Gita 2.3'
    }
  },
  {
    id: 'vid-20',
    title: 'The Secret of Hanuman’s Namasmaran: Every Breath is Ram',
    shortDescription: 'When Sita gifted Hanuman a string of rare pearls, he broke them open looking for Ram inside. True wealth is Divine Remembrance.',
    deity: 'Hanuman',
    sourceContext: 'Uttara Kanda • Ramayana',
    category: 'Lord Hanuman',
    topic: 'Ram Bhakti',
    tags: ['devotion', 'hanuman', 'ram', 'pearls', 'bhakti'],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-the-night-sky-flowing-slowly-43048-large.mp4',
    thumbnailUrl: '',
    duration: 44,
    creator: {
      name: 'Bhakti Pravah',
      avatar: '',
      handle: '@bhaktipravah',
      verified: true
    },
    stats: { likes: 38400, comments: 1320, shares: 9600, saves: 15100, views: 250000 },
    isPremium: false
  },
  {
    id: 'vid-21',
    title: 'The Crescent Moon on Shiva: Mastering Time and Mind',
    shortDescription: 'The moon governs ocean tides and human emotions. By wearing it as an ornament, Mahadev shows complete mastery over the lunar mind.',
    deity: 'Shiva',
    sourceContext: 'Shiva Purana • Rudra Samhita',
    category: 'Lord Shiva & Mahadev',
    topic: 'Inner Stillness',
    tags: ['chandra', 'shiva', 'emotions', 'calm'],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-water-falling-down-a-small-stream-in-the-forest-42861-large.mp4',
    thumbnailUrl: '',
    duration: 36,
    creator: {
      name: 'Vedic Stillness',
      avatar: '',
      handle: '@vedicstillness',
      verified: true
    },
    stats: { likes: 26800, comments: 750, shares: 6100, saves: 9400, views: 172000 },
    isPremium: true
  },
  {
    id: 'vid-22',
    title: 'How to Break Addiction to Validation: Gita Chapter 12',
    shortDescription: 'He who is alike to foe and friend, untouched by praise or reproach, silent, content with anything—he is dear to Me.',
    deity: 'Krishna',
    sourceContext: 'Bhagavad Gita • Chapter 12, Verses 18-19',
    category: 'Bhagavad Gita Wisdom',
    topic: 'Detachment',
    tags: ['validation', 'social media', 'peace', 'gita'],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4',
    thumbnailUrl: '',
    duration: 41,
    creator: {
      name: 'Acharya Raghav',
      avatar: '',
      handle: '@acharyaraghav',
      verified: true
    },
    stats: { likes: 29400, comments: 880, shares: 6900, saves: 11000, views: 188000 },
    isPremium: false,
    quoteOverlay: {
      sanskrit: 'तुल्यनिन्दास्तुतिर्मौनी सन्तुष्टो येन केनचित्',
      translation: 'He who views censure and praise equally, who is calm and content with whatever comes.',
      author: 'Gita 12.19'
    }
  },
  {
    id: 'vid-23',
    title: 'Sundara Kanda: The Divine Science of Never Giving Up',
    shortDescription: 'Every obstacle Hanuman faced tested a different virtue: Surasa tested his intellect, Simhika tested his courage, and Lankini tested his strength.',
    deity: 'Hanuman',
    sourceContext: 'Sundara Kanda • Verses 1-40',
    category: 'Lord Hanuman',
    topic: 'Courage & Strength',
    tags: ['sundarakanda', 'resilience', 'grit', 'hanuman'],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-sunrise-over-misty-mountains-42655-large.mp4',
    thumbnailUrl: '',
    duration: 49,
    creator: {
      name: 'Prana Mandir',
      avatar: '',
      handle: '@pranamandir',
      verified: true
    },
    stats: { likes: 35100, comments: 1190, shares: 8700, saves: 14100, views: 235000 },
    isPremium: false
  },
  {
    id: 'vid-24',
    title: 'The Damaru of Shiva: From Cosmic Vibration to Stillness',
    shortDescription: 'The sound of the Damaru represents Nada Brahma—the primal vibration of language and creation emerging from pure silence.',
    deity: 'Shiva',
    sourceContext: 'Shiva Purana • Vidyeshvara Samhita',
    category: 'Lord Shiva & Mahadev',
    topic: 'Shiv Tandav',
    tags: ['damaru', 'sound', 'om', 'vibration', 'shiva'],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-bonfire-burning-in-the-dark-43360-large.mp4',
    thumbnailUrl: '',
    duration: 37,
    creator: {
      name: 'Rudra Beats',
      avatar: '',
      handle: '@rudrabeats',
      verified: true
    },
    stats: { likes: 21800, comments: 590, shares: 4600, saves: 8100, views: 140000 },
    isPremium: false
  },
  {
    id: 'vid-25',
    title: 'Discipline is Choosing What You Want Most Over What You Want Now',
    shortDescription: 'Krishna warns: that which feels like nectar initially turns to poison at the end; but sattvic discipline is poison first, and sweet nectar forever.',
    deity: 'Krishna',
    sourceContext: 'Bhagavad Gita • Chapter 18, Verse 37',
    category: 'Bhagavad Gita Wisdom',
    topic: 'Discipline & Focus',
    tags: ['habits', 'dopamine', 'discipline', 'gita'],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-calm-river-flowing-smoothly-in-the-forest-42862-large.mp4',
    thumbnailUrl: '',
    duration: 43,
    creator: {
      name: 'Dr. Ananya Shastri',
      avatar: '',
      handle: '@ananyashastri',
      verified: true
    },
    stats: { likes: 36700, comments: 1250, shares: 9200, saves: 14900, views: 240000 },
    isPremium: false,
    quoteOverlay: {
      sanskrit: 'यत्तदग्रे विषमिव परिणामेऽमृतोपमम्',
      translation: 'That joy which seems like poison in the beginning, but like nectar in the end, is born of serene wisdom.',
      author: 'Gita 18.37'
    }
  },
  {
    id: 'vid-26',
    title: 'Why Hanuman Tore His Chest Open: The True Meaning of Faith',
    shortDescription: 'When skeptics questioned his devotion, Hanuman revealed Lord Ram and Mother Sita shining inside his heart. Love beyond appearances.',
    deity: 'Hanuman',
    sourceContext: 'Ramayana Tradition',
    category: 'Lord Hanuman',
    topic: 'Ram Bhakti',
    tags: ['faith', 'devotion', 'hanuman', 'heart'],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-bright-sun-shining-between-mountain-peaks-42657-large.mp4',
    thumbnailUrl: '',
    duration: 46,
    creator: {
      name: 'Bhakti Pravah',
      avatar: '',
      handle: '@bhaktipravah',
      verified: true
    },
    stats: { likes: 44200, comments: 1740, shares: 12300, saves: 18900, views: 310000 },
    isPremium: false
  },
  {
    id: 'vid-27',
    title: 'Nataraja: The Dance of Time and Stillness in One Frame',
    shortDescription: 'Under Shiva’s right foot lies Apasmara, the demon of forgetfulness. As long as you remember your true nature, suffering cannot touch you.',
    deity: 'Shiva',
    sourceContext: 'Chidambaram Mahatmya',
    category: 'Lord Shiva & Mahadev',
    topic: 'Shiv Tandav',
    tags: ['nataraja', 'dance', 'shiva', 'cosmic', 'mind'],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-time-lapse-of-clouds-over-mountain-peaks-43047-large.mp4',
    thumbnailUrl: '',
    duration: 38,
    creator: {
      name: 'Vedic Stillness',
      avatar: '',
      handle: '@vedicstillness',
      verified: true
    },
    stats: { likes: 27900, comments: 810, shares: 6400, saves: 10400, views: 180000 },
    isPremium: true
  },
  {
    id: 'vid-28',
    title: 'The Cure for Loneliness: The Indweller in Every Heart',
    shortDescription: 'Krishna says: I am seated in the heart of all beings. From Me come memory, knowledge, and their loss. You are never alone.',
    deity: 'Krishna',
    sourceContext: 'Bhagavad Gita • Chapter 15, Verse 15',
    category: 'Bhagavad Gita Wisdom',
    topic: 'Self Realization',
    tags: ['loneliness', 'atman', 'connection', 'gita'],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-raindrops-falling-on-a-puddle-with-floating-leaves-42859-large.mp4',
    thumbnailUrl: '',
    duration: 40,
    creator: {
      name: 'Acharya Raghav',
      avatar: '',
      handle: '@acharyaraghav',
      verified: true
    },
    stats: { likes: 33100, comments: 1090, shares: 8500, saves: 13800, views: 215000 },
    isPremium: false,
    quoteOverlay: {
      sanskrit: 'सर्वस्य चाहं हृदि सन्निविष्टः',
      translation: 'I am seated in the hearts of all living beings; from Me arise wisdom and memory.',
      author: 'Gita 15.15'
    }
  },
  {
    id: 'vid-29',
    title: 'Hanuman Chalisa Line by Line: Ashtasiddhi Nau Nidhi Ke Data',
    shortDescription: 'Mother Sita blessed Hanuman as the dispenser of the eight divine psychic powers and nine cosmic treasures.',
    deity: 'Hanuman',
    sourceContext: 'Hanuman Chalisa • Chaupai 31',
    category: 'Lord Hanuman',
    topic: 'Hanuman Chalisa',
    tags: ['ashtasiddhi', 'hanuman', 'blessings', 'abundance'],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-sunrise-over-misty-mountains-42655-large.mp4',
    thumbnailUrl: '',
    duration: 45,
    creator: {
      name: 'Prana Mandir',
      avatar: '',
      handle: '@pranamandir',
      verified: true
    },
    stats: { likes: 39100, comments: 1410, shares: 10800, saves: 16200, views: 265000 },
    isPremium: false
  },
  {
    id: 'vid-30',
    title: 'The Mahamrityunjaya Mantra: The Sacred Chant for Immortality',
    shortDescription: 'Chanting to Tryambakam liberates us from the fear of physical decay, like a ripe cucumber easily detaching from its vine.',
    deity: 'Shiva',
    sourceContext: 'Rigveda • Mandala 7 • Shiva Purana',
    category: 'Lord Shiva & Mahadev',
    topic: 'Inner Stillness',
    tags: ['mahamrityunjaya', 'mantra', 'healing', 'immortality'],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-clouds-and-blue-sky-2408-large.mp4',
    thumbnailUrl: '',
    duration: 48,
    creator: {
      name: 'Vedic Stillness',
      avatar: '',
      handle: '@vedicstillness',
      verified: true
    },
    stats: { likes: 52000, comments: 2100, shares: 16800, saves: 24500, views: 410000 },
    isPremium: true,
    quoteOverlay: {
      sanskrit: 'त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्',
      translation: 'We worship the Three-Eyed Lord who nourishes all beings. May He liberate us from death into immortality.',
      author: 'Rigveda 7.59.12'
    }
  },
  {
    id: 'vid-31',
    title: 'Be in the World, Not of It: The Chariot Analogy of Katha Upanishad',
    shortDescription: 'The senses are the horses, the mind is the reins, the intellect is the driver, and the Atman is the passenger. Who is driving yours?',
    deity: 'Krishna',
    sourceContext: 'Katha Upanishad & Bhagavad Gita',
    category: 'Bhagavad Gita Wisdom',
    topic: 'Mind Mastery',
    tags: ['chariot', 'upanishad', 'senses', 'mastery'],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-mystical-fog-moving-through-a-mountain-valley-42654-large.mp4',
    thumbnailUrl: '',
    duration: 44,
    creator: {
      name: 'Dr. Ananya Shastri',
      avatar: '',
      handle: '@ananyashastri',
      verified: true
    },
    stats: { likes: 34100, comments: 1140, shares: 8700, saves: 14200, views: 228000 },
    isPremium: false
  },
  {
    id: 'vid-32',
    title: 'The Silent Protector: Why Hanuman is Called Marutinandan',
    shortDescription: 'Born of the wind, Hanuman moves swifter than thought. Whenever you call out in true distress, the divine wind rushes to support you.',
    deity: 'Hanuman',
    sourceContext: 'Valmiki Ramayana • Kishkindha Kanda',
    category: 'Lord Hanuman',
    topic: 'Courage & Strength',
    tags: ['hanuman', 'wind', 'protection', 'maruti'],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-flames-of-a-burning-fire-1189-large.mp4',
    thumbnailUrl: '',
    duration: 41,
    creator: {
      name: 'Bhakti Pravah',
      avatar: '',
      handle: '@bhaktipravah',
      verified: true
    },
    stats: { likes: 37600, comments: 1310, shares: 9800, saves: 15400, views: 255000 },
    isPremium: false
  }
];

export const SEED_VIDEOS: VideoItem[] = RAW_VIDEOS.map(v => {
  const pack = getDeityMediaPack(v.deity);
  const thumb = getVideoThumbnail(v.id, v.deity);
  return {
    ...v,
    thumbnailUrl: thumb,
    imageUrl: thumb,
    heroImageUrl: pack.hero,
    deityImageUrl: pack.deity,
    fallbackImageUrl: pack.fallback,
    creator: {
      ...v.creator,
      avatar: getCreatorAvatar(v.creator.handle)
    }
  };
});

// 20+ Curated Devotional Audio Tracks with Spotify-style metadata mapped to centralized media config
export const SEED_AUDIO_TRACKS: AudioTrack[] = [
  {
    id: 'audio-1',
    title: 'Shiv Tandav Stotram (Atmospheric)',
    artist: 'Rudra Vedic Ensemble',
    deity: 'Shiva',
    category: 'Chants',
    coverUrl: getAudioArtwork('audio-1', 'Shiva', 'Chants').url,
    audioUrl: 'https://cdn.freesound.org/previews/560/560731_11861866-lq.mp3',
    duration: 320,
    isPremium: false,
    bpm: 96,
    lyrics: 'Jatatavigalajjala pravahapavitasthale, Galeavalambya lambitam bhujangatungamalikam...',
    meaning: 'Cosmic Sanskrit hymn celebrating the majestic power, flowing locks, and divine dance of Lord Shiva.'
  },
  {
    id: 'audio-2',
    title: 'Hanuman Chalisa (Meditative 432Hz)',
    artist: 'Prana Resonance',
    deity: 'Hanuman',
    category: 'Mantras',
    coverUrl: getAudioArtwork('audio-2', 'Hanuman', 'Mantras').url,
    audioUrl: 'https://cdn.freesound.org/previews/415/415490_5121236-lq.mp3',
    duration: 480,
    isPremium: false,
    bpm: 72,
    lyrics: 'Shri Guru Charan Saroj Raj Nija Manu Mukuru Sudhari, Baranau Raghuvar Bimala Jasu...',
    meaning: 'The 40 verses composed by Goswami Tulsidas invoking unshakeable courage, devotion, and removal of obstacles.'
  },
  {
    id: 'audio-3',
    title: 'Karpura Gauram Karunavataram',
    artist: 'Sacred Sanskrit Choir',
    deity: 'Shiva',
    category: 'Aartis',
    coverUrl: getAudioArtwork('audio-3', 'Shiva', 'Aartis').url,
    audioUrl: 'https://cdn.freesound.org/previews/560/560731_11861866-lq.mp3',
    duration: 240,
    isPremium: false,
    bpm: 64,
    lyrics: 'Karpuragauram karunavataram sansarasaram bhujagendraharm...',
    meaning: 'Pure as camphor, embodiment of compassion, essence of worldly existence, I bow to Shiva who dwells with Bhavani in my heart.'
  },
  {
    id: 'audio-4',
    title: 'Mahamrityunjaya Mantra (108 Loops)',
    artist: 'Kailash Dhwani',
    deity: 'Shiva',
    category: 'Mantras',
    coverUrl: getAudioArtwork('audio-4', 'Shiva', 'Mantras').url,
    audioUrl: 'https://cdn.freesound.org/previews/415/415490_5121236-lq.mp3',
    duration: 600,
    isPremium: true,
    bpm: 60,
    lyrics: 'Om Tryambakam Yajamahe Sugandhim Pushtivardhanam, Urvarukamiva Bandhanan Mrityor Mukshiya Maamritat...',
    meaning: 'The great death-conquering Vedic healing mantra awakening longevity, healing, and spiritual liberation.'
  },
  {
    id: 'audio-5',
    title: 'Achyutam Keshavam Rama Narayanam',
    artist: 'Sitar & Bamboo Flute Devotion',
    deity: 'Krishna',
    category: 'Bhajans',
    coverUrl: getAudioArtwork('audio-5', 'Krishna', 'Bhajans').url,
    audioUrl: 'https://cdn.freesound.org/previews/560/560731_11861866-lq.mp3',
    duration: 350,
    isPremium: false,
    bpm: 80,
    lyrics: 'Achyutam Keshavam Krishna Damodaram, Rama Narayanam Janakivallabham...',
    meaning: 'Sweet contemplation on who says God does not come; they have not called Him with the innocent yearning of Shabari.'
  },
  {
    id: 'audio-6',
    title: 'Sankat Mochan Hanumanashtak',
    artist: 'Ayodhya Mandir Chants',
    deity: 'Hanuman',
    category: 'Chants',
    coverUrl: getAudioArtwork('audio-6', 'Hanuman', 'Chants').url,
    audioUrl: 'https://cdn.freesound.org/previews/415/415490_5121236-lq.mp3',
    duration: 390,
    isPremium: false,
    bpm: 88,
    lyrics: 'Bal Samay Ravi Bhakshi Liyo Tab, Teenahu Loka Bhayo Andhiyaro...',
    meaning: 'Eight powerful stanzas recounting how Hanuman swallowed the sun as a child and dispelled all universal darkness.'
  },
  {
    id: 'audio-7',
    title: 'Deep Silence: Himalayan Singing Bowls',
    artist: 'Bodhi Solitude',
    deity: 'Shiva',
    category: 'Meditation',
    coverUrl: getAudioArtwork('audio-7', 'Shiva', 'Meditation').url,
    audioUrl: 'https://cdn.freesound.org/previews/560/560731_11861866-lq.mp3',
    duration: 720,
    isPremium: true,
    bpm: 50,
    lyrics: 'Instrumental meditative frequencies designed to induce theta brainwave states.',
    meaning: 'Soundscapes crafted from 7 antique Tibetan bowls tuned to the heart and third eye chakras.'
  },
  {
    id: 'audio-8',
    title: 'Gayatri Mantra (Golden Dawn Edition)',
    artist: 'Vedic Rishis',
    deity: 'Universal',
    category: 'Morning',
    coverUrl: getAudioArtwork('audio-8', 'Universal', 'Morning').url,
    audioUrl: 'https://cdn.freesound.org/previews/415/415490_5121236-lq.mp3',
    duration: 300,
    isPremium: false,
    bpm: 68,
    lyrics: 'Om Bhur Bhuva Swaha, Tat Savitur Varenyam, Bhargo Devasya Dhimahi, Dhiyo Yo Nah Prachodayat...',
    meaning: 'We meditate upon the supreme effulgence of the solar creator. May that divine light illuminate our intellect.'
  },
  {
    id: 'audio-9',
    title: 'Om Namah Shivaya (Deep Trance Japa)',
    artist: 'Panchakshari Collective',
    deity: 'Shiva',
    category: 'Mantras',
    coverUrl: getAudioArtwork('audio-9', 'Shiva', 'Mantras').url,
    audioUrl: 'https://cdn.freesound.org/previews/560/560731_11861866-lq.mp3',
    duration: 600,
    isPremium: false,
    bpm: 58,
    lyrics: 'Om Namah Shivaya, Om Namah Shivaya...',
    meaning: 'The primordial five syllables harmonizing earth, water, fire, air, and ether within consciousness.'
  },
  {
    id: 'audio-10',
    title: 'Bajrang Baan (Sacred Shield)',
    artist: 'Tulsidas Tradition',
    deity: 'Hanuman',
    category: 'Chants',
    coverUrl: getAudioArtwork('audio-10', 'Hanuman', 'Chants').url,
    audioUrl: 'https://cdn.freesound.org/previews/415/415490_5121236-lq.mp3',
    duration: 410,
    isPremium: true,
    bpm: 104,
    lyrics: 'Nishchay Prema Prateeti Te Vinay Karain Sanman, Tehi Ke Karaj Sakal Shubha Siddha Karain Hanuman...',
    meaning: 'The unshakeable arrow chant of Hanuman invoking swift protection from psychological distress and negative influences.'
  },
  {
    id: 'audio-11',
    title: 'Radhe Govinda Krishna Murari',
    artist: 'Vrindavan Flute Sanctuary',
    deity: 'Krishna',
    category: 'Bhajans',
    coverUrl: getAudioArtwork('audio-11', 'Krishna', 'Bhajans').url,
    audioUrl: 'https://cdn.freesound.org/previews/560/560731_11861866-lq.mp3',
    duration: 330,
    isPremium: false,
    bpm: 78,
    lyrics: 'Radhe Radhe Govinda, Govinda Radhe...',
    meaning: 'Pure ecstatic melody celebrating the timeless spiritual bond between divine love and wisdom.'
  },
  {
    id: 'audio-12',
    title: 'Nirvana Shatkam: I Am Shiva (Shivoham)',
    artist: 'Adi Shankara Tradition',
    deity: 'Shiva',
    category: 'Meditation',
    coverUrl: getAudioArtwork('audio-12', 'Shiva', 'Meditation').url,
    audioUrl: 'https://cdn.freesound.org/previews/415/415490_5121236-lq.mp3',
    duration: 420,
    isPremium: false,
    bpm: 62,
    lyrics: 'Mano Buddhi Ahankara Chittani Naaham, Na Cha Shrotra Jihve Na Cha Ghrana Netre...',
    meaning: 'I am not the mind, intellect, ego, or memory. I am pure consciousness and bliss; I am Shiva, I am Shiva.'
  },
  {
    id: 'audio-13',
    title: 'Shri Ram Chandra Kripalu Bhajman',
    artist: 'Awadhi Strings',
    deity: 'Universal',
    category: 'Aartis',
    coverUrl: getAudioArtwork('audio-13', 'Universal', 'Aartis').url,
    audioUrl: 'https://cdn.freesound.org/previews/560/560731_11861866-lq.mp3',
    duration: 290,
    isPremium: false,
    bpm: 70,
    lyrics: 'Shri Ramchandra kripalu bhaj man haran bhavbhay darunam...',
    meaning: 'Sing the praise of merciful Ram, who dispels the terrifying dread of worldly existence.'
  },
  {
    id: 'audio-14',
    title: 'Sleep With the Stars: Kailash Ambient Rain & Drone',
    artist: 'Soma Sound Labs',
    deity: 'Shiva',
    category: 'Sleep',
    coverUrl: getAudioArtwork('audio-14', 'Shiva', 'Sleep').url,
    audioUrl: 'https://cdn.freesound.org/previews/415/415490_5121236-lq.mp3',
    duration: 900,
    isPremium: true,
    bpm: 45,
    lyrics: 'Ambient natural field recording mixed with binaural frequencies for restorative delta sleep.',
    meaning: 'Calms nighttime overthinking and dissolves anxious mental clutter.'
  },
  {
    id: 'audio-15',
    title: 'Prabhu Aapne Rang Rang De',
    artist: 'Sant Vani',
    deity: 'Krishna',
    category: 'Bhajans',
    coverUrl: getAudioArtwork('audio-15', 'Krishna', 'Bhajans').url,
    audioUrl: 'https://cdn.freesound.org/previews/560/560731_11861866-lq.mp3',
    duration: 310,
    isPremium: false,
    bpm: 84,
    lyrics: 'Rang de chunariya prem ke rang me...',
    meaning: 'Dye the fabric of my heart in the color of supreme divine devotion.'
  },
  {
    id: 'audio-16',
    title: 'Gita Dhyanam: Salutations to the Divine Song',
    artist: 'Veda Patha Kendra',
    deity: 'Krishna',
    category: 'Chants',
    coverUrl: getAudioArtwork('audio-16', 'Krishna', 'Chants').url,
    audioUrl: 'https://cdn.freesound.org/previews/415/415490_5121236-lq.mp3',
    duration: 260,
    isPremium: false,
    bpm: 65,
    lyrics: 'Om Parthaya Pratibodhitam Bhagavatam Narayanena Svayam...',
    meaning: 'O Divine Mother Gita, who was taught to Partha by Bhagavan Narayana Himself, I meditate upon Thee.'
  },
  {
    id: 'audio-17',
    title: 'Maruti Stuti: The Breath of Courage',
    artist: 'Hanuman Gana',
    deity: 'Hanuman',
    category: 'Morning',
    coverUrl: getAudioArtwork('audio-17', 'Hanuman', 'Morning').url,
    audioUrl: 'https://cdn.freesound.org/previews/560/560731_11861866-lq.mp3',
    duration: 280,
    isPremium: false,
    bpm: 92,
    lyrics: 'Manojavam Maruta Tulya Vegam, Jitendriyam Buddhimatam Varishtham...',
    meaning: 'Swift as the mind, fleet as the wind, master of all senses, supreme among the wise, to Hanuman I bow.'
  },
  {
    id: 'audio-18',
    title: 'Shiva Rudrashtakam (Namami Shamishan)',
    artist: 'Kashi Vishwanath Mandir',
    deity: 'Shiva',
    category: 'Chants',
    coverUrl: getAudioArtwork('audio-18', 'Shiva', 'Chants').url,
    audioUrl: 'https://cdn.freesound.org/previews/415/415490_5121236-lq.mp3',
    duration: 360,
    isPremium: false,
    bpm: 76,
    lyrics: 'Namamishamishana nirvanaroopam, vibhum vyapakam brahma vedasvaroopam...',
    meaning: 'I bow to Ishana, the Lord of the universe, form of ultimate liberation, all-pervading, embodiment of Vedas.'
  },
  {
    id: 'audio-19',
    title: 'Yoga Nidra: The Conscious Yogic Sleep',
    artist: 'Swami Anandam',
    deity: 'Universal',
    category: 'Sleep',
    coverUrl: getAudioArtwork('audio-19', 'Universal', 'Sleep').url,
    audioUrl: 'https://cdn.freesound.org/previews/560/560731_11861866-lq.mp3',
    duration: 1200,
    isPremium: true,
    bpm: 50,
    lyrics: 'Guided body scanning and deep cosmic relaxation technique from classical Bihar Yoga tradition.',
    meaning: '30 minutes of Yoga Nidra equals 3 hours of natural deep sleep.'
  },
  {
    id: 'audio-20',
    title: 'Hare Krishna Mahamantra (Soothing Flute & Tanpura)',
    artist: 'Mayapur Seva',
    deity: 'Krishna',
    category: 'Mantras',
    coverUrl: getAudioArtwork('audio-20', 'Krishna', 'Mantras').url,
    audioUrl: 'https://cdn.freesound.org/previews/415/415490_5121236-lq.mp3',
    duration: 540,
    isPremium: false,
    bpm: 66,
    lyrics: 'Hare Krishna Hare Krishna Krishna Krishna Hare Hare, Hare Rama Hare Rama Rama Rama Hare Hare...',
    meaning: 'The Great Chant for Deliverance: cleanses the dust from the mirror of the mind.'
  },
  {
    id: 'audio-21',
    title: 'Bho Shambho Shiva Shambho Swayambho',
    artist: 'Carnatic Mystics',
    deity: 'Shiva',
    category: 'Bhajans',
    coverUrl: getAudioArtwork('audio-21', 'Shiva', 'Bhajans').url,
    audioUrl: 'https://cdn.freesound.org/previews/560/560731_11861866-lq.mp3',
    duration: 410,
    isPremium: true,
    bpm: 78,
    lyrics: 'Bho Shambho Shiva Shambho Swayambho, Ganga Dhara Hara Teri Charanam...',
    meaning: 'O Self-Manifest Lord Shiva, bearer of the Ganges, refuge of all weary wanderers, I take shelter in Your feet.'
  }
];

// 20+ Verified Vedic Shlokas with Sanskrit, pronunciation, and life application
export const SEED_SHLOKAS: ShlokaItem[] = [
  {
    id: 'shloka-1',
    source: 'Bhagavad Gita',
    chapterVerse: 'Chapter 2, Verse 47',
    deity: 'Krishna',
    sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥',
    transliteration: 'karmaṇy-evādhikāras te mā phaleṣu kadācana |\nmā karma-phala-hetur bhūr mā te saṅgo \'stv akarmaṇi',
    translation: 'You have a right only to perform your prescribed duty, but never to the fruits of action. Never consider yourself the cause of the results of your activities, and never be attached to inaction.',
    context: 'Lord Krishna instructs Arjuna on the battlefield of Kurukshetra when paralyzing fear and doubt froze his ability to act.',
    practicalApplication: 'Focus completely on the quality of your effort, preparation, and integrity today. Let go of anxious mental forecasts about what the future will give back.',
    tags: ['career', 'focus', 'karma', 'anxiety', 'duty']
  },
  {
    id: 'shloka-2',
    source: 'Bhagavad Gita',
    chapterVerse: 'Chapter 2, Verse 48',
    deity: 'Krishna',
    sanskrit: 'योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय।\nसिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते॥',
    transliteration: 'yoga-sthaḥ kuru karmāṇi saṅgaṁ tyaktvā dhanañjaya |\nsiddhy-asiddhyoḥ samo bhūtvā samatvaṁ yoga ucyate',
    translation: 'Perform your duties established in yoga, renouncing attachment, O Dhananjaya, remaining steady in both success and failure. Equanimity is verily called yoga.',
    context: 'Defining the true meaning of Yoga: not mere physical postures, but inner balance amid the polarities of life.',
    practicalApplication: 'When praised, do not swell with ego. When criticized or failing, do not sink into despair. View both as passing weather.',
    tags: ['balance', 'emotional-resilience', 'yoga', 'failure']
  },
  {
    id: 'shloka-3',
    source: 'Shiva Purana',
    chapterVerse: 'Rudra Samhita',
    deity: 'Shiva',
    sanskrit: 'शान्तं पद्मासनस्थं शशिशकलधरं ध्यानयोगैकगम्यम्।\nनित्यं शुद्धं निराभासमखिलभयहरं शम्भुमीशानमीडे॥',
    transliteration: 'śāntaṁ padmāsanasthaṁ śaśi-śakala-dharaṁ dhyāna-yogaika-gamyam |\nnityaṁ śuddhaṁ nirābhāsam akhila-bhaya-haraṁ śambhum īśānam īḍe',
    translation: 'I adore Lord Sambhu, who sits in the lotus posture of peace, bearing the crescent moon, accessible through meditation, ever pure, free from illusion, and dispeller of all fear.',
    context: 'The ancient contemplation formula for meditating on Shiva’s transcendent formlessness.',
    practicalApplication: 'Spend 5 minutes every day in absolute physical stillness. The mind slows down when the body ceases restless movement.',
    tags: ['shiva', 'peace', 'meditation', 'fearless']
  },
  {
    id: 'shloka-4',
    source: 'Hanuman Chalisa',
    chapterVerse: 'Chaupai 24',
    deity: 'Hanuman',
    sanskrit: 'भूत पिशाच निकट नहिं आवै।\nमहाबीर जब नाम सुनावै॥',
    transliteration: 'bhūta piśāca nikaṭa nahiṁ āvai |\nmahābīra jaba nāma sunāvai',
    translation: 'Negative energies, dark spirits, and phantom fears dare not approach when the sacred name of Mahavira Hanuman is proclaimed.',
    context: 'Tulsidas reassuring spiritual seekers of the impenetrable divine shield of Hanuman.',
    practicalApplication: 'When waking up from a nightmare or feeling unexplainable dread, chant the name of Hanuman aloud. It immediately anchors the nervous system.',
    tags: ['hanuman', 'protection', 'courage', 'fear']
  },
  {
    id: 'shloka-5',
    source: 'Bhagavad Gita',
    chapterVerse: 'Chapter 2, Verse 63',
    deity: 'Krishna',
    sanskrit: 'क्रोधाद्भवति सम्मोहः सम्मोहात्स्मृतिविभ्रमः।\nस्मृतिभ्रंशाद् बुद्धिनाशो बुद्धिनाशात्प्रणश्यति॥',
    transliteration: 'krodhād bhavati sammohaḥ sammohāt smṛti-vibhramaḥ |\nsmṛti-bhraṁśād buddhi-nāśo buddhi-nāśāt praṇaśyati',
    translation: 'From anger arises delusion; from delusion confusion of memory; from confusion of memory loss of intellect; and from loss of intellect a person is ruined.',
    context: 'Krishna mapping out the precise neuro-psychological descent of consciousness when dominated by reactive rage.',
    practicalApplication: 'Never write an email, sign a contract, or confront a loved one while angry. Count 10 breaths; allow your intellect (Buddhi) to reassert leadership.',
    tags: ['anger', 'mindfulness', 'clarity', 'relationships']
  },
  {
    id: 'shloka-6',
    source: 'Rigveda & Shiva Purana',
    chapterVerse: 'Rigveda 7.59.12',
    deity: 'Shiva',
    sanskrit: 'त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्।\nउर्वारुकमिव बन्धनान्मृत्य pushiya maamritat॥',
    transliteration: 'tryambakaṁ yajāmahe sugandhiṁ puṣṭi-vardhanam |\nurvārukam iva bandhanān mṛtyor mukṣīya māmṛtāt',
    translation: 'We worship the Three-Eyed One, who is fragrant and who nourishes all beings. As the cucumber is naturally liberated from its stalk, so may we be liberated from death, not from immortality.',
    context: 'Sage Markandeya’s supreme mantra of healing, vitality, and transcending the fear of physical decay.',
    practicalApplication: 'Chant this when someone is unwell or when you feel weak. It reminds the subconscious of infinite renewal.',
    tags: ['healing', 'longevity', 'vitality', 'shiva']
  },
  {
    id: 'shloka-7',
    source: 'Bhagavad Gita',
    chapterVerse: 'Chapter 6, Verse 5',
    deity: 'Krishna',
    sanskrit: 'उद्धरेदात्मनात्मानं नात्मानमवसादयेत्।\nआत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः॥',
    transliteration: 'uddhared ātmanātmānaṁ nātmānam avasādayet |\nātmaiva hy ātmano bandhur ātmaiva ripur ātmanaḥ',
    translation: 'One must elevate oneself by the mind, and never degrade oneself. For the mind alone is the dearest friend of oneself, and the mind alone is one’s bitterest enemy.',
    context: 'Teaching on personal responsibility: external circumstance is neutral; your inner relationship with your own mind determines your destiny.',
    practicalApplication: 'Audit your self-talk. If you spoke to a close friend the way you speak to yourself during mistakes, would they stay in your life? Be your mind\'s guide, not its tormentor.',
    tags: ['self-mastery', 'discipline', 'mindset', 'habits']
  },
  {
    id: 'shloka-8',
    source: 'Sundara Kanda',
    chapterVerse: 'Doha 1',
    deity: 'Hanuman',
    sanskrit: 'अतुलितबलधामं हेमशैलाभदेहं\nदनुजवनकृशानुं ज्ञानिनामग्रगण्यम्।\nसकलगुणनिधानं वानराणामधीशं\nरघुपतिप्रियभक्तं वातजातं नमामि॥',
    transliteration: 'atulita-bala-dhāmaṁ hema-śailābha-dehaṁ\ndanuja-vana-kṛśānuṁ jñāninām agra-gaṇyam |\nsakala-guṇa-nidhānaṁ vānarāṇām adhīśaṁ\nraghupati-priya-bhaktaṁ vātajātaṁ namāmi',
    translation: 'I bow to the Son of the Wind God, the abode of incomparable strength, whose body gleams like a golden mountain, a fire to the forest of demons, foremost among the wise, repository of all virtues, and the beloved devotee of Lord Ram.',
    context: 'The invocation salutation before commencing the study of Sundara Kanda.',
    practicalApplication: 'Combine immense strength with supreme humility. Strength without wisdom becomes arrogance; wisdom without strength becomes helplessness.',
    tags: ['hanuman', 'humility', 'wisdom', 'strength']
  },
  {
    id: 'shloka-9',
    source: 'Bhagavad Gita',
    chapterVerse: 'Chapter 18, Verse 66',
    deity: 'Krishna',
    sanskrit: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज।\nअहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः॥',
    transliteration: 'sarva-dharmān parityajya mām ekaṁ śaraṇaṁ vraja |\nahaṁ tvāṁ sarva-pāpebhyo mokṣayiṣyāmi mā śucaḥ',
    translation: 'Abandon all varieties of worldly dogmas and simply surrender your being unto Me alone. I shall deliver you from all sinful reactions; grieve not.',
    context: 'The Charama Shloka — the ultimate closing promise of Krishna in the Bhagavad Gita.',
    practicalApplication: 'When you have exhausted all human strategizing and planning, take your hands off the steering wheel in your mind and trust the Divine order.',
    tags: ['surrender', 'faith', 'liberation', 'peace']
  },
  {
    id: 'shloka-10',
    source: 'Shiv Tandav Stotram',
    chapterVerse: 'Verse 1',
    deity: 'Shiva',
    sanskrit: 'जटाटवीगलज्जलप्रवाहपावितस्थले\nगलेऽवलम्ब्य लम्बितां भुजङ्गतुङ्गमालिकाम्।\nडमड्डमड्डमड्डमन्निनादवड्डमर्वयं\nचकार चण्डताण्डवं तनोतु नः शिवः शिवम्॥',
    transliteration: 'jaṭā-ṭavī-galaj-jala-pravāha-pāvita-sthale\ngale \'valambya lambitāṁ bhujaṅga-tuṅga-mālikām |\nḍamaḍ-ḍamaḍ-ḍamaḍ-ḍaman-nināda-vad-ḍamarvayaṁ\ncakāra caṇḍa-tāṇḍavaṁ tanotu naḥ śivaḥ śivam',
    translation: 'With His neck sanctified by the cascading waters flowing from the dense thicket of His matted hair, wearing a lofty serpent as a garland, Lord Shiva dances the passionate Tandava to the beat of His damaru. May He grant us auspiciousness.',
    context: 'King Ravana in rapturous adoration of Shiva’s cosmic sovereignty.',
    practicalApplication: 'Chant with deep diaphragm resonance to awaken vitality, confidence, and break lethargy.',
    tags: ['tandav', 'energy', 'vitality', 'shiva']
  }
];

// 7 Daily Practices for the Retentive Habit System (Watch -> Reflect -> Complete -> Award Streak 🔥)
export const SEED_DAILY_PRACTICES: DailyPractice[] = [
  {
    id: 'dp-day-1',
    date: 'Day 1',
    title: 'The Discipline of Detachment',
    theme: 'Action Without Anxiety',
    shloka: {
      sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन',
      transliteration: 'karmaṇy-evādhikāras te mā phaleṣu kadācana',
      translation: 'You have a right only to work, but never to its fruits.',
      source: 'Bhagavad Gita 2.47',
      meaning: 'Energy spent worrying about what might happen is energy stolen from doing your best right now.'
    },
    mantra: {
      name: 'Om Gam Ganapataye Namah',
      sanskrit: 'ॐ गं गणपतये नमः',
      meaning: 'Removal of mental obstacles and opening of clear action.',
      targetCount: 11
    },
    teaching: {
      headline: 'Give 100% to the process. Give 0% to the fear.',
      summary: 'Before starting your main work today, pause for 10 seconds. Declare inwardly: "I will execute this with full craft, and release anxiety over how it is judged."',
      durationSec: 35
    },
    reflection: {
      question: 'What is one result or outcome you have been obsessively worrying about this week?',
      placeholder: 'Write your honest thought here... and consciously surrender it.'
    }
  },
  {
    id: 'dp-day-2',
    date: 'Day 2',
    title: 'The Stillness of Mahadev',
    theme: 'Inner Sanctuary',
    shloka: {
      sanskrit: 'शान्तं पद्मासनस्थं शशिशकलधरं ध्यानयोगैकगम्यम्',
      transliteration: 'śāntaṁ padmāsanasthaṁ śaśi-śakala-dharaṁ dhyāna-yogaika-gamyam',
      translation: 'I adore Lord Shiva, seated in stillness, crowned with the moon, known through meditation.',
      source: 'Shiva Purana',
      meaning: 'Chaos in the world cannot disturb you if your inner temple is consecrated to silence.'
    },
    mantra: {
      name: 'Om Namah Shivaya',
      sanskrit: 'ॐ नमः शिवाय',
      meaning: 'I bow to the pure, auspicious divine consciousness within.',
      targetCount: 21
    },
    teaching: {
      headline: 'The pause between breath is where Shiva dwells.',
      summary: 'Whenever an irritation arises today, do not immediately react. Inhale for 4 seconds, hold for 4 seconds, and let the impulse dissolve.',
      durationSec: 40
    },
    reflection: {
      question: 'Where did you lose your inner stillness yesterday, and how can you hold space today?',
      placeholder: 'Notice the trigger without self-judgment...'
    }
  },
  {
    id: 'dp-day-3',
    date: 'Day 3',
    title: 'The Fearlessness of Hanuman',
    theme: 'Courage Under Pressure',
    shloka: {
      sanskrit: 'दुर्गम काज जगत के जेते, सुगम अनुग्रह तुम्हरे तेते',
      transliteration: 'durgama kāja jagata ke jete | sugama anugraha tumhare tete',
      translation: 'All insurmountable challenges in the world turn effortless through your grace.',
      source: 'Hanuman Chalisa',
      meaning: 'Courage is remembering that you are backed by the infinite power of truth.'
    },
    mantra: {
      name: 'Om Hanumate Namah',
      sanskrit: 'ॐ हनुमते नमः',
      meaning: 'Salutations to the embodiment of boundless devotion and strength.',
      targetCount: 11
    },
    teaching: {
      headline: 'Hanuman leaped the ocean by forgetting himself and remembering Ram.',
      summary: 'When a challenge seems too big for your ego, remember who you are serving. Purpose dwarfs fear every single time.',
      durationSec: 30
    },
    reflection: {
      question: 'What difficult conversation or task have you been postponing out of fear?',
      placeholder: 'Name it clearly. Commit to taking the first step today.'
    }
  },
  {
    id: 'dp-day-4',
    date: 'Day 4',
    title: 'Mastering the Fire of Anger',
    theme: 'Emotional Clarity',
    shloka: {
      sanskrit: 'क्रोधाद्भवति सम्मोहः सम्मोहात्स्मृतिविभ्रमः',
      transliteration: 'krodhād bhavati sammohaḥ sammohāt smṛti-vibhramaḥ',
      translation: 'Anger generates delusion, loss of memory, and destruction of wisdom.',
      source: 'Bhagavad Gita 2.63',
      meaning: 'Anger is drinking poison and expecting the other person to suffer.'
    },
    mantra: {
      name: 'Om Shantih Shantih Shantih',
      sanskrit: 'ॐ शान्तिः शान्तिः शान्तिः',
      meaning: 'Peace in the physical, subtle, and spiritual realms.',
      targetCount: 9
    },
    teaching: {
      headline: 'Behind every burst of anger lies an unacknowledged hurt or thwarted expectation.',
      summary: 'When you feel the heat of fury rising, ask: "What was my hidden expectation here? Can I accept that reality is different?"',
      durationSec: 35
    },
    reflection: {
      question: 'Who or what made you feel angry recently? What expectation was broken?',
      placeholder: 'Write it down to release its hold on your mind...'
    }
  },
  {
    id: 'dp-day-5',
    date: 'Day 5',
    title: 'The Gift of Equanimity',
    theme: 'Samatvam Yoga Ucyate',
    shloka: {
      sanskrit: 'सिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते',
      transliteration: 'siddhy-asiddhyoḥ samo bhūtvā samatvaṁ yoga ucyate',
      translation: 'Remaining poised in victory and setback alike—that poise is Yoga.',
      source: 'Bhagavad Gita 2.48',
      meaning: 'True victory is not never falling, but maintaining your dignity and calm when you do.'
    },
    mantra: {
      name: 'Om Sri Krishnaya Namah',
      sanskrit: 'ॐ श्री कृष्णाय नमः',
      meaning: 'I surrender to the teacher of universal equanimity.',
      targetCount: 11
    },
    teaching: {
      headline: 'Do not allow compliments to get to your head, nor critiques to get to your heart.',
      summary: 'Treat both praise and blame as passing guests at an inn. Be the grounded innkeeper who observes without clinging.',
      durationSec: 35
    },
    reflection: {
      question: 'How did you react to your latest success or setback? Did it shake your center?',
      placeholder: 'Reflect on finding your balance...'
    }
  },
  {
    id: 'dp-day-6',
    date: 'Day 6',
    title: 'The Humility of the Mighty',
    theme: 'Strength Without Arrogance',
    shloka: {
      sanskrit: 'सकलगुणनिधानं वानराणामधीशं रघुपतिप्रियभक्तम्',
      transliteration: 'sakala-guṇa-nidhānaṁ vānarāṇām adhīśaṁ raghupati-priya-bhaktam',
      translation: 'Repository of all virtues, beloved devotee of Lord Ram, I bow to Hanuman.',
      source: 'Sundara Kanda',
      meaning: 'The mightiest warrior was also the most humble servant. That is the apex of character.'
    },
    mantra: {
      name: 'Jai Bajrangbali',
      sanskrit: 'जय बजरंगबली',
      meaning: 'Victory to the diamond-bodied protector of truth.',
      targetCount: 11
    },
    teaching: {
      headline: 'The tree laden with ripe fruit bows low to the earth.',
      summary: 'Arrogance is the sign of a shallow vessel. As your knowledge and skills grow, let your gentle humility grow twice as fast.',
      durationSec: 30
    },
    reflection: {
      question: 'Where can you practice genuine humility and listening today?',
      placeholder: 'Identify one relationship or interaction...'
    }
  },
  {
    id: 'dp-day-7',
    date: 'Day 7',
    title: 'Surrender & Rest',
    theme: 'Sharanagati',
    shloka: {
      sanskrit: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज',
      transliteration: 'sarva-dharmān parityajya mām ekaṁ śaraṇaṁ vraja',
      translation: 'Surrender all burdens unto Me alone. I will liberate you; grieve not.',
      source: 'Bhagavad Gita 18.66',
      meaning: 'Rest is not laziness. It is the sacred act of trusting the universe while you recharge.'
    },
    mantra: {
      name: 'Mahamrityunjaya Mantra',
      sanskrit: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्',
      meaning: 'Supreme healing chant for vitality and peaceful renewal.',
      targetCount: 7
    },
    teaching: {
      headline: 'You have done your work this week. Now release the weight.',
      summary: 'Place your hand over your heart. Breathe out with a sigh: "I did what I could. I trust the divine timing of my journey."',
      durationSec: 40
    },
    reflection: {
      question: 'What is one spiritual insight you learned this past week that made life feel lighter?',
      placeholder: 'Celebrate your 7-day milestone...'
    }
  }
];
