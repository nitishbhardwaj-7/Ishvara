import React, { useCallback, useEffect, useState } from 'react';
import {
  BunnyStatus,
  DEITIES,
  Deity,
  VideoRow,
  deleteBunnyVideo,
  fmtDuration,
  getVideoStatuses,
  nextSlot,
  readMediaDuration,
  supabase,
  toLocalInput,
  uploadVideo,
} from './api';
import { Card, Field, LiveBadge, ProgressBar } from './shared';

interface FormState {
  title: string;
  description: string;
  deity: Deity;
  sourceContext: string;
  quoteSanskrit: string;
  quoteTranslation: string;
  publishAt: string;
  isPublished: boolean;
}

const emptyForm = (publishAt: Date): FormState => ({
  title: '',
  description: '',
  deity: 'Krishna',
  sourceContext: '',
  quoteSanskrit: '',
  quoteTranslation: '',
  publishAt: toLocalInput(publishAt),
  isPublished: true,
});

const STATUS_LABEL: Record<number, string> = {
  0: 'Waiting for upload',
  1: 'Uploaded',
  2: 'Processing',
  3: 'Encoding',
  4: 'Ready',
  5: 'Encoding failed',
  6: 'Upload failed',
};

export const VideosPanel: React.FC = () => {
  const [videos, setVideos] = useState<VideoRow[]>([]);
  const [statuses, setStatuses] = useState<Record<string, BunnyStatus>>({});
  const [editing, setEditing] = useState<VideoRow | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm(new Date()));
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from('videos').select('*').order('publish_at', { ascending: false });
    if (error) {
      setMessage({ kind: 'error', text: error.message });
      return;
    }
    const rows = data as VideoRow[];
    setVideos(rows);
    // Encoding status for the most recent uploads
    const guids = rows.slice(0, 20).map(v => v.bunny_video_id).filter((g): g is string => !!g);
    if (guids.length) getVideoStatuses(guids).then(setStatuses).catch(() => {});
    return rows;
  }, []);

  useEffect(() => {
    load().then(rows => rows && setForm(f => ({ ...f, publishAt: toLocalInput(nextSlot(rows)) })));
  }, [load]);

  // Refresh encoding status while anything is still processing
  useEffect(() => {
    const pending = Object.values(statuses).some(s => s.status < 4);
    if (!pending) return;
    const t = setTimeout(load, 15000);
    return () => clearTimeout(t);
  }, [statuses, load]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm(f => ({ ...f, [key]: value }));

  const resetForm = (rows = videos) => {
    setEditing(null);
    setFile(null);
    setProgress(null);
    setForm(emptyForm(nextSlot(rows)));
  };

  const startEdit = (v: VideoRow) => {
    setEditing(v);
    setFile(null);
    setMessage(null);
    setForm({
      title: v.title,
      description: v.description,
      deity: v.deity,
      sourceContext: v.source_context,
      quoteSanskrit: v.quote_sanskrit ?? '',
      quoteTranslation: v.quote_translation ?? '',
      publishAt: toLocalInput(new Date(v.publish_at)),
      isPublished: v.is_published,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing && !file) {
      setMessage({ kind: 'error', text: 'Choose a video file.' });
      return;
    }
    setBusy(true);
    setMessage(null);
    const meta = {
      title: form.title.trim(),
      description: form.description.trim(),
      deity: form.deity,
      source_context: form.sourceContext.trim(),
      quote_sanskrit: form.quoteSanskrit.trim() || null,
      quote_translation: form.quoteTranslation.trim() || null,
      publish_at: new Date(form.publishAt).toISOString(),
      is_published: form.isPublished,
    };
    try {
      if (editing) {
        const { error } = await supabase.from('videos').update(meta).eq('id', editing.id);
        if (error) throw error;
        setMessage({ kind: 'ok', text: 'Saved.' });
      } else {
        const duration = await readMediaDuration(file!);
        setProgress(0);
        const uploaded = await uploadVideo(file!, meta.title, setProgress);
        const { error } = await supabase.from('videos').insert({
          ...meta,
          bunny_video_id: uploaded.guid,
          video_url: uploaded.videoUrl,
          thumbnail_url: uploaded.thumbnailUrl,
          duration_sec: duration,
        });
        if (error) {
          await deleteBunnyVideo(uploaded.guid).catch(() => {});
          throw error;
        }
        setMessage({
          kind: 'ok',
          text: 'Uploaded! Bunny is encoding it now (usually 1–5 minutes). Schedule it at least a few minutes ahead.',
        });
      }
      const rows = await load();
      resetForm(rows ?? videos);
    } catch (err) {
      setMessage({ kind: 'error', text: err instanceof Error ? err.message : 'Something went wrong.' });
      setProgress(null);
    } finally {
      setBusy(false);
    }
  };

  const toggleVisible = async (v: VideoRow) => {
    await supabase.from('videos').update({ is_published: !v.is_published }).eq('id', v.id);
    load();
  };

  const remove = async (v: VideoRow) => {
    if (!confirm(`Delete "${v.title}" permanently? This removes the video file too.`)) return;
    try {
      if (v.bunny_video_id) await deleteBunnyVideo(v.bunny_video_id);
      const { error } = await supabase.from('videos').delete().eq('id', v.id);
      if (error) throw error;
      if (editing?.id === v.id) resetForm();
      load();
    } catch (err) {
      setMessage({ kind: 'error', text: err instanceof Error ? err.message : 'Delete failed.' });
    }
  };

  const scheduledCount = videos.filter(v => v.is_published && new Date(v.publish_at).getTime() > Date.now()).length;

  return (
    <div className="space-y-6">
      <Card
        title={editing ? `Edit: ${editing.title}` : 'Upload a new video'}
        action={
          editing && (
            <button onClick={() => resetForm()} className="text-xs text-neutral-400 hover:text-white">
              Cancel edit
            </button>
          )
        }
      >
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          {!editing && (
            <Field label="Video file (vertical 9:16, MP4/MOV)" className="sm:col-span-2">
              <input
                type="file"
                accept="video/*"
                onChange={e => setFile(e.target.files?.[0] ?? null)}
                className="field file:mr-3 file:rounded file:border-0 file:bg-[#D6A85F] file:px-3 file:py-1 file:text-black"
              />
            </Field>
          )}
          <Field label="Title" className="sm:col-span-2">
            <input required maxLength={120} value={form.title} onChange={e => set('title', e.target.value)} className="field" />
          </Field>
          <Field label="Description" className="sm:col-span-2">
            <textarea rows={2} maxLength={500} value={form.description} onChange={e => set('description', e.target.value)} className="field" />
          </Field>
          <Field label="Deity">
            <select value={form.deity} onChange={e => set('deity', e.target.value as Deity)} className="field">
              {DEITIES.map(d => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </Field>
          <Field label="Scripture source (optional)" hint="e.g. Bhagavad Gita 2.47">
            <input value={form.sourceContext} onChange={e => set('sourceContext', e.target.value)} className="field" />
          </Field>
          <Field label="Shloka in Sanskrit (optional)">
            <textarea rows={2} value={form.quoteSanskrit} onChange={e => set('quoteSanskrit', e.target.value)} className="field" />
          </Field>
          <Field label="Translation (optional)">
            <textarea rows={2} value={form.quoteTranslation} onChange={e => set('quoteTranslation', e.target.value)} className="field" />
          </Field>
          <Field label="Goes live at" hint="Defaults to the next free day at 6:00 AM, so a batch of uploads releases one per day.">
            <input type="datetime-local" required value={form.publishAt} onChange={e => set('publishAt', e.target.value)} className="field" />
          </Field>
          <label className="flex items-center gap-2 text-sm self-center">
            <input type="checkbox" checked={form.isPublished} onChange={e => set('isPublished', e.target.checked)} className="accent-[#D6A85F]" />
            Visible in app
          </label>

          {progress !== null && (
            <div className="sm:col-span-2">
              <ProgressBar value={progress} label="Uploading to Bunny Stream" />
            </div>
          )}
          {message && (
            <p className={`sm:col-span-2 text-sm ${message.kind === 'ok' ? 'text-emerald-300' : 'text-rose-400'}`}>{message.text}</p>
          )}
          <div className="sm:col-span-2">
            <button type="submit" disabled={busy} className="btn btn-primary">
              {busy ? 'Working…' : editing ? 'Save changes' : 'Upload video'}
            </button>
          </div>
        </form>
      </Card>

      <Card title={`All videos (${videos.length}) · ${scheduledCount} scheduled ahead`}>
        {videos.length === 0 ? (
          <p className="text-sm text-neutral-500">No videos yet.</p>
        ) : (
          <ul className="divide-y divide-white/5">
            {videos.map(v => {
              const st = v.bunny_video_id ? statuses[v.bunny_video_id] : undefined;
              return (
                <li key={v.id} className="py-3 flex gap-3 items-center">
                  <div className="w-12 h-20 rounded-md bg-neutral-800 overflow-hidden flex-shrink-0">
                    {v.thumbnail_url && st?.status === 4 && <img src={v.thumbnail_url} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="font-medium text-sm truncate">{v.title}</div>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-neutral-400">
                      <LiveBadge publishAt={v.publish_at} isPublished={v.is_published} />
                      <span>{v.deity}</span>
                      <span>{fmtDuration(v.duration_sec)}</span>
                      {st && (
                        <span className={st.status >= 5 ? 'text-rose-400' : st.status === 4 ? 'text-neutral-500' : 'text-amber-300'}>
                          {STATUS_LABEL[st.status] ?? 'Unknown'}
                          {st.status === 3 ? ` ${st.encodeProgress}%` : ''}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => startEdit(v)} className="btn btn-ghost !px-2.5 !py-1 !text-xs">
                      Edit
                    </button>
                    <button onClick={() => toggleVisible(v)} className="btn btn-ghost !px-2.5 !py-1 !text-xs">
                      {v.is_published ? 'Hide' : 'Show'}
                    </button>
                    <button onClick={() => remove(v)} className="btn !px-2.5 !py-1 !text-xs text-rose-300 hover:bg-rose-500/10">
                      Delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
};
