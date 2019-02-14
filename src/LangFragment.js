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
		save: phrase(key: "app_save")
		confirm: phrase(key: "app_confirm")
		add: phrase(key: "app_add")
		share: phrase(key: "app_share")
		report: phrase(key: "app_report")
		show: phrase(key: "app_show")
		hide: phrase(key: "app_hide")
		replace: phrase(key: "app_replace")
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
		popular_contributors: phrase(key: "app_popular_contributors")
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
		error: phrase(key: "app_error")
		error_remove_reaction: phrase(key: "app_error_remove_reaction")
		error_reacting: phrase(key: "app_error_reacting")
		error_following: phrase(key: "app_error_following")
		error_unfollowing: phrase(key: "app_error_unfollowing")
		ok: phrase(key: "app_ok")
		cant_show_reactions: phrase(key: "app_cant_show_reactions")
		editor_quote_line_with_time: phrase(key: "app_editor_quote_line_with_time")
		editor_quote_line: phrase(key: "app_editor_quote_line")
		ignoring_user: phrase(key: "app_ignoring_user")
		pagination: phrase(key: "app_pagination")
		insert_into_post: phrase(key: "app_insert_into_post")
		delete_image: phrase(key: "app_delete_image")
		cancel_upload: phrase(key: "app_cancel_upload")
		attachment_options: phrase(key: "app_attachment_options")
		no_matching_members: phrase(key: "app_no_matching_members")
		rep: phrase(key: "app_rep")

		followed_member: phrase(key: "app_followed_member")
		unfollowed_member: phrase(key: "app_unfollowed_member")
		profile_content_count: phrase(key: "app_profile_content_count")
		profile_reputation: phrase(key: "app_profile_reputation")
		profile_followers: phrase(key: "app_profile_followers")
		profile_overview: phrase(key: "app_profile_overview")
		profile_content: phrase(key: "app_profile_content")
		basic_information: phrase(key: "app_basic_information")
		joined: phrase(key: "app_joined")
		email_address: phrase(key: "app_email_address")
		end_of_profile_content: phrase(key: "app_end_of_profile_content")

		username: phrase(key: "app_username")
		password: phrase(key: "app_password")
		forgot_password: phrase(key: "app_forgot_password")
		sign_in_anon: phrase(key: "app_sign_in_anon")
		sign_in_with_social: phrase(key: "app_sign_in_with_social")
		
		search_site: phrase(key: "app_search_site")
		loading: phrase(key: "app_loading")
		no_recent_searches: phrase(key: "app_no_recent_searches")
		error_searching: phrase(key: "app_error_searching")
		no_results: phrase(key: "app_no_results")
		no_results_in_x: phrase(key: "app_no_results_in_x")
		see_all: phrase(key: "app_see_all")
		name_replied: phrase(key: "app_name_replied")
		item_in_container: phrase(key: "app_item_in_container")
		overview: phrase(key: "app_overview")
		top_content: phrase(key: "app_top_content")
		top_members: phrase(key: "app_top_members")
		recent_searches: phrase(key: "app_recent_searches")
		content: phrase(key: "app_content")

		create_new_topic: phrase(key: "app_create_new_topic")
		topics_title: phrase(key: "app_topics_title")
		subforums_title: phrase(key: "app_subforums_title")
		no_forum: phrase(key: "app_no_forum")
		no_topic: phrase(key: "app_no_topic")
		incorrect_forum_password: phrase(key: "app_incorrect_forum_password")
		no_post: phrase(key: "app_no_post"),
		invalid_topic: phrase(key: "app_invalid_topic")
		not_question: phrase(key: "app_not_question")
		cannot_vote: phrase(key: "app_cannot_vote")
		error_voting_question: phrase(key: "app_error_voting_question")
		replace_best_answer_title: phrase(key: "app_replace_best_answer_title")
		replace_best_answer_text: phrase(key: "app_replace_best_answer_text")
		question_asked_by: phrase(key: "app_question_asked_by")
		this_is_best_answer: phrase(key: "app_this_is_best_answer")

		votes: phrase(key: "app_votes")
		votes_nonum: phrase(key: "app_votes_nonum")
		poll_closed: phrase(key: "app_poll_closed")
		poll_closes_date: phrase(key: "app_poll_closes_date")
		poll_view: phrase(key: "app_poll_view")
		poll_view_results: phrase(key: "app_poll_view_results")
		poll_view_and_vote: phrase(key: "app_poll_view_and_vote")
		poll_you_voted: phrase(key: "app_poll_you_voted")
		poll_prefix: phrase(key: "app_poll_prefix")
		poll_question_number: phrase(key: "app_poll_question_number")
		poll_multiple_choice: phrase(key: "app_poll_multiple_choice")
		poll_view_confirm: phrase(key: "app_poll_view_confirm")
		poll_no_permission: phrase(key: "app_poll_no_permission")

		tags_min_max: phrase(key: "app_tags_min_max")
		tags_min: phrase(key: "app_tags_min")
		tags_max: phrase(key: "app_tags_max")
		tags_len_min_max: phrase(key: "app_tags_len_min_max")
		tags_len_min: phrase(key: "app_tags_len_min")
		tags_len_max: phrase(key: "app_tags_len_max")
		manage_tags: phrase(key: "app_manage_tags")
		enter_tag: phrase(key: "app_enter_tag")
		tags: phrase(key: "app_tags")
		tag_suggestions: phrase(key: "app_tag_suggestions")

		no_more_notifications: phrase(key: "app_no_more_notifications")
		notifications_unread: phrase(key: "app_notifications_unread")
		notifications_read: phrase(key: "app_notifications_read")
		no_notifications: phrase(key: "app_no_notifications")

		switch_stream: phrase(key: "app_switch_stream")
		past_hour: phrase(key: "app_past_hour")
		yesterday: phrase(key: "app_yesterday")
		today: phrase(key: "app_today")
		last_week: phrase(key: "app_last_week")
		earlier: phrase(key: "app_earlier")

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

		notifications__club_invitation: phrase(key: "app_notifications__club_invitation")
		notifications__club_response: phrase(key: "app_notifications__club_response")
		notifications__club_request: phrase(key: "app_notifications__club_request")
		notifications__club_join: phrase(key: "app_notifications__club_join")
		notifications__unapproved_club: phrase(key: "app_notifications__unapproved_club")
		notifications__new_content: phrase(key: "app_notifications__new_content")
		notifications__new_comment: phrase(key: "app_notifications__new_comment")
		notifications__new_review: phrase(key: "app_notifications__new_review")
		notifications__follower_content: phrase(key: "app_notifications__follower_content")
		notifications__quote: phrase(key: "app_notifications__quote")
		notifications__mention: phrase(key: "app_notifications__mention")
		notifications__embed: phrase(key: "app_notifications__embed")
		notifications__new_likes_rep: phrase(key: "app_notifications__new_likes_rep")
		notifications__new_likes_like: phrase(key: "app_notifications__new_likes_like")
		notifications__warning_mods: phrase(key: "app_notifications__warning_mods")
		notifications__report_center: phrase(key: "app_notifications__report_center")
		notifications__automatic_moderation: phrase(key: "app_notifications__automatic_moderation")
		notifications__unapproved_content: phrase(key: "app_notifications__unapproved_content")
		notifications__new_private_message: phrase(key: "app_notifications__new_private_message")
		notifications__private_message_added: phrase(key: "app_notifications__private_message_added")
		notifications__member_follow: phrase(key: "app_notifications__member_follow")
		notifications__profile_comment: phrase(key: "app_notifications__profile_comment")
		notifications__profile_reply: phrase(key: "app_notifications__profile_reply")
		notifications__new_status: phrase(key: "app_notifications__new_status")
	}
`;

export default LangFragment;