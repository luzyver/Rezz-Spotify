<script lang="ts">
  import { selectedArtist, sortBy, viewMode, density } from '$lib/stores/filters';
  import type { HistoryItem } from '$lib/types';
  import { Filter, Grid3x3, List, LayoutGrid, SlidersHorizontal } from 'lucide-svelte';

  let { history = [] }: { history: HistoryItem[] } = $props();

  let uniqueArtists = $derived(
    Array.from(new Set(history.map((h) => h.artist)))
      .sort()
      .slice(0, 20)
  );

  let showFilters = $state(false);
</script>

<div class="space-y-3">
  <!-- Main Filter Bar -->
  <div class="flex flex-wrap items-center gap-2">
    <!-- Sort -->
    <select
      bind:value={$sortBy}
      class="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm backdrop-blur-md transition-all focus:border-[#1db954]/50 focus:outline-none"
    >
      <option value="recent">Most Recent</option>
      <option value="oldest">Oldest First</option>
      <option value="artist">Artist A-Z</option>
      <option value="track">Track A-Z</option>
    </select>

    <!-- View Mode -->
    <div class="flex gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
      <button
        onclick={() => viewMode.set('grid')}
        class="rounded p-1.5 transition-all {$viewMode === 'grid'
          ? 'bg-[#1db954] text-white'
          : 'text-gray-400 hover:text-white'}"
        aria-label="Grid view"
      >
        <Grid3x3 class="h-4 w-4" />
      </button>
      <button
        onclick={() => viewMode.set('list')}
        class="rounded p-1.5 transition-all {$viewMode === 'list'
          ? 'bg-[#1db954] text-white'
          : 'text-gray-400 hover:text-white'}"
        aria-label="List view"
      >
        <List class="h-4 w-4" />
      </button>
      <button
        onclick={() => viewMode.set('compact')}
        class="rounded p-1.5 transition-all {$viewMode === 'compact'
          ? 'bg-[#1db954] text-white'
          : 'text-gray-400 hover:text-white'}"
        aria-label="Compact view"
      >
        <LayoutGrid class="h-4 w-4" />
      </button>
    </div>

    <!-- More Filters Toggle -->
    <button
      onclick={() => (showFilters = !showFilters)}
      class="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm transition-all hover:border-[#1db954]/50 hover:bg-white/10"
    >
      <SlidersHorizontal class="h-4 w-4" />
      Filters
    </button>

    <!-- Clear Filters -->
    {#if $selectedArtist}
      <button
        onclick={() => selectedArtist.set(null)}
        class="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm transition-all hover:border-red-500/50 hover:bg-red-500/10"
      >
        Clear Filters
      </button>
    {/if}
  </div>

  <!-- Extended Filters -->
  {#if showFilters}
    <div class="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-md">
      <div class="space-y-3">
        <!-- Artist Filter -->
        <div>
          <label for="artist-filter" class="mb-2 block text-xs font-medium text-gray-400"
            >Filter by Artist</label
          >
          <select
            id="artist-filter"
            bind:value={$selectedArtist}
            class="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm backdrop-blur-md transition-all focus:border-[#1db954]/50 focus:outline-none"
          >
            <option value={null}>All Artists</option>
            {#each uniqueArtists as artist}
              <option value={artist}>{artist}</option>
            {/each}
          </select>
        </div>

        <!-- Density -->
        <div>
          <div class="mb-2 text-xs font-medium text-gray-400">Display Density</div>
          <div class="flex gap-2">
            <button
              onclick={() => density.set('compact')}
              class="flex-1 rounded-lg border px-3 py-2 text-xs transition-all {$density ===
              'compact'
                ? 'border-[#1db954] bg-[#1db954]/20 text-[#1db954]'
                : 'border-white/10 bg-white/5 text-gray-400 hover:text-white'}"
            >
              Compact
            </button>
            <button
              onclick={() => density.set('comfortable')}
              class="flex-1 rounded-lg border px-3 py-2 text-xs transition-all {$density ===
              'comfortable'
                ? 'border-[#1db954] bg-[#1db954]/20 text-[#1db954]'
                : 'border-white/10 bg-white/5 text-gray-400 hover:text-white'}"
            >
              Comfortable
            </button>
            <button
              onclick={() => density.set('spacious')}
              class="flex-1 rounded-lg border px-3 py-2 text-xs transition-all {$density ===
              'spacious'
                ? 'border-[#1db954] bg-[#1db954]/20 text-[#1db954]'
                : 'border-white/10 bg-white/5 text-gray-400 hover:text-white'}"
            >
              Spacious
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
