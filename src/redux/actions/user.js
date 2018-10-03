export const USER_LOADED = "USER_LOADED";
export const userLoaded = data => ({
	type: USER_LOADED,
	payload: {
		...data
	}
});

export const GUEST_LOADED = "GUEST_LOADED";
export const guestLoaded = data => ({
	type: GUEST_LOADED,
	payload: {
		...data
	}
});

export const SET_USER_STREAMS = "SET_USER_STREAMS";
export const setUserStreams = data => ({
	type: SET_USER_STREAMS,
	payload: {
		...data
	}
});
