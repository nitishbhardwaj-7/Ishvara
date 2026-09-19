// Admin-only media operations against Bunny.net. Keeps Bunny API keys server-side.
// Deploy: supabase functions deploy bunny --no-verify-jwt
// Secrets:
//   BUNNY_STREAM_LIBRARY_ID, BUNNY_STREAM_API_KEY, BUNNY_STREAM_CDN_HOST (e.g. vz-abc123.b-cdn.net)
//   BUNNY_STORAGE_ZONE, BUNNY_STORAGE_API_KEY (storage zone password),
//   BUNNY_STORAGE_HOST (optional, default storage.bunnycdn.com — use your region's host, e.g. sg.storage.bunnycdn.com),
//   BUNNY_STORAGE_CDN_URL (pull zone URL, e.g. https://ishvara-media.b-cdn.net)
//
// Actions (POST):
//   JSON {action: 'create-video', title}   → Bunny Stream video + signed TUS upload credentials
//   JSON {action: 'video-status', guids: string[]} → encoding status per video
//   JSON {action: 'delete-video', guid}
//   multipart form {action: 'upload-file', kind: 'audio'|'image', file} → public CDN URL
//   JSON {action: 'delete-file', url}

import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders, json, requireEnv } from '../_shared/http.ts';

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function assertAdmin(req: Request): Promise<string | null> {
  const token = req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return null;
  const supabase = createClient(requireEnv('SUPABASE_URL'), requireEnv('SUPABASE_SERVICE_ROLE_KEY'));
  const { data, error } = await supabase.auth.getUser(token);
  const email = data?.user?.email;
  if (error || !email) return null;
  const { data: row } = await supabase.from('admins').select('email').ilike('email', email).maybeSingle();
  return row ? email : null;
}

function storageBase(): string {
  const host = Deno.env.get('BUNNY_STORAGE_HOST') ?? 'storage.bunnycdn.com';
  return `https://${host}/${requireEnv('BUNNY_STORAGE_ZONE')}`;
}

const EXTENSIONS: Record<string, string> = {
  'audio/mpeg': 'mp3',
  'audio/mp3': 'mp3',
  'audio/mp4': 'm4a',
  'audio/x-m4a': 'm4a',
  'audio/aac': 'aac',
  'audio/wav': 'wav',
  'audio/x-wav': 'wav',
  'audio/ogg': 'ogg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  try {
    const admin = await assertAdmin(req);
    if (!admin) return json({ error: 'Not authorized. Is your email in the admins table?' }, 403);

    const isMultipart = (req.headers.get('content-type') ?? '').includes('multipart/form-data');

    if (isMultipart) {
      const form = await req.formData();
      if (form.get('action') !== 'upload-file') return json({ error: 'Unknown action' }, 400);
      const kind = form.get('kind');
      const file = form.get('file');
      if ((kind !== 'audio' && kind !== 'image') || !(file instanceof File)) {
        return json({ error: 'Expected kind (audio|image) and file' }, 400);
      }
      const ext = EXTENSIONS[file.type];
      if (!ext || !file.type.startsWith(kind)) return json({ error: `Unsupported file type: ${file.type}` }, 400);

      const path = `${kind === 'audio' ? 'songs' : 'covers'}/${crypto.randomUUID()}.${ext}`;
      const res = await fetch(`${storageBase()}/${path}`, {
        method: 'PUT',
        headers: { AccessKey: requireEnv('BUNNY_STORAGE_API_KEY'), 'Content-Type': 'application/octet-stream' },
        body: file.stream(),
      });
      if (!res.ok) return json({ error: `Bunny Storage upload failed (${res.status}): ${await res.text()}` }, 502);
      return json({ url: `${requireEnv('BUNNY_STORAGE_CDN_URL').replace(/\/$/, '')}/${path}` });
    }

    const body = await req.json();

    if (body.action === 'create-video') {
      const libraryId = requireEnv('BUNNY_STREAM_LIBRARY_ID');
      const apiKey = requireEnv('BUNNY_STREAM_API_KEY');
      const res = await fetch(`https://video.bunnycdn.com/library/${libraryId}/videos`, {
        method: 'POST',
        headers: { AccessKey: apiKey, 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ title: String(body.title ?? 'Untitled').slice(0, 200) }),
      });
      if (!res.ok) return json({ error: `Bunny Stream create failed (${res.status}): ${await res.text()}` }, 502);
      const video = await res.json();
      const guid: string = video.guid;
      const expiration = Math.floor(Date.now() / 1000) + 6 * 60 * 60; // 6 hours to finish the upload
      const signature = await sha256Hex(`${libraryId}${apiKey}${expiration}${guid}`);
      const cdn = requireEnv('BUNNY_STREAM_CDN_HOST').replace(/^https?:\/\//, '').replace(/\/$/, '');
      return json({
        guid,
        libraryId,
        expiration,
        signature,
        videoUrl: `https://${cdn}/${guid}/playlist.m3u8`,
        thumbnailUrl: `https://${cdn}/${guid}/thumbnail.jpg`,
      });
    }

    if (body.action === 'video-status') {
      const guids: string[] = Array.isArray(body.guids) ? body.guids.filter((g: unknown) => typeof g === 'string').slice(0, 50) : [];
      const libraryId = requireEnv('BUNNY_STREAM_LIBRARY_ID');
      const apiKey = requireEnv('BUNNY_STREAM_API_KEY');
      const statuses: Record<string, { status: number; encodeProgress: number; length: number }> = {};
      await Promise.all(
        guids.map(async guid => {
          const res = await fetch(`https://video.bunnycdn.com/library/${libraryId}/videos/${guid}`, {
            headers: { AccessKey: apiKey, Accept: 'application/json' },
          });
          if (!res.ok) return;
          const v = await res.json();
          // Bunny status: 0 created, 1 uploaded, 2 processing, 3 transcoding, 4 finished, 5 error, 6 upload failed
          statuses[guid] = { status: v.status, encodeProgress: v.encodeProgress ?? 0, length: v.length ?? 0 };
        }),
      );
      return json({ statuses });
    }

    if (body.action === 'delete-video') {
      const guid = String(body.guid ?? '');
      if (!/^[0-9a-f-]{36}$/i.test(guid)) return json({ error: 'Invalid guid' }, 400);
      const res = await fetch(
        `https://video.bunnycdn.com/library/${requireEnv('BUNNY_STREAM_LIBRARY_ID')}/videos/${guid}`,
        { method: 'DELETE', headers: { AccessKey: requireEnv('BUNNY_STREAM_API_KEY') } },
      );
      if (!res.ok && res.status !== 404) return json({ error: `Bunny delete failed (${res.status})` }, 502);
      return json({ ok: true });
    }

    if (body.action === 'delete-file') {
      const cdnBase = requireEnv('BUNNY_STORAGE_CDN_URL').replace(/\/$/, '');
      const url = String(body.url ?? '');
      if (!url.startsWith(`${cdnBase}/`)) return json({ ok: true }); // not a file we host
      const path = url.slice(cdnBase.length + 1);
      if (!/^(songs|covers)\/[0-9a-f-]+\.[a-z0-9]+$/i.test(path)) return json({ error: 'Invalid path' }, 400);
      const res = await fetch(`${storageBase()}/${path}`, {
        method: 'DELETE',
        headers: { AccessKey: requireEnv('BUNNY_STORAGE_API_KEY') },
      });
      if (!res.ok && res.status !== 404) return json({ error: `Bunny delete failed (${res.status})` }, 502);
      return json({ ok: true });
    }

    return json({ error: 'Unknown action' }, 400);
  } catch (err) {
    console.error('bunny function error', err);
    return json({ error: err instanceof Error ? err.message : 'Unexpected error' }, 500);
  }
});
