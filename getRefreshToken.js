/**
 * Spotify Refresh Token Generator
 * Exchanges authorization code for access token and refresh token
 * Run this after getting the auth code from the OAuth flow
 */

import axios from "axios";
import "dotenv/config";

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
	clientId: process.env.SPOTIFY_CLIENT_ID,
	clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
	redirectUri: "https://test.luzyver.dev/callback",
	authorizationCode: process.env.SPOTIFY_AUTH_CODE
};

// ============================================================================
// VALIDATION
// ============================================================================

function validateConfig() {
	const errors = [];

	if (!CONFIG.clientId) {
		errors.push("SPOTIFY_CLIENT_ID is missing");
	}
	if (!CONFIG.clientSecret) {
		errors.push("SPOTIFY_CLIENT_SECRET is missing");
	}
	if (!CONFIG.authorizationCode) {
		errors.push("SPOTIFY_AUTH_CODE is missing");
	}

	if (errors.length > 0) {
		console.error("❌ Configuration Error:\n");
		errors.forEach(error => console.error(`   - ${error}`));
		console.log("\n💡 Usage:");
		console.log("   SPOTIFY_AUTH_CODE=\"your_code_here\" node getRefreshToken.js");
		console.log("\n💡 Make sure your .env file contains:");
		console.log("   SPOTIFY_CLIENT_ID=your_client_id");
		console.log("   SPOTIFY_CLIENT_SECRET=your_client_secret");
		process.exit(1);
	}
}

// ============================================================================
// MAIN FUNCTION
// ============================================================================

async function getRefreshToken() {
	console.log("\n🎵 Exchanging authorization code for tokens...\n");

	try {
		const response = await axios.post(
			"https://accounts.spotify.com/api/token",
			new URLSearchParams({
				grant_type: "authorization_code",
				code: CONFIG.authorizationCode,
				redirect_uri: CONFIG.redirectUri
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

		// Success
		console.log("✅ Tokens retrieved successfully!\n");
		console.log("🔑 Access Token:");
		console.log(`   ${response.data.access_token}`);
		console.log("");
		console.log("🔄 Refresh Token (SAVE THIS!):");
		console.log(`   ${response.data.refresh_token}`);
		console.log("");
		console.log("📝 Next Steps:");
		console.log("   1. Copy the Refresh Token above");
		console.log("   2. Add it to your .env file in SPOTIFY_REFRESH_TOKENS");
		console.log("   3. Format:");
		console.log('      SPOTIFY_REFRESH_TOKENS={"spotify:user:YOUR_ID":{"refreshToken":"TOKEN"}}');
		console.log("");
		console.log("💡 Tip: Run `node fetchSpotify.js` to get your User ID");
		console.log("");
	} catch (error) {
		console.error("❌ Error exchanging token:");

		if (error.response?.data) {
			console.error(`   ${error.response.data.error}: ${error.response.data.error_description}`);

			if (error.response.data.error === "invalid_grant") {
				console.log("\n💡 This usually means:");
				console.log("   - The authorization code has expired (they expire quickly!)");
				console.log("   - The code has already been used");
				console.log("   - Run getAuthUrl.js again to get a new code");
			}
		} else {
			console.error(`   ${error.message}`);
		}

		console.log("");
		process.exit(1);
	}
}

// ============================================================================
// EXECUTION
// ============================================================================

validateConfig();
getRefreshToken();
