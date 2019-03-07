import { SET_ACTIVE_COMMUNITY, OPEN_MODAL_WEBVIEW, RESET_MODAL_WEBVIEW } from "../actions/app";

const initialState = {
	currentCommunity: {
		apiUrl: Expo.Constants.manifest.extra.api_url,
		apiKey: Expo.Constants.manifest.extra.api_key
	},
	webview: {
		active: false,
		url: ''
	}
};

export default function app(state = initialState, { type, payload }) {
	switch (type) {
		case SET_ACTIVE_COMMUNITY:
			return {
				...state,
				currentCommunity: {
					apiUrl: payload.apiUrl,
					apiKey: payload.apiKey
				}
			};
		case OPEN_MODAL_WEBVIEW:
			return {
				...state,
				webview: {
					active: true,
					url: payload.url
				}
			};
		case RESET_MODAL_WEBVIEW:
			return {
				...state,
				webview: {
					active: false,
					url: ''
				}
			};
		default:
			return { ...state };
	}
}
