import { WebBrowser, Linking } from "expo";
import { NavigationActions } from "react-navigation";
import _ from "underscore";
import isURL from "validator/lib/isURL";
import queryString from "query-string";

import configureStore from "../redux/configureStore";
import supported from "../supportedTypes";
import { resetModalWebview } from "../redux/actions/app";
import { swapToken } from "../redux/actions/auth";

const store = configureStore();

class NavigationService {
	construct() {
		this._navigator = null;
	}

	/**
	 * Allows us to pass our navigatior component into this class
	 *
	 * @param 	object 		navigatorRef 		Reference to top-level navigator component
	 * @return 	void
	 */
	setTopLevelNavigator(navigatorRef) {
		this._navigator = navigatorRef;
	}

	/**
	 * Allows us to pass our community's base url
	 *
	 * @param 	string 		baseUrl 		Base URL for this community
	 * @return 	void
	 */
	setBaseUrl(baseUrl) {
		this._baseUrl = baseUrl;
		this._parsedBaseUrl = parseUri(this._baseUrl);
	}

	/**
	 * Launch an authorization webview
	 *
	 * @return 	void
	 */
	async launchAuth() {
		const {
			app: {
				currentCommunity: { apiUrl, apiKey }
			}
		} = store.getState();

		if (apiUrl) {
			let urlToOpen = `${apiUrl}oauth/authorize/?`;
			const urlQuery = [];
			const urlParams = {};

			urlParams["client_id"] = apiKey;
			urlParams["response_type"] = "code";
			urlParams["state"] = Expo.Constants.sessionId;
			urlParams["redirect_uri"] = this.getSchemeUrl("auth");

			console.log(`THIS URL NEEDS TO BE WHITELISTED: ${urlParams["redirect_uri"]}`);

			for (let param in urlParams) {
				urlQuery.push(`${param}=${encodeURIComponent(urlParams[param])}`);
			}

			WebBrowser.openAuthSessionAsync(`${urlToOpen}${urlQuery.join("&")}`, this.getSchemeUrl("auth")).then(resolved => {
				if (resolved.type !== "success") {
					console.log("Browser closed without authenticating");
					// The user either closed the browser or denied oauth, so no need to do anything.
					return;
				}

				if (resolved.error) {
					store.dispatch(
						logInError({
							error: resolved.error
						})
					);
					return;
				}

				const parsed = Linking.parse(resolved.url);
				console.log(parsed);

				// Check our state param to make sure it matches what we expect - mismatch could indicate tampering
				if (_.isUndefined(parsed.queryParams.state) || parsed.queryParams.state !== Expo.Constants.sessionId) {
					store.dispatch(
						logInError({
							error: "state_mismatch"
						})
					);
					return;
				}

				console.log(`code: ${parsed.queryParams.code}`);

				store.dispatch(
					swapToken({
						token: parsed.queryParams.code,
						redirect_uri: this.getSchemeUrl("auth")
					})
				);
			});
		}
	}

	getSchemeUrl(path, params = {}) {
		return Linking.makeUrl(`/${path}`, params);
	}

	/**
	 * Generic method to trigger navigatation within the app.
	 * By default, will determine whether the provided URL/route components are supported by the app and
	 * navigate to the appropriate screen, or show a WebBrowser/WebView if not. Behavior can be overriden by
	 * the options object.
	 *
	 * @param 	string|object 		url 		A string url, or an object containing route components (app/module/controller) or a 'full' key
	 * @param 	object				params 		Params to be passed into loaded screen
	 * @param 	object 				options 	Options to configure behavior of this method. {
	 *		forceBrowser: bypass app screens and show in browser,
	 *		forceInteral: if shown in browser, show in 'internal' webview so it appears seamless
	 * }
	 * @return 	void
	 */
	navigate(url, params = {}, options = { forceBrowser: false, forceInternal: false }) {
		if (_.isObject(url) && !options.forceBrowser) {
			// If we have app/controller/module
			if (!_.isUndefined(url.app) && !_.isUndefined(url.module) && !_.isUndefined(url.controller)) {
				const routeName = this.getScreenFromUrlComponents(url.app, url.module, url.controller);

				if (routeName) {
					return this.navigateToScreen(routeName, params, options.key || null);
				}
			}
		}

		// If we're still here, make sure we have a correct URL
		if (_.isObject(url)) {
			// We might have 'url' or 'full' keys we can use
			if (!_.isUndefined(url.url)) {
				url = url.url;
			} else if (!_.isUndefined(url.full)) {
				url = url.full;
			} else {
				url = url.toString();
			}
		}

		// If we're still here, we don't have a screen to show for this URL, so we'll either
		// open it in an external browser or in a webview screen
		if (this.isInternalUrl(url) || options.forceInternal) {
			const urlToCheck = url.replace(this._baseUrl, "");

			// Loop through each url pattern we have and see if any match
			for (let i = 0; i < supported.urls.length; i++) {
				const urlType = supported.urls[i];

				if (urlType.test.test(urlToCheck)) {
					// URL matches, so feed it into .match to get the screen and params, if any
					const result = urlType.matchCallback(urlToCheck.match(urlType.test));

					if (result) {
						return this.navigateToScreen(result.routeName, Object.assign({}, params, result.params));
					}
				}
			}

			// If we make it here, load in our webview screen
			this.navigateToScreen("WebView", {
				...params,
				url
			});
		} else {
			this.openInBrowser(url);
		}
	}

	/**
	 * Determine whether the provided url is part of the app owner's site
	 *
	 * @param 	string 		url 	URL to check
	 * @return 	boolean
	 */
	isInternalUrl(url) {
		if (!this.isValidUrl(url)) {
			return false;
		}

		const thisUrl = parseUri(url);
		return thisUrl.host === this._parsedBaseUrl.host && thisUrl.path.startsWith(this._parsedBaseUrl.path);
	}

	/**
	 * Determine whether the provided string is a valid URL
	 *
	 * @param 	string 		url 	URL to check
	 * @return 	boolean
	 */
	isValidUrl(url) {
		return isURL(url);
	}

	/**
	 * Given app/module/controller components, returns the app screen that can be navigated to to show the content
	 *
	 * @param 	string 		app 		The app name
	 * @param 	string		module 		The module name
	 * @param 	string 		controller	The controller name
	 * @return 	string|boolean		Route name if available, false otherwise
	 */
	getScreenFromUrlComponents(app, module, controller) {
		let currentPiece = supported.appComponents;
		let renderComponent = false;
		let url = [app, module, controller];

		for (let i = 0; i < url.length; i++) {
			if (!_.isUndefined(currentPiece[url[i]]) && currentPiece[url[i]] !== false) {
				if (_.isObject(currentPiece[url[i]])) {
					currentPiece = currentPiece[url[i]];
					continue;
				} else {
					renderComponent = currentPiece[url[i]];
					break;
				}
			}
			return false;
		}

		return renderComponent;
	}

	/**
	 * Construct a local URL
	 *
	 * @param 	string 		routeName 		The screen name to navigate to
	 * @param 	object		params 			Params to pass into the screen
	 * @param 	string 		key 			A unique key, needed in case we're navigating to the same screen but e.g. with a different id. Auto-generated if not provided.
	 * @return 	void
	 */
	constructInternalUrl(params = {}) {
		const additionalParams = _.pairs(params).map(paramSet => `${paramSet[0]}=${encodeURIComponent(paramSet[1])}`);

		let outURL = `${this._baseURL}index.php?_webview=true&`;

		if (additionalParams.length) {
			outURL += additionalParams.join("&");
		}

		return outURL;
	}

	/**
	 * Navigate to the provided route (screen) name
	 *
	 * @param 	string 		routeName 		The screen name to navigate to
	 * @param 	object		params 			Params to pass into the screen
	 * @param 	string 		key 			A unique key, needed in case we're navigating to the same screen but e.g. with a different id. Auto-generated if not provided.
	 * @return 	void
	 */
	navigateToScreen(routeName, params = {}, key = null) {
		if (!key) {
			key = `${routeName}-${Math.floor(Math.random() * 100000)}`;
		}

		this._navigator.dispatch(
			NavigationActions.navigate({
				routeName,
				params,
				key
			})
		);
	}

	/**
	 * Open the provided url in the external WebBrowser. Does not check for internal/external url.
	 *
	 * @param 	string 		url 		URL to open
	 * @return 	Promise
	 */
	async openInBrowser(url) {
		let result = await WebBrowser.openBrowserAsync(url);
	}
}

let navigationService = new NavigationService();
export default navigationService;

// https://gist.github.com/dperini/729294
/*const urlRegex = new RegExp("([a-z]([a-z]|\d|\+|-|\.)*):(\/\/(((([a-z]|\d|-|\.|_|~|[\x00A0-\xD7FF\xF900-\xFDCF\xFDF0-\xFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?((\[(|(v[\da-f]{1,}\.(([a-z]|\d|-|\.|_|~)|[!\$&'\(\)\*\+,;=]|:)+))\])|((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(([a-z]|\d|-|\.|_|~|[\x00A0-\xD7FF\xF900-\xFDCF\xFDF0-\xFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=])*)(:\d*)?)(\/(([a-z]|\d|-|\.|_|~|[\x00A0-\xD7FF\xF900-\xFDCF\xFDF0-\xFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*|(\/((([a-z]|\d|-|\.|_|~|[\x00A0-\xD7FF\xF900-\xFDCF\xFDF0-\xFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\x00A0-\xD7FF\xF900-\xFDCF\xFDF0-\xFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)|((([a-z]|\d|-|\.|_|~|[\x00A0-\xD7FF\xF900-\xFDCF\xFDF0-\xFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\x00A0-\xD7FF\xF900-\xFDCF\xFDF0-\xFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)|((([a-z]|\d|-|\.|_|~|[\x00A0-\xD7FF\xF900-\xFDCF\xFDF0-\xFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)){0})(\?((([a-z]|\d|-|\.|_|~|[\x00A0-\xD7FF\xF900-\xFDCF\xFDF0-\xFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\xE000-\xF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\x00A0-\xD7FF\xF900-\xFDCF\xFDF0-\xFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?", "i");*/

// parseUri 1.2.2
// (c) Steven Levithan <stevenlevithan.com>
// MIT License
function parseUri(str) {
	var o = parseUriOptions,
		m = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
		uri = {},
		i = 14;

	while (i--) uri[o.key[i]] = m[i] || "";

	uri[o.q.name] = {};
	uri[o.key[12]].replace(o.q.parser, function($0, $1, $2) {
		if ($1) uri[o.q.name][$1] = $2;
	});

	return uri;
}

const parseUriOptions = {
	strictMode: false,
	key: ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
	q: {
		name: "queryKey",
		parser: /(?:^|&)([^&=]*)=?([^&]*)/g
	},
	parser: {
		strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
		loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
	}
};
