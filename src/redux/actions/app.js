// =================================================================

export const OPEN_MODAL_WEBVIEW = "OPEN_MODAL_WEBVIEW";
export const openModalWebview = data => ({
	type: OPEN_MODAL_WEBVIEW,
	payload: {
		...data
	}
});

export const RESET_MODAL_WEBVIEW = "RESET_MODAL_WEBVIEW";
export const resetModalWebview = data => ({
	type: RESET_MODAL_WEBVIEW,
	payload: {
		...data
	}
});

export const SET_ACTIVE_COMMUNITY = "SET_ACTIVE_COMMUNITY";
export const setActiveCommunity = data => ({
	type: SET_ACTIVE_COMMUNITY,
	payload: {
		...data
	}
});

export const RESET_ACTIVE_COMMUNITY = "RESET_ACTIVE_COMMUNITY";
export const resetActiveCommunity = data => ({
	type: RESET_ACTIVE_COMMUNITY
});

export const SWITCH_APP_VIEW = "SWITCH_APP_VIEW";
export const switchAppView = data => ({
	type: SWITCH_APP_VIEW,
	payload: {
		...data
	}
});

export const SET_APOLLO_CLIENT = "SET_APOLLO_CLIENT";
export const setApolloClient = data => ({
	type: SET_APOLLO_CLIENT,
	payload: {
		...data
	}
});

// =================================================================

export const RESET_BOOT_STATUS = "RESET_BOOT_STATUS";
export const resetBootStatus = data => ({
	type: RESET_BOOT_STATUS
});

export const BOOT_SITE_LOADING = "BOOT_SITE_LOADING";
export const bootSiteLoading = data => ({
	type: BOOT_SITE_LOADING
});

export const BOOT_SITE_ERROR = "BOOT_SITE_ERROR";
export const bootSiteError = data => ({
	type: BOOT_SITE_ERROR,
	payload: {
		...data
	}
});

export const BOOT_SITE_SUCCESS = "BOOT_SITE_SUCCESS";
export const bootSiteSuccess = data => ({
	type: BOOT_SITE_SUCCESS
});

import _ from "underscore";
import Lang from "../../utils/Lang";
import { guestLoaded, userLoaded, setUserStreams } from "./user";
import { setSiteSettings, setLoginHandlers } from "./site";
import gql from "graphql-tag";
import { graphql } from "react-apollo";

export const bootSite = apiInfo => {
	return async (dispatch, getState) => {
		const {
			auth: { client }
		} = getState();

		// Set state to loading
		dispatch(bootSiteLoading());

		// Now run our boot query
		try {
			const { auth } = getState();
			const { data } = await client.query({
				query: BootQuery,
				variables: {}
			});

			if (auth.isAuthenticated && data.core.me.group.groupType !== "GUEST") {
				dispatch(userLoaded({ ...data.core.me }));
				//	clearInterval(this._notificationTimeout);
				//	this._notificationTimeout = setInterval(() => this.runNotificationQuery(), NOTIFICATION_TIMEOUT);
			} else {
				dispatch(guestLoaded({ ...data.core.me }));
			}

			// Set our lang strings
			if (_.size(data.core.language)) {
				// We don't want __typename, so discard that
				const { __typename, ...rest } = data.core.language;
				Lang.setWords(rest);
			}

			// Set our system settings
			dispatch(setSiteSettings(data.core.settings));
			dispatch(setLoginHandlers(data.core.loginHandlers));

			// Store our streams
			dispatch(
				setUserStreams([
					{
						id: "all",
						title: "All Activity",
						isDefault: true
					},
					...data.core.streams
				])
			);

			dispatch(bootSiteSuccess());
		} catch (err) {
			dispatch(
				bootSiteError({
					error: err,
					isNetworkError: true
				})
			);
		}
	};
};

import LangFragment from "../../LangFragment";
const BootQuery = gql`
	query BootQuery {
		core {
			me {
				id
				name
				photo
				notificationCount
				group {
					canAccessSite
					canAccessOffline
					groupType
					canTag
				}
			}
			settings {
				base_url
				site_online
				site_offline_message
				board_name
				allow_reg
				allow_reg_target
				disable_anonymous
				tags_enabled
				tags_open_system
				tags_min
				tags_len_min
				tags_max
				tags_len_max
				tags_min_req
				reputation_enabled
				reputation_highlight
				reputation_show_profile
				allow_result_view
				forums_questions_downvote
			}
			loginHandlers {
				id
				title
				icon
				text
				color
				url
			}
			language {
				...LangFragment
			}
			streams {
				id
				title
				isDefault
			}
		}
	}
	${LangFragment}
`;
