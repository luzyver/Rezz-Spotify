<script lang="ts">
  import type { HistoryItem } from '$lib/types';
  import type { ViewMode } from '$lib/stores/filters';
  import { timeAgo, spotifyUrl } from '$lib/utils';
  import { Motion } from 'svelte-motion';
  import { Play, Clock, User, Sparkles } from 'lucide-svelte';
  import { COLOR_PALETTES } from '$lib/palettes';
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
  const palette = $derived(COLOR_PALETTES[globalIndex % COLOR_PALETTES.length]);
  const isLight = $derived($theme === 'light');

  // Light mode colors
  const textColor = $derived(isLight ? '#1f2937' : '#ffffff');
  const secondaryTextColor = $derived(isLight ? '#6b7280' : '#9ca3af');
  const tertiaryTextColor = $derived(isLight ? '#9ca3af' : '#6b7280');
  const cardBg = $derived(
    isLight
      ? 'rgba(255, 255, 255, 0.95)'
      : `linear-gradient(135deg, ${palette.primary}15, ${palette.secondary}15)`
  );
</script>

{#if viewMode === 'list'}
  <!-- List View -->
  <Motion
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05 }}
    let:motion
  >
    <div
      use:motion
      class="glass-card group flex items-center gap-4 rounded-xl p-3 transition-all hover:scale-[1.02]"
    >
      <a href={spotifyUrl(item.uri)} target="_blank" rel="noopener noreferrer">
        <div class="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
          <img src={item.imageUrl} class="h-full w-full object-cover" alt={item.track} />
          <div
            class="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <Play class="h-6 w-6 fill-white text-white" />
          </div>
        </div>
      </a>

      <div class="min-w-0 flex-1">
        <a href={spotifyUrl(item.uri)} target="_blank" rel="noopener noreferrer">
          <h3 class="truncate font-bold" style="color: {isLight ? '#16a34a' : palette.primary}">
            {item.track}
          </h3>
        </a>
        <p class="truncate text-sm" style="color: {secondaryTextColor}">{item.artist}</p>
      </div>

      <div class="flex items-center gap-4 text-sm" style="color: {tertiaryTextColor}">
        <div class="flex items-center gap-1">
          <Clock class="h-4 w-4" />
          <span>{timeAgo(item.timestamp)}</span>
        </div>
        <div class="flex items-center gap-1">
          <User class="h-4 w-4" />
          <span>{item.user}</span>
        </div>
      </div>
    </div>
  </Motion>
{:else if viewMode === 'compact'}
  <!-- Compact View -->
  <Motion
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.03 }}
    let:motion
  >
    <a
      use:motion
      href={spotifyUrl(item.uri)}
      target="_blank"
      rel="noopener noreferrer"
      class="group block"
    >
      <div class="glass-card overflow-hidden rounded-lg transition-all hover:scale-105">
        <div class="relative aspect-square">
          <img src={item.imageUrl} class="h-full w-full object-cover" alt={item.track} />
          <div
            class="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <Play class="h-8 w-8 fill-white text-white" />
          </div>
          <div
            class="absolute left-1 top-1 rounded-full px-2 py-1 text-xs font-bold"
            style="background: {palette.primary}"
          >
            #{globalIndex}
          </div>
        </div>
        <div class="p-2">
          <h3
            class="truncate text-xs font-bold"
            style="color: {isLight ? '#16a34a' : palette.primary}"
          >
            {item.track}
          </h3>
          <p class="truncate text-[10px]" style="color: {secondaryTextColor}">{item.artist}</p>
        </div>
      </div>
    </a>
  </Motion>
{:else}
  <!-- Grid View (Default) -->
  <Motion
    initial={{ opacity: 0, y: 30, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{
      type: 'spring',
      stiffness: 100,
      damping: 15,
      mass: 1,
      delay: (index % itemsPerPage) * 0.08,
    }}
    let:motion
  >
    <div
      use:motion
      class="group relative cursor-pointer overflow-hidden rounded-2xl transition-all duration-700 ease-out hover:scale-[1.03] {isLight
        ? 'border border-gray-200 shadow-lg'
        : ''}"
      style="background: {cardBg}"
    >
      <div class="absolute inset-0 bg-gradient-to-br {palette.gradient} opacity-60"></div>
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
      ></div>

      <div
        class="absolute right-2 top-2 opacity-0 transition-all duration-500 ease-out group-hover:opacity-100"
      >
        <Sparkles
          class="h-4 w-4 animate-pulse text-yellow-300"
          style="filter: drop-shadow(0 0 8px {palette.primary})"
        />
      </div>

      <div
        class="absolute inset-0 rounded-2xl opacity-0 transition-all duration-700 ease-out group-hover:opacity-100"
        style="box-shadow: inset 0 0 20px {palette.primary}40, 0 0 30px {palette.primary}20"
      ></div>

      <div class="relative z-10 p-2 sm:p-3">
        <div class="group/album relative mb-3">
          <a href={spotifyUrl(item.uri)} target="_blank" rel="noopener noreferrer" class="block">
            <div
              class="relative overflow-hidden rounded-xl shadow-2xl transition-all duration-700 ease-out group-hover/album:rotate-1 group-hover/album:scale-105"
              style="box-shadow: 0 20px 40px {palette.primary}40"
            >
              <img src={item.imageUrl} class="aspect-square w-full object-cover" alt={item.track} />

              <div
                class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-500 ease-out group-hover/album:opacity-100"
              ></div>

              <div
                class="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-500 ease-out group-hover/album:opacity-100"
              >
                <div
                  class="animate-bounce-slow rounded-full p-4 transition-transform duration-300 ease-out hover:scale-125"
                  style="background: linear-gradient(135deg, {palette.primary}, {palette.secondary}); box-shadow: 0 0 30px {palette.primary}80"
                >
                  <Play class="h-6 w-6 fill-white text-white drop-shadow-lg" />
                </div>
              </div>
            </div>

            <div
              class="animate-bounce-gentle absolute -left-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full text-sm font-black shadow-lg"
              style="background: linear-gradient(135deg, {palette.primary}, {palette.secondary}); box-shadow: 0 0 20px {palette.primary}60"
            >
              #{globalIndex}
            </div>
          </a>
        </div>

        <div class="space-y-1.5 sm:space-y-2">
          <a href={spotifyUrl(item.uri)} target="_blank" rel="noopener noreferrer" class="block">
            <h3
              class="line-clamp-2 text-sm font-black leading-tight transition-transform duration-500 ease-out group-hover:scale-105 sm:text-base"
              style="color: {isLight ? '#16a34a' : palette.primary}; text-shadow: {isLight
                ? 'none'
                : `0 0 20px ${palette.primary}40`}"
            >
              {item.track}
            </h3>
          </a>

          <p
            class="truncate text-xs font-semibold transition-colors duration-300 ease-out sm:text-sm"
            style="color: {secondaryTextColor}"
            title={item.artist}
          >
            {item.artist}
          </p>

          <div
            class="flex items-center justify-between border-t pt-2 text-xs"
            style="border-color: {isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}"
          >
            <div class="flex items-center gap-1.5" style="color: {tertiaryTextColor}">
              <Clock class="h-3 w-3" />
              <span>{timeAgo(item.timestamp)}</span>
            </div>

            <div
              class="flex items-center gap-1.5 rounded-full px-2 py-1 transition-all duration-500 ease-out hover:scale-105"
              style="background: {isLight
                ? 'rgba(22, 163, 74, 0.15)'
                : `linear-gradient(135deg, ${palette.primary}30, ${palette.secondary}30)`}; color: {isLight
                ? '#16a34a'
                : palette.primary}"
            >
              <User class="h-3 w-3" />
              <span class="max-w-[60px] truncate font-bold">{item.user}</span>
            </div>
          </div>
        </div>
      </div>

      <div
        class="absolute bottom-0 left-0 h-1 w-full transition-all duration-700 ease-out group-hover:h-2"
        style="background: linear-gradient(90deg, {palette.primary}, {palette.secondary})"
      ></div>
    </div>
  </Motion>
{/if}

<style>
  @keyframes bounce-slow {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes bounce-gentle {
    0%,
    100% {
      transform: translateY(0) scale(1);
    }
    50% {
      transform: translateY(-5px) scale(1.05);
    }
  }

  .animate-bounce-slow {
    animation: bounce-slow 2s ease-in-out infinite;
  }

  .animate-bounce-gentle {
    animation: bounce-gentle 3s ease-in-out infinite;
  }
</style>
