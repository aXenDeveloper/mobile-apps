//import auth from '../utils/Auth';
import { AsyncStorage } from "react-native";
import ToFormData from "../../utils/ToFormData";

export const RECEIVE_AUTH = "RECEIVE_AUTH";
export const receiveAuth = data => ({
	type: RECEIVE_AUTH,
	payload: {
		...data
	}
});

export const LOGIN_ERROR = "LOGIN_ERROR";
export const loginError = data => ({
	type: LOGIN_ERROR,
	payload: {
		data
	}
});

export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const loginRequest = data => ({
	type: LOGIN_REQUEST,
	payload: {
		data
	}
});

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const loginSuccess = data => ({
	type: LOGIN_SUCCESS,
	payload: {
		...data
	}
});

export const CHECK_AUTH_REQUEST = "CHECK_AUTH_REQUEST";
export const checkAuthRequest = data => ({
	type: CHECK_AUTH_REQUEST,
	payload: {
		...data
	}
});

export const CHECK_AUTH_REQUEST_ERROR = "CHECK_AUTH_REQUEST_ERROR";
export const checkAuthRequestError = data => ({
	type: CHECK_AUTH_REQUEST_ERROR,
	payload: {
		...data
	}
});

export const CHECK_AUTH_REQUEST_SUCCESS = "CHECK_AUTH_REQUEST_SUCCESS";
export const checkAuthRequestSuccess = data => ({
	type: CHECK_AUTH_REQUEST_SUCCESS,
	payload: {
		...data
	}
});

export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const logOutSuccess = data => ({
	type: LOGOUT_SUCCESS
});

/**
 * Refreshes the auth token, if available in AsyncStorage
 */
export const refreshAuth = () => {
	return async dispatch => {
		dispatch(checkAuthRequest());

		const authData = await AsyncStorage.getItem("@authStore:auth");

		if (authData == null) {
			dispatch(
				checkAuthRequestError({
					error: "empty_storage"
				})
			);
			return;
		}

		// Do the request
		try {
			// Set a timeout so we can show an error if we can't connect
			var timeoutCanceled = false;
			const timeoutHandler = setTimeout( () => {
				timeoutCanceled = true;

				dispatch(
					checkAuthRequestError({
						error: 'timeout'
					})
				);
			}, 5000);
			
			// Now do the request
			const authObj = JSON.parse(authData);
			const response = await fetch(
				`${Expo.Constants.manifest.extra.api_url}/oauth/token/index.php`,
				{
					method: "post",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					body: ToFormData({
						grant_type: "refresh_token",
						response_type: "token",
						client_id: Expo.Constants.manifest.extra.oauth_client_id,
						refresh_token: authObj.refresh_token
					})
				}
			);

			if( timeoutCanceled ){
				return;
			}
			
			// Now clear the timeout so we can proceed
			clearTimeout( timeoutHandler );

			const data = await response.json();

			if (data.error || !data.access_token) {
				dispatch(
					checkAuthRequestError({
						error: "invalid_token"
					})
				);
			} else if (!response.ok) {
				dispatch(
					checkAuthRequestError({
						error: "server_error"
					})
				);
			} else {
				await AsyncStorage.setItem(
					"@authStore:auth",
					JSON.stringify({
						refresh_token: authObj.refresh_token,
						access_token: data.access_token,
						expires_in: data.expires_in
					})
				);

				dispatch(
					checkAuthRequestSuccess({
						access_token: data.access_token,
						expires_in: data.expires_in
					})
				);
			}

		} catch (err) {
			// If this is true, we've already dispatched an error
			if( timeoutCanceled ){
				return;
			}

			dispatch(
				checkAuthRequestError({
					error: err.message
				})
			);
		}
	};
};

/**
 * Attempt to authenticate the user using given username, password
 *
 * @param 	string 	username
 * @param 	string 	password
 * @param 	object 	apolloClient 	Instance of ApolloClient, so we can reset the store
 */
export const logIn = (username, password, apolloClient) => {
	return async dispatch => {
		dispatch(loginRequest());

		const response = await fetch(
			`${Expo.Constants.manifest.extra.api_url}oauth/token/index.php`,
			{
				method: "post",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				body: ToFormData({
					grant_type: "password",
					response_type: "token",
					client_id: Expo.Constants.manifest.extra.oauth_client_id,
					redirect_uri: Expo.Constants.manifest.extra.api_url,
					username: username,
					password: password
				})
			}
		);

		const data = await response.json();

		// IPB errors
		if (data.error && data.error === "invalid_grant") {
			dispatch(
				loginError({
					message: "login_failed"
				})
			);
			return;
		}

		// Other server errors
		if (!response.ok) {
			dispatch(
				loginError({
					message: "server_error"
				})
			);
			return;
		}

		// Store and dispatch our tokens/data
		const authData = {
			access_token: data.access_token,
			expires_in: data.expires_in,
			refresh_token: data.refresh_token
		};

		await AsyncStorage.setItem("@authStore:auth", JSON.stringify(authData));

		dispatch(loginSuccess(authData));

		apolloClient.resetStore();
	};
};

/**
 * Attempt to authenticate the user using given username, password
 *
 * @param 	string 	username
 * @param 	string 	password
 * @param 	object 	apolloClient 	Instance of ApolloClient, so we can reset the store
 */
export const logOut = apolloClient => {
	return async dispatch => {
		await AsyncStorage.removeItem("@authStore:auth");
		dispatch(logOutSuccess());
		apolloClient.resetStore();
	};
};
