import type { HistoryItem } from '$lib/types';

export interface ListeningInsights {
  totalPlays: number;
  uniqueTracks: number;
  uniqueArtists: number;
  topArtist: { name: string; plays: number };
  topTrack: { name: string; artist: string; plays: number };
  favoriteTime: string;
  listeningStreak: number;
  discoveryScore: number;
  musicPersonality: string;
  avgPlaysPerDay: number;
  topGenre?: string;
}

export function calculateInsights(history: HistoryItem[]): ListeningInsights {
  if (history.length === 0) {
    return {
      totalPlays: 0,
      uniqueTracks: 0,
      uniqueArtists: 0,
      topArtist: { name: 'N/A', plays: 0 },
      topTrack: { name: 'N/A', artist: 'N/A', plays: 0 },
      favoriteTime: 'N/A',
      listeningStreak: 0,
      discoveryScore: 0,
      musicPersonality: 'New Listener',
      avgPlaysPerDay: 0,
    };
  }

  // Basic stats
  const totalPlays = history.length;
  const uniqueTracks = new Set(history.map((h) => h.track)).size;
  const uniqueArtists = new Set(history.map((h) => h.artist)).size;

  // Top artist
  const artistCounts = history.reduce(
    (acc, item) => {
      acc[item.artist] = (acc[item.artist] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const topArtistEntry = Object.entries(artistCounts).sort((a, b) => b[1] - a[1])[0];
  const topArtist = { name: topArtistEntry[0], plays: topArtistEntry[1] };

  // Top track
  const trackCounts = history.reduce(
    (acc, item) => {
      const key = `${item.track}|||${item.artist}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const topTrackEntry = Object.entries(trackCounts).sort((a, b) => b[1] - a[1])[0];
  const [trackName, artistName] = topTrackEntry[0].split('|||');
  const topTrack = { name: trackName, artist: artistName, plays: topTrackEntry[1] };

  // Favorite time (GMT+7 / WIB)
  const hourCounts = history.reduce(
    (acc, item) => {
      // Convert to GMT+7 (WIB)
      const date = new Date(item.timestamp);
      const utcHour = date.getUTCHours();
      const wibHour = (utcHour + 7) % 24; // GMT+7
      acc[wibHour] = (acc[wibHour] || 0) + 1;
      return acc;
    },
    {} as Record<number, number>
  );
  const favoriteHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0][0];
  const favoriteTime = `${favoriteHour}:00 - ${Number(favoriteHour) + 1}:00`;

  // Listening streak
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

  // Discovery score (percentage of unique tracks)
  const discoveryScore = Math.round((uniqueTracks / totalPlays) * 100);

  // Music personality
  let musicPersonality = 'Casual Listener';
  if (discoveryScore > 80) musicPersonality = 'Explorer';
  else if (discoveryScore < 30) musicPersonality = 'Loyalist';
  else if (totalPlays > 100) musicPersonality = 'Enthusiast';

  // Average plays per day
  const daySpan = dates.length || 1;
  const avgPlaysPerDay = Math.round(totalPlays / daySpan);

  return {
    totalPlays,
    uniqueTracks,
    uniqueArtists,
    topArtist,
    topTrack,
    favoriteTime,
    listeningStreak: maxStreak,
    discoveryScore,
    musicPersonality,
    avgPlaysPerDay,
  };
}

export function getHourlyDistribution(history: HistoryItem[]): { hour: number; plays: number }[] {
  const hourCounts = history.reduce(
    (acc, item) => {
      // Convert to GMT+7 (WIB)
      const date = new Date(item.timestamp);
      const utcHour = date.getUTCHours();
      const wibHour = (utcHour + 7) % 24; // GMT+7
      acc[wibHour] = (acc[wibHour] || 0) + 1;
      return acc;
    },
    {} as Record<number, number>
  );

  return Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    plays: hourCounts[i] || 0,
  }));
}

export function getDailyDistribution(
  history: HistoryItem[]
): { date: string; plays: number; tracks: string[] }[] {
  const dailyCounts = history.reduce(
    (acc, item) => {
      const date = new Date(item.timestamp).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { plays: 0, tracks: [] };
      }
      acc[date].plays++;
      acc[date].tracks.push(item.track);
      return acc;
    },
    {} as Record<string, { plays: number; tracks: string[] }>
  );

  return Object.entries(dailyCounts)
    .map(([date, data]) => ({
      date,
      plays: data.plays,
      tracks: data.tracks,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}
