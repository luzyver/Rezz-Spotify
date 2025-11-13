import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Theme = 'dark' | 'light';

const getInitialTheme = (): Theme => {
  if (!browser) return 'dark';
  const stored = localStorage.getItem('theme') as Theme;
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
};

export const theme = writable<Theme>(getInitialTheme());

if (browser) {
  theme.subscribe((value) => {
    localStorage.setItem('theme', value);
    document.documentElement.classList.toggle('light', value === 'light');
  });
}

export function toggleTheme() {
  theme.update((current) => (current === 'dark' ? 'light' : 'dark'));
}
