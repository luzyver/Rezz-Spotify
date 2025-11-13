<script lang="ts">
  import { onMount } from 'svelte';

  let { show = $bindable(false) }: { show?: boolean } = $props();
  let particles: Array<{ x: number; y: number; color: string; rotation: number }> = $state([]);

  $effect(() => {
    if (show) {
      triggerConfetti();
    }
  });

  function triggerConfetti() {
    const colors = ['#1db954', '#1ed760', '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1'];
    const newParticles = Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: -10,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
    }));
    particles = newParticles;

    setTimeout(() => {
      particles = [];
    }, 3000);
  }
</script>

{#if particles.length > 0}
  <div class="pointer-events-none fixed inset-0 z-50 overflow-hidden">
    {#each particles as particle, i}
      <div
        class="confetti-particle absolute"
        style="
          left: {particle.x}%;
          top: {particle.y}%;
          background: {particle.color};
          animation-delay: {i * 0.01}s;
          transform: rotate({particle.rotation}deg);
        "
      ></div>
    {/each}
  </div>
{/if}

<style>
  .confetti-particle {
    width: 10px;
    height: 10px;
    animation: confetti-fall 3s ease-in forwards;
  }

  @keyframes confetti-fall {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(100vh) rotate(720deg);
      opacity: 0;
    }
  }
</style>
