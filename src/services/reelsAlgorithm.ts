import { VideoItem, UserProfile, Deity } from '../types';

export interface UserInteractionHistory {
  videoId: string;
  watchDurationSec: number;
  completionRate: number; // 0.0 to 1.0
  rewatchedCount: number;
  liked: boolean;
  saved: boolean;
  shared: boolean;
  skippedQuickly: boolean;
  timestamp: number;
}

export interface VideoScoringBreakdown {
  videoId: string;
  watchCompletionScore: number; // 30%
  watchTimeScore: number;       // 25%
  rewatchScore: number;         // 15%
  saveScore: number;            // 10%
  shareScore: number;           // 10%
  likeScore: number;            // 5%
  topicAffinityScore: number;   // 5%
  deityBonus: number;           // dynamic boost
  diversityJitter: number;      // exploration factor
  totalScore: number;
  reason: string;
}

class ReelsRecommendationEngine {
  private interactionHistory: Map<string, UserInteractionHistory> = new Map();

  constructor() {
    // Restore from localStorage if available
    try {
      const saved = localStorage.getItem('ishvara_reels_history');
      if (saved) {
        const parsed: [string, UserInteractionHistory][] = JSON.parse(saved);
        this.interactionHistory = new Map(parsed);
      }
    } catch {
      // ignore
    }
  }

  private persist() {
    try {
      const entries = Array.from(this.interactionHistory.entries());
      localStorage.setItem('ishvara_reels_history', JSON.stringify(entries.slice(-100)));
    } catch {
      // ignore
    }
  }

  public recordInteraction(
    videoId: string,
    watchDurationSec: number,
    videoDurationSec: number,
    liked: boolean,
    saved: boolean,
    shared: boolean
  ) {
    const existing = this.interactionHistory.get(videoId);
    const safeDuration = Math.max(videoDurationSec, 10);
    const rawRate = Math.min(watchDurationSec / safeDuration, 2.0);
    const isRewatch = watchDurationSec > safeDuration * 1.1 || (existing ? existing.rewatchedCount > 0 : false);
    const skippedQuickly = watchDurationSec < 3;

    const historyItem: UserInteractionHistory = {
      videoId,
      watchDurationSec: (existing?.watchDurationSec || 0) + watchDurationSec,
      completionRate: Math.min(rawRate, 1.0),
      rewatchedCount: isRewatch ? (existing?.rewatchedCount || 0) + 1 : 0,
      liked: liked || (existing?.liked || false),
      saved: saved || (existing?.saved || false),
      shared: shared || (existing?.shared || false),
      skippedQuickly,
      timestamp: Date.now()
    };

    this.interactionHistory.set(videoId, historyItem);
    this.persist();
  }

  public rankVideos(
    videos: VideoItem[],
    user: UserProfile,
    timeOfDayHour = new Date().getHours()
  ): { ranked: VideoItem[]; scores: Map<string, VideoScoringBreakdown> } {
    const scoreMap = new Map<string, VideoScoringBreakdown>();

    // Calculate user's aggregate affinities
    const topicAffinities = user.topicAffinities || {};
    const deityAffinities = user.deityAffinities || {};

    const scoredList = videos.map((video, index) => {
      const hist = this.interactionHistory.get(video.id);

      // 1. Watch completion (30% weight)
      // If user previously watched it, use past completion; otherwise base on community stats
      const completion = hist ? hist.completionRate : Math.min(video.stats.views > 0 ? (video.stats.saves / video.stats.views) * 10 : 0.65, 0.95);
      const watchCompletionScore = completion * 30;

      // 2. Watch time score (25% weight)
      // Normalizes around 30-45s sweet spot for spiritual micro-teachings
      const normalizedDuration = Math.min(video.duration / 50, 1.0);
      const watchTimeScore = normalizedDuration * 25;

      // 3. Rewatch score (15% weight)
      const rewatchScore = hist && hist.rewatchedCount > 0 ? 15 : (video.stats.saves > 10000 ? 10 : 6);

      // 4. Save score (10% weight)
      const saveScore = (hist?.saved || user.savedVideoIds.includes(video.id)) ? 10 : (video.stats.saves / 25000) * 10;

      // 5. Share score (10% weight)
      const shareScore = (hist?.shared ? 10 : (video.stats.shares / 20000) * 10);

      // 6. Like score (5% weight)
      const likeScore = (hist?.liked || user.likedVideoIds.includes(video.id)) ? 5 : (video.stats.likes / 50000) * 5;

      // 7. Topic affinity score (5% weight)
      const userTopicAffinity = topicAffinities[video.topic] || 0;
      const topicAffinityScore = Math.min(userTopicAffinity * 2, 5);

      // Dynamic Deity Preference Bonus
      let deityBonus = 0;
      if (deityAffinities[video.deity]) {
        deityBonus = Math.min((deityAffinities[video.deity] || 0) * 3, 12);
      }

      // Time of day bonus (e.g. morning meditation in morning, stillness in evening)
      let timeOfDayBonus = 0;
      if (timeOfDayHour >= 4 && timeOfDayHour <= 10) {
        if (video.topic.includes('Morning') || video.topic.includes('Discipline') || video.category.includes('Daily')) {
          timeOfDayBonus = 5;
        }
      } else if (timeOfDayHour >= 20 || timeOfDayHour <= 3) {
        if (video.topic.includes('Stillness') || video.topic.includes('Overcoming Fear') || video.topic.includes('Detachment')) {
          timeOfDayBonus = 5;
        }
      }

      // Negative penalty for quick skips
      const skipPenalty = hist?.skippedQuickly ? -20 : 0;

      // Controlled Exploration Jitter (prevent echo chambers by injecting 0-8 points of serendipity)
      const diversityJitter = ((index * 7 + video.title.length) % 11) * 0.7;

      const totalScore = Math.max(
        0,
        watchCompletionScore +
        watchTimeScore +
        rewatchScore +
        saveScore +
        shareScore +
        likeScore +
        topicAffinityScore +
        deityBonus +
        timeOfDayBonus +
        skipPenalty +
        diversityJitter
      );

      // Generate human-readable algorithmic reason
      let reason = "Curated foundational wisdom";
      if (deityBonus > 6) reason = `Recommended because you resonate with Lord ${video.deity}`;
      else if (topicAffinityScore > 3) reason = `High affinity for ${video.topic}`;
      else if (timeOfDayBonus > 0) reason = `Time-aligned practice for this hour`;
      else if (saveScore > 7) reason = `Deeply bookmarked by spiritual seekers`;

      const breakdown: VideoScoringBreakdown = {
        videoId: video.id,
        watchCompletionScore,
        watchTimeScore,
        rewatchScore,
        saveScore,
        shareScore,
        likeScore,
        topicAffinityScore,
        deityBonus,
        diversityJitter,
        totalScore,
        reason
      };

      scoreMap.set(video.id, breakdown);
      return { video, totalScore };
    });

    // Sort descending by total recommendation score
    scoredList.sort((a, b) => b.totalScore - a.totalScore);

    return {
      ranked: scoredList.map(s => s.video),
      scores: scoreMap
    };
  }
}

export const reelsAlgorithm = new ReelsRecommendationEngine();
