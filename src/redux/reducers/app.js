import { OPEN_MODAL_WEBVIEW, RESET_MODAL_WEBVIEW } from "../actions/app";

const initialState = {
	webview: {
		active: false,
		url: ''
	}
};

export default function app(state = initialState, { type, payload }) {
	switch (type) {
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
