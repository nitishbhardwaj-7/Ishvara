# Ishvara (ईश्वर)

Daily devotional videos and songs for Lord Shiva, Lord Hanuman, and the Bhagavad Gita. It's an Android app built with React, Vite, and Capacitor.

- **Home**: vertical video feed of the videos you publish, newest first
- **Songs**: bhajans, mantras, aartis, and chants with a full player
- **Explore**: browse by deity, search, and a bundled shloka library
- **Journey**: a daily 5-minute practice (shloka, japa counter, reflection) with a streak kept on the device
- **Ask Divya**: an AI guide grounded in scripture (Gemini)

No accounts, likes, comments, or payments. Content is managed from a private admin page.

**Setting up production (Supabase, Bunny.net, signing, Play Store): see [SETUP.md](SETUP.md).**

## Project layout

| Path | What |
|---|---|
| `src/` | The listener app (bundled into the APK) |
| `admin/` | Admin uploader (deployed to GitHub Pages at `/admin/`) |
| `site/` | Landing page and privacy policy (GitHub Pages) |
| `supabase/schema.sql` | Database tables and security rules |
| `supabase/functions/` | `ask-divya` (AI) and `bunny` (uploads) edge functions |
| `android/` | Capacitor Android project |
| `assets/` | Icon, splash, and Play Store graphics sources |

## Builds

Every push to `main` runs **Build Android App**. The installable APK is published to the [latest release](https://github.com/nitishbhardwaj-7/Ishvara/releases/tag/latest). Once signing is configured, the run also produces a signed `.aab` for Google Play under its Artifacts.
