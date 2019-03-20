import { SecureStore, Linking, WebBrowser } from "expo";
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

		const authData = await SecureStore.getItemAsync(`authStore_${getSiteIdentifier(apiInfo.apiUrl)}`);

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

			console.log(`Setting new auth data in authStore_${getSiteIdentifier(apiInfo.apiUrl)}`);
			console.log(newAuthData);

			await SecureStore.setItemAsync(`authStore_${getSiteIdentifier(apiInfo.apiUrl)}`, JSON.stringify(newAuthData));

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
	type: SWAP_TOKEN_ERROR,
	payload: {
		...data
	}
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

		const authStore = await SecureStore.getItemAsync(`authStore`);
		let allAuthData = {};
		let authData = {};

		// Try and get this site's data from the store
		if (authStore !== null) {
			try {
				allAuthData = JSON.parse(authStore);
			} catch (err) {
				console.log("No existing auth store");
			}
		}

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

			allAuthData[apiUrl] = authData;

			client.resetStore();
			await SecureStore.setItemAsync(`authStore`, JSON.stringify(allAuthData));

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

// ====================================================================
// Launch authentication action

import getRandomString from "../../utils/getRandomString";

export const launchAuth = () => {
	return async (dispatch, getState) => {
		const {
			app: {
				currentCommunity: { apiKey, apiUrl }
			}
		} = getState();

		let urlToOpen = `${apiUrl}oauth/authorize/?`;
		const urlQuery = [];
		const urlParams = {};
		const schemeUrl = Linking.makeUrl(`/auth`);
		const stateString = getRandomString();

		// Build basic request params
		urlParams["client_id"] = apiKey;
		urlParams["response_type"] = "code";
		urlParams["state"] = stateString;
		urlParams["redirect_uri"] = schemeUrl;

		console.log(`State string set to ${stateString}`);

		const authStore = await SecureStore.getItemAsync(`authStore`);
		let allAuthData = {};
		let authData = {};

		// Try and get this site's data from the store
		if (authStore !== null) {
			try {
				allAuthData = JSON.parse(authStore);

				if (!_.isUndefined(allAuthData[apiUrl])) {
					authData = allAuthData[apiUrl];
				} else {
					allAuthData[apiUrl] = {};
				}
			} catch (err) {
				console.log("No existing auth store");
			}
		}

		// If we've stored a 'loggedOut' flag for this community, force a login prompt
		if (!_.isUndefined(authData.loggedOut) && authData.loggedOut === true) {
			urlParams["prompt"] = "login";
		}

		// Build our final request URL
		for (let param in urlParams) {
			urlQuery.push(`${param}=${encodeURIComponent(urlParams[param])}`);
		}

		// Update our SecureStore with the state string. We use this to identify the site if the user
		// closes the app and comes back later via a validation link
		try {
			allAuthData[apiUrl]["state"] = stateString;
			await SecureStore.setItemAsync("authStore", JSON.stringify(allAuthData));
		} catch (err) {
			console.log("Couldn't save updated authStore");
		}

		// Launch Expo's webbrowser authentication flow which will handle receiving the redirect for us
		WebBrowser.openAuthSessionAsync(`${urlToOpen}${urlQuery.join("&")}`, schemeUrl).then(resolved => {
			if (resolved.type !== "success") {
				console.log("Browser closed without authenticating");
				// The user either closed the browser or denied oauth, so no need to do anything.
				return;
			}

			if (resolved.error) {
				dispatch(
					logInError({
						error: resolved.error
					})
				);
				return;
			}

			const parsed = Linking.parse(resolved.url);

			// Check our state param to make sure it matches what we expect - mismatch could indicate tampering
			if (_.isUndefined(parsed.queryParams.state) || parsed.queryParams.state !== stateString) {
				dispatch(
					logInError({
						error: "state_mismatch"
					})
				);
				return;
			}

			dispatch(
				swapToken({
					token: parsed.queryParams.code,
					redirect_uri: schemeUrl
				})
			);
		});
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

		const authStore = await SecureStore.getItemAsync(`authStore`);
		let allAuthData = {};
		let authData = {};

		// Try and get this site's data from the store
		if (authStore !== null) {
			try {
				allAuthData = JSON.parse(authStore);

				if (!_.isUndefined(allAuthData[apiUrl])) {
					authData = allAuthData[apiUrl];
				} else {
					allAuthData[apiUrl] = {};
				}
			} catch (err) {
				console.log("No existing auth store");
			}
		}

		allAuthData[apiUrl] = {
			loggedOut: true
		};

		client.resetStore();

		// We don't completely delete the authstore here. Instead, set a flag indicating the
		// user has logged out. We'll use this to force the login screen if they try authenticating
		// again.
		await SecureStore.setItemAsync(`authStore`, JSON.stringify(allAuthData));
		dispatch(removeAuth());
	};
};

/**
 * Utility method that takes an API url and returns a unique, alphanumeric (base64) string
 * SecureStore only allows alphanums as keys, so we use this value to represent the site.
 *
 * @param 	string 	apiUrl 		URL to return identifier for
 * @return	string
 */
const siteIdentifiers = {};
const getSiteIdentifier = apiUrl => {
	if (!_.isUndefined(siteIdentifiers[apiUrl])) {
		return siteIdentifiers[apiUrl];
	}

	// Base 64 the URL, but remove any = because they aren't valid as SecureStore keys
	let base64 = Buffer.from(apiUrl).toString("base64");
	base64 = base64.replace(/\=/g, "");

	siteIdentifiers[apiUrl] = base64;
	return base64;
};
