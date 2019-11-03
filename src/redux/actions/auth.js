import { Linking } from "expo";
import * as Permissions from "expo-permissions";
import * as WebBrowser from "expo-web-browser";
import * as SecureStore from "expo-secure-store";
import apolloLogger from "apollo-link-logger";
import { ApolloClient } from "apollo-client";
import { HttpLink, createHttpLink } from "apollo-link-http";
import { ApolloLink } from "apollo-link";
import { onError } from "apollo-link-error";
import { InMemoryCache } from "apollo-cache-inmemory";
import { IntrospectionFragmentMatcher } from "apollo-cache-inmemory";
import _ from "underscore";

import ToFormData from "../../utils/ToFormData";
import getUserAgent from "../../utils/getUserAgent";
import introspectionQueryResultData from "../../fragmentTypes.json";

// ====================================================================
// General auth actions

export const REMOVE_AUTH = "REMOVE_AUTH";
export const removeAuth = data => {
	return (dispatch, getState) => {
		const {
			app: {
				currentCommunity: { apiUrl, apiKey }
			}
		} = getState();

		dispatch({
			type: REMOVE_AUTH,
			payload: {
				client: getNewClient({
					apiUrl,
					apiKey,
					accessToken: null
				})
			}
		});
	};
};

// ====================================================================
// Refresh token actions

export const REFRESH_TOKEN_LOADING = "REFRESH_TOKEN_LOADING";
export const refreshTokenLoading = data => ({
	type: REFRESH_TOKEN_LOADING
});

export const REFRESH_TOKEN_SUCCESS = "REFRESH_TOKEN_SUCCESS";
export const refreshTokenSuccess = data => {
	return (dispatch, getState) => {
		const {
			app: {
				currentCommunity: { apiUrl, apiKey }
			}
		} = getState();

		const { refreshToken, expiresIn, accessToken } = data;
		dispatch({
			type: REFRESH_TOKEN_SUCCESS,
			payload: {
				refreshToken,
				expiresIn,
				accessToken,
				client: getNewClient({
					apiUrl,
					apiKey,
					accessToken
				})
			}
		});
	};
};

export const REFRESH_TOKEN_ERROR = "REFRESH_TOKEN_ERROR";
export const refreshTokenError = data => {
	const { error, isNetworkError, apiUrl, apiKey } = data;
	return {
		type: REFRESH_TOKEN_ERROR,
		payload: {
			error,
			isNetworkError,
			client: getNewClient({
				apiUrl,
				apiKey,
				accessToken: null
			})
		}
	};
};

var timeoutHandler;
var timeoutCanceled = false;

export const refreshToken = apiInfo => {
	return async dispatch => {
		dispatch(refreshTokenLoading());

		const { apiUrl, apiKey } = apiInfo;
		const authStore = await SecureStore.getItemAsync(`authStore`);
		let allAuthData = {};
		let authData = {};

		console.log(`REFRESH_TOKEN: Url: ${apiUrl}    Token: ${apiKey}`);

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
				dispatch(
					refreshTokenError({
						error: "empty_storage",
						isNetworkError: false,
						apiUrl,
						apiKey
					})
				);
				return;
			}
		} else {
			dispatch(
				refreshTokenError({
					error: "empty_storage",
					isNetworkError: false,
					apiUrl,
					apiKey
				})
			);
			return;
		}

		// Do we have a refresh token stored for this site?
		if (_.isUndefined(authData.refreshToken) || _.isUndefined(authData.tokenFetched)) {
			dispatch(
				refreshTokenError({
					error: "empty_storage",
					isNetworkError: false,
					apiUrl,
					apiKey
				})
			);
			return;
		}

		// Do we actually need to run the request?
		const tokenMinAge = Math.floor(Date.now() / 1000) - Expo.Constants.manifest.extra.refresh_token_advance;

		if (authData.tokenFetched > tokenMinAge && !apiInfo.forceRefresh) {
			console.log(`REFRESH_TOKEN: Dispatching success immediately...`);
			dispatch(
				refreshTokenSuccess({
					...authData
				})
			);
			return;
		}

		console.log(`REFRESH_TOKEN: Token expiring soon, refreshing with server...`);

		// Do the request
		try {
			// Set a timeout so we can show an error if we can't connect

			timeoutHandler = setTimeout(() => {
				timeoutCanceled = true;
				dispatch(
					refreshTokenError({
						error: "timeout",
						isNetworkError: true,
						apiUrl,
						apiKey
					})
				);
			}, 5000);

			// Now do the request
			if (_.isUndefined(authData)) {
				dispatch(
					refreshTokenError({
						error: "no_token",
						isNetworkError: false,
						apiUrl,
						apiKey
					})
				);
				return;
			}

			const response = await fetch(`${apiUrl}/oauth/token/index.php`, {
				method: "post",
				headers: {
					"Content-Type": "multipart/form-data",
					"User-Agent": getUserAgent()
				},
				body: ToFormData({
					grant_type: "refresh_token",
					response_type: "token",
					client_id: apiKey,
					refresh_token: authData.refreshToken
				})
			});

			if (timeoutCanceled) {
				return;
			}

			// Now clear the timeout so we can proceed
			clearTimeout(timeoutHandler);

			// Handle response error
			if (!response.ok) {
				console.log("REFRESH_TOKEN: Request failed:");
				console.log(response);

				dispatch(
					refreshTokenError({
						error: "server_error",
						isNetworkError: true,
						apiUrl,
						apiKey
					})
				);
				return;
			}

			const data = await response.json();

			// Handle server error
			if (data.error) {
				dispatch(
					refreshTokenError({
						error: data.error,
						isNetworkError: false,
						apiUrl,
						apiKey
					})
				);
				return;
			}

			if (!data.access_token) {
				dispatch(
					refreshTokenError({
						error: "invalid_token",
						isNetworkError: false,
						apiUrl,
						apiKey
					})
				);
				return;
			}

			const newAuthData = {
				refreshToken: authData.refreshToken,
				accessToken: data.access_token,
				expiresIn: data.expires_in,
				tokenFetched: Math.floor(Date.now() / 1000)
			};

			// Ensure state is kept if it exists
			if (authData.state) {
				newAuthData.state = authData.state;
			}

			allAuthData[apiUrl] = newAuthData;

			console.log(`REFRESH_TOKEN: Setting new auth data in authStore for ${apiUrl}`);
			await SecureStore.setItemAsync(`authStore`, JSON.stringify(allAuthData));

			dispatch(
				refreshTokenSuccess({
					...newAuthData
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
					isNetworkError: true,
					apiUrl,
					apiKey
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
export const swapTokenError = data => {
	return (dispatch, getState) => {
		const {
			app: {
				currentCommunity: { apiUrl, apiKey }
			}
		} = getState();

		dispatch({
			type: SWAP_TOKEN_ERROR,
			payload: {
				...data,
				client: getNewClient({
					apiUrl,
					apiKey,
					accessToken: null
				})
			}
		});
	};
};

export const SWAP_TOKEN_SUCCESS = "SWAP_TOKEN_SUCCESS";
export const swapTokenSuccess = data => {
	return (dispatch, getState) => {
		const {
			app: {
				currentCommunity: { apiUrl, apiKey }
			}
		} = getState();
		const { refreshToken, expiresIn, accessToken } = data;

		dispatch({
			type: SWAP_TOKEN_SUCCESS,
			payload: {
				refreshToken,
				expiresIn,
				accessToken,
				client: getNewClient({
					apiUrl,
					apiKey,
					accessToken
				})
			}
		});
	};
};

export const swapToken = tokenInfo => {
	return async (dispatch, getState) => {
		dispatch(swapTokenLoading());

		const {
			app: {
				currentCommunity: { apiUrl, apiKey }
			},
			auth: { client }
		} = getState();

		console.log("SWAP_TOKEN: Starting swap token process");

		const authStore = await SecureStore.getItemAsync(`authStore`);
		let allAuthData = {};
		let authData = {};

		// Try and get this site's data from the store
		if (authStore !== null) {
			try {
				allAuthData = JSON.parse(authStore);
			} catch (err) {
				console.log("SWAP_TOKEN: No existing auth store");
			}
		}

		try {
			const response = await fetch(`${apiUrl}/oauth/token/index.php`, {
				method: "post",
				headers: {
					"Content-Type": "multipart/form-data",
					"User-Agent": getUserAgent()
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

			client.clearStore();
			await SecureStore.setItemAsync(`authStore`, JSON.stringify(allAuthData));

			console.log("SWAP_TOKEN: swapping done.");

			dispatch(
				swapTokenSuccess({
					...authData
				})
			);
		} catch (err) {
			console.log(`SWAP_TOKEN: Token exchange failed: ${err}`);
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

		console.log(`LAUNCH_AUTH: State string set to ${stateString}`);

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
				console.log("LAUNCH_AUTH: No existing auth store");
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
			console.log("LAUNCH_AUTH: Couldn't save updated authStore");
		}

		console.log(`LAUNCH_AUTH: Url ${urlToOpen}${urlQuery.join("&")}`);
		console.log(`LAUNCH_AUTH: schemeUrl: ${schemeUrl}`);

		// Launch Expo's webbrowser authentication flow which will handle receiving the redirect for us
		WebBrowser.openAuthSessionAsync(`${urlToOpen}${urlQuery.join("&")}`, schemeUrl).then(resolved => {
			if (resolved.type !== "success") {
				console.log("LAUNCH_AUTH: Browser closed without authenticating");
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

import asyncCache from "../../utils/asyncCache";

/**
 * Attempt to authenticate the user using given username, password
 *
 * @param 	string 	username
 * @param 	string 	password
 * @param 	object 	apolloClient 	Instance of ApolloClient, so we can reset the store
 */
export const logOut = (requireReauth = true) => {
	return async (dispatch, getState) => {
		const {
			app: {
				currentCommunity: { apiKey, apiUrl }
			},
			auth: {
				authData: { accessToken },
				client: client
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
				console.log("LOGOUT: No existing auth store");
			}
		}

		// If we require reauth, then set a flag in our site object to force a true login next time
		if (requireReauth) {
			allAuthData[apiUrl] = {
				loggedOut: true
			};
		}

		// Clear cache for this site
		console.log("LOGOUT: Removing cache...");
		asyncCache.removeScope(apiUrl);

		console.log("LOGOUT: Resetting store...");
		client.clearStore();
		console.log("LOGOUT: Store reset.");

		await SecureStore.setItemAsync(`authStore`, JSON.stringify(allAuthData));
		dispatch(removeAuth());
	};
};

import configureStore from "../configureStore";
const getNewClient = connectData => {
	// In order for Apollo to use fragments with union types, as we do for generic core_Content
	// queries, we need to pass it the schema definition in advance.
	// See https://www.apollographql.com/docs/react/advanced/fragments.html#fragment-matcher
	const fragmentMatcher = new IntrospectionFragmentMatcher({
		introspectionQueryResultData
	});

	const accessToken = connectData.accessToken;
	const apiKey = connectData.apiKey;
	const thisInstance = _.uniqueId();

	console.log(`CLIENT (${thisInstance}): When getting client instance, accessToken is ${accessToken}`);

	// Apollo config & setup
	const authLink = new ApolloLink((operation, next) => {
		operation.setContext(context => {
			console.log(`CLIENT (${thisInstance}): Making ${accessToken ? "AUTHENTICATED" : "unauthenticated"} request`);
			return {
				...context,
				credentials: "same-origin",
				headers: {
					...context.headers,
					Authorization: accessToken ? `Bearer ${accessToken}` : `Basic ${Buffer.from(apiKey + ":").toString("base64")}:`,
					"User-Agent": getUserAgent()
				}
			};
		});
		return next(operation);
	});

	const errorsToUnauth = ["INVALID_ACCESS_TOKEN", "INVALID_API_KEY", "TOO_MANY_REQUESTS_WITH_BAD_KEY"];
	const errorLink = onError(errors => {
		const { graphQLErrors, networkError } = errors;
		if (graphQLErrors) {
			for (let i = 0; i < graphQLErrors.length; i++) {
				const error = graphQLErrors[i];

				if (errorsToUnauth.indexOf(error.message) !== -1) {
					console.log(`CLIENT ERROR (${thisInstance}): Got error: ${error.message} (${!_.isUndefined(error.path) ? error.path.join(" -> ") : "no path"})`);

					const store = configureStore();
					store.dispatch(removeAuth());
					return;
				}
			}
		}

		if (networkError) {
			try {
				const parsedError = JSON.parse(networkError);
				console.log("[Network error]:");
				console.log(parsedError);
			} catch (err) {
				console.log(`[Network error] (${thisInstance}): ${networkError}`);
			}
		}
	});

	const httpLink = createHttpLink({
		uri: `${connectData.apiUrl}/api/graphql/`,
		fetch: customFetch
	});

	const link = ApolloLink.from([
		//apolloLogger,
		authLink,
		errorLink,
		httpLink
	]);

	const client = new ApolloClient({
		link: link,
		cache: new InMemoryCache({ fragmentMatcher })
	});

	return client;
};

const customFetch = (uri, options) => {
	if (options.useUpload) {
		return uploadFetch(uri, options);
	}
	return fetch(uri, options);
};

// See https://github.com/jaydenseric/apollo-upload-client/issues/88#issuecomment-468318261
const uploadFetch = (url, options) => {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();

		xhr.onload = () => {
			const opts = {
				status: xhr.status,
				statusText: xhr.statusText,
				headers: parseHeaders(xhr.getAllResponseHeaders() || "")
			};

			opts.url = "responseURL" in xhr ? xhr.responseURL : opts.headers.get("X-Request-URL");
			const body = "response" in xhr ? xhr.response : xhr.responseText;
			resolve(new Response(body, opts));
		};

		xhr.onerror = () => {
			reject(new TypeError("Network request failed"));
		};
		xhr.ontimeout = () => {
			reject(new TypeError("Network request failed"));
		};
		xhr.open(options.method, url, true);

		Object.keys(options.headers).forEach(key => {
			xhr.setRequestHeader(key, options.headers[key]);
		});

		if (xhr.upload) {
			xhr.upload.onprogress = options.onProgress;
		}

		if (options.onAbortPossible) {
			options.onAbortPossible(() => {
				xhr.abort();
			});
		}

		xhr.send(options.body);
	});
};

const parseHeaders = rawHeaders => {
	const headers = new Headers();
	const preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, " ");

	preProcessedHeaders.split(/\r?\n/).forEach(line => {
		const parts = line.split(":");
		const key = parts.shift().trim();
		if (key) {
			const value = parts.join(":").trim();
			headers.append(key, value);
		}
	});

	return headers;
};
