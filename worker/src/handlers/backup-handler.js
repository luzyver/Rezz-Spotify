import * as github from '../services/github.js';

function extractDateTag(commitData) {
  const message = commitData?.commit?.message || '';
  const match = message.match(/\[(\d{8})\]/);
  if (match) return match[1];
  const dateStr = commitData?.commit?.author?.date || new Date().toISOString();
  const d = new Date(dateStr);
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const yyyy = d.getUTCFullYear();
  return `${dd}${mm}${yyyy}`;
}

export async function handleBackupEndpoint(request, env, corsHeaders) {
  try {
    // Validate env
    if (!env.GITHUB_TOKEN) throw new Error('GITHUB_TOKEN not set');
    if (!env.GITHUB_REPO) throw new Error('GITHUB_REPO not set');

    const url = new URL(request.url);
    const accept = request.headers.get('Accept') || '';
    const contentType = request.headers.get('Content-Type') || '';

    const queryCommit = url.searchParams.get('commit') || url.searchParams.get('id');

    let bodyCommit = undefined;
    if (request.method === 'POST' && contentType.includes('application/json')) {
      try {
        const body = await request.json();
        bodyCommit = body?.commit || body?.id;
      } catch (_) {
        // ignore JSON parse errors
      }
    }

    const commitSha = queryCommit || bodyCommit;

    if (!commitSha) {
      return new Response(
        JSON.stringify({ success: false, error: 'commit (sha) is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const githubToken = env.GITHUB_TOKEN;
    const githubRepo = env.GITHUB_REPO;

    // 1) Get commit info
    const commitData = await github.getCommit(githubRepo, commitSha, githubToken);
    const sourceCommitMessage = commitData?.commit?.message || '';

    // Validate: must be a clear history commit
    // Pattern: "🗑️ [ddmmyyyy] Clear history" or contains "Clear history"
    const isClearCommit = sourceCommitMessage.includes('Clear history') || sourceCommitMessage.match(/🗑️\s*\[\d{8}\]/);
    if (!isClearCommit) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid commit: Must be a "Clear history" commit',
          commitMessage: sourceCommitMessage
        }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const parentSha = commitData?.parents?.[0]?.sha;
    if (!parentSha) {
      throw new Error('Parent commit not found');
    }

    // 2) Determine date tag [ddmmyyyy]
    const dateTag = extractDateTag(commitData);

    // 3) Read history.json at parent commit (pre-clear state)
    const { content: previousHistory } = await github.getGitHubFileAtRef(
      githubRepo,
      'history.json',
      parentSha,
      githubToken
    );

    if (!previousHistory || !Array.isArray(previousHistory)) {
      return new Response(
        JSON.stringify({ success: false, error: 'No history found at parent commit' }),
        { status: 404, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // 4) Write backup file to frontend/static/history/{ddmmyyyy}.json
    const backupPath = `frontend/static/history/${dateTag}.json`;

    // Check if file exists and compare content
    let existingSha = null;
    let existingContent = null;
    try {
      const existing = await github.getGitHubFile(githubRepo, backupPath, githubToken);
      existingSha = existing.sha;
      existingContent = existing.content;
    } catch (_) { /* ignore - file doesn't exist */ }

    // If file exists with same content, skip commit
    if (existingContent && JSON.stringify(existingContent) === JSON.stringify(previousHistory)) {
      console.log(`ℹ️  Backup file ${backupPath} already exists with same content, skipping commit`);
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Backup already exists (no changes)',
          path: backupPath,
          dateTag,
          sourceCommit: commitSha,
          items: previousHistory.length,
          skipped: true,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const commitMessage = `💾 Backup history [${dateTag}] from ${commitSha}`;
    await github.updateGitHubFile(
      githubRepo,
      backupPath,
      previousHistory,
      commitMessage,
      existingSha,
      githubToken
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Backup created',
        path: backupPath,
        dateTag,
        sourceCommit: commitSha,
        items: previousHistory.length,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (error) {
    console.error('❌ Error in /backup:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
}

