<script lang="ts">
  import { API_ENDPOINTS } from '$lib/config';

  let password = '';
  let loading = false;
  let message = '';
  let messageType: 'idle' | 'success' | 'error' = 'idle';

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (!password) return;

    loading = true;
    message = '';
    messageType = 'idle';

    try {
      const res = await fetch(API_ENDPOINTS.CLEAR_HISTORY, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Clear-Password': password,
        },
        body: JSON.stringify({}),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data?.success) {
        messageType = 'success';
        message = data.message ?? 'History cleared successfully';
      } else {
        messageType = 'error';
        message = data?.error ?? 'Failed to clear history';
      }
    } catch (error) {
      messageType = 'error';
      message = 'Connection error. Please try again.';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Admin - Clear History</title>
</svelte:head>

<div class="min-h-screen bg-[#0a0e27] flex items-center justify-center px-4 py-6">
  <div class="w-full max-w-md rounded-lg border border-slate-800 bg-[#15192e] p-6 shadow-lg">
    <h1 class="mb-2 text-lg font-semibold text-slate-50">Clear Listening History</h1>
    <p class="mb-6 text-sm text-slate-400">
      This will permanently delete all listening history data from the worker's history.json.
    </p>

    <form onsubmit={handleSubmit} class="space-y-4">
      <div>
        <label for="password" class="mb-2 block text-xs font-medium text-slate-300">
          Admin Password
        </label>
        <input
          id="password"
          type="password"
          bind:value={password}
          class="w-full rounded border border-slate-700 bg-[#202435] px-3 py-2 text-sm text-slate-50 outline-none focus:border-blue-400"
          placeholder="Enter admin password"
          autocomplete="off"
        />
      </div>

      <button
        type="submit"
        class="flex w-full items-center justify-center rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={loading || !password}
      >
        {#if loading}
          Processing...
        {:else}
          Clear History
        {/if}
      </button>
    </form>

    {#if messageType !== 'idle'}
      <div
        class="mt-4 rounded border px-3 py-2 text-xs leading-relaxed {messageType === 'success'
          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
          : 'border-red-500/40 bg-red-500/10 text-red-300'}"
      >
        {message}
      </div>
    {/if}
  </div>
</div>

