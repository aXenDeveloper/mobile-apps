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
	},
	categoryList: {
		loading: false,
		error: false
	},
	categories: {},
	settings: {
		contentView: "first"
	},
	toast: [],
	currentTheme: null,
	darkMode: false
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
		// "My Communities" list for Multi-community
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
		case actions.SET_COMMUNITIES:
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
		// Category list for Multi-community
		case actions.COMMUNITY_CATEGORIES_LOADING:
			return {
				...state,
				categoryList: {
					...state.categoryList,
					loading: true,
					error: false
				}
			};
		case actions.COMMUNITY_CATEGORIES_ERROR:
			return {
				...state,
				categoryList: {
					...state.categoryList,
					loading: false,
					error: true
				}
			};
		case actions.COMMUNITY_CATEGORIES_SUCCESS:
			const categoryKeys = Object.keys(payload);
			const categoryObj = {};

			categoryKeys.forEach(category => {
				categoryObj[category] = {
					id: category,
					name: payload[category],
					loading: false,
					error: false,
					items: []
				};
			});

			return {
				...state,
				categoryList: {
					...state.categoryList,
					loading: false,
					error: false
				},
				categories: {
					...categoryObj,
					...state.categories
				}
			};

		// --------------------------------------------------------------
		// Individual category for Multi-community
		case actions.COMMUNITY_CATEGORY_LOADING:
			return {
				...state,
				categories: {
					...state.categories,
					[payload.id]: {
						...state.categories[payload.id],
						loading: true,
						finished: false,
						error: false
					}
				}
			};
		case actions.COMMUNITY_CATEGORY_ERROR:
			return {
				...state,
				categories: {
					...state.categories,
					[payload.id]: {
						...state.categories[payload.id],
						loading: false,
						finished: false,
						error: true
					}
				}
			};
		case actions.COMMUNITY_CATEGORY_SUCCESS:
			// We receive an offset, so to be sure we dont duplicate items in case of a race condition,
			// take a slice of existing data up to the offset we're about to append to
			const existingItems = state.categories[payload.id].items || [];
			const existingSlice = existingItems.slice(0, payload.offset);

			return {
				...state,
				categories: {
					...state.categories,
					[payload.id]: {
						...state.categories[payload.id],
						loading: false,
						error: false,
						finished: payload.finished,
						items: [...existingSlice, ...payload.items]
					}
				}
			};

		// --------------------------------------------------------------
		// App settings
		case actions.CONTENT_VIEW:
			return {
				...state,
				settings: {
					...state.settings,
					contentView: payload
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
		case actions.PUSH_TOAST:
			return {
				...state,
				toast: [...state.toast, payload]
			};
		case actions.SHIFT_TOAST:
			const clone = [state.toast];
			clone.shift();

			return {
				...state,
				toast: clone
			};
		default:
			return { ...state };
	}
}
