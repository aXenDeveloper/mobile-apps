// Keeps track of the types of content the app is able to display
// If content types other than these are loaded, they'll be displayed in a WebView instead
// There's a few ways we identify content: classnames, controller paths, and basic URLs.
const supported = {
	classes: [
		"IPS\\forums\\Topic",
		"IPS\\forums\\Topic\\Post"
	],
	appComponents: {
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
	},
	urls: [

		// -------
		// CORE SCREENS
		// Profile view
		{
			test: new RegExp("profile\/([0-9]+?)-([^\/]+)?", "i"),
			matchCallback: (found) => {
				return {
					routeName: "Profile",
					params: {
						id: found[1]
					}
				};
			}
		},

		// -------
		// FORUMS SCREENS
		// Forum view
		{
			test: new RegExp("forum/([0-9]+?)-([^\/]+)?", "i"),
			matchCallback: (found) => {
				return {
					routeName: "TopicList",
					params: {
						id: found[1]
					}
				}
			}
		},
		// Topic view
		{
			test: new RegExp("topic/([0-9]+?)-([^\/]+)?", "i"),
			matchCallback: (found) => {
				return {
					routeName: "TopicView",
					params: {
						id: found[1]
					}
				}
			}
		}
	]
}

export default supported;