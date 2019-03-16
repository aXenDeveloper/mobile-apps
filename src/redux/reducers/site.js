import { SET_SITE_SETTINGS, SET_LOGIN_HANDLERS } from "../actions/site";
import { SET_ACTIVE_COMMUNITY } from "../actions/app";

const initialState = {
	settings: {
		site_online: true,
		site_offline_message: "",
		board_name: "Invision Community"
	},
	loginHandlers: []
};

export default function site(state = initialState, { type, payload }) {
	switch (type) {
		// When we change the active community, we want to completely reset
		// our site state.
		case SET_ACTIVE_COMMUNITY:
			return {
				...initialState
			};

		case SET_SITE_SETTINGS:
			return {
				...state,
				settings: {
					...payload
				}
			};
		case SET_LOGIN_HANDLERS:
			return {
				...state,
				loginHandlers: [...Object.values(payload)]
			};
		default:
			return { ...state };
	}
}
