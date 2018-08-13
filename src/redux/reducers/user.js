import { USER_LOADED, GUEST_LOADED } from "../actions/user";

const initialState = {
	isGuest: true,
	id: 0,
	name: 'Guest',
	photo: '',
	group: {
		canAccessSite: false,
		canAccessOffline: false,
		groupType: 'GUEST'
	}
};

export default function user(state = initialState, { type, payload }) {
	switch (type) {
		case GUEST_LOADED:
			return {
				...initialState,
				...payload,
				isGuest: true
			};
		case USER_LOADED:
			return {
				...state,
				...payload,
				isGuest: false
			}
		default:
			return { ...state };
	}
}
