import { writable, derived } from 'svelte/store';
import type { HistoryItem } from '$lib/types';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  target?: number;
}

export const achievements = writable<Achievement[]>([
  {
    id: 'first-play',
    title: 'First Steps',
    description: 'Play your first track',
    icon: '🎵',
    unlocked: false,
  },
  {
    id: 'night-owl',
    title: 'Night Owl',
    description: 'Listen to music between 12 AM - 4 AM',
    icon: '🦉',
    unlocked: false,
  },
  {
    id: 'early-bird',
    title: 'Early Bird',
    description: 'Listen to music between 5 AM - 7 AM',
    icon: '🐦',
    unlocked: false,
  },
  {
    id: 'genre-explorer',
    title: 'Genre Explorer',
    description: 'Listen to 10 different artists',
    icon: '🗺️',
    unlocked: false,
    progress: 0,
    target: 10,
  },
  {
    id: 'marathon',
    title: 'Marathon Listener',
    description: 'Listen to 100 tracks',
    icon: '🏃',
    unlocked: false,
    progress: 0,
    target: 100,
  },
  {
    id: 'loyal-fan',
    title: 'Loyal Fan',
    description: 'Play the same track 10 times',
    icon: '💚',
    unlocked: false,
    progress: 0,
    target: 10,
  },
  {
    id: 'week-streak',
    title: 'Week Warrior',
    description: 'Listen to music for 7 consecutive days',
    icon: '🔥',
    unlocked: false,
    progress: 0,
    target: 7,
  },
  {
    id: 'variety-seeker',
    title: 'Variety Seeker',
    description: 'No repeat artists in 20 consecutive plays',
    icon: '🎲',
    unlocked: false,
  },
]);

export function checkAchievements(history: HistoryItem[]) {
  achievements.update((current) => {
    const updated = [...current];

    // First play
    if (history.length > 0) {
      const firstPlay = updated.find((a) => a.id === 'first-play');
      if (firstPlay) firstPlay.unlocked = true;
    }

    // Night owl & Early bird (local timezone)
    const nightOwl = history.some((item) => {
      const date = new Date(item.timestamp);
      const localHour = date.getHours(); // Use local timezone
      return localHour >= 0 && localHour < 4;
    });
    const earlyBird = history.some((item) => {
      const date = new Date(item.timestamp);
      const localHour = date.getHours(); // Use local timezone
      return localHour >= 5 && localHour < 7;
    });

    const nightOwlAch = updated.find((a) => a.id === 'night-owl');
    const earlyBirdAch = updated.find((a) => a.id === 'early-bird');
    if (nightOwlAch) nightOwlAch.unlocked = nightOwl;
    if (earlyBirdAch) earlyBirdAch.unlocked = earlyBird;

    // Genre explorer
    const uniqueArtists = new Set(history.map((h) => h.artist)).size;
    const genreExplorer = updated.find((a) => a.id === 'genre-explorer');
    if (genreExplorer) {
      genreExplorer.progress = uniqueArtists;
      genreExplorer.unlocked = uniqueArtists >= 10;
    }

    // Marathon
    const marathon = updated.find((a) => a.id === 'marathon');
    if (marathon) {
      marathon.progress = history.length;
      marathon.unlocked = history.length >= 100;
    }

    // Loyal fan
    const trackCounts = history.reduce(
      (acc, item) => {
        acc[item.track] = (acc[item.track] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
    const maxPlays = Math.max(...Object.values(trackCounts), 0);
    const loyalFan = updated.find((a) => a.id === 'loyal-fan');
    if (loyalFan) {
      loyalFan.progress = maxPlays;
      loyalFan.unlocked = maxPlays >= 10;
    }

    // Week streak
    const dates = history
      .map((h) => new Date(h.timestamp).toDateString())
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort();
    let streak = 1;
    let maxStreak = 1;
    for (let i = 1; i < dates.length; i++) {
      const diff =
        (new Date(dates[i]).getTime() - new Date(dates[i - 1]).getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        streak++;
        maxStreak = Math.max(maxStreak, streak);
      } else {
        streak = 1;
      }
    }
    const weekStreak = updated.find((a) => a.id === 'week-streak');
    if (weekStreak) {
      weekStreak.progress = maxStreak;
      weekStreak.unlocked = maxStreak >= 7;
    }

    return updated;
  });
}
