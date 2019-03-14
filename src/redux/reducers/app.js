import {
	SET_APOLLO_CLIENT,
	RESET_BOOT_STATUS,
	BOOT_SITE_LOADING,
	BOOT_SITE_SUCCESS,
	SET_ACTIVE_COMMUNITY,
	SWITCH_APP_VIEW,
	OPEN_MODAL_WEBVIEW,
	RESET_MODAL_WEBVIEW
} from "../actions/app";

const initialState = {
	bootStatus: {
		loading: false,
		loaded: false,
		error: false,
		networkError: false
	},
	client: null,
	view: "multi",
	currentCommunity: {
		apiUrl: null,
		apiKey: null
	},
	webview: {
		active: false,
		url: ""
	}
};

export default function app(state = initialState, { type, payload }) {
	switch (type) {
		case SET_APOLLO_CLIENT:
			return {
				...state,
				client: payload.client
			};
		case RESET_BOOT_STATUS:
			return {
				...state,
				bootStatus: {
					...initialState.bootStatus
				}
			};
		case BOOT_SITE_LOADING:
			return {
				...state,
				bootStatus: {
					...initialState.bootStatus,
					loading: true,
					loaded: false
				}
			};
		case BOOT_SITE_SUCCESS:
			return {
				...state,
				bootStatus: {
					...initialState.bootStatus,
					loading: false,
					loaded: true
				}
			};
		case SWITCH_APP_VIEW:
			return {
				...state,
				view: payload.view
			};
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
					url: ""
				}
			};
		default:
			return { ...state };
	}
}
