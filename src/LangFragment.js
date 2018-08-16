import gql from "graphql-tag";

const LangFragment = gql`
	fragment LangFragment on core_Language {
		topics: phrase(key: "app_topics")
		posts: phrase(key: "app_posts")
		quote: phrase(key: "app_quote")
		post_options: phrase(key: "app_post_options")
		end_of_forum: phrase(key: "app_end_of_forum")
		cancel: phrase(key: "app_cancel")
		share: phrase(key: "app_share")
		report: phrase(key: "app_report")
		load_earlier: phrase(key: "app_load_earlier")
		write_reply: phrase(key: "app_write_reply")
		unread_posts: phrase(key: "app_unread_posts")
		your_profile: phrase(key: "app_your_profile")
		settings: phrase(key: "app_settings")
		sign_out: phrase(key: "app_sign_out")
		notification_settings: phrase(key: "app_notification_settings")
		disabled_notification: phrase(key: "app_disabled_notification")
		legal_notices: phrase(key: "app_legal_notices")
		edit_profile: phrase(key: "app_edit_profile")
		offline: phrase(key: "app_offline")
		home: phrase(key: "app_home")
		browse: phrase(key: "app_browse")
		our_picks: phrase(key: "app_our_picks")
		new_for_you: phrase(key: "app_new_for_you")
	}
`;

export default LangFragment;