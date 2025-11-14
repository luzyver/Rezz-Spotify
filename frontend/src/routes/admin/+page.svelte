<script lang="ts">
  import { API_ENDPOINTS } from '$lib/config';

  type StatusType = 'idle' | 'success' | 'error';

  let statusMessage = '';
  let statusType: StatusType = 'idle';
  let loadingTrigger = false;
  let loadingUpdate = false;

  const endpoints = [
    { method: 'GET', path: '/trigger', desc: 'Manually trigger data sync' },
    { method: 'GET', path: '/api/live', desc: 'Currently playing tracks' },
    { method: 'GET', path: '/api/history', desc: 'Recently played tracks' },
    { method: 'POST', path: '/update', desc: 'Update README statistics' },
    { method: 'POST', path: '/backup', desc: 'Backup history from commit' },
    { method: 'POST', path: '/clear-history', desc: 'Clear history (protected)' },
  ] as const;

  function showStatus(message: string, type: StatusType) {
    statusMessage = message;
    statusType = type;
    if (message) {
      setTimeout(() => {
        statusMessage = '';
        statusType = 'idle';
      }, 5000);
    }
  }

  async function triggerSync() {
    loadingTrigger = true;
    showStatus('', 'idle');

    try {
      const res = await fetch(API_ENDPOINTS.TRIGGER);
      const text = await res.text().catch(() => '');
      if (res.ok) {
        showStatus(text || 'Success: Sync triggered', 'success');
      } else {
        showStatus(`Sync failed: ${text || res.statusText}`, 'error');
      }
    } catch (err) {
      showStatus(`Error: ${(err as Error).message}`, 'error');
    } finally {
      loadingTrigger = false;
    }
  }

  async function updateReadme() {
    loadingUpdate = true;
    showStatus('', 'idle');

    try {
      const res = await fetch(API_ENDPOINTS.UPDATE, { method: 'POST' });
      const data = await res.json().catch(() => ({}));

      if (res.ok && (data as any)?.success) {
        const skipped = (data as any)?.skipped;
        showStatus(skipped ? 'README unchanged' : 'README updated', 'success');
      } else {
        const error = (data as any)?.error || res.statusText || 'Unknown error';
        showStatus(`Update failed: ${error}`, 'error');
      }
    } catch (err) {
      showStatus(`Error: ${(err as Error).message}`, 'error');
    } finally {
      loadingUpdate = false;
    }
  }
</script>

<svelte:head>
  <title>Spotify Worker API - Admin</title>
</svelte:head>

<div class="admin-root">
  <div class="container">
    <header>
      <h1>Spotify Worker API</h1>
      <p class="subtitle">Cloudflare Worker for automated Spotify activity tracking</p>
    </header>

    <section class="section">
      <div class="section-title">Endpoints</div>
      <div class="endpoint-list">
        {#each endpoints as ep}
          <div class="endpoint">
            <span class={`method ${ep.method === 'GET' ? 'get' : 'post'}`}>
              {ep.method}
            </span>
            <span class="endpoint-path">{ep.path}</span>
            <span class="endpoint-desc">{ep.desc}</span>
          </div>
        {/each}
      </div>
    </section>

    <section class="section">
      <div class="section-title">Actions</div>
      <div class="actions">
        <button class="btn" on:click={triggerSync} disabled={loadingTrigger}>
          {#if loadingTrigger}
            Triggering sync...
          {:else}
            Trigger Sync
          {/if}
        </button>

        <button class="btn" on:click={updateReadme} disabled={loadingUpdate}>
          {#if loadingUpdate}
            Updating README...
          {:else}
            Update README
          {/if}
        </button>

        <a
          class="btn"
          href={API_ENDPOINTS.LIVE}
          target="_blank"
          rel="noreferrer"
        >
          View Live Data
        </a>

        <a
          class="btn"
          href={API_ENDPOINTS.HISTORY}
          target="_blank"
          rel="noreferrer"
        >
          View History
        </a>
      </div>

      {#if statusType !== 'idle' && statusMessage}
        <div class={`status show ${statusType === 'success' ? 'success' : 'error'}`}>
          {statusMessage}
        </div>
      {/if}
    </section>

    <footer>
      Automated sync runs every 10 minutes via cron
    </footer>
  </div>
</div>


<style>
  .admin-root {
    min-height: 100vh;
    background: #0a0a0a;
    color: #e0e0e0;
    line-height: 1.6;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  .admin-root .container {
    max-width: 900px;
    margin: 0 auto;
    padding: 60px 20px;
  }

  .admin-root header {
    margin-bottom: 50px;
  }

  .admin-root h1 {
    font-size: 32px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 8px;
  }

  .admin-root .subtitle {
    color: #888;
    font-size: 15px;
  }

  .admin-root .section {
    margin-bottom: 40px;
  }

  .admin-root .section-title {
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #666;
    margin-bottom: 16px;
    font-weight: 500;
  }

  .admin-root .endpoint-list {
    display: flex;
    flex-direction: column;
    gap: 1px;
    background: #1a1a1a;
    border-radius: 8px;
    overflow: hidden;
  }

  .admin-root .endpoint {
    background: #0f0f0f;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .admin-root .endpoint:hover {
    background: #151515;
  }

  .admin-root .method {
    font-family: 'SF Mono', Monaco, monospace;
    font-size: 11px;
    font-weight: 600;
    padding: 4px 8px;
    border-radius: 4px;
    min-width: 45px;
    text-align: center;
  }

  .admin-root .method.get {
    background: #1a3a1a;
    color: #4ade80;
  }

  .admin-root .method.post {
    background: #1a2a3a;
    color: #60a5fa;
  }

  .admin-root .endpoint-path {
    font-family: 'SF Mono', Monaco, monospace;
    font-size: 14px;
    color: #fff;
    flex: 0 0 auto;
  }

  .admin-root .endpoint-desc {
    color: #888;
    font-size: 14px;
  }

  .admin-root .actions {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .admin-root .btn {
    background: #1a1a1a;
    border: 1px solid #2a2a2a;
    color: #fff;
    padding: 12px 20px;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    text-align: center;
    transition: all 0.15s;
  }

  .admin-root .btn:hover {
    background: #252525;
    border-color: #3a3a3a;
  }

  .admin-root .btn:active {
    transform: scale(0.98);
  }

  .admin-root .status {
    margin-top: 20px;
    padding: 12px 16px;
    border-radius: 6px;
    font-size: 13px;
    display: none;
    border-left: 3px solid;
  }

  .admin-root .status.show {
    display: block;
  }

  .admin-root .status.success {
    background: #0a2a0a;
    border-color: #4ade80;
    color: #4ade80;
  }

  .admin-root .status.error {
    background: #2a0a0a;
    border-color: #ef4444;
    color: #ef4444;
  }

  .admin-root footer {
    margin-top: 60px;
    padding-top: 30px;
    border-top: 1px solid #1a1a1a;
    color: #666;
    font-size: 13px;
  }

  @media (max-width: 600px) {
    .admin-root .container {
      padding: 40px 16px;
    }

    .admin-root h1 {
      font-size: 24px;
    }

    .admin-root .endpoint {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }

    .admin-root .actions {
      grid-template-columns: 1fr;
    }
  }
</style>

