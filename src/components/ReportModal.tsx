import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, Check, X } from 'lucide-react';
import { motion } from 'motion/react';
import { analytics } from '../services/analytics';

export const ReportModal: React.FC = () => {
  const { reportModalVideo, setReportModalVideo } = useApp();
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [reported, setReported] = useState(false);

  if (!reportModalVideo) return null;

  const reasons = [
    'Inaccurate or unverified scripture interpretation',
    'Disrespectful or offensive towards sacred traditions',
    'Commercial advertising / spam / promotional plug',
    'Superstitious, fear-mongering, or fatalistic claims',
    'Copyright or audio infringement'
  ];

  const handleReport = () => {
    if (!selectedReason) return;
    analytics.track('content_reported', {
      videoId: reportModalVideo.id,
      title: reportModalVideo.title,
      reason: selectedReason
    });
    setReported(true);
    setTimeout(() => {
      setReported(false);
      setReportModalVideo(null);
    }, 1500);
  };

  return (
    <div
      id="report-modal-backdrop"
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-sm rounded-3xl bg-[#12110f] border border-white/10 p-5 text-neutral-100 shadow-2xl relative"
      >
        <button
          onClick={() => setReportModalVideo(null)}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <h3 className="font-serif text-sm font-bold text-white">Report Content</h3>
        </div>

        <p className="text-xs text-neutral-400 mb-4">
          Help us maintain high scriptural integrity and authentic devotional safety.
        </p>

        {reported ? (
          <div className="p-6 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-sm font-bold text-white">Report Received</h4>
            <p className="text-xs text-neutral-300">
              Our spiritual editorial council will review this within 24 hours.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="space-y-2">
              {reasons.map(r => (
                <div
                  key={r}
                  onClick={() => setSelectedReason(r)}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                    selectedReason === r
                      ? 'bg-amber-500/20 border-amber-500/50 text-white'
                      : 'bg-white/5 border-white/5 text-neutral-300 hover:bg-white/10'
                  }`}
                >
                  {r}
                </div>
              ))}
            </div>

            <button
              disabled={!selectedReason}
              onClick={handleReport}
              className={`w-full py-2.5 rounded-xl font-bold text-xs transition mt-2 cursor-pointer ${
                selectedReason
                  ? 'bg-amber-500 text-black hover:bg-amber-400'
                  : 'bg-white/10 text-neutral-500 cursor-not-allowed'
              }`}
            >
              Submit Report
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
