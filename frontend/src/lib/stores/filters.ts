import { derived } from 'svelte/store';
import type { HistoryItem } from '$lib/types';

export function filterAndSortHistory(history: HistoryItem[]) {
  return derived([], () => {
    // Sort by most recent
    return [...history].sort((a, b) => b.timestamp - a.timestamp);
  });
}
