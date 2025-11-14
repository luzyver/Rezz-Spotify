import open from "open";
import "dotenv/config";

const CONFIG = {
	clientId: process.env.SPOTIFY_CLIENT_ID,
	redirectUri: "https://test.luzyver.dev/callback",
	scopes: [
		"user-read-recently-played",
		"user-read-currently-playing",
		"user-read-playback-state",
		"user-read-private"
	]
};

if (!CONFIG.clientId) {
	console.error("Error: SPOTIFY_CLIENT_ID not found in environment variables");
	console.log("\nMake sure you have a .env file with:");
	console.log("  SPOTIFY_CLIENT_ID=your_client_id");
	process.exit(1);
}

const authUrl = new URL("https://accounts.spotify.com/authorize");
authUrl.searchParams.append("response_type", "code");
authUrl.searchParams.append("client_id", CONFIG.clientId);
authUrl.searchParams.append("scope", CONFIG.scopes.join(" "));
authUrl.searchParams.append("redirect_uri", CONFIG.redirectUri);

console.log("\nSpotify OAuth Authorization\n");
console.log("Required Scopes:");
CONFIG.scopes.forEach(scope => console.log(`  - ${scope}`));
console.log("");
console.log("Authorization URL:");
console.log(`  ${authUrl.toString()}\n`);
console.log("Next Steps:");
console.log("  1. Open the URL above in your browser");
console.log("  2. Login with your Spotify account");
console.log("  3. Authorize the application");
console.log("  4. Copy the 'code' parameter from the redirect URL");
console.log("  5. Use the code with script/getRefreshToken.js\n");
