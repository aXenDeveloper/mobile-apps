import gql from "graphql-tag";

const LangFragment = gql`
	fragment LangFragment on core_Language {
		replies: phrase(key: "app_replies")
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
		new_content: phrase(key: "app_new_content")
		active_users: phrase(key: "app_active_users")
		x_more: phrase(key: "app_x_more")
		no_users_online: phrase(key: "app_no_users_online")
		x_guests_online: phrase(key: "app_x_guests_online")
		activity_replied: phrase(key: "app_activity_replied")
		activity_commented: phrase(key: "app_activity_commented")
		activity_reviewed: phrase(key: "app_activity_reviewed")
		activity_posted_item: phrase(key: "app_activity_posted_item")
		activity_generic: phrase(key: "app_activity_generic")
		login_prompt: phrase(key: "app_login_prompt")
		login_register_prompt: phrase(key: "app_login_register_prompt")
		login_prompt_comment: phrase(key: "app_login_prompt_comment")
		login_register_prompt_comment: phrase(key: "app_login_register_prompt_comment")
		register: phrase(key: "app_register")
		sign_in: phrase(key: "app_sign_in")
		home_view_error: phrase(key: "app_home_view_error")
		topic_view_error: phrase(key: "app_topic_view_error")
		no_topics: phrase(key: "app_no_topics")
		forum_requires_password: phrase(key: "app_forum_requires_password")
		enter_password: phrase(key: "app_enter_password")
		password: phrase(key: "app_password")
		go: phrase(key: "app_go")
		search_site: phrase(key: "app_search_site")

		x_follow_this: phrase(key: "app_x_follow_this")
		follow_immediate: phrase(key: "app_follow_immediate")		
		follow_weekly: phrase(key: "app_follow_weekly")
		follow_daily: phrase(key: "app_follow_daily")
		follow_none: phrase(key: "app_follow_none")		
		follow_anon: phrase(key: "app_follow_anon")
		follow_freq: phrase(key: "app_follow_freq")
		follow_privacy: phrase(key: "app_follow_privacy")
		follow: phrase(key: "app_follow")
		follow_save: phrase(key: "app_follow_save")
		unfollow: phrase(key: "app_unfollow")
	}
`;

export default LangFragment;