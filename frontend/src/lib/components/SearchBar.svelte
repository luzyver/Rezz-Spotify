<script lang="ts">
  import { searchQuery } from '$lib/stores/filters';
  import { Search, X } from 'lucide-svelte';

  let inputValue = $state('');

  $effect(() => {
    const timeout = setTimeout(() => {
      searchQuery.set(inputValue);
    }, 300);

    return () => clearTimeout(timeout);
  });

  function clearSearch() {
    inputValue = '';
    searchQuery.set('');
  }
</script>

<div class="relative w-full">
  <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
  <input
    type="text"
    bind:value={inputValue}
    placeholder="Search tracks, artists..."
    class="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-10 text-sm backdrop-blur-md transition-all placeholder:text-gray-500 focus:border-[#1db954]/50 focus:bg-white/10 focus:outline-none"
  />
  {#if inputValue}
    <button
      onclick={clearSearch}
      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-white"
    >
      <X class="h-4 w-4" />
    </button>
  {/if}
</div>
