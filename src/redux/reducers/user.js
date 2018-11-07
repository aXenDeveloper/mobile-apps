import { USER_LOADED, GUEST_LOADED, SET_USER_STREAMS } from "../actions/user";

const initialState = {
	isGuest: true,
	id: 0,
	name: 'Guest',
	photo: '',
	notificationCount: 4,
	group: {
		canAccessSite: false,
		canAccessOffline: false,
		groupType: 'GUEST'
	},
	streams: []
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
		case SET_USER_STREAMS:
			return {
				...state,
				streams: Object.values(payload)
			}
		default:
			return { ...state };
	}
}
