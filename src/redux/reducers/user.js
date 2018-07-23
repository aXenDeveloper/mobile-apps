import { USER_LOADED, GUEST_LOADED } from "../actions/user";

const initialState = {
	isGuest: true,
	id: 0,
	name: 'Guest',
	photo: '',
	notificationCount: 0
};

export default function user(state = initialState, { type, payload }) {
	switch (type) {
		case GUEST_LOADED:
			return {
				...initialState
			};
		case USER_LOADED:
			return {
				isGuest: false,
				id: payload.id,
				name: payload.name,
				photo: payload.photo,
				notificationCount: payload.notificationCount
			}
		default:
			return { ...state };
	}
}
