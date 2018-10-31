export const SET_SITE_SETTINGS = "SET_SITE_SETTINGS";
export const setSiteSettings = data => ({
	type: SET_SITE_SETTINGS,
	payload: {
		...data
	}
});

export const SET_LOGIN_HANDLERS = "SET_LOGIN_HANDLERS";
export const setLoginHandlers = data => ({
	type: SET_LOGIN_HANDLERS,
	payload: {
		...data
	}
});

export const SET_FORUM_PASSWORD = "SET_FORUM_PASSWORD";
export const setForumPassword = data => ({
	type: SET_FORUM_PASSWORD,
	payload: {
		...data
	}
});