import { ShlokaItem, DailyPractice } from '../types';

// Static scripture library bundled with the app (works offline).

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
