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
	},
	notification: null,
	communities: {
		loading: false,
		error: false,
		data: []
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
		// Notification actions
		case actions.RECEIVE_NOTIFICATION:
			console.log("Notification reducer");
			console.log(payload);
			return {
				...state,
				notification: {
					...payload
				}
			};

		case actions.CLEAR_CURRENT_NOTIFICATION:
			return {
				...state,
				notification: null
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
		// Multi-community
		case actions.COMMUNITY_LIST_LOADING:
			return {
				...state,
				communities: {
					...state.communities,
					loading: true,
					error: false
				}
			};
		case actions.COMMUNITY_LIST_ERROR:
			return {
				...state,
				communities: {
					...state.communities,
					loading: false,
					error: true
				}
			};
		case actions.COMMUNITY_LIST_SUCCESS:
			return {
				...state,
				communities: {
					...state.communities,
					loading: false,
					error: false,
					data: payload.communities
				}
			};

		// --------------------------------------------------------------
		// Other app actions
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
