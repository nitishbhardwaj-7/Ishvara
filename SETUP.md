# Ishvara — Production Setup

The app is a **read-only content app**: you upload videos and songs through a private admin page and everyone who installs the app sees them. There are no accounts, likes, comments, or payments.

```
 You (admin page on GitHub Pages)                Listeners (Android app)
        │ upload                                          │ watch / listen
        ▼                                                 ▼
 Supabase Edge Function "bunny" ──► Bunny.net ◄── video/audio streamed from CDN
        │                          (Stream = videos, Storage = songs)
        ▼
 Supabase Postgres (titles, schedule) ◄──────────── app reads the list of live content
                                                    app asks "ask-divya" function → Gemini
```

Content goes live at its **publish time**. The admin page defaults each new upload to *the day after your latest scheduled item, 6:00 AM*, so you can upload a week in one sitting and one item goes live each day.

---

## 1. Supabase (database, admin login, server functions) — free tier is fine

1. Create a project at https://supabase.com (pick a region near India, e.g. Mumbai).
2. **SQL Editor → New query** → paste all of [`supabase/schema.sql`](supabase/schema.sql) → **Run**.
3. Make yourself an admin (same SQL editor):
   ```sql
   insert into public.admins (email) values ('your-email@example.com');
   ```
4. **Authentication → URL Configuration**
   - Site URL: `https://nitishbhardwaj-7.github.io/Ishvara/admin/`
   - Redirect URLs: add `https://nitishbhardwaj-7.github.io/Ishvara/admin/**` and `http://localhost:3001/**`
5. **Project Settings → API**: copy the **Project URL** and the **anon / publishable key** (safe to put in the app — the database rules protect your data). *Never* use the `service_role` key anywhere except Supabase itself.

## 2. Bunny.net (video + audio hosting)

1. Create an account at https://bunny.net.
2. **Stream → Add Video Library** (e.g. `ishvara`). Open it → **API**: note the **Library ID**, **API Key**, and **CDN Hostname** (looks like `vz-abc123-456.b-cdn.net`).
3. **Storage → Add Storage Zone** (e.g. `ishvara-media`, main region close to your users). Open it → **FTP & API Access**: note the **Password** (this is the storage API key) and the **Hostname** (e.g. `sg.storage.bunnycdn.com`).
4. In the storage zone click **Connect Pull Zone** → create one; note its URL, e.g. `https://ishvara-media.b-cdn.net`.
5. If videos ever fail to play in the app: Stream library → **Pull zone settings → CORS**, make sure `m3u8, ts, m4s` are in the CORS extension list.

## 3. Gemini API key (for Ask Divya)

Create a key at https://aistudio.google.com/apikey. Set a billing budget alert in Google Cloud. The function limits each device to 20 questions/hour (`AI_HOURLY_LIMIT`).

## 4. Deploy the server functions

Run in this project folder (needs the Supabase CLI via `bunx`):

```bash
bunx supabase login
```
```bash
bunx supabase link --project-ref YOUR_PROJECT_REF
```
```bash
bunx supabase secrets set GEMINI_API_KEY=... BUNNY_STREAM_LIBRARY_ID=... BUNNY_STREAM_API_KEY=... BUNNY_STREAM_CDN_HOST=vz-xxxx.b-cdn.net BUNNY_STORAGE_ZONE=ishvara-media BUNNY_STORAGE_API_KEY=... BUNNY_STORAGE_HOST=sg.storage.bunnycdn.com BUNNY_STORAGE_CDN_URL=https://ishvara-media.b-cdn.net
```
```bash
bunx supabase functions deploy ask-divya --no-verify-jwt
```
```bash
bunx supabase functions deploy bunny --no-verify-jwt
```

(`--no-verify-jwt` is intentional: `ask-divya` is public and rate-limited; `bunny` checks the admin's login itself.)

## 5. GitHub settings

**Settings → Secrets and variables → Actions → Variables** (not secrets — these are public values baked into the app):

| Variable | Value |
|---|---|
| `VITE_SUPABASE_URL` | your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | anon / publishable key |
| `VITE_SUPPORT_EMAIL` | the email shown to users & on the privacy policy |
| `VITE_PRIVACY_POLICY_URL` | `https://nitishbhardwaj-7.github.io/Ishvara/privacy.html` |

**Settings → Pages → Source: GitHub Actions.** Then run the **Deploy website & admin** workflow (Actions tab → Run workflow). Your admin page will be at `https://nitishbhardwaj-7.github.io/Ishvara/admin/`.

## 6. Signing key for Google Play (one time)

Generate an **upload key** (needs Java; Android Studio includes it). Keep the `.jks` file and passwords somewhere safe and **never commit it**:

```bash
keytool -genkeypair -v -keystore ishvara-upload.jks -alias ishvara -keyalg RSA -keysize 2048 -validity 10000
```

Convert it to text for GitHub (PowerShell):

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("ishvara-upload.jks")) | Set-Clipboard
```

Add these under **Settings → Secrets and variables → Actions → Secrets**:

| Secret | Value |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | the clipboard contents from above |
| `ANDROID_KEYSTORE_PASSWORD` | keystore password |
| `ANDROID_KEY_ALIAS` | `ishvara` |
| `ANDROID_KEY_PASSWORD` | key password |

From the next push on, the **Build Android App** workflow produces a signed `.aab` (in the run's *Artifacts*) — that is what you upload to Play. Every build gets a higher `versionCode` automatically. Bump `"version"` in `package.json` for user-visible version names.

## 7. Google Play Console checklist

- **App signing**: use *Play App Signing* (default). Your GitHub key is the *upload key*.
- **Closed testing first**: new personal developer accounts must run a closed test with **12+ testers for 14 days** before production access.
- **Store listing assets** are in [`assets/`](assets/): `play-store-icon-512.png`, `play-feature-graphic-1024x500.png`. Take phone screenshots from the test build.
- **Privacy policy URL**: `https://nitishbhardwaj-7.github.io/Ishvara/privacy.html`
- **Data safety**: no accounts, no ads, no analytics. Ask Divya questions are sent to Gemini and not stored; IP addresses are kept ≤24h only for rate limiting; journey data stays on the device. Answer the form to match [`site/privacy.html`](site/privacy.html).
- **AI-generated content**: Ask Divya has an in-app "Report response" link (emails `VITE_SUPPORT_EMAIL`), as Play's AI policy requires.
- **Content rating**: complete the IARC questionnaire (devotional content, no violence, no user interaction between users).

## Local development

```bash
bun install
```
```bash
bun run dev
```
Without Supabase configured, `bun run dev` shows a few sample items so you can work on the UI. Put real values in `.env.local` (see `.env.example`) to use your live content. The admin page runs with `bun run dev:admin` at http://localhost:3001.
