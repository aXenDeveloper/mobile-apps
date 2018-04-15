import { AsyncStorage } from "react-native";
import configureStore from "../redux/configureStore";
import { connect } from "react-redux";
import { receiveAuth } from "../redux/actions/auth";
import ToFormData from "../utils/ToFormData";

let instance = null;

class Auth {
	constructor(apolloClient, store) {
		if (instance) {
			return instance;
		}

		this._store = configureStore();
		this._expires = 360000;

		return this;
	}

	setClient(client) {
		this._client = client;
	}

	async checkTokenStatus() {
		const authData = await AsyncStorage.getItem("@authStore:auth");

		if (authData == null) {
			throw "no_refresh_token";
		}

		const authObj = JSON.parse(authData);
		return this.doRefreshToken(authObj.refresh_token);
	}

	startTimerToken() {
		// Now set a timeout so that we get a new refresh token before the old one expires
		this._refreshTimer = setTimeout(
			this.checkTokenStatus,
			this._expires - 300000
		);
	}

	/**
	 * Get a refreshed access_token from the server
	 *
	 * @param 	string 	token 	The refresh token to use
	 * @return 	void
	 */
	async doRefreshToken(token) {
		if (!token) {
			throw new Error("no_refresh_token");
		}

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
					refresh_token: token
				})
			}
		);

		const data = await response.json();

		console.log(data);

		// Assume unauthenticated at this point
		let authData = {
			userSession: false
		};

		// If request succeeded, set up data
		if (!data.error && response.ok && data.access_token) {
			authData = {
				refresh_token: token,
				access_token: data.access_token,
				expires_in: data.expires_in,
				userSession: true
			};
		}

		// Todo: refresh tokens not used
		// Todo: error response
		// Todo: no expires value

		// Update storage with new details
		await AsyncStorage.setItem("@authStore:auth", JSON.stringify(authData));
		this._expires = parseInt(data.expires_in) * 1000;
		this._store.dispatch(receiveAuth(authData));

		// Throw error if we hit one
		if ((data.error && data.error === "invalid_grent") || !response.ok) {
			throw new Error("error_logging_in");
		}

		if (!response.ok) {
			throw new Error("server_error");
		}

		console.log(`Refreshed access token: ${data.access_token}`);
	}

	/**
	 * Log in a user with given username/password. Username may be an email address or display name.
	 *
	 * @param 	string 	username 	Username
	 * @param 	string 	password 	Password
	 * @return 	void
	 */
	async logIn(username, password) {
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

		/*// Error generated by IPB
		if(data.error && data.error === 'invalid_grant'){
			throw new Error('error_logging_in');
		}

		// Other server errors
		if( !response.ok ){
			throw new Error('server_error');
		}

		const authData = {
			access_token: data.access_token,
			expires_in: data.expires_in,
			refresh_token: data.refresh_token,
			userSession: true
		};

		await AsyncStorage.setItem('@authStore:auth', JSON.stringify(authData));

		console.log('User has logged in');
			
		// Update store with auth info
		this._store.dispatch( receiveAuth(authData) );

		// Clear out any existing data we might have
		this._client.resetStore();*/
	}

	/**
	 * Log the user out
	 *
	 * @return 	void
	 */
	async logOut() {
		await AsyncStorage.removeItem("@authStore:auth");
		this._store.dispatch(
			receiveAuth({
				userSession: false
			})
		);

		this._client.resetStore();
	}
}

let auth = new Auth();
export default auth;
