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