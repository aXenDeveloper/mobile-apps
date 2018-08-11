export const SET_SITE_SETTINGS = "SET_SITE_SETTINGS";
export const setSiteSettings = data => ({
	type: SET_SITE_SETTINGS,
	payload: {
		...data
	}
});