# Rezz Spotify Activity Tracker

A real-time Spotify activity tracker that automatically monitors and displays what you're listening to. This project features a Svelte frontend, Node.js data fetcher, and Cloudflare Worker for automated updates.

## Features

- Real-time Spotify activity tracking
- Automatic data synchronization every 10 minutes
- History of recently played tracks
- Live display of currently playing songs
- Multiple user support
- Cloudflare Worker automation (no GitHub Actions billing)
- Clean and responsive frontend

## Project Structure

```
rezzspotify/
├── frontend/          # Svelte-based web interface
├── worker/            # Cloudflare Worker for automation
│   └── src/
│       ├── index.js                    # Entry point & routing
│       ├── config/
│       │   └── constants.js            # Constants & configuration
│       ├── services/
│       │   ├── spotify.js              # Spotify API integration
│       │   └── github.js               # GitHub API integration
│       ├── handlers/
│       │   ├── sync-handler.js         # Sync Spotify data handler
│       │   ├── clear-handler.js        # Clear history handler
│       │   ├── clear-history-html.js   # HTML form for clear history
│       │   └── api-handler.js          # API endpoints handler
│       └── utils/
│           ├── encoding.js             # UTF-8 & Base64 encoding
│           ├── commit-messages.js      # Commit message generator
│           └── data-processor.js       # Data processing & transformation
├── fetchSpotify.js    # Main data fetcher script
├── getAuthUrl.js      # Generate Spotify OAuth URL
├── getRefreshToken.js # Exchange code for refresh token
├── history.json       # Recently played tracks data
└── live.json          # Currently playing data
```

### Worker Architecture

The worker is built with a modular architecture for maintainability:

- **Routing**: `index.js` handles HTTP routing and cron triggers
- **Services**: Separate modules for Spotify and GitHub API integrations
- **Handlers**: Dedicated handlers for sync, clear history, and API endpoints
- **Utilities**: Shared utilities for encoding, commit messages, and data processing

**Key Features**:
- Separation of concerns for better code organization
- Reusable functions across different handlers
- Independent testing for each module
- Password protection for clear history endpoint
- CORS configuration for API endpoints

## Setup

### 1. Prerequisites

- Node.js (v18 or higher)
- Spotify Developer Account
- Cloudflare Account (for worker automation)
- GitHub Account (for hosting data)

### 2. Spotify App Configuration

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Add redirect URI: `http://localhost:8888/callback`
4. Note your Client ID and Client Secret

### 3. Environment Configuration

Create `.env` file in the root directory:

```env
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REFRESH_TOKENS={"spotify:user:USER_ID":{"refreshToken":"TOKEN"}}
```

### 4. Get Refresh Tokens

```bash
# Install dependencies
npm install

# Generate authorization URL
node getAuthUrl.js

# Follow the URL, authorize, and get the callback code
# Exchange code for refresh token
node getRefreshToken.js
```

Copy the refresh token to your `.env` file.

### 5. Test Data Fetching

```bash
node fetchSpotify.js
```

This will create/update `history.json` and `live.json`.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to see the web interface.

### Build for Production

```bash
cd frontend
npm run build
```

## Cloudflare Worker Setup

The worker automatically fetches Spotify data every 10 minutes and commits to GitHub.

### 1. Install Wrangler

```bash
npm install -g wrangler
```

### 2. Login to Cloudflare

```bash
wrangler login
```

### 3. Configure Secrets

```bash
cd worker

# Spotify credentials
wrangler secret put SPOTIFY_CLIENT_ID
wrangler secret put SPOTIFY_CLIENT_SECRET
wrangler secret put SPOTIFY_REFRESH_TOKENS

# GitHub credentials
wrangler secret put GITHUB_TOKEN
wrangler secret put GITHUB_REPO
```

### 4. Deploy Worker

```bash
cd worker
npm install
wrangler deploy
```

### 5. Monitor Worker

```bash
# Real-time logs
wrangler tail

# Manual trigger
curl https://your-worker.workers.dev/trigger
```

## Configuration

### Change Update Frequency

Edit `worker/wrangler.toml`:

```toml
[triggers]
crons = ["*/10 * * * *"]  # Every 10 minutes
# crons = ["0 */1 * * *"]  # Every hour
# crons = ["0 */6 * * *"]  # Every 6 hours
```

### Add Multiple Users

Update `.env` with multiple refresh tokens:

```env
SPOTIFY_REFRESH_TOKENS={
  "spotify:user:user1": {"refreshToken": "token1"},
  "spotify:user:user2": {"refreshToken": "token2"}
}
```

## API Endpoints

### Worker Endpoints

- `GET /trigger` - Manually trigger data fetch
- `GET /api/live` - Get currently playing data
- `GET /api/history` - Get recently played tracks
- `POST /clear-history` - Clear history (password protected)
- Automatic: Runs every 10 minutes via cron

## Data Format

### history.json

```json
[
  {
    "timestamp": 1699999999999,
    "user": "User Name",
    "userId": "spotify:user:userid",
    "track": "Track Name",
    "artist": "Artist Name",
    "uri": "spotify:track:xxxxx",
    "imageUrl": "https://..."
  }
]
```

### live.json

```json
{
  "friends": [
    {
      "timestamp": 1699999999999,
      "user": {
        "uri": "spotify:user:userid",
        "name": "User Name",
        "imageUrl": "https://..."
      },
      "track": {
        "uri": "spotify:track:xxxxx",
        "name": "Track Name",
        "imageUrl": "https://...",
        "album": { "uri": "...", "name": "..." },
        "artist": { "uri": "...", "name": "..." },
        "context": { "uri": "...", "name": "...", "index": 0 }
      }
    }
  ]
}
```

## Deployment

### Frontend (Vercel/Netlify)

```bash
cd frontend
npm run build
# Deploy the 'build' folder
```

### Worker (Cloudflare)

```bash
cd worker
wrangler deploy
```

## Worker Development

### Local Testing

```bash
# Development mode
cd worker
npm run dev

# Test manual trigger
curl http://localhost:8787/trigger

# Test API endpoints
curl http://localhost:8787/api/live
curl http://localhost:8787/api/history
```

### Worker Flow

**Scheduled Sync Flow**:
```
Cron Trigger → index.js → sync-handler.js → spotify.js (get data)
                                          → data-processor.js (process)
                                          → github.js (save to repo)
```

**Clear History Flow**:
```
Cron/HTTP → index.js → clear-handler.js → github.js (get history)
                                        → github.js (clear & commit)
```

**API Request Flow**:
```
HTTP Request → index.js → api-handler.js → github.js (get data)
```

## Troubleshooting

### Token Expired

Re-run the authorization flow:

```bash
node getAuthUrl.js
node getRefreshToken.js
```

### Worker Not Running

Check cron triggers:

```bash
wrangler triggers
```

### Data Not Updating

Check worker logs:

```bash
wrangler tail
```

## Cost

- **Cloudflare Workers**: Free (100k requests/day)
- **GitHub**: Free (public repo)
- **Spotify API**: Free
- **Hosting**: Free (Vercel/Netlify/Cloudflare Pages)

Total: **$0/month**

## Benefits Over GitHub Actions

- More generous free tier (100k vs 2000 minutes)
- Unlimited cron triggers
- No billing issues
- Faster execution (edge computing)
- Real-time logs
- Better monitoring

## License

MIT

## Contributing

Feel free to open issues or submit pull requests!
