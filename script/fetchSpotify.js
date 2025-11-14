import axios from "axios";
import fs from "fs";
import path from "path";
import "dotenv/config";

const CONFIG = {
	clientId: process.env.SPOTIFY_CLIENT_ID,
	clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
	tokens: JSON.parse(process.env.SPOTIFY_REFRESH_TOKENS || "{}"),
	files: {
		live: path.resolve("../live.json"),
		history: path.resolve("../history.json")
	},
	api: {
		recentTracksLimit: 50
	}
};

const FileManager = {
	loadHistory() {
		try {
			if (fs.existsSync(CONFIG.files.history)) {
				const content = fs.readFileSync(CONFIG.files.history, "utf-8");
				return JSON.parse(content);
			}
		} catch (error) {
			console.error("Error loading history file:", error.message);
		}
		return [];
	},

	loadLiveData() {
		try {
			if (fs.existsSync(CONFIG.files.live)) {
				const content = fs.readFileSync(CONFIG.files.live, "utf-8");
				return JSON.parse(content);
			}
		} catch (error) {
			console.error("Error loading live file:", error.message);
		}
		return { friends: [] };
	},

	saveHistory(history) {
		try {
			const sortedHistory = history.sort((a, b) => b.timestamp - a.timestamp);
			fs.writeFileSync(
				CONFIG.files.history,
				JSON.stringify(sortedHistory, null, 2)
			);
		} catch (error) {
			console.error("Error saving history:", error.message);
		}
	},

	saveLiveData(liveData) {
		try {
			fs.writeFileSync(
				CONFIG.files.live,
				JSON.stringify(liveData, null, 2)
			);
		} catch (error) {
			console.error("Error saving live data:", error.message);
		}
	}
};

const SpotifyAPI = {
	async refreshAccessToken(refreshToken) {
		try {
			const response = await axios.post(
				"https://accounts.spotify.com/api/token",
				new URLSearchParams({
					grant_type: "refresh_token",
					refresh_token: refreshToken
				}),
				{
					headers: {
						Authorization:
							"Basic " +
							Buffer.from(
								`${CONFIG.clientId}:${CONFIG.clientSecret}`
							).toString("base64"),
						"Content-Type": "application/x-www-form-urlencoded"
					}
				}
			);
			return response.data.access_token;
		} catch (error) {
			throw new Error(
				`Failed to refresh token: ${error.response?.data?.error || error.message}`
			);
		}
	},

	async getUserProfile(accessToken) {
		try {
			const response = await axios.get("https://api.spotify.com/v1/me", {
				headers: { Authorization: `Bearer ${accessToken}` }
			});

			return {
				name: response.data.display_name,
				uri: response.data.uri,
				imageUrl: response.data.images?.[0]?.url || null
			};
		} catch (error) {
			console.error("Error fetching user profile:", error.response?.data || error.message);
			return null;
		}
	},

	async getRecentlyPlayed(accessToken) {
		try {
			const response = await axios.get(
				`https://api.spotify.com/v1/me/player/recently-played?limit=${CONFIG.api.recentTracksLimit}`,
				{
					headers: { Authorization: `Bearer ${accessToken}` }
				}
			);
			return response.data.items || [];
		} catch (error) {
			console.error("Error fetching recently played:", error.response?.data || error.message);
			return [];
		}
	},

	async getCurrentlyPlaying(accessToken) {
		try {
			const response = await axios.get(
				"https://api.spotify.com/v1/me/player/currently-playing",
				{
					headers: { Authorization: `Bearer ${accessToken}` }
				}
			);

			if (response.status === 204 || !response.data || !response.data.item) {
				return null;
			}

			const item = response.data.item;
			return {
				timestamp: Date.now(),
				track: {
					name: item.name,
					uri: item.uri,
					imageUrl: item.album.images?.[0]?.url || null
				},
				album: {
					name: item.album.name,
					uri: item.album.uri
				},
				artist: {
					name: item.artists.map((a) => a.name).join(", "),
					uri: item.artists[0]?.uri
				},
				context: {
					uri: response.data.context?.uri || null,
					name: response.data.context?.type || null,
					index: 0
				}
			};
		} catch (error) {
			console.error("Error fetching currently playing:", error.response?.data || error.message);
			return null;
		}
	}
};

const DataProcessor = {
	processRecentTracks(recentTracks, userProfile, history) {
		let addedCount = 0;

		for (const item of recentTracks) {
			const entry = {
				timestamp: new Date(item.played_at).getTime(),
				user: userProfile.name,
				userId: userProfile.uri,
				track: item.track.name,
				artist: item.track.artists.map((a) => a.name).join(", "),
				uri: item.track.uri,
				imageUrl: item.track.album.images?.[0]?.url || null
			};

			const exists = history.some(
				(h) =>
					h.userId === entry.userId &&
					h.timestamp === entry.timestamp &&
					h.track === entry.track
			);

			if (!exists) {
				history.push(entry);
				addedCount++;
			}
		}

		return addedCount;
	},

	processCurrentlyPlaying(nowPlaying, userProfile) {
		if (!nowPlaying) return null;

		return {
			timestamp: nowPlaying.timestamp,
			user: {
				uri: userProfile.uri,
				name: userProfile.name,
				imageUrl: userProfile.imageUrl
			},
			track: {
				uri: nowPlaying.track.uri,
				name: nowPlaying.track.name,
				imageUrl: nowPlaying.track.imageUrl,
				album: {
					uri: nowPlaying.album.uri,
					name: nowPlaying.album.name
				},
				artist: {
					uri: nowPlaying.artist.uri,
					name: nowPlaying.artist.name
				},
				context: {
					uri: nowPlaying.context.uri,
					name: nowPlaying.context.name,
					index: nowPlaying.context.index
				}
			}
		};
	}
};

async function main() {
	const history = FileManager.loadHistory();
	const liveFriends = [];

	for (const [userId, tokenData] of Object.entries(CONFIG.tokens)) {
		try {
			const accessToken = await SpotifyAPI.refreshAccessToken(
				tokenData.refreshToken
			);

			const userProfile = await SpotifyAPI.getUserProfile(accessToken);
			if (!userProfile) continue;

			const recentTracks = await SpotifyAPI.getRecentlyPlayed(accessToken);
			DataProcessor.processRecentTracks(
				recentTracks,
				userProfile,
				history
			);

			const nowPlaying = await SpotifyAPI.getCurrentlyPlaying(accessToken);
			if (nowPlaying) {
				const liveEntry = DataProcessor.processCurrentlyPlaying(
					nowPlaying,
					userProfile
				);
				if (liveEntry) {
					liveFriends.push(liveEntry);
				}
			}
		} catch (error) {
			console.error(`Error processing ${userId}:`, error.message);
		}
	}

	FileManager.saveHistory(history);
	FileManager.saveLiveData({ friends: liveFriends });
}

if (!CONFIG.clientId || !CONFIG.clientSecret) {
	console.error("Error: Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET");
	process.exit(1);
}

if (Object.keys(CONFIG.tokens).length === 0) {
	console.error("Error: No refresh tokens configured in SPOTIFY_REFRESH_TOKENS");
	process.exit(1);
}

main().catch((error) => {
	console.error("Fatal error:", error.message);
	process.exit(1);
});
