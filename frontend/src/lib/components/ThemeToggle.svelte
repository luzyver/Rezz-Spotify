<script lang="ts">
  import { theme, toggleTheme } from '$lib/stores/theme';
  import { Sun, Moon } from 'lucide-svelte';

  let isDark = $derived($theme === 'dark');
</script>

<button
  onclick={toggleTheme}
  class="group relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md transition-all hover:scale-110 hover:border-[#1db954]/50 hover:bg-white/10"
  aria-label="Toggle theme"
>
  {#if isDark}
    <Moon class="h-5 w-5 text-blue-400 transition-transform duration-300" />
  {:else}
    <Sun class="h-5 w-5 text-yellow-400 transition-transform duration-300" />
  {/if}
</button>
