const baseConfig = require("../baseConfig");

module.exports = baseConfig({
	expo: {
		hooks: {
			postPublish: [
				{
					config: {
						project: "invision-communities",
						authToken: "b3c5d84bc38c40b08ac7ae01831fba8e43410b543c194c0e8bb8edf4909f5c14"
					}
				}
			]
		},
		extra: {
			oauth_client_id: "e79f36dc890d5c6b01fa0dc25e52ad0e",
			api_url: "https://invisioncommunity.com/",
			sentryDsn: "https://df2e90cd358c4402b9e1def82a335387@o248014.ingest.sentry.io/5285650",
			experienceId: "invision-communities"
		},
		name: "Communities",
		slug: "invision-communities",
		scheme: "invisioncommunities",
		ios: {
			bundleIdentifier: "com.invisioncommunity.communities"
		},
		android: {
			googleServicesFile: "./config/multi/assets/google-services.json",
			package: "com.invisioncommunity.communities"
		},
		primaryColor: "#3370AA"
	}
});
