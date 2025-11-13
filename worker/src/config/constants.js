export const CORS_HEADERS = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Clear-Password, X-Backup-Password',
};

export const CRON_SCHEDULES = {
	CLEAR_HISTORY_HOUR: 16,
	CLEAR_HISTORY_MINUTE: 59,
};

export const MESSAGES = {
	WORKER_INFO: `Spotify Activity Worker

Endpoints:
- GET /trigger - Manual trigger
- GET /clear-history - Clear history data
- GET /backup - Create backup file from clear commit
- GET /api/live - Get live activity
- GET /api/history - Get listening history`,
};
