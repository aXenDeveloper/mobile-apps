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