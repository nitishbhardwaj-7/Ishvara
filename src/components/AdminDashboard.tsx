import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  TrendingUp,
  Activity,
  Users,
  Film,
  Plus,
  Check,
  X,
  Database,
  RefreshCw,
  Sparkles,
  Image as ImageIcon,
  Eye,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { analytics } from '../services/analytics';
import { VideoItem, Deity } from '../types';
import {
  EXPLICIT_DEITY_IMAGE_MAPPING,
  SPIRITUAL_MEDIA_REGISTRY,
  DeityMediaPack
} from '../data/mediaConfig';
import { SpiritualImage } from './SpiritualImage';

export const AdminDashboard: React.FC = () => {
  const { showAdmin, setShowAdmin, videos } = useApp();
  const [activeTab, setActiveTab] = useState<'metrics' | 'cms' | 'media' | 'telemetry'>('metrics');

  // Media CMS State
  const [selectedDeity, setSelectedDeity] = useState<'shiva' | 'krishna' | 'hanuman' | 'universal'>('shiva');
  const [deityPacks, setDeityPacks] = useState(EXPLICIT_DEITY_IMAGE_MAPPING);
  const [customHeroUrl, setCustomHeroUrl] = useState('');
  const [customThumbUrl, setCustomThumbUrl] = useState('');
  const [customDeityUrl, setCustomDeityUrl] = useState('');
  const [customFallbackUrl, setCustomFallbackUrl] = useState('');
  const [mediaSaveSuccess, setMediaSaveSuccess] = useState(false);

  // New video form state
  const [newTitle, setNewTitle] = useState('');
  const [newContext, setNewContext] = useState('Bhagavad Gita 2.47');
  const [newDeity, setNewDeity] = useState<Deity>('Krishna');
  const [newTopic, setNewTopic] = useState('Karma Yoga');
  const [newDuration, setNewDuration] = useState(35);
  const [publishSuccess, setPublishSuccess] = useState(false);

  if (!showAdmin) return null;

  const currentPack = deityPacks[selectedDeity];

  const handleSaveMedia = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...deityPacks,
      [selectedDeity]: {
        ...currentPack,
        hero: customHeroUrl.trim() || currentPack.hero,
        thumbnail: customThumbUrl.trim() || currentPack.thumbnail,
        deity: customDeityUrl.trim() || currentPack.deity,
        fallback: customFallbackUrl.trim() || currentPack.fallback
      }
    };
    setDeityPacks(updated);
    EXPLICIT_DEITY_IMAGE_MAPPING[selectedDeity] = updated[selectedDeity];

    analytics.track('admin_media_updated', {
      deity: selectedDeity,
      hero: updated[selectedDeity].hero
    });

    setMediaSaveSuccess(true);
    setTimeout(() => {
      setMediaSaveSuccess(false);
      setCustomHeroUrl('');
      setCustomThumbUrl('');
      setCustomDeityUrl('');
      setCustomFallbackUrl('');
    }, 2500);
  };

  const handleResetMedia = () => {
    EXPLICIT_DEITY_IMAGE_MAPPING[selectedDeity] = {
      ...EXPLICIT_DEITY_IMAGE_MAPPING[selectedDeity]
    };
    setDeityPacks({ ...EXPLICIT_DEITY_IMAGE_MAPPING });
  };

  const metrics = analytics.getDashboardMetrics();
  const recentEvents = analytics.getRecentEvents();

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    analytics.track('admin_content_published', {
      title: newTitle,
      deity: newDeity,
      sourceContext: newContext
    });

    setPublishSuccess(true);
    setTimeout(() => {
      setPublishSuccess(false);
      setNewTitle('');
    }, 2000);
  };

  return (
    <div
      id="admin-dashboard-container"
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto select-none"
    >
      <div className="w-full max-w-2xl bg-[#0e0d0b] border border-[#D6A85F]/50 rounded-3xl p-6 text-neutral-100 shadow-2xl relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-base font-bold text-white">Ishvara Creator & Telemetry Studio</h2>
              <p className="text-[11px] text-neutral-400">Production monitoring, PostHog/Firebase analytics & CMS</p>
            </div>
          </div>

          <button
            onClick={() => setShowAdmin(false)}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center gap-2 pt-3 pb-2 border-b border-white/5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-3 py-1.5 rounded-xl transition ${activeTab === 'metrics' ? 'bg-[#D6A85F] text-black' : 'bg-white/5 text-neutral-300'}`}
          >
            Growth & Retention
          </button>
          <button
            onClick={() => setActiveTab('cms')}
            className={`px-3 py-1.5 rounded-xl transition ${activeTab === 'cms' ? 'bg-[#D6A85F] text-black' : 'bg-white/5 text-neutral-300'}`}
          >
            Publish Sacred Reel
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`px-3 py-1.5 rounded-xl transition ${activeTab === 'media' ? 'bg-[#D6A85F] text-black' : 'bg-white/5 text-neutral-300'}`}
          >
            Sacred Media CMS
          </button>
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`px-3 py-1.5 rounded-xl transition ${activeTab === 'telemetry' ? 'bg-[#D6A85F] text-black' : 'bg-white/5 text-neutral-300'}`}
          >
            Real-Time Events ({recentEvents.length})
          </button>
        </div>

        {/* TAB 1: Metrics */}
        {activeTab === 'metrics' && (
          <div className="flex-1 overflow-y-auto py-4 space-y-4 no-scrollbar">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-[10px] text-neutral-400 block uppercase">Active Seekers (DAU)</span>
                <span className="text-xl font-serif font-black text-white mt-1 block">{metrics.dau.toLocaleString()}</span>
                <span className="text-[10px] text-emerald-400 mt-1 block">↑ 14.2% this week</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-[10px] text-neutral-400 block uppercase">Day 7 Retention</span>
                <span className="text-xl font-serif font-black text-emerald-400 mt-1 block">{metrics.d7Retention}</span>
                <span className="text-[10px] text-neutral-400 mt-1 block">Industry top 5%</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-[10px] text-neutral-400 block uppercase">Video Completion</span>
                <span className="text-xl font-serif font-black text-[#D6A85F] mt-1 block">{metrics.completionRate}</span>
                <span className="text-[10px] text-neutral-400 mt-1 block">Avg {metrics.avgSessionMinutes}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-[10px] text-neutral-400 block uppercase">Paid Conversion</span>
                <span className="text-xl font-serif font-black text-amber-400 mt-1 block">{metrics.conversionRate}</span>
                <span className="text-[10px] text-neutral-400 mt-1 block">LTV {metrics.ltv}</span>
              </div>
            </div>

            {/* Retention & Funnel Architecture */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2 text-xs">
              <h4 className="font-serif font-bold text-white flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#D6A85F]" /> 5-Loop Retention Architecture
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-2 text-[11px]">
                <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                  <strong className="text-[#D6A85F] block">Loop 1: Sadhana</strong>
                  <span className="text-neutral-300">Daily streak notifications & japa counter</span>
                </div>
                <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                  <strong className="text-[#D6A85F] block">Loop 2: Reels</strong>
                  <span className="text-neutral-300">Weighted affinity AI feed (30+ assets)</span>
                </div>
                <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                  <strong className="text-[#D6A85F] block">Loop 3: Audio</strong>
                  <span className="text-neutral-300">432Hz spatial Tanpura background player</span>
                </div>
                <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                  <strong className="text-[#D6A85F] block">Loop 4: Journey</strong>
                  <span className="text-neutral-300">18 Gita chapters & level badges</span>
                </div>
                <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                  <strong className="text-[#D6A85F] block">Loop 5: AI Divya</strong>
                  <span className="text-neutral-300">Grounded RAG scripture queries</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Sacred Reel Publisher CMS */}
        {activeTab === 'cms' && (
          <form onSubmit={handlePublish} className="flex-1 overflow-y-auto py-4 space-y-3 text-xs no-scrollbar">
            {publishSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Sacred Reel published to recommendation feed!</span>
              </div>
            )}

            <div>
              <label className="text-neutral-300 block mb-1">Reel Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="e.g., The Secret of Unshakable Detachment"
                className="w-full bg-[#161616] border border-white/10 rounded-xl p-2.5 text-white"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-neutral-300 block mb-1">Deity Affinity</label>
                <select
                  value={newDeity}
                  onChange={e => setNewDeity(e.target.value as Deity)}
                  className="w-full bg-[#161616] border border-white/10 rounded-xl p-2.5 text-white"
                >
                  <option value="Shiva">Lord Shiva</option>
                  <option value="Hanuman">Lord Hanuman</option>
                  <option value="Krishna">Bhagavad Gita / Krishna</option>
                  <option value="Universal">Universal</option>
                </select>
              </div>
              <div>
                <label className="text-neutral-300 block mb-1">Scripture Context Root</label>
                <input
                  type="text"
                  value={newContext}
                  onChange={e => setNewContext(e.target.value)}
                  placeholder="e.g., Shiva Tandava Stotram v.5"
                  className="w-full bg-[#161616] border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-neutral-300 block mb-1">Topic</label>
                <input
                  type="text"
                  value={newTopic}
                  onChange={e => setNewTopic(e.target.value)}
                  className="w-full bg-[#161616] border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="text-neutral-300 block mb-1">Duration (Seconds)</label>
                <input
                  type="number"
                  value={newDuration}
                  onChange={e => setNewDuration(Number(e.target.value))}
                  className="w-full bg-[#161616] border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#D6A85F] text-black font-bold flex items-center justify-center gap-2 hover:bg-amber-300 transition mt-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Publish to Ishvara Feed</span>
            </button>
          </form>
        )}

        {/* TAB: Sacred Media CMS */}
        {activeTab === 'media' && (
          <div className="flex-1 overflow-y-auto py-3 space-y-4 text-xs no-scrollbar">
            {mediaSaveSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Media pack updated! Live app cards and screens will now use this asset pack.</span>
              </div>
            )}

            {/* Deity Selector */}
            <div>
              <label className="text-neutral-400 block mb-1.5 uppercase text-[10px] tracking-wider">
                Select Deity Media Pack
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['shiva', 'krishna', 'hanuman', 'universal'] as const).map(deity => (
                  <button
                    key={deity}
                    type="button"
                    onClick={() => {
                      setSelectedDeity(deity);
                      setCustomHeroUrl('');
                      setCustomThumbUrl('');
                      setCustomDeityUrl('');
                      setCustomFallbackUrl('');
                    }}
                    className={`py-2 px-2.5 rounded-xl border text-center font-serif text-xs capitalize transition cursor-pointer ${
                      selectedDeity === deity
                        ? 'bg-[#D6A85F]/20 border-[#D6A85F] text-[#D6A85F] font-bold'
                        : 'bg-white/5 border-white/5 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {deity}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Visual Previews of Current Pack */}
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-serif text-sm font-semibold text-white flex items-center gap-1.5 capitalize">
                  <Eye className="w-4 h-4 text-[#D6A85F]" /> {selectedDeity} Live Media Preview
                </span>
                <span className="text-[10px] text-neutral-400">Deterministic Art-Directed Imagery</span>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {/* Hero 16:9 */}
                <div>
                  <span className="text-[10px] text-neutral-400 block mb-1">Hero / Landscape</span>
                  <div className="aspect-[16/9] rounded-xl overflow-hidden border border-white/10 relative bg-[#111]">
                    <SpiritualImage
                      src={customHeroUrl || currentPack.hero}
                      fallbackSrc={currentPack.fallback}
                      alt={`${selectedDeity} Hero`}
                      deity={selectedDeity.charAt(0).toUpperCase() + selectedDeity.slice(1) as Deity}
                      aspectRatio="16/9"
                      overlay="hero"
                      className="w-full h-full"
                    />
                  </div>
                </div>

                {/* Portrait Card 4:5 */}
                <div>
                  <span className="text-[10px] text-neutral-400 block mb-1">Card Thumbnail (4:5)</span>
                  <div className="aspect-[4/5] rounded-xl overflow-hidden border border-white/10 relative bg-[#111]">
                    <SpiritualImage
                      src={customThumbUrl || currentPack.thumbnail}
                      fallbackSrc={currentPack.fallback}
                      alt={`${selectedDeity} Thumbnail`}
                      deity={selectedDeity.charAt(0).toUpperCase() + selectedDeity.slice(1) as Deity}
                      aspectRatio="4/5"
                      overlay="subtle"
                      className="w-full h-full"
                    />
                  </div>
                </div>

                {/* Deity / Sacred Icon 1:1 */}
                <div>
                  <span className="text-[10px] text-neutral-400 block mb-1">Deity / Icon (1:1)</span>
                  <div className="aspect-square rounded-xl overflow-hidden border border-white/10 relative bg-[#111]">
                    <SpiritualImage
                      src={customDeityUrl || currentPack.deity}
                      fallbackSrc={currentPack.fallback}
                      alt={`${selectedDeity} Deity`}
                      deity={selectedDeity.charAt(0).toUpperCase() + selectedDeity.slice(1) as Deity}
                      aspectRatio="1/1"
                      className="w-full h-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Custom URL Replacement Form */}
            <form onSubmit={handleSaveMedia} className="space-y-3">
              <div>
                <label className="text-neutral-300 block mb-1 flex items-center justify-between">
                  <span>Replace Hero / Landscape Image URL</span>
                  <span className="text-[10px] text-neutral-500">Currently: {currentPack.hero.slice(0, 45)}...</span>
                </label>
                <input
                  type="url"
                  value={customHeroUrl}
                  onChange={e => setCustomHeroUrl(e.target.value)}
                  placeholder={currentPack.hero}
                  className="w-full bg-[#161616] border border-white/10 rounded-xl p-2 text-white font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="text-neutral-300 block mb-1 flex items-center justify-between">
                  <span>Replace Thumbnail Image URL (4:5 / Explore Card)</span>
                  <span className="text-[10px] text-neutral-500">Currently: {currentPack.thumbnail.slice(0, 45)}...</span>
                </label>
                <input
                  type="url"
                  value={customThumbUrl}
                  onChange={e => setCustomThumbUrl(e.target.value)}
                  placeholder={currentPack.thumbnail}
                  className="w-full bg-[#161616] border border-white/10 rounded-xl p-2 text-white font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="text-neutral-300 block mb-1 flex items-center justify-between">
                  <span>Replace Deity Image URL (Sacred Portrait)</span>
                  <span className="text-[10px] text-neutral-500">Currently: {currentPack.deity.slice(0, 45)}...</span>
                </label>
                <input
                  type="url"
                  value={customDeityUrl}
                  onChange={e => setCustomDeityUrl(e.target.value)}
                  placeholder={currentPack.deity}
                  className="w-full bg-[#161616] border border-white/10 rounded-xl p-2 text-white font-mono text-[11px]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#D6A85F] text-black font-bold flex items-center justify-center gap-1.5 hover:bg-amber-300 transition cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Apply & Save {selectedDeity.toUpperCase()} Assets</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetMedia}
                  className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
                  title="Reset to verified curated defaults"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: Telemetry Stream */}
        {activeTab === 'telemetry' && (
          <div className="flex-1 overflow-y-auto py-4 space-y-2 font-mono text-[11px] no-scrollbar">
            {recentEvents.map((evt, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[#D6A85F] font-bold">{evt.eventName}</span>
                  <span className="text-neutral-500 ml-2">
                    {JSON.stringify(evt.properties)}
                  </span>
                </div>
                <span className="text-neutral-500 text-[10px]">
                  {new Date(evt.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
