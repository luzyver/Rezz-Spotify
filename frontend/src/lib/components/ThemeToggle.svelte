<script lang="ts">
  import { theme, toggleTheme } from '$lib/stores/theme';
  import { Sun, Moon } from 'lucide-svelte';
  import { Motion } from 'svelte-motion';

  let isDark = $derived($theme === 'dark');
</script>

<button
  onclick={toggleTheme}
  class="group relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md transition-all hover:border-[#1db954]/50 hover:bg-white/10"
  aria-label="Toggle theme"
>
  <Motion
    initial={{ scale: 0, rotate: -180 }}
    animate={{ scale: isDark ? 1 : 0, rotate: isDark ? 0 : 180 }}
    transition={{ duration: 0.3 }}
    let:motion
  >
    <div use:motion class="absolute">
      <Moon class="h-5 w-5 text-blue-400" />
    </div>
  </Motion>

  <Motion
    initial={{ scale: 0, rotate: 180 }}
    animate={{ scale: isDark ? 0 : 1, rotate: isDark ? -180 : 0 }}
    transition={{ duration: 0.3 }}
    let:motion
  >
    <div use:motion class="absolute">
      <Sun class="h-5 w-5 text-yellow-400" />
    </div>
  </Motion>
</button>
