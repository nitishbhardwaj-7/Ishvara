# Ishvara (ईश्वर) — Sacred Sadhana, Wisdom & Devotion

A modern spiritual and devotional content platform focused on Lord Shiva, Lord Hanuman, and the eternal wisdom of the Bhagavad Gita.

Built with React 19, TypeScript, Tailwind CSS, Vite, and Capacitor / PWA architectures. Typography powered by the Lazzer Medium typeface from Displaay Type Foundry.

---

## Features

- **9:16 Devotional Video Feed**: Dynamic vertical reels with Sanskrit shlokas, English/Hindi translations, commentary, and deity tags.
- **Audio & Chants Engine**: Streaming audio player with sacred chants, mantras, background loop controls, and playback speeds.
- **Sadhana Daily Tracker**: Track meditation minutes, mantra japa counters, daily spiritual streaks, and reflective milestones.
- **Ask Divya AI**: Context-grounded spiritual assistant powered by Google Gemini, answering queries with authentic scripture citations (Bhagavad Gita, Shiva Purana, Ramcharitmanas).
- **Mobile Ready & Installable**:
  - **PWA**: Fully installable directly from your browser with offline caching and standalone display.
  - **Capacitor**: Ready for iOS and Android native deployment via Xcode and Android Studio.
- **Curated Typography**: Authentic Lazzer Medium variable font integration with full OpenType feature support.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion
- **Backend & Middleware**: Node.js, Express, Vite
- **Mobile Packaging**: Capacitor CLI, vite-plugin-pwa
- **AI Engine**: `@google/genai` (Gemini API)
- **Icons**: Lucide React

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Locally in Development Mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
npm start
```

### 4. Build for Mobile (Capacitor)
```bash
# Sync web build to native folders
npm run cap:sync

# Run on iOS or Android simulator / device
npm run cap:ios
npm run cap:android
```

---

## License

MIT
