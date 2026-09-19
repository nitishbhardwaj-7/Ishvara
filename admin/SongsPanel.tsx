import React, { useCallback, useEffect, useState } from 'react';
import {
  DEITIES,
  Deity,
  SONG_CATEGORIES,
  SongRow,
  deleteBunnyFile,
  fmtDuration,
  nextSlot,
  readMediaDuration,
  supabase,
  toLocalInput,
  uploadFile,
} from './api';
import { Card, Field, LiveBadge, ProgressBar } from './shared';

type Category = (typeof SONG_CATEGORIES)[number];

interface FormState {
  title: string;
  artist: string;
  deity: Deity;
  category: Category;
  lyrics: string;
  meaning: string;
  publishAt: string;
  isPublished: boolean;
}

const emptyForm = (publishAt: Date): FormState => ({
  title: '',
  artist: '',
  deity: 'Shiva',
  category: 'Bhajans',
  lyrics: '',
  meaning: '',
  publishAt: toLocalInput(publishAt),
  isPublished: true,
});

export const SongsPanel: React.FC = () => {
  const [songs, setSongs] = useState<SongRow[]>([]);
  const [editing, setEditing] = useState<SongRow | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm(new Date()));
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<{ value: number; label: string } | null>(null);
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(0);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from('songs').select('*').order('publish_at', { ascending: false });
    if (error) {
      setMessage({ kind: 'error', text: error.message });
      return;
    }
    setSongs(data as SongRow[]);
    return data as SongRow[];
  }, []);

  useEffect(() => {
    load().then(rows => rows && setForm(f => ({ ...f, publishAt: toLocalInput(nextSlot(rows)) })));
  }, [load]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm(f => ({ ...f, [key]: value }));

  const resetForm = (rows = songs) => {
    setEditing(null);
    setAudioFile(null);
    setCoverFile(null);
    setProgress(null);
    setFileInputKey(k => k + 1);
    setForm(emptyForm(nextSlot(rows)));
  };

  const startEdit = (s: SongRow) => {
    setEditing(s);
    setAudioFile(null);
    setCoverFile(null);
    setMessage(null);
    setFileInputKey(k => k + 1);
    setForm({
      title: s.title,
      artist: s.artist,
      deity: s.deity,
      category: s.category,
      lyrics: s.lyrics ?? '',
      meaning: s.meaning ?? '',
      publishAt: toLocalInput(new Date(s.publish_at)),
      isPublished: s.is_published,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing && !audioFile) {
      setMessage({ kind: 'error', text: 'Choose an audio file.' });
      return;
    }
    setBusy(true);
    setMessage(null);
    const uploadedUrls: string[] = [];
    try {
      const row: Partial<SongRow> = {
        title: form.title.trim(),
        artist: form.artist.trim(),
        deity: form.deity,
        category: form.category,
        lyrics: form.lyrics.trim() || null,
        meaning: form.meaning.trim() || null,
        publish_at: new Date(form.publishAt).toISOString(),
        is_published: form.isPublished,
      };

      if (audioFile) {
        row.duration_sec = await readMediaDuration(audioFile);
        setProgress({ value: 0, label: 'Uploading audio' });
        row.audio_url = await uploadFile(audioFile, 'audio', v => setProgress({ value: v, label: 'Uploading audio' }));
        uploadedUrls.push(row.audio_url);
      }
      if (coverFile) {
        setProgress({ value: 0, label: 'Uploading cover' });
        row.cover_url = await uploadFile(coverFile, 'image', v => setProgress({ value: v, label: 'Uploading cover' }));
        uploadedUrls.push(row.cover_url);
      }

      if (editing) {
        const { error } = await supabase.from('songs').update(row).eq('id', editing.id);
        if (error) throw error;
        // Clean up replaced files
        if (row.audio_url && editing.audio_url) deleteBunnyFile(editing.audio_url).catch(() => {});
        if (row.cover_url && editing.cover_url) deleteBunnyFile(editing.cover_url).catch(() => {});
        setMessage({ kind: 'ok', text: 'Saved.' });
      } else {
        const { error } = await supabase.from('songs').insert(row);
        if (error) throw error;
        setMessage({ kind: 'ok', text: 'Song uploaded.' });
      }
      const rows = await load();
      resetForm(rows ?? songs);
    } catch (err) {
      uploadedUrls.forEach(u => deleteBunnyFile(u).catch(() => {}));
      setMessage({ kind: 'error', text: err instanceof Error ? err.message : 'Something went wrong.' });
      setProgress(null);
    } finally {
      setBusy(false);
    }
  };

  const toggleVisible = async (s: SongRow) => {
    await supabase.from('songs').update({ is_published: !s.is_published }).eq('id', s.id);
    load();
  };

  const remove = async (s: SongRow) => {
    if (!confirm(`Delete "${s.title}" permanently?`)) return;
    try {
      const { error } = await supabase.from('songs').delete().eq('id', s.id);
      if (error) throw error;
      deleteBunnyFile(s.audio_url).catch(() => {});
      if (s.cover_url) deleteBunnyFile(s.cover_url).catch(() => {});
      if (editing?.id === s.id) resetForm();
      load();
    } catch (err) {
      setMessage({ kind: 'error', text: err instanceof Error ? err.message : 'Delete failed.' });
    }
  };

  return (
    <div className="space-y-6">
      <Card
        title={editing ? `Edit: ${editing.title}` : 'Upload a new song'}
        action={
          editing && (
            <button onClick={() => resetForm()} className="text-xs text-neutral-400 hover:text-white">
              Cancel edit
            </button>
          )
        }
      >
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          <Field label={editing ? 'Replace audio file (optional)' : 'Audio file (MP3/M4A)'}>
            <input
              key={`a${fileInputKey}`}
              type="file"
              accept="audio/*"
              onChange={e => setAudioFile(e.target.files?.[0] ?? null)}
              className="field file:mr-3 file:rounded file:border-0 file:bg-[#D6A85F] file:px-3 file:py-1 file:text-black"
            />
          </Field>
          <Field label={editing ? 'Replace cover image (optional)' : 'Cover image (square, optional)'} hint="If empty, the app uses a deity image.">
            <input
              key={`c${fileInputKey}`}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={e => setCoverFile(e.target.files?.[0] ?? null)}
              className="field file:mr-3 file:rounded file:border-0 file:bg-white/10 file:px-3 file:py-1 file:text-white"
            />
          </Field>
          <Field label="Title">
            <input required maxLength={120} value={form.title} onChange={e => set('title', e.target.value)} className="field" />
          </Field>
          <Field label="Artist / singer">
            <input maxLength={120} value={form.artist} onChange={e => set('artist', e.target.value)} className="field" />
          </Field>
          <Field label="Deity">
            <select value={form.deity} onChange={e => set('deity', e.target.value as Deity)} className="field">
              {DEITIES.map(d => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </Field>
          <Field label="Category">
            <select value={form.category} onChange={e => set('category', e.target.value as Category)} className="field">
              {SONG_CATEGORIES.map(c => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Lyrics (optional)">
            <textarea rows={4} value={form.lyrics} onChange={e => set('lyrics', e.target.value)} className="field" />
          </Field>
          <Field label="Meaning (optional)">
            <textarea rows={4} value={form.meaning} onChange={e => set('meaning', e.target.value)} className="field" />
          </Field>
          <Field label="Goes live at">
            <input type="datetime-local" required value={form.publishAt} onChange={e => set('publishAt', e.target.value)} className="field" />
          </Field>
          <label className="flex items-center gap-2 text-sm self-center">
            <input type="checkbox" checked={form.isPublished} onChange={e => set('isPublished', e.target.checked)} className="accent-[#D6A85F]" />
            Visible in app
          </label>

          {progress && (
            <div className="sm:col-span-2">
              <ProgressBar value={progress.value} label={progress.label} />
            </div>
          )}
          {message && (
            <p className={`sm:col-span-2 text-sm ${message.kind === 'ok' ? 'text-emerald-300' : 'text-rose-400'}`}>{message.text}</p>
          )}
          <div className="sm:col-span-2">
            <button type="submit" disabled={busy} className="btn btn-primary">
              {busy ? 'Working…' : editing ? 'Save changes' : 'Upload song'}
            </button>
          </div>
        </form>
      </Card>

      <Card title={`All songs (${songs.length})`}>
        {songs.length === 0 ? (
          <p className="text-sm text-neutral-500">No songs yet.</p>
        ) : (
          <ul className="divide-y divide-white/5">
            {songs.map(s => (
              <li key={s.id} className="py-3 flex gap-3 items-center">
                <div className="w-12 h-12 rounded-md bg-neutral-800 overflow-hidden flex-shrink-0">
                  {s.cover_url && <img src={s.cover_url} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="font-medium text-sm truncate">{s.title}</div>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-neutral-400">
                    <LiveBadge publishAt={s.publish_at} isPublished={s.is_published} />
                    <span>{s.artist}</span>
                    <span>{s.category}</span>
                    <span>{fmtDuration(s.duration_sec)}</span>
                  </div>
                </div>
                <audio src={s.audio_url} controls preload="none" className="hidden md:block h-8 w-48" />
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => startEdit(s)} className="btn btn-ghost !px-2.5 !py-1 !text-xs">
                    Edit
                  </button>
                  <button onClick={() => toggleVisible(s)} className="btn btn-ghost !px-2.5 !py-1 !text-xs">
                    {s.is_published ? 'Hide' : 'Show'}
                  </button>
                  <button onClick={() => remove(s)} className="btn !px-2.5 !py-1 !text-xs text-rose-300 hover:bg-rose-500/10">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};
