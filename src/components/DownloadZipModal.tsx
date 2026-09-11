import React, { useState } from 'react';
import { Archive, Download, CheckCircle2, Loader2, Copy, ExternalLink, X } from 'lucide-react';

interface DownloadZipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadZipModal: React.FC<DownloadZipModalProps> = ({ isOpen, onClose }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const directUrl = `${window.location.origin}/api/download-zip`;

  // Fallback 1: Direct link trigger
  const handleDirectDownload = () => {
    try {
      const link = document.createElement('a');
      link.href = '/api/download-zip';
      link.setAttribute('download', 'ishvara-app.zip');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch {
      handleBlobDownload();
    }
  };

  // Fallback 2: In-memory base64/blob trigger (works even if browser blocks cross-origin iframe navigation)
  const handleBlobDownload = async () => {
    setDownloading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/zip-base64');
      if (!res.ok) throw new Error('Failed to fetch ZIP binary');
      const json = await res.json();

      // Convert base64 to binary blob
      const byteCharacters = atob(json.data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/zip' });

      // Create object URL and download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'ishvara-app.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err: any) {
      console.error('Blob download error:', err);
      setErrorMsg('Could not start direct download in this browser sandbox. Please use the Copy Link button below.');
    } finally {
      setDownloading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(directUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md rounded-3xl bg-[#141311] border border-[#D6A85F]/40 p-6 shadow-2xl relative overflow-hidden text-neutral-100">
        {/* Glow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#D6A85F]/20 blur-3xl rounded-full pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-[#D6A85F] text-black flex items-center justify-center font-bold shadow-lg shadow-[#D6A85F]/25 shrink-0">
            <Archive className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-white tracking-wide">
              Download Ishvara Source Code
            </h3>
            <p className="text-xs text-[#D6A85F] font-mono mt-0.5">
              ishvara-app.zip • 5.6 MB
            </p>
          </div>
        </div>

        <p className="text-xs text-neutral-300 leading-relaxed mb-5">
          Contains the full production-ready application: React 19, Tailwind v4, Capacitor mobile configuration, PWA manifest, Lazzer fonts, audio engine, and Gemini API backend.
        </p>

        {downloadSuccess && (
          <div className="p-3.5 mb-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Download triggered! Check your browser's Downloads folder.</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs">
            {errorMsg}
          </div>
        )}

        {/* Primary Download Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={handleBlobDownload}
            disabled={downloading}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#D6A85F] to-[#E5BE6C] text-[#120F0A] font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-[#D6A85F]/20 hover:brightness-110 active:scale-95 transition cursor-pointer"
          >
            {downloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating ZIP package...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Direct Download ZIP (In-Memory)</span>
              </>
            )}
          </button>

          <button
            onClick={handleDirectDownload}
            className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#D6A85F]" />
            <span>Standard Browser Download</span>
          </button>
        </div>

        {/* Fallback direct link URL */}
        <div className="mt-5 pt-4 border-t border-white/10 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-neutral-400">
            <span>Direct URL for new tab or wget / curl:</span>
          </div>
          <div className="flex items-center gap-2 bg-black/60 border border-white/10 rounded-xl p-2">
            <code className="text-[11px] text-[#E8C280] font-mono truncate flex-1 select-all">
              {directUrl}
            </code>
            <button
              onClick={handleCopy}
              className="px-2.5 py-1.5 rounded-lg bg-[#D6A85F]/20 hover:bg-[#D6A85F]/30 text-[#E8C280] text-[11px] font-semibold flex items-center gap-1 transition shrink-0 cursor-pointer"
            >
              {copiedLink ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedLink ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Git push snippet */}
        <div className="mt-4 p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] text-neutral-400 space-y-1">
          <span className="text-neutral-300 font-semibold block">Pushing extracted ZIP to GitHub:</span>
          <code className="text-[10px] text-neutral-400 font-mono block leading-normal">
            git init &amp;&amp; git add . &amp;&amp; git commit -m "first commit" &amp;&amp; git remote add origin https://github.com/nitishbhardwaj-7/Ishvara.git &amp;&amp; git push -u origin main
          </code>
        </div>
      </div>
    </div>
  );
};
