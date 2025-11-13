<script lang="ts">
  import type { ListeningInsights } from '$lib/utils/analytics';
  import { Share2, Download, X } from 'lucide-svelte';
  import { Motion, AnimatePresence } from 'svelte-motion';

  let { insights }: { insights: ListeningInsights } = $props();

  let showModal = $state(false);
  let cardRef = $state<HTMLDivElement>();

  async function shareAsImage() {
    // In a real implementation, you'd use html2canvas or similar
    // For now, we'll just show a message
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Spotify Stats',
          text: `I've listened to ${insights.totalPlays} tracks! My music personality: ${insights.musicPersonality}`,
        });
      } catch (err) {
        // Share cancelled
      }
    } else {
      alert('Share feature not supported on this browser');
    }
  }

  function downloadCard() {
    // Placeholder for download functionality
    alert('Download feature coming soon!');
  }
</script>

<button
  onclick={() => (showModal = true)}
  class="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm transition-all hover:border-[#1db954]/50 hover:bg-white/10"
>
  <Share2 class="h-4 w-4" />
  Share Stats
</button>

<AnimatePresence>
  {#if showModal}
    <Motion initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} let:motion>
      <div
        use:motion
        role="button"
        tabindex="-1"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
        onclick={() => (showModal = false)}
        onkeydown={(e) => e.key === 'Escape' && (showModal = false)}
      >
        <Motion
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          let:motion
        >
          <div
            use:motion
            role="dialog"
            aria-modal="true"
            tabindex="-1"
            class="relative w-full max-w-md"
            onclick={(e) => e.stopPropagation()}
            onkeydown={(e) => e.stopPropagation()}
          >
            <button
              onclick={() => (showModal = false)}
              class="absolute -right-2 -top-2 z-10 rounded-full bg-white/10 p-2 backdrop-blur-md transition-all hover:bg-white/20"
            >
              <X class="h-4 w-4" />
            </button>

            <!-- Share Card -->
            <div
              bind:this={cardRef}
              class="overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] p-8 shadow-2xl"
            >
              <div class="mb-6 text-center">
                <div class="mb-2 text-4xl">🎵</div>
                <h2 class="gradient-text text-2xl font-black">My Spotify Stats</h2>
              </div>

              <div class="space-y-4">
                <div class="rounded-lg bg-white/5 p-4 backdrop-blur-md">
                  <div class="text-3xl font-black text-[#1db954]">{insights.totalPlays}</div>
                  <div class="text-sm text-gray-400">Total Plays</div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="rounded-lg bg-white/5 p-4 backdrop-blur-md">
                    <div class="text-xl font-bold">{insights.uniqueTracks}</div>
                    <div class="text-xs text-gray-400">Unique Tracks</div>
                  </div>
                  <div class="rounded-lg bg-white/5 p-4 backdrop-blur-md">
                    <div class="text-xl font-bold">{insights.uniqueArtists}</div>
                    <div class="text-xs text-gray-400">Artists</div>
                  </div>
                </div>

                <div class="rounded-lg bg-white/5 p-4 backdrop-blur-md">
                  <div class="mb-1 text-sm text-gray-400">Music Personality</div>
                  <div class="text-lg font-bold text-[#1db954]">{insights.musicPersonality}</div>
                </div>

                <div class="rounded-lg bg-white/5 p-4 backdrop-blur-md">
                  <div class="mb-1 text-sm text-gray-400">Top Artist</div>
                  <div class="text-lg font-bold">{insights.topArtist.name}</div>
                  <div class="text-xs text-gray-500">{insights.topArtist.plays} plays</div>
                </div>
              </div>

              <div class="mt-6 text-center text-xs text-gray-500">
                Powered by Spotify • {new Date().toLocaleDateString()}
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="mt-4 flex gap-2">
              <button
                onclick={shareAsImage}
                class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#1db954] px-4 py-3 font-medium transition-all hover:bg-[#1ed760]"
              >
                <Share2 class="h-4 w-4" />
                Share
              </button>
              <button
                onclick={downloadCard}
                class="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-3 font-medium backdrop-blur-md transition-all hover:bg-white/10"
              >
                <Download class="h-4 w-4" />
                Download
              </button>
            </div>
          </div>
        </Motion>
      </div>
    </Motion>
  {/if}
</AnimatePresence>
