<script lang="ts">
  import { API_ENDPOINTS } from '$lib/config';

  let commit = '';
  let loading = false;
  let message = '';
  let messageType: 'idle' | 'success' | 'error' = 'idle';

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (!commit) return;

    loading = true;
    message = '';
    messageType = 'idle';

    try {
      const res = await fetch(API_ENDPOINTS.BACKUP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ commit }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data?.success) {
        messageType = 'success';
        const items = data.items ?? data.itemsRemoved ?? 0;
        const path = data.path ?? '';
        message = data.message ?? `Backup created at ${path} (${items} items)`;
      } else {
        messageType = 'error';
        message = data?.error ?? 'Failed to create backup';
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
  <title>Admin - Create History Backup</title>
</svelte:head>

<div class="min-h-screen bg-[#0a0e27] flex items-center justify-center px-4 py-6">
  <div class="w-full max-w-xl rounded-lg border border-slate-800 bg-[#15192e] p-6 shadow-lg">
    <h1 class="mb-2 text-lg font-semibold text-slate-50">Create History Backup</h1>
    <p class="mb-6 text-sm text-slate-400">
      Generate a backup file in <code class="font-mono text-xs">frontend/static/history/[ddmmyyyy].json</code>
      from a clear-history commit.
    </p>

    <form onsubmit={handleSubmit} class="space-y-4">
      <div>
        <label for="commit" class="mb-2 block text-xs font-medium text-slate-300">
          Commit SHA (Clear History)
        </label>
        <input
          id="commit"
          type="text"
          bind:value={commit}
          class="w-full rounded border border-slate-700 bg-[#202435] px-3 py-2 text-sm text-slate-50 outline-none focus:border-blue-400"
          placeholder="e.g. 1005f17..."
          autocomplete="off"
        />
        <p class="mt-1 text-[11px] text-slate-400">
          Use the SHA of a clear-history commit (🗑️ [ddmmyyyy] Clear history...).
        </p>
      </div>

      <button
        type="submit"
        class="flex w-full items-center justify-center rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={loading || !commit}
      >
        {#if loading}
          Creating backup...
        {:else}
          Create Backup
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

