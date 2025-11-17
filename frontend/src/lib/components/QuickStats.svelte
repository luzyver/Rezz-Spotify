<script lang="ts">
  import type { HistoryItem } from '$lib/types';

  let { history }: { history: HistoryItem[] } = $props();

  const stats = $derived.by(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return {
      today: history.filter((item) => item.timestamp >= today.getTime()).length,
      week: history.filter((item) => item.timestamp >= thisWeek.getTime()).length,
      month: history.filter((item) => item.timestamp >= thisMonth.getTime()).length,
      total: history.length,
    };
  });

  const quickStats = $derived([
    { label: 'Today', value: stats.today },
    { label: 'This Week', value: stats.week },
    { label: 'This Month', value: stats.month },
    { label: 'All Time', value: stats.total },
  ]);
</script>

<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
  {#each quickStats as stat (stat.label)}
    <div
      class="rounded-lg border border-white/5 bg-white/[0.02] p-4 transition-colors hover:border-white/10 hover:bg-white/[0.04]"
    >
      <div class="text-xs font-medium text-gray-500">{stat.label}</div>
      <div class="mt-1 text-2xl font-semibold">{stat.value}</div>
    </div>
  {/each}
</div>
