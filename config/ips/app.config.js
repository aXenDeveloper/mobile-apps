const baseConfig = require("../baseConfig");

module.exports = baseConfig({
	expo: {
		hooks: {
			postPublish: [
				{
					config: {
						project: "invision-community-app",
						authToken: "bd04333c3cee47919b0b963b90c18706b7f7bdd5f7df4f93b422ef0a91f68943"
					}
				}
			]
		},
		extra: {
			multi: false,
			oauth_client_id: "e79f36dc890d5c6b01fa0dc25e52ad0e",
			api_url: "https://invisioncommunity.com/",
			sentryDsn: "https://7ebe0255a311425c8edb883ad65e5002@o248014.ingest.sentry.io/1429754",
			experienceId: "invision-community"
		},
		name: "Invision Community",
		slug: "invision-community",
		scheme: "invisioncommunity",
		ios: {
			bundleIdentifier: "com.invisioncommunity.app"
		},
		android: {
			googleServicesFile: "./config/ips/assets/google-services.json",
			package: "com.invisioncommunity.app"
		},
		primaryColor: "#3370AA"
	}
});
