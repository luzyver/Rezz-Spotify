<script lang="ts">
  import { onMount } from 'svelte';
  import { Motion, AnimatePresence } from 'svelte-motion';
  import { Keyboard, X } from 'lucide-svelte';

  let showModal = $state(false);

  const shortcuts = [
    { key: '/', description: 'Focus search' },
    { key: 'Esc', description: 'Clear search / Close modals' },
    { key: '1-4', description: 'Switch tabs' },
    { key: 'T', description: 'Toggle theme' },
    { key: 'F', description: 'Toggle fullscreen' },
    { key: '←/→', description: 'Navigate pages' },
    { key: '?', description: 'Show shortcuts' },
  ];

  onMount(() => {
    function handleKeydown(e: KeyboardEvent) {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === '?' && !e.shiftKey) {
        e.preventDefault();
        showModal = !showModal;
      }
    }

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  });
</script>

<button
  onclick={() => (showModal = true)}
  class="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-[#1db954] shadow-lg backdrop-blur-md transition-all hover:scale-110 hover:shadow-xl"
  aria-label="Keyboard shortcuts"
  title="Keyboard shortcuts (?)"
>
  <Keyboard class="h-5 w-5 text-white" />
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
            class="glass-card relative w-full max-w-md rounded-2xl p-6"
            onclick={(e) => e.stopPropagation()}
            onkeydown={(e) => e.stopPropagation()}
          >
            <button
              onclick={() => (showModal = false)}
              class="absolute right-4 top-4 rounded-full p-2 transition-all hover:bg-white/10"
            >
              <X class="h-4 w-4" />
            </button>

            <div class="mb-6">
              <div class="mb-2 flex items-center gap-2">
                <Keyboard class="h-6 w-6 text-[#1db954]" />
                <h2 class="text-2xl font-bold">Keyboard Shortcuts</h2>
              </div>
              <p class="text-sm text-gray-400">Navigate faster with these shortcuts</p>
            </div>

            <div class="space-y-3">
              {#each shortcuts as shortcut, i}
                <Motion
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  let:motion
                >
                  <div
                    use:motion
                    class="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3"
                  >
                    <span class="text-sm text-gray-300">{shortcut.description}</span>
                    <kbd
                      class="rounded border border-white/20 bg-white/10 px-3 py-1 font-mono text-sm font-bold"
                    >
                      {shortcut.key}
                    </kbd>
                  </div>
                </Motion>
              {/each}
            </div>
          </div>
        </Motion>
      </div>
    </Motion>
  {/if}
</AnimatePresence>
