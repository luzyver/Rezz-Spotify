<script lang="ts">
  import type { HistoryItem } from '$lib/types';
  import type { ViewMode } from '$lib/stores/filters';
  import { timeAgo, spotifyUrl, getUserName } from '$lib/utils';
  import { Motion } from 'svelte-motion';
  import { Play, Clock, ExternalLink } from 'lucide-svelte';
  import { theme } from '$lib/stores/theme';

  interface Props {
    item: HistoryItem;
    index: number;
    currentPage: number;
    itemsPerPage: number;
    viewMode?: ViewMode;
  }

  let { item, index, currentPage, itemsPerPage, viewMode = 'grid' }: Props = $props();

  const globalIndex = $derived((currentPage - 1) * itemsPerPage + index + 1);
  const isLight = $derived($theme === 'light');
  
  const userName = $derived(item.user || getUserName(item.userId));
</script>

{#if viewMode === 'list'}
  <!-- List View -->
  <Motion
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.03, duration: 0.4 }}
    let:motion
  >
    <div
      use:motion
      class="group flex items-center gap-4 rounded-md p-2 transition-all duration-200 hover:bg-white/10"
    >
      <!-- Number -->
      <div class="w-8 text-center text-sm text-gray-400">{globalIndex}</div>

      <!-- Album Art -->
      <a
        href={spotifyUrl(item.uri)}
        target="_blank"
        rel="noopener noreferrer"
        class="relative flex-shrink-0"
      >
        <div class="relative h-10 w-10 overflow-hidden rounded">
          <img src={item.imageUrl} class="h-full w-full object-cover" alt={item.track} />
        </div>
      </a>

      <!-- Info -->
      <div class="min-w-0 flex-1">
        <a href={spotifyUrl(item.uri)} target="_blank" rel="noopener noreferrer" class="block">
          <h4 class="truncate text-base text-white hover:underline">
            {item.track}
          </h4>
        </a>
        <p class="truncate text-sm text-gray-400">{item.artist || 'Unknown Artist'}</p>
      </div>

      <!-- User Info -->
      <div class="text-sm text-gray-400">{userName}</div>

      <!-- Time -->
      <div class="text-sm text-gray-400">{timeAgo(item.timestamp)}</div>
    </div>
  </Motion>
{:else if viewMode === 'compact'}
  <!-- Compact View -->
  <Motion
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.02, duration: 0.3 }}
    let:motion
  >
    <a
      use:motion
      href={spotifyUrl(item.uri)}
      target="_blank"
      rel="noopener noreferrer"
      class="spotify-card group block overflow-hidden p-3"
    >
      <div class="relative mb-3 aspect-square overflow-hidden rounded-md">
        <img src={item.imageUrl} alt={item.track} class="h-full w-full object-cover" />
        <div
          class="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        ></div>
        <div
          class="absolute bottom-2 right-2 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-[#1db954] opacity-0 shadow-xl transition-all duration-200 hover:scale-110 hover:bg-[#1ed760] group-hover:translate-y-0 group-hover:opacity-100"
        >
          <Play class="h-4 w-4 translate-x-0.5 fill-black text-black" />
        </div>
      </div>
      <p class="mb-1 truncate text-sm font-semibold text-white">{item.track}</p>
      <p class="truncate text-xs text-gray-400">{item.artist || 'Unknown Artist'}</p>
      <!-- User Info -->
      <div class="mt-1">
        <span class="truncate text-xs text-gray-500">{userName}</span>
      </div>
    </a>
  </Motion>
{:else}
  <!-- Grid View (Default) -->
  <Motion
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.04, duration: 0.4 }}
    let:motion
  >
    <div use:motion class="spotify-card group overflow-hidden rounded-lg p-4">
      <!-- Album Art -->
      <a
        href={spotifyUrl(item.uri)}
        target="_blank"
        rel="noopener noreferrer"
        class="relative mb-4 block"
      >
        <div class="relative aspect-square overflow-hidden rounded-md shadow-lg">
          <img src={item.imageUrl} alt={item.track} class="h-full w-full object-cover" />

          <!-- Overlay -->
          <div
            class="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          ></div>

          <!-- Play Button -->
          <div
            class="absolute bottom-2 right-2 flex h-12 w-12 translate-y-2 items-center justify-center rounded-full bg-[#1db954] opacity-0 shadow-xl transition-all duration-200 hover:scale-110 hover:bg-[#1ed760] group-hover:translate-y-0 group-hover:opacity-100"
          >
            <Play class="h-5 w-5 translate-x-0.5 fill-black text-black" />
          </div>
        </div>
      </a>

      <!-- Info -->
      <div class="space-y-2">
        <a href={spotifyUrl(item.uri)} target="_blank" rel="noopener noreferrer" class="block">
          <h4 class="line-clamp-1 text-base font-bold text-white hover:underline">
            {item.track}
          </h4>
        </a>

        <p class="line-clamp-2 text-sm text-gray-400">
          {item.artist || 'Unknown Artist'}
        </p>

        <!-- User Info -->
        <div class="flex items-center gap-2 pt-1 text-xs text-gray-400">
          <span class="truncate">{userName}</span>
          <span class="text-gray-600">•</span>
          <span>{timeAgo(item.timestamp)}</span>
        </div>
      </div>
    </div>
  </Motion>
{/if}
