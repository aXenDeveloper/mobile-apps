// Keeps track of the types of content the app is able to display
// If content types other than these are loaded, they'll be displayed in a WebView instead
const supported = {
	classes: [
		"IPS\\forums\\Topic",
		"IPS\\forums\\Topic\\Post"
	],
	urls: {
		forums: {
			forums: {
				topic: "TopicView"
			}
		},
		core: {
			members: {
				profile: "Profile"
			}
		}
	}
}

export default supported;