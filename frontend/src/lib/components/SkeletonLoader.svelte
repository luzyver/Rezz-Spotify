<script lang="ts">
  let { type = 'card' }: { type?: 'card' | 'list' | 'chart' } = $props();
</script>

{#if type === 'card'}
  <div class="glass-card animate-pulse rounded-xl p-4">
    <div class="mb-3 h-32 rounded-lg bg-white/10"></div>
    <div class="mb-2 h-4 w-3/4 rounded bg-white/10"></div>
    <div class="h-3 w-1/2 rounded bg-white/10"></div>
  </div>
{:else if type === 'list'}
  <div class="space-y-3">
    {#each Array(5) as _}
      <div class="glass-card animate-pulse rounded-lg p-4">
        <div class="flex items-center gap-3">
          <div class="h-12 w-12 rounded-lg bg-white/10"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 w-3/4 rounded bg-white/10"></div>
            <div class="h-3 w-1/2 rounded bg-white/10"></div>
          </div>
        </div>
      </div>
    {/each}
  </div>
{:else if type === 'chart'}
  <div class="glass-card animate-pulse rounded-xl p-6">
    <div class="mb-4 h-6 w-1/3 rounded bg-white/10"></div>
    <div class="flex items-end justify-between gap-2">
      {#each Array(12) as _, i}
        <div
          class="w-full rounded-t-lg bg-white/10"
          style="height: {Math.random() * 100 + 20}px"
        ></div>
      {/each}
    </div>
  </div>
{/if}

<style>
  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
</style>
