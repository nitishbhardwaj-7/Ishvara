// Ask Divya — scripture-grounded answers via Gemini.
// Deploy: supabase functions deploy ask-divya --no-verify-jwt
// Secrets: GEMINI_API_KEY (required), GEMINI_MODEL (optional), AI_HOURLY_LIMIT (optional)

import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders, json, requireEnv } from '../_shared/http.ts';

interface ScriptureDoc {
  source: string;
  deity: 'Krishna' | 'Shiva' | 'Hanuman';
  sanskrit: string;
  translation: string;
  tags: string[];
  application: string;
}

const KNOWLEDGE_BASE: ScriptureDoc[] = [
  {
    source: 'Bhagavad Gita 2.47',
    deity: 'Krishna',
    sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥',
    translation: 'You have a right only to perform your prescribed duty, but never to the fruits of action. Never consider yourself the cause of the results, and never be attached to inaction.',
    tags: ['career', 'anxiety', 'fear', 'result', 'stress', 'work', 'pressure', 'failure', 'success', 'future', 'exam'],
    application: 'Put your full energy into preparation and honest effort now, and release the demand for a specific outcome.',
  },
  {
    source: 'Bhagavad Gita 2.48',
    deity: 'Krishna',
    sanskrit: 'योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय। सिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते॥',
    translation: 'Perform your duties established in yoga, renouncing attachment, remaining even in success and failure. Equanimity is called yoga.',
    tags: ['failure', 'balance', 'calm', 'emotion', 'success', 'resilience'],
    application: 'Treat wins and setbacks as feedback, and keep inner steadiness regardless of outside turbulence.',
  },
  {
    source: 'Bhagavad Gita 2.62–63',
    deity: 'Krishna',
    sanskrit: 'ध्यायतो विषयान्पुंसः सङ्गस्तेषूपजायते। सङ्गात्सञ्जायते कामः कामात्क्रोधोऽभिजायते॥',
    translation: 'Dwelling on sense objects breeds attachment; from attachment comes desire, and from desire unfulfilled comes anger. Anger leads to delusion and the ruin of understanding.',
    tags: ['anger', 'frustration', 'rage', 'impulse', 'desire', 'conflict', 'argument'],
    application: 'Before reacting in anger, ask which expectation reality did not meet.',
  },
  {
    source: 'Bhagavad Gita 6.5',
    deity: 'Krishna',
    sanskrit: 'उद्धरेदात्मनात्मानं नात्मानमवसादयेत्। आत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः॥',
    translation: 'Lift yourself by your own self; do not let yourself sink. The mind alone is your friend, and the mind alone is your enemy.',
    tags: ['discipline', 'procrastination', 'self-doubt', 'habit', 'motivation', 'mindset', 'focus', 'lazy'],
    application: 'Build small daily habits instead of waiting for inspiration; your self-talk shapes your strength.',
  },
  {
    source: 'Bhagavad Gita 12.13–14',
    deity: 'Krishna',
    sanskrit: 'अद्वेष्टा सर्वभूतानां मैत्रः करुण एव च। निर्ममो निरहङ्कारः समदुःखसुखः क्षमी॥',
    translation: 'One who bears no hatred toward any being, who is friendly and compassionate, free from possessiveness and ego, even in joy and sorrow, and forgiving — such a devotee is dear to Me.',
    tags: ['relationship', 'forgive', 'love', 'compassion', 'kindness', 'ego', 'family', 'hurt'],
    application: 'When hurt, respond with compassionate boundaries rather than bitterness.',
  },
  {
    source: 'Shiva Purana — Dhyana Shloka',
    deity: 'Shiva',
    sanskrit: 'शान्तं पद्मासनस्थं शशिशकलधरं ध्यानयोगैकगम्यम्। नित्यं शुद्धं निराभासमखिलभयहरं शम्भुमीशानमीडे॥',
    translation: 'I praise Shambhu, the peaceful one seated in lotus posture, bearing the crescent moon, reached through meditation — eternal, pure, and remover of all fear.',
    tags: ['fear', 'peace', 'stillness', 'meditation', 'ego', 'silence', 'shiva', 'mahadev'],
    application: 'Hold difficult emotions with calm awareness, the way Shiva holds poison in his throat without being harmed by it.',
  },
  {
    source: 'Shiv Tandav Stotram, Verse 12',
    deity: 'Shiva',
    sanskrit: 'दृषद्विचित्रतल्पयोर्भुजङ्गमौक्तिकस्रजोः ... समं प्रवर्तयन्मनः कदा सदाशिवं भजे॥',
    translation: 'When will I worship Sadashiva with an even mind — seeing a stone bed and a soft couch, a serpent and a pearl necklace, friend and foe, a blade of grass and a lotus, as equal?',
    tags: ['detachment', 'equality', 'judgment', 'ego', 'acceptance', 'shiva', 'letting go'],
    application: 'Drop the constant labelling of events as good or bad and practise the witness attitude (sakshi bhava).',
  },
  {
    source: 'Hanuman Chalisa, Chaupai 24',
    deity: 'Hanuman',
    sanskrit: 'भूत पिशाच निकट नहिं आवै। महाबीर जब नाम सुनावै॥',
    translation: 'No evil spirits come near when the name of Mahavir Hanuman is recited.',
    tags: ['fear', 'courage', 'strength', 'nightmare', 'lonely', 'protection', 'hanuman'],
    application: 'Courage grows from devotion to something greater than your fear; anchor your mind in remembrance.',
  },
  {
    source: 'Hanuman Chalisa, Chaupai 20',
    deity: 'Hanuman',
    sanskrit: 'दुर्गम काज जगत के जेते। सुगम अनुग्रह तुम्हरे तेते॥',
    translation: 'Every difficult task in the world becomes easy by your grace.',
    tags: ['challenge', 'impossible', 'obstacle', 'humility', 'faith', 'strength', 'hanuman'],
    application: 'When a goal feels too big, set aside ego, take the next step, and surrender the weight to the Divine.',
  },
];

function retrieve(question: string): ScriptureDoc[] {
  const q = question.toLowerCase();
  return KNOWLEDGE_BASE
    .map(doc => {
      let score = 0;
      for (const tag of doc.tags) if (q.includes(tag)) score += 3;
      if (q.includes(doc.deity.toLowerCase())) score += 5;
      if (q.includes('gita') && doc.source.includes('Gita')) score += 4;
      return { doc, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(s => s.doc);
}

function fallbackAnswer(doc: ScriptureDoc) {
  return {
    answer: 'Take a breath. Scripture has guided many through moments like this one.',
    citation: { source: doc.source, sanskrit: doc.sanskrit, translation: doc.translation },
    takeaway: doc.application,
  };
}

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  let question = '';
  try {
    const body = await req.json();
    question = typeof body?.question === 'string' ? body.question.trim().slice(0, 500) : '';
  } catch {
    // fall through to validation
  }
  if (question.length < 2) return json({ error: 'Please ask a question.' }, 400);

  // Per-client hourly rate limit to protect the Gemini bill
  const supabase = createClient(requireEnv('SUPABASE_URL'), requireEnv('SUPABASE_SERVICE_ROLE_KEY'));
  const clientKey = (req.headers.get('x-forwarded-for') ?? 'unknown').split(',')[0].trim();
  const limit = Number(Deno.env.get('AI_HOURLY_LIMIT') ?? '20');
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from('ai_requests')
    .select('id', { count: 'exact', head: true })
    .eq('client_key', clientKey)
    .gte('created_at', since);
  if ((count ?? 0) >= limit) {
    return json({ error: 'You have asked many questions this hour. Please pause, reflect, and try again later.' }, 429);
  }
  await supabase.from('ai_requests').insert({ client_key: clientKey });
  // Occasionally purge old rate-limit rows (privacy policy promises ≤ 24h retention)
  if (Math.random() < 0.05) {
    await supabase.from('ai_requests').delete().lt('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
  }

  const docs = retrieve(question);
  const primary = docs[0];
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) return json(fallbackAnswer(primary));

  const model = Deno.env.get('GEMINI_MODEL') ?? 'gemini-2.5-flash';
  const prompt = `You are Divya, a calm and respectful spiritual guide in the Ishvara app, drawing on the Bhagavad Gita, Shiva traditions, and Hanuman bhakti.

Rules:
- Never invent verses, verse numbers, or stories. Only cite from the reference passages below.
- Keep scripture and your practical interpretation clearly separate.
- Warm, grounded, concise. No excessive exclamation marks.
- You are not a doctor, therapist, or lawyer. If the user mentions self-harm, a medical emergency, or danger, gently urge them to contact local emergency services or a trusted person right away.
- Reply in the same language the user wrote in (English, Hindi, or Hinglish).

Reference passages:
${docs.map(d => `- ${d.source}: "${d.translation}" (Application: ${d.application})`).join('\n')}

Respond ONLY with JSON:
{"answer": "2-4 sentences addressing the question", "citationSource": "exact source string of the most relevant reference passage", "takeaway": "2-3 practical sentences for today"}

User question: ${JSON.stringify(question)}`;

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json', temperature: 0.3, maxOutputTokens: 600 },
      }),
    });
    if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`);
    const data = await res.json();
    const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const parsed = JSON.parse(text);
    const cited = docs.find(d => d.source === parsed.citationSource) ?? primary;
    return json({
      answer: String(parsed.answer ?? ''),
      citation: { source: cited.source, sanskrit: cited.sanskrit, translation: cited.translation },
      takeaway: String(parsed.takeaway ?? cited.application),
    });
  } catch (err) {
    console.error('ask-divya gemini error', err);
    return json(fallbackAnswer(primary));
  }
});
