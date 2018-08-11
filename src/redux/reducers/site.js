import { SET_SITE_SETTINGS } from "../actions/site";

const initialState = {
	site_online: true,
	site_offline_message: '',
	board_name: 'Invision Community'
};

export default function site(state = initialState, { type, payload }) {
	switch (type) {
		case SET_SITE_SETTINGS:
			return {
				...state,
				...payload
			};
		default:
			return { ...state };
	}
}
