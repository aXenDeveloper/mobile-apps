import { SET_SITE_SETTINGS, SET_LOGIN_HANDLERS } from "../actions/site";

const initialState = {
	settings: {
		site_online: true,
		site_offline_message: '',
		board_name: 'Invision Community'
	},
	loginHandlers: []
};

export default function site(state = initialState, { type, payload }) {
	switch (type) {
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
				loginHandlers: [
					...( Object.values(payload) )
				]
			};
		default:
			return { ...state };
	}
}
