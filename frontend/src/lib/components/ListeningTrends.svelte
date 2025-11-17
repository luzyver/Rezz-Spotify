<script lang="ts">
  import type { HistoryItem } from '$lib/types';
  import { TrendingUp, TrendingDown, Minus } from 'lucide-svelte';

  let { history }: { history: HistoryItem[] } = $props();

  const weeklyData = $derived.by(() => {
    if (history.length === 0) return [];

    const weeks: Record<string, number> = {};
    history.forEach((item) => {
      const date = new Date(item.timestamp);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      weeks[weekKey] = (weeks[weekKey] || 0) + 1;
    });

    return Object.entries(weeks)
      .map(([week, plays]) => ({ week, plays }))
      .sort((a, b) => a.week.localeCompare(b.week))
      .slice(-8);
  });

  const trend = $derived.by(() => {
    if (weeklyData.length < 2) return { direction: 'stable', percentage: 0 };
    const current = weeklyData[weeklyData.length - 1].plays;
    const previous = weeklyData[weeklyData.length - 2].plays;
    const change = ((current - previous) / previous) * 100;

    if (Math.abs(change) < 5) return { direction: 'stable', percentage: 0 };
    return {
      direction: change > 0 ? 'up' : 'down',
      percentage: Math.abs(Math.round(change)),
    };
  });

  const maxPlays = $derived(Math.max(...weeklyData.map((d) => d.plays), 1));
</script>

<div class="space-y-4">
  <div class="flex items-center justify-between">
    <h3 class="text-xl font-semibold">Listening Trends</h3>
    <div class="flex items-center gap-1.5 text-sm">
      {#if trend.direction === 'up'}
        <TrendingUp class="h-4 w-4 text-green-400" />
        <span class="font-medium text-green-400">+{trend.percentage}%</span>
      {:else if trend.direction === 'down'}
        <TrendingDown class="h-4 w-4 text-red-400" />
        <span class="font-medium text-red-400">-{trend.percentage}%</span>
      {:else}
        <Minus class="h-4 w-4 text-gray-400" />
        <span class="font-medium text-gray-400">Stable</span>
      {/if}
    </div>
  </div>

  {#if weeklyData.length > 0}
    <div class="rounded-lg border border-white/5 bg-white/[0.02] p-4">
      <div class="flex h-40 items-end justify-between gap-2">
        {#each weeklyData as data, i (data.week)}
          <div class="flex flex-1 flex-col items-center gap-2">
            <div class="relative flex w-full flex-1 items-end">
              <div
                class="group relative w-full rounded-t bg-[#1db954] transition-all hover:bg-[#1ed760]"
                style="height: {(data.plays / maxPlays) * 100}%"
              >
                <div
                  class="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <div
                    class="whitespace-nowrap rounded bg-black/90 px-1.5 py-0.5 text-xs font-medium text-white"
                  >
                    {data.plays}
                  </div>
                </div>
              </div>
            </div>
            <div class="text-[10px] text-gray-600">W{i + 1}</div>
          </div>
        {/each}
      </div>
    </div>
  {:else}
    <div
      class="flex h-40 items-center justify-center rounded-lg border border-white/5 bg-white/[0.02] text-gray-500"
    >
      <p class="text-sm">No data available</p>
    </div>
  {/if}
</div>
