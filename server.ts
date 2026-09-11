import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(process.cwd(), "public")));
app.use("/assets", express.static(path.join(process.cwd(), "public", "assets")));

// Dedicated ZIP download route
app.get(["/api/download-zip", "/download.zip", "/ishvara-app.zip"], (req, res) => {
  const zipPath = path.join(process.cwd(), "public", "ishvara-app.zip");
  res.download(zipPath, "ishvara-app.zip", (err) => {
    if (err) {
      console.error("Error sending ZIP download:", err);
      if (!res.headersSent) {
        res.status(500).json({ error: "Could not serve ZIP file" });
      }
    }
  });
});

// Base64 chunked download endpoint for iframe safety
app.get("/api/zip-base64", (req, res) => {
  try {
    const fs = require("fs");
    const zipPath = path.join(process.cwd(), "public", "ishvara-app.zip");
    const fileBuffer = fs.readFileSync(zipPath);
    const base64 = fileBuffer.toString("base64");
    res.json({
      filename: "ishvara-app.zip",
      sizeBytes: fileBuffer.length,
      data: base64
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Initialize Gemini client if key is available
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Curated RAG Scripture Knowledge Base
interface ScriptureDoc {
  id: string;
  source: string;
  deity: "Krishna" | "Shiva" | "Hanuman" | "Universal";
  sanskrit: string;
  transliteration: string;
  translation: string;
  tags: string[];
  modernApplication: string;
}

const SCRIPTURE_KNOWLEDGE_BASE: ScriptureDoc[] = [
  {
    id: "gita-2-47",
    source: "Bhagavad Gita • Chapter 2, Verse 47",
    deity: "Krishna",
    sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
    transliteration: "karmaṇy-evādhikāras te mā phaleṣu kadācana | mā karma-phala-hetur bhūr mā te saṅgo 'stv akarmaṇi",
    translation: "You have a right only to perform your prescribed duty, but never to the fruits of action. Never consider yourself the cause of the results of your activities, and never be attached to inaction.",
    tags: ["career", "anxiety", "fear", "results", "stress", "work", "pressure", "failure", "success", "future"],
    modernApplication: "Pour 100% of your energy into your preparation, execution, and ethics right now. Release the psychological burden of demanding a specific outcome, which only generates paralyzing anxiety."
  },
  {
    id: "gita-2-48",
    source: "Bhagavad Gita • Chapter 2, Verse 48",
    deity: "Krishna",
    sanskrit: "योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय। सिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते॥",
    transliteration: "yoga-sthaḥ kuru karmāṇi saṅgaṁ tyaktvā dhanañjaya | siddhy-asiddhyoḥ samo bhūtvā samatvaṁ yoga ucyate",
    translation: "Perform your duties established in yoga, renouncing attachment, O Dhananjaya, remaining steady in both success and failure. Equanimity is verily called yoga.",
    tags: ["failure", "balance", "calm", "emotional stability", "success", "resilience"],
    modernApplication: "Treat both momentary wins and temporary setbacks as neutral feedback loops. True strength is maintaining inner stillness regardless of external turbulence."
  },
  {
    id: "gita-2-62-63",
    source: "Bhagavad Gita • Chapter 2, Verses 62-63",
    deity: "Krishna",
    sanskrit: "ध्यायतो विषयान्पुंसः सङ्गस्तेषूपजायते। सङ्गात्सञ्जायते कामः कामात्क्रोधोऽभिजायते॥ क्रोधाद्भवति सम्मोहः सम्मोहात्स्मृतिविभ्रमः। स्मृतिभ्रंशाद् बुद्धिनाशो बुद्धिनाशात्प्रणश्यति॥",
    transliteration: "dhyāyato viṣayān puṁsaḥ saṅgas teṣūpajāyate | saṅgāt sañjāyate kāmaḥ kāmāt krodho 'bhijāyate || krodhād bhavati sammohaḥ...",
    translation: "Contemplating sense objects leads to attachment; from attachment arises desire; from desire unfulfilled arises anger. From anger arises delusion, from delusion loss of memory, loss of intellect, and ruin.",
    tags: ["anger", "frustration", "rage", "impulse", "desire", "conflict", "arguments"],
    modernApplication: "Anger is always the symptom of an uninspected expectation or blocked desire. Step back before reacting; ask: 'What expectation am I clinging to that reality did not satisfy?'"
  },
  {
    id: "gita-6-5",
    source: "Bhagavad Gita • Chapter 6, Verse 5",
    deity: "Krishna",
    sanskrit: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत्। आत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः॥",
    transliteration: "uddhared ātmanātmānaṁ nātmānam avasādayet | ātmaiva hy ātmano bandhur ātmaiva ripur ātmanaḥ",
    translation: "One must elevate oneself through the mind, and not degrade oneself. For the mind alone is the friend of the conditioned soul, and the mind alone is the enemy.",
    tags: ["discipline", "procrastination", "self-doubt", "habit", "motivation", "mindset", "focus"],
    modernApplication: "Your inner self-talk either builds your spiritual armor or tears it down. Train your mind through daily micro-habits rather than waiting for emotional inspiration."
  },
  {
    id: "shiva-rudra-samhita",
    source: "Shiva Purana • Rudra Samhita",
    deity: "Shiva",
    sanskrit: "शान्तं पद्मासनस्थं शशिशकलधरं ध्यानयोगैकगम्यम्। नित्यं शुद्धं निराभासमखिलभयहरं शम्भुमीशानमीडे॥",
    transliteration: "śāntaṁ padmāsanasthaṁ śaśi-śakala-dharaṁ dhyāna-yogaika-gamyam | nityaṁ śuddhaṁ nirābhāsam akhila-bhaya-haraṁ śambhum īśānam īḍe",
    translation: "I adore Lord Shiva, the embodiment of profound peace, seated in the lotus pose, crowned with the crescent moon, accessible through inward meditation, eternally pure, and the dispeller of all fear.",
    tags: ["fear", "peace", "stillness", "meditation", "ego", "silence", "shiva", "mahadev"],
    modernApplication: "Shiva holds poison in His throat without swallowing or spewing it out. When facing negativity, hold it with conscious awareness without letting it contaminate your heart."
  },
  {
    id: "shiva-tandav-4",
    source: "Shiv Tandav Stotram • Verse 4",
    deity: "Shiva",
    sanskrit: "दृषद्विचित्रतल्पयोर्भुजङ्गमौक्तिकस्रजोर्गरिष्ठरत्नलोष्टयोः सुहृद्विपक्षपक्षयोः। तृणारविन्दचक्षुषोः प्रजामहीमहेन्द्रयोः समं प्रवर्तयन्मनः कदा सदाशिवं भजे॥",
    transliteration: "dṛṣad-vicitra-talpayor bhujaṅga-mauktika-srajor... samaṁ pravartayan manaḥ kadā sadāśivaṁ bhaje",
    translation: "When will I worship Sada-Shiva with equanimity of mind—viewing a hard stone bed and a luxurious couch equally, a serpent and a pearl garland equally, friends and enemies equally, a blade of grass and a lotus eye equally?",
    tags: ["detachment", "equality", "judgment", "ego", "acceptance", "shiva"],
    modernApplication: "Drop the exhausting mental habit of constantly labeling people and events as 'favorable' or 'unfavorable'. Cultivate Shiva's witness consciousness (Sakshi Bhava)."
  },
  {
    id: "hanuman-chalisa-24",
    source: "Hanuman Chalisa • Verse 24",
    deity: "Hanuman",
    sanskrit: "भूत पिशाच निकट नहिं आवै। महाबीर जब नाम सुनावै॥",
    transliteration: "bhūta piśāca nikaṭa nahiṁ āvai | mahābīra jaba nāma sunāvai",
    translation: "No evil forces, dark anxieties, or negative spirits can draw near when the sacred name of Mahavira Hanuman is remembered and chanted.",
    tags: ["fear", "courage", "strength", "nightmares", "loneliness", "protection", "hanuman"],
    modernApplication: "Courage is not the absence of fear, but the presence of an unbreakable devotion to something greater. Anchor your heart in Hanuman's unshakeable remembrance."
  },
  {
    id: "hanuman-chalisa-20",
    source: "Hanuman Chalisa • Verse 20",
    deity: "Hanuman",
    sanskrit: "दुर्गम काज जगत के जेते। सुगम अनुग्रह तुम्हरे तेते॥",
    transliteration: "durgama kāja jagata ke jete | sugama anugraha tumhare tete",
    translation: "All arduous, seemingly impossible tasks in this world become effortlessly attainable by your boundless divine grace.",
    tags: ["challenges", "impossible", "obstacles", "humility", "faith", "ram bhakti", "strength"],
    modernApplication: "When a goal feels insurmountable, dismantle personal arrogance and surrender the weight to the Divine. Hanuman leaped the vast ocean through pure selfless surrender."
  },
  {
    id: "gita-12-13-14",
    source: "Bhagavad Gita • Chapter 12, Verses 13-14",
    deity: "Krishna",
    sanskrit: "अद्वेष्टा सर्वभूतानां मैत्रः करुण एव च। निर्ममो निरहङ्कारः समदुःखसुखः क्षमी॥",
    transliteration: "adveṣṭā sarva-bhūtānāṁ maitraḥ karuṇa eva ca | nirmamo nirahaṅkāraḥ sama-duḥkha-sukhaḥ kṣamī",
    translation: "One who is not envious of any living entity, who is a kind friend to all, free from false possession and ego, tranquil in joy and sorrow, and patient—such a devotee is very dear to Me.",
    tags: ["relationships", "forgiveness", "love", "compassion", "kindness", "ego"],
    modernApplication: "When hurt by others, recognize that hatred only poisons the vessel holding it. Respond with compassionate boundaries rather than defensive bitterness."
  }
];

// Helper: Match best scripture references for RAG context
function retrieveScriptureContext(query: string, preferredDeity?: string): ScriptureDoc[] {
  const q = query.toLowerCase();
  const scored = SCRIPTURE_KNOWLEDGE_BASE.map(doc => {
    let score = 0;
    doc.tags.forEach(tag => {
      if (q.includes(tag)) score += 3;
    });
    if (q.includes(doc.deity.toLowerCase())) score += 5;
    if (preferredDeity && doc.deity.toLowerCase() === preferredDeity.toLowerCase()) score += 2;
    if (q.includes("gita") && doc.source.includes("Gita")) score += 4;
    if (q.includes("shiva") && doc.source.includes("Shiva")) score += 4;
    if (q.includes("hanuman") && doc.source.includes("Hanuman")) score += 4;
    return { doc, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 3).map(s => s.doc);
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "Ishvara",
    aiEnabled: !!ai,
    timestamp: new Date().toISOString()
  });
});

// AI Spiritual Guide endpoint ("Ask Divya")
app.post("/api/ai/ask-spiritual-guide", async (req, res) => {
  try {
    const { question, userLanguage = "English", preferredDeity = "Universal" } = req.body;

    if (!question || typeof question !== "string" || question.trim().length < 2) {
      return res.status(400).json({ error: "Please provide a valid spiritual inquiry or question." });
    }

    const matchedDocs = retrieveScriptureContext(question, preferredDeity);
    const primaryDoc = matchedDocs[0] || SCRIPTURE_KNOWLEDGE_BASE[0];

    // If Gemini client is active, use gemini-3.8-flash with RAG
    if (ai) {
      const ragPrompt = `
You are Divya, the compassionate, revered, and authentic Spiritual Guide inside Ishvara.
You provide grounding wisdom from Lord Shiva, Lord Hanuman, and the Bhagavad Gita.

STRICT INSTRUCTIONS:
1. DO NOT invent scriptures, verse numbers, or mythical stories.
2. Ground your wisdom in verified Vedic philosophy (Advaita, Karma Yoga, Bhakti, Shiva Purana, Sundara Kanda).
3. Clearly distinguish authentic sacred scripture citation from practical modern interpretation.
4. Tone: Calm, deeply grounded, warm, dignified, modern yet sacred. Never preachy, no excessive exclamation marks.
5. Provide response strictly as JSON adhering to this schema:
{
  "shortAnswer": "2-3 sentences of empathetic spiritual insight addressing the user's situation.",
  "sacredCitation": {
    "source": "${primaryDoc.source}",
    "sanskrit": "${primaryDoc.sanskrit}",
    "transliteration": "${primaryDoc.transliteration}",
    "translation": "${primaryDoc.translation}"
  },
  "modernTakeaway": "3-4 concise, pragmatic sentences explaining how to apply this wisdom today in work, relationships, or inner peace.",
  "recommendedPractice": "A 1-minute daily spiritual practice (e.g., breathwork, mantra chant, or contemplation) directly suited to this issue."
}

User question: "${question}"
User preferred deity or inspiration: "${preferredDeity}"
User preferred language/style: "${userLanguage}"

Knowledge Base Reference:
${matchedDocs.map(d => `${d.source}: ${d.translation} (Application: ${d.modernApplication})`).join("\n")}
`;

      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: ragPrompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.3,
          },
        });

        const textOutput = response.text?.trim() || "";
        const parsed = JSON.parse(textOutput);
        return res.json({
          success: true,
          data: parsed,
          matchedSources: matchedDocs.map(m => m.source),
        });
      } catch (err: any) {
        console.error("Gemini API call error in Ask Divya, using curated RAG fallback:", err);
      }
    }

    // Curated High-Fidelity RAG Fallback
    const fallbackResponse = {
      shortAnswer: `In the wisdom of ${primaryDoc.deity}, moments of ${question.toLowerCase().includes("anger") ? "anger" : question.toLowerCase().includes("fear") ? "fear and uncertainty" : "challenge"} are sacred invitations to turn inward and remember your indestructible true nature.`,
      sacredCitation: {
        source: primaryDoc.source,
        sanskrit: primaryDoc.sanskrit,
        transliteration: primaryDoc.transliteration,
        translation: primaryDoc.translation
      },
      modernTakeaway: primaryDoc.modernApplication,
      recommendedPractice: primaryDoc.deity === "Hanuman"
        ? "Close your eyes for 60 seconds. Chant 'Om Hanumate Namah' 11 times, visualizing an aura of diamond-like courage encircling your chest."
        : primaryDoc.deity === "Shiva"
        ? "Sit in stillness for 3 minutes. Inhale slowly for 4 counts, hold for 4 counts, and exhale for 6 counts with 'Om Namah Shivaya'."
        : "Reflect on this: Take one responsible action right now, and consciously surrender the fear of the outcome to the Supreme."
    };

    return res.json({
      success: true,
      data: fallbackResponse,
      matchedSources: matchedDocs.map(m => m.source),
      isCuratedRAG: true
    });
  } catch (error: any) {
    console.error("Error handling Ask Divya:", error);
    res.status(500).json({ error: "Unable to complete spiritual inquiry at this moment." });
  }
});

// Static Vite middleware configuration
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Ishvara] Server running at http://0.0.0.0:${PORT}`);
  });
}

start();
