<script lang="ts">
  import type { Achievement } from '$lib/stores/achievements';
  import { Lock } from 'lucide-svelte';

  let { achievement }: { achievement: Achievement } = $props();
</script>

<div
  class="group relative overflow-hidden rounded-lg border p-4 transition-all hover:scale-105 active:scale-95 {achievement.unlocked
    ? 'border-[#1db954]/50 bg-[#1db954]/10'
    : 'border-white/10 bg-white/5 opacity-60'}"
>
  {#if !achievement.unlocked}
    <div class="absolute right-2 top-2">
      <Lock class="h-4 w-4 text-gray-500" />
    </div>
  {/if}

  <div class="mb-2 text-3xl">{achievement.icon}</div>
  <div class="text-sm font-bold">{achievement.title}</div>
  <div class="text-xs text-gray-400">{achievement.description}</div>

  {#if achievement.progress !== undefined && achievement.target}
    <div class="mt-3">
      <div class="mb-1 flex justify-between text-xs">
        <span class="text-gray-400">Progress</span>
        <span class="font-medium">{achievement.progress}/{achievement.target}</span>
      </div>
      <div class="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          class="h-full rounded-full bg-gradient-to-r from-[#1db954] to-[#1ed760] transition-all duration-500"
          style="width: {Math.min((achievement.progress / achievement.target) * 100, 100)}%"
        ></div>
      </div>
    </div>
  {/if}

  {#if achievement.unlocked}
    <div
      class="absolute inset-0 bg-gradient-to-br from-[#1db954]/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
    ></div>
  {/if}
</div>
