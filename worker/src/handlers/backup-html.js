/**
 * Backup HTML Form
 * Returns an HTML page to trigger /backup with commit SHA
 */

export function getBackupHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Create History Backup</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0a0e27; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .wrapper { background: #15192e; border: 1px solid #1f2544; border-radius: 4px; max-width: 520px; width: 100%; padding: 48px 42px; }
    h1 { color: #e8eaed; font-size: 22px; font-weight: 400; margin-bottom: 8px; letter-spacing: -0.3px; }
    .subtitle { color: #9aa0a6; font-size: 14px; margin-bottom: 24px; line-height: 1.5; }
    .field { margin-bottom: 18px; }
    label { display: block; color: #bdc1c6; font-size: 13px; margin-bottom: 8px; font-weight: 400; }
    input[type="text"] { width: 100%; padding: 11px 14px; background: #202435; border: 1px solid #3c4043; border-radius: 3px; color: #e8eaed; font-size: 15px; font-family: inherit; transition: border-color 0.2s; }
    input[type="text"]:focus { outline: none; border-color: #8ab4f8; background: #1a1d31; }
    input::placeholder { color: #5f6368; }
    .btn { width: 100%; padding: 12px; background: #2d6ff7; color: #fff; border: none; border-radius: 3px; font-size: 14px; font-weight: 500; cursor: pointer; transition: background 0.15s; font-family: inherit; }
    .btn:hover:not(:disabled) { background: #4285f4; }
    .btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .alert { margin-top: 16px; padding: 12px 14px; border-radius: 3px; font-size: 13px; line-height: 1.5; display: none; }
    .alert.success { background: rgba(48, 209, 88, 0.1); color: #30d158; border: 1px solid rgba(48, 209, 88, 0.2); }
    .alert.error { background: rgba(255, 69, 58, 0.1); color: #ff453a; border: 1px solid rgba(255, 69, 58, 0.2); }
    .alert.warning { background: rgba(255, 214, 10, 0.1); color: #ffd60a; border: 1px solid rgba(255, 214, 10, 0.2); }
    .row { display: flex; gap: 10px; }
    .row .field { flex: 1; margin-bottom: 0; }
    .note { color: #9aa0a6; font-size: 12px; margin-top: 4px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <h1>Create History Backup</h1>
    <p class="subtitle">Generate a backup file in <code>frontend/static/history/[ddmmyyyy].json</code> from a clear-history commit.</p>

    <form id="backupForm">
      <div class="field">
        <label for="commit">Commit SHA (Clear History)</label>
        <input type="text" id="commit" name="commit" placeholder="e.g. 1005f17..." required autocomplete="off" autofocus>
        <div class="note">Enter the SHA of a clear-history commit (🗑️ [ddmmyyyy] Clear history...)</div>
      </div>

      <button type="submit" class="btn" id="submitBtn">Create Backup</button>
    </form>

    <div class="alert" id="message"></div>
  </div>

  <script>
    const form = document.getElementById('backupForm');
    const message = document.getElementById('message');
    const submitBtn = document.getElementById('submitBtn');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      message.style.display = 'none';
      message.className = 'alert';

      const commit = document.getElementById('commit').value.trim();
      if (!commit) return;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Creating backup...';

      try {
        const res = await fetch('/backup?commit=' + encodeURIComponent(commit), { method: 'POST' });
        const result = await res.json();
        if (result.success) {
          if (result.skipped) {
            message.classList.add('warning');
            message.innerHTML = '⚠️ Backup already exists: <code>' + (result.path || '') + '</code> (' + (result.items || 0) + ' items)';
          } else {
            message.classList.add('success');
            message.innerHTML = '✅ Backup created: <code>' + (result.path || '') + '</code> (' + (result.items || 0) + ' items)';
          }
        } else {
          message.classList.add('error');
          message.textContent = result.error || 'Failed to create backup';
        }
      } catch (err) {
        message.classList.add('error');
        message.textContent = 'Connection error. Please try again.';
      } finally {
        message.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Backup';
      }
    });
  </script>
</body>
</html>`;
}

