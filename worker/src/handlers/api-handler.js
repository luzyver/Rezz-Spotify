import * as github from '../services/github.js';

export async function handleLiveAPI(env, corsHeaders) {
	try {
		const { content } = await github.getGitHubFile(
			env.GITHUB_REPO,
			'live.json',
			env.GITHUB_TOKEN
		);

		return new Response(JSON.stringify(content || { friends: [] }), {
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
				'Pragma': 'no-cache',
				'Expires': '0',
				...corsHeaders
			}
		});
	} catch (error) {
		return new Response(JSON.stringify({ friends: [], error: error.message }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json',
				...corsHeaders
			}
		});
	}
}

export async function handleHistoryAPI(env, corsHeaders) {
	try {
		const { content } = await github.getGitHubFile(
			env.GITHUB_REPO,
			'history.json',
			env.GITHUB_TOKEN
		);

		return new Response(JSON.stringify(content || []), {
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
				'Pragma': 'no-cache',
				'Expires': '0',
				...corsHeaders
			}
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: error.message }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json',
				...corsHeaders
			}
		});
	}
}
