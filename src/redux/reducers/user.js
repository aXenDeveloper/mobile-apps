import { USER_LOADED, GUEST_LOADED, SET_USER_STREAMS, UPDATE_NOTIFICATION_COUNT } from "../actions/user";

const initialState = {
	isGuest: true,
	id: 0,
	name: 'Guest',
	photo: '',
	notificationCount: 0,
	group: {
		canAccessSite: false,
		canAccessOffline: false,
		groupType: 'GUEST',
		canTag: false
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
		case UPDATE_NOTIFICATION_COUNT:
			return {
				...state,
				notificationCount: payload
			}
		default:
			return { ...state };
	}
}
