//import auth from '../utils/Auth';
import { AsyncStorage } from "react-native";
import ToFormData from "../../utils/ToFormData";
import _ from "underscore";

// ====================================================================
// General auth actions

export const RECEIVE_AUTH = "RECEIVE_AUTH";
export const receiveAuth = data => ({
	type: RECEIVE_AUTH,
	payload: {
		...data
	}
});

export const REMOVE_AUTH = "REMOVE_AUTH";
export const removeAuth = data => ({
	type: REMOVE_AUTH
});

// ====================================================================
// Refresh token actions

export const REFRESH_TOKEN_LOADING = "REFRESH_TOKEN_LOADING";
export const refreshTokenLoading = data => ({
	type: REFRESH_TOKEN_LOADING
});

export const REFRESH_TOKEN_SUCCESS = "REFRESH_TOKEN_SUCCESS";
export const refreshTokenSuccess = data => ({
	type: REFRESH_TOKEN_SUCCESS
});

export const REFRESH_TOKEN_ERROR = "REFRESH_TOKEN_ERROR";
export const refreshTokenError = data => ({
	type: REFRESH_TOKEN_ERROR,
	payload: {
		...data
	}
});

var timeoutHandler;
var timeoutCanceled = false;

export const refreshToken = apiInfo => {
	return async dispatch => {
		dispatch(refreshTokenLoading());

		const authData = await AsyncStorage.getItem(`@authStore:${apiInfo.apiUrl}`);

		if (authData == null) {
			dispatch(
				refreshTokenError({
					error: "empty_storage",
					isNetworkError: false
				})
			);
			return;
		}

		// Do the request
		try {
			// Set a timeout so we can show an error if we can't connect

			timeoutHandler = setTimeout(() => {
				timeoutCanceled = true;
				dispatch(
					refreshTokenError({
						error: "timeout",
						isNetworkError: true
					})
				);
			}, 5000);

			// Now do the request
			const authObj = JSON.parse(authData);

			if (_.isUndefined(authObj)) {
				dispatch(
					refreshTokenError({
						error: "no_token",
						isNetworkError: false
					})
				);
				return;
			}

			const response = await fetch(`${apiInfo.apiUrl}/oauth/token/index.php`, {
				method: "post",
				headers: {
					"Content-Type": "multipart/form-data"
				},
				body: ToFormData({
					grant_type: "refresh_token",
					response_type: "token",
					client_id: apiInfo.apiKey,
					refresh_token: authObj.refreshToken
				})
			});

			if (timeoutCanceled) {
				return;
			}

			// Now clear the timeout so we can proceed
			clearTimeout(timeoutHandler);

			if (!response.ok) {
				console.log(response);
				console.log(
					ToFormData({
						grant_type: "refresh_token",
						response_type: "token",
						client_id: authObj.apiKey,
						refresh_token: authObj.refreshToken
					})
				);

				dispatch(
					refreshTokenError({
						error: "server_error",
						networkError: true
					})
				);
				return;
			}

			const data = await response.json();

			if (data.error) {
				dispatch(
					refreshTokenError({
						error: data.error,
						isNetworkError: false
					})
				);
				return;
			}

			if (!data.access_token) {
				dispatch(
					refreshTokenError({
						error: "invalid_token",
						isNetworkError: false
					})
				);
				return;
			}

			const newAuthData = {
				refreshToken: authObj.refreshToken,
				accessToken: data.access_token,
				expiresIn: data.expires_in
			};

			console.log(`Setting new auth data in @authStore:${apiInfo.apiUrl}`);
			console.log(newAuthData);

			await AsyncStorage.setItem(`@authStore:${apiInfo.apiUrl}`, JSON.stringify(newAuthData));

			dispatch(refreshTokenSuccess());
			dispatch(
				receiveAuth({
					...newAuthData,
					isAuthenticated: true
				})
			);
		} catch (err) {
			// If this is true, we've already dispatched an error
			if (timeoutCanceled) {
				return;
			}

			clearTimeout(timeoutHandler);

			dispatch(
				refreshTokenError({
					error: err.message,
					networkError: true
				})
			);
		}
	};
};

// ====================================================================
// Swap token actions

export const SWAP_TOKEN_LOADING = "SWAP_TOKEN_LOADING";
export const swapTokenLoading = data => ({
	type: SWAP_TOKEN_LOADING
});

export const SWAP_TOKEN_ERROR = "SWAP_TOKEN_ERROR";
export const swapTokenError = data => ({
	type: SWAP_TOKEN_ERROR
});

export const SWAP_TOKEN_SUCCESS = "SWAP_TOKEN_SUCCESS";
export const swapTokenSuccess = data => ({
	type: SWAP_TOKEN_SUCCESS
});

export const swapToken = tokenInfo => {
	return async (dispatch, getState) => {
		dispatch(swapTokenLoading());

		const {
			app: {
				currentCommunity: { apiUrl, apiKey },
				client
			}
		} = getState();

		try {
			const response = await fetch(`${apiUrl}/oauth/token/index.php`, {
				method: "post",
				headers: {
					"Content-Type": "multipart/form-data"
				},
				body: ToFormData({
					client_id: apiKey,
					grant_type: "authorization_code",
					code: tokenInfo.token,
					redirect_uri: tokenInfo.redirect_uri
				})
			});

			if (!response.ok) {
				dispatch(
					swapTokenError({
						isNetworkError: true
					})
				);
				return;
			}

			const data = await response.json();

			if (data.error) {
				dispatch(
					swapTokenError({
						error: data.error,
						isNetworkError: false
					})
				);
				return;
			}

			const authData = {
				accessToken: data.access_token,
				expiresIn: data.expires_in,
				refreshToken: data.refresh_token
			};

			client.resetStore();
			await AsyncStorage.setItem(`@authStore:${apiUrl}`, JSON.stringify(authData));

			dispatch(swapTokenSuccess());
			dispatch(
				receiveAuth({
					...authData,
					isAuthenticated: true
				})
			);
		} catch (err) {
			console.log(err);
			dispatch(
				swapTokenError({
					isNetworkError: false
				})
			);
			return;
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
export const logOut = () => {
	return async (dispatch, getState) => {
		const {
			app: {
				client,
				currentCommunity: { apiKey, apiUrl }
			}
		} = getState();

		client.resetStore();
		await AsyncStorage.removeItem(`@authStore:${apiUrl}`);
		dispatch(removeAuth());
	};
};
