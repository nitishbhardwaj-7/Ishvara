import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Send, Heart, MessageCircle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CommentDrawer: React.FC = () => {
  const { commentModalVideo, setCommentModalVideo, postComment, commentsMap, user } = useApp();
  const [commentText, setCommentText] = useState('');

  if (!commentModalVideo) return null;

  const comments = commentsMap[commentModalVideo.id] || [
    {
      id: 'c-default',
      videoId: commentModalVideo.id,
      userName: 'Rohan Deshmukh',
      userAvatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%23261f18" stroke="%23c99a4a" stroke-width="2"/><text x="50" y="58" font-family="serif" font-size="28" fill="%23f5f1e8" text-anchor="middle">रो</text></svg>',
      text: 'Practicing this verse every morning before taking client calls has completely transformed my focus.',
      likes: 28,
      timestamp: '3h ago'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    postComment(commentModalVideo.id, commentText);
    setCommentText('');
  };

  return (
    <div
      id="comment-drawer-backdrop"
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end justify-center select-none"
      onClick={() => setCommentModalVideo(null)}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md h-[520px] max-h-[85vh] bg-[#121212] border-t border-[#D6A85F]/30 rounded-t-3xl flex flex-col overflow-hidden text-neutral-100 shadow-2xl"
      >
        {/* Drawer Handle & Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="w-10 h-1 bg-white/20 rounded-full mx-auto absolute top-2 inset-x-0" />
          <div className="flex items-center gap-2 pt-1">
            <MessageCircle className="w-4 h-4 text-[#D6A85F]" />
            <h3 className="font-serif text-sm font-bold text-white">
              Sacred Reflections ({comments.length})
            </h3>
          </div>
          <button
            onClick={() => setCommentModalVideo(null)}
            className="p-1 rounded-full text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Community Guideline note */}
        <div className="px-4 py-2 bg-black/40 border-b border-white/5 flex items-center gap-1.5 text-[10px] text-neutral-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Ishvara Community: Keep reflections respectful, contemplative, and sincere.</span>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {comments.map(c => (
            <div key={c.id} className="flex items-start gap-3 text-xs">
              <img src={c.userAvatar} alt={c.userName} referrerPolicy="no-referrer" className="w-8 h-8 rounded-full object-cover border border-white/10" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-neutral-200">{c.userName}</span>
                  <span className="text-[10px] text-neutral-500">{c.timestamp}</span>
                </div>
                <p className="text-neutral-300 mt-1 leading-relaxed">{c.text}</p>
              </div>
              <button className="flex flex-col items-center gap-0.5 text-neutral-400 hover:text-rose-400 transition pt-1">
                <Heart className="w-3.5 h-3.5" />
                <span className="text-[10px]">{c.likes}</span>
              </button>
            </div>
          ))}
        </div>

        {/* Post Comment Input */}
        <form onSubmit={handleSubmit} className="p-3 bg-[#181818] border-t border-white/10 flex items-center gap-2">
          <img src={user.avatar} alt={user.name} referrerPolicy="no-referrer" className="w-7 h-7 rounded-full object-cover border border-[#D6A85F]/50" />
          <input
            id="comment-input-field"
            type="text"
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            placeholder="Add a contemplative reflection..."
            className="flex-1 bg-[#222] border border-white/10 rounded-2xl py-2 px-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D6A85F]/60 transition"
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className={`p-2 rounded-xl transition ${commentText.trim() ? 'bg-[#D6A85F] text-black hover:scale-105' : 'bg-white/10 text-neutral-500'}`}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </motion.div>
    </div>
  );
};
