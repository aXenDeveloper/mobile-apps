import * as actions from "../actions/app";

const initialState = {
	bootStatus: {
		loading: false,
		loaded: false,
		error: false,
		isNetworkError: false
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
		// --------------------------------------------------------------
		// Boot actions
		case actions.RESET_BOOT_STATUS:
			return {
				...state,
				bootStatus: {
					...initialState.bootStatus
				}
			};
		case actions.BOOT_SITE_LOADING:
			return {
				...state,
				bootStatus: {
					error: false,
					isNetworkError: false,
					loading: true,
					loaded: false
				}
			};
		case actions.BOOT_SITE_SUCCESS:
			return {
				...state,
				bootStatus: {
					error: false,
					isNetworkError: false,
					loading: false,
					loaded: true
				}
			};
		case actions.BOOT_SITE_ERROR:
			console.log("Boot status error");
			console.log(payload);
			return {
				...state,
				bootStatus: {
					loading: false,
					loaded: false,
					error: payload.error || true,
					isNetworkError: payload.isNetworkError
				}
			};

		// --------------------------------------------------------------
		// Actions to control the active community
		case actions.SET_ACTIVE_COMMUNITY:
			return {
				...state,
				currentCommunity: {
					apiUrl: payload.apiUrl,
					apiKey: payload.apiKey
				}
			};
		case actions.RESET_ACTIVE_COMMUNITY:
			return {
				...state,
				currentCommunity: {
					...initialState.currentCommunity
				}
			};

		// --------------------------------------------------------------
		// Other app actions
		case actions.SET_APOLLO_CLIENT:
			console.log("APP_ACTION: Set new client.");
			return {
				...state,
				client: payload.client
			};
		case actions.SWITCH_APP_VIEW:
			return {
				...state,
				view: payload.view
			};

		case actions.OPEN_MODAL_WEBVIEW:
			return {
				...state,
				webview: {
					active: true,
					url: payload.url
				}
			};
		case actions.RESET_MODAL_WEBVIEW:
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
