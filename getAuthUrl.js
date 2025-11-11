/**
 * Spotify OAuth URL Generator
 * Generates authorization URL for Spotify OAuth flow
 * Run this script to get the auth URL, then visit it in browser to authorize
 */

import open from "open";
import "dotenv/config";

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
	clientId: process.env.SPOTIFY_CLIENT_ID,
	redirectUri: "https://test.luzyver.dev/callback",
	scopes: [
		"user-read-recently-played",  // Required: Read recently played tracks
		"user-read-currently-playing", // Required: Read currently playing track
		"user-read-playback-state",    // Required: Read playback state
		"user-read-private"            // Required: Read user profile
	]
};

// ============================================================================
// VALIDATION
// ============================================================================

if (!CONFIG.clientId) {
	console.error("❌ Error: SPOTIFY_CLIENT_ID not found in environment variables");
	console.log("\n💡 Make sure you have a .env file with:");
	console.log("   SPOTIFY_CLIENT_ID=your_client_id");
	process.exit(1);
}

// ============================================================================
// GENERATE URL
// ============================================================================

const authUrl = new URL("https://accounts.spotify.com/authorize");
authUrl.searchParams.append("response_type", "code");
authUrl.searchParams.append("client_id", CONFIG.clientId);
authUrl.searchParams.append("scope", CONFIG.scopes.join(" "));
authUrl.searchParams.append("redirect_uri", CONFIG.redirectUri);

// ============================================================================
// OUTPUT
// ============================================================================

console.log("\n🎵 Spotify OAuth Authorization\n");
console.log("📋 Required Scopes:");
CONFIG.scopes.forEach(scope => console.log(`   - ${scope}`));
console.log("");
console.log("🔗 Authorization URL:");
console.log(`   ${authUrl.toString()}`);
console.log("");
console.log("📝 Next Steps:");
console.log("   1. Open the URL above in your browser");
console.log("   2. Login with your Spotify account");
console.log("   3. Authorize the application");
console.log("   4. Copy the 'code' parameter from the redirect URL");
console.log("   5. Use the code with getRefreshToken.js");
console.log("");

// Optional: Auto-open in browser (uncomment to enable)
// open(authUrl.toString());
