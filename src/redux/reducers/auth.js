import * as actions from "../actions/auth";

const initialState = {
	loginProcessing: false,
	authenticated: false
};

export default function auth(state = initialState, { type, payload }) {
	switch (type) {
		case actions.RECEIVE_AUTH:
			return {
				...state,
				loginProcessing: false,
				refresh_token: payload.refresh_token,
				expires_in: payload.expires_in,
				access_token: payload.access_token,
				authenticated: payload.userSession
			};
		case actions.LOGIN_REQUEST:
			return {
				...state,
				loginProcessing: true
			};
		case actions.LOGIN_SUCCESS:
			return {
				...state,
				loginProcessing: false,
				refresh_token: payload.refresh_token,
				expires_in: payload.expires_in,
				access_token: payload.access_token,
				authenticated: true
			};
		case actions.LOGIN_ERROR:
			return {
				loginProcessing: false,
				authenticated: false,
				error: payload.error
			};
		case actions.CHECK_AUTH_REQUEST:
			return {
				...state,
				checkAuthProcessing: true
			};
		case actions.CHECK_AUTH_REQUEST_SUCCESS:
			return {
				...state,
				checkAuthProcessing: false,
				authenticated: true,
				expires_in: payload.expires_in,
				access_token: payload.access_token
			};
		case actions.CHECK_AUTH_REQUEST_ERROR:
			// Return object that excludes access_token & expires_in
			const { access_token, expires_in, error, ...rest } = state;
			return {
				...rest,
				checkAuthProcessing: false,
				authenticated: false
			};
		case actions.LOGOUT_SUCCESS:
			return {
				authenticated: false,
				loginProcessing: false,
				checkAuthProcessing: false
			};
		default:
			return state;
	}
}
