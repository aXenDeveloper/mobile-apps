export const SET_FOCUS = "SET_FOCUS";
export const setFocus = data => ({
	type: SET_FOCUS,
	payload: {
		...data
	}
});

// ------------------------------------------------------------
export const SET_FORMATTING = "SET_FORMATTING";
export const setFormatting = data => ({
	type: SET_FORMATTING,
	payload: {
		...data
	}
});
export const SET_BUTTON_STATE = "SET_BUTTON_STATE";
export const setButtonState = data => ({
	type: SET_BUTTON_STATE,
	payload: {
		...data
	}
});

// ------------------------------------------------------------
export const RESET_EDITOR = "RESET_EDITOR";
export const resetEditor = data => ({
	type: RESET_EDITOR,
});

// ------------------------------------------------------------
export const OPEN_LINK_MODAL = "OPEN_LINK_MODAL";
export const openLinkModal = data => ({
	type: OPEN_LINK_MODAL,
});
export const CLOSE_LINK_MODAL = "CLOSE_LINK_MODAL";
export const closeLinkModal = data => ({
	type: CLOSE_LINK_MODAL,
});

// ------------------------------------------------------------
export const OPEN_IMAGE_PICKER = "OPEN_IMAGE_PICKER";
export const openImagePicker = data => ({
	type: OPEN_IMAGE_PICKER,
});
export const RESET_IMAGE_PICKER = "RESET_IMAGE_PICKER";
export const resetImagePicker = data => ({
	type: RESET_IMAGE_PICKER,
});
export const ADD_IMAGE_TO_UPLOAD = "ADD_IMAGE_TO_UPLOAD";
export const addImageToUpload = data => ({
	type: ADD_IMAGE_TO_UPLOAD,
	payload: {
		...data
	}
});

// ------------------------------------------------------------
export const SHOW_MENTION_BAR = "SHOW_MENTION_BAR";
export const showMentionBar = data => ({
	type: SHOW_MENTION_BAR,
});
export const HIDE_MENTION_BAR = "HIDE_MENTION_BAR";
export const hideMentionBar = data => ({
	type: HIDE_MENTION_BAR,
});
export const LOADING_MENTIONS = "LOADING_MENTIONS";
export const loadingMentions = data => ({
	type: LOADING_MENTIONS
});
export const UPDATE_MENTION_RESULTS = "UPDATE_MENTION_RESULTS";
export const updateMentionResults = data => ({
	type: UPDATE_MENTION_RESULTS,
	payload: data
});