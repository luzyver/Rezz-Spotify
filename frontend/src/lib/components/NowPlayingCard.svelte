<script lang="ts">
  import type { NowPlayingBuddy } from '$lib/types';
  import { getUserName, timeAgo, spotifyUrl } from '$lib/utils';
  import { fly } from 'svelte/transition';
  import { Play } from 'lucide-svelte';

  interface Props {
    buddy: NowPlayingBuddy;
    index: number;
  }

  let { buddy, index }: Props = $props();

  const userName = $derived(buddy.user?.name || getUserName(buddy.user?.uri));
  const avatarUrl = $derived(
    buddy.user?.imageUrl ||
      `https://ui-avatars.com/api/?name=${userName}&background=1db954&color=fff`
  );
</script>

<div
  class="spotify-card group relative overflow-hidden p-4 transition-all duration-300"
  in:fly={{ y: 20, duration: 400, delay: index * 80 }}
>
  <!-- Album Art -->
  <div class="group/album relative mb-4">
    <a
      href={spotifyUrl(buddy.track?.uri)}
      target="_blank"
      rel="noopener noreferrer"
      class="relative block"
    >
      <div class="relative overflow-hidden rounded-md shadow-2xl">
        <img
          src={buddy.track?.imageUrl || ''}
          class="aspect-square w-full object-cover"
          alt={buddy.track?.name || 'Album art'}
          loading="lazy"
        />

        <!-- Overlay on Hover -->
        <div
          class="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover/album:opacity-100"
        ></div>

        <!-- Play Button -->
        <div
          class="absolute bottom-2 right-2 flex h-12 w-12 translate-y-2 items-center justify-center rounded-full bg-[#1db954] opacity-0 shadow-xl transition-all duration-300 hover:scale-110 hover:bg-[#1ed760] group-hover/album:translate-y-0 group-hover/album:opacity-100"
        >
          <Play class="h-5 w-5 translate-x-0.5 fill-black text-black" />
        </div>
      </div>

      <!-- Live Badge -->
      <div
        class="absolute right-2 top-2 flex items-center gap-1.5 rounded-full px-2.5 py-1 shadow-lg"
        style="background-color: #1db954;"
      >
        <div
          class="h-1.5 w-1.5 animate-pulse rounded-full"
          style="background-color: #ffffff;"
        ></div>
        <span class="text-[10px] font-bold uppercase tracking-wide" style="color: #ffffff;"
          >Live</span
        >
      </div>
    </a>
  </div>

  <!-- Track Info -->
  <div class="space-y-2">
    <a href={spotifyUrl(buddy.track?.uri)} target="_blank" rel="noopener noreferrer" class="block">
      <h3 class="line-clamp-1 text-base font-bold text-white transition-colors hover:underline">
        {buddy.track?.name || ''}
      </h3>
    </a>

    <div class="space-y-1">
      <a
        href={spotifyUrl(buddy.track?.artist?.uri)}
        target="_blank"
        rel="noopener noreferrer"
        class="block truncate text-sm text-gray-400 transition-colors hover:text-white hover:underline"
      >
        {buddy.track?.artist?.name || ''}
      </a>

      {#if buddy.track?.album?.name}
        <a
          href={spotifyUrl(buddy.track?.album?.uri)}
          target="_blank"
          rel="noopener noreferrer"
          class="block truncate text-xs text-gray-500 transition-colors hover:text-gray-400 hover:underline"
        >
          {buddy.track?.album?.name}
        </a>
      {/if}
    </div>

    <!-- User Info -->
    <div class="flex items-center gap-2 pt-2">
      <img
        src={avatarUrl}
        class="h-6 w-6 rounded-full"
        alt={userName}
        loading="lazy"
        onerror={(e) => ((e.currentTarget as HTMLImageElement).src = avatarUrl)}
      />
      <span class="truncate text-xs text-gray-400">{userName}</span>
      <span class="text-xs text-gray-600">•</span>
      <span class="text-xs text-gray-400">{timeAgo(buddy.timestamp)}</span>
    </div>
  </div>
</div>
