// ========================================================

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

export const SET_HOME_SCREEN_DATA = "SET_HOME_SCREEN_DATA";
export const setHomeScreenData = data => ({
	type: SET_HOME_SCREEN_DATA,
	payload: {
		data
	}
});

export const SET_FORUM_PASSWORD = "SET_FORUM_PASSWORD";
export const setForumPassword = data => ({
	type: SET_FORUM_PASSWORD,
	payload: {
		...data
	}
});

export const SET_SITE_MENU = "SET_SITE_MENU";
export const setSiteMenu = data => ({
	type: SET_SITE_MENU,
	payload: data
});

export const SET_SITE_MODULE_PERMISSIONS = "SET_SITE_MODULE_PERMISSIONS";
export const setSiteModulePermissions = data => ({
	type: SET_SITE_MODULE_PERMISSIONS,
	payload: data
});
