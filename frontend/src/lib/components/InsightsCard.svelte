<script lang="ts">
  import type { ListeningInsights } from '$lib/utils/analytics';
  import { Music, Users, Clock, Flame, Target, Disc3 } from 'lucide-svelte';

  let { insights }: { insights: ListeningInsights } = $props();

  const stats = $derived([
    { label: 'Total Plays', value: insights.totalPlays, icon: Music },
    { label: 'Unique Tracks', value: insights.uniqueTracks, icon: Disc3 },
    { label: 'Artists', value: insights.uniqueArtists, icon: Users },
    { label: 'Favorite Time', value: insights.favoriteTime, icon: Clock },
    { label: 'Streak', value: `${insights.listeningStreak}d`, icon: Flame },
    { label: 'Discovery', value: `${insights.discoveryScore}%`, icon: Target },
  ]);
</script>

<div class="space-y-6">
  <!-- Header Section -->
  <div class="flex items-center justify-between">
    <div>
      <h2 class="text-3xl font-bold">Overview</h2>
      <p class="mt-1 text-sm text-gray-400">
        {insights.musicPersonality} • {insights.avgPlaysPerDay} plays/day
      </p>
    </div>
  </div>

  <!-- Stats Grid - Minimalist -->
  <div class="grid grid-cols-3 gap-3 sm:grid-cols-6">
    {#each stats as stat (stat.label)}
      <div
        class="group rounded-lg border border-white/5 bg-white/[0.02] p-4 transition-all hover:border-white/10 hover:bg-white/[0.04]"
      >
        {#each [stat.icon] as Icon (Icon)}
          <Icon class="mb-2 h-4 w-4 text-gray-400" />
        {/each}
        <div class="text-xl font-semibold">{stat.value}</div>
        <div class="mt-0.5 text-xs text-gray-500">{stat.label}</div>
      </div>
    {/each}
  </div>

  <!-- Top Artist & Track - Simplified -->
  <div class="grid gap-3 sm:grid-cols-2">
    <div class="rounded-lg border border-white/5 bg-white/[0.02] p-4">
      <div class="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">Top Artist</div>
      <div class="text-lg font-semibold">{insights.topArtist.name}</div>
      <div class="mt-2 flex items-center gap-2 text-sm text-gray-400">
        <div class="h-1 flex-1 overflow-hidden rounded-full bg-white/5">
          <div
            class="h-full bg-[#1db954]"
            style="width: {Math.min((insights.topArtist.plays / insights.totalPlays) * 100, 100)}%"
          ></div>
        </div>
        <span>{insights.topArtist.plays}</span>
      </div>
    </div>

    <div class="rounded-lg border border-white/5 bg-white/[0.02] p-4">
      <div class="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">Top Track</div>
      <div class="line-clamp-1 text-lg font-semibold">{insights.topTrack.name}</div>
      <div class="line-clamp-1 text-sm text-gray-400">{insights.topTrack.artist}</div>
      <div class="mt-2 flex items-center gap-2 text-sm text-gray-400">
        <div class="h-1 flex-1 overflow-hidden rounded-full bg-white/5">
          <div
            class="h-full bg-[#1db954]"
            style="width: {Math.min((insights.topTrack.plays / insights.totalPlays) * 100, 100)}%"
          ></div>
        </div>
        <span>{insights.topTrack.plays}</span>
      </div>
    </div>
  </div>
</div>
