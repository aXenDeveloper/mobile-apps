import React, { Component } from "react";
import { Text, View, Alert, StyleSheet, StatusBar, ActivityIndicator, AsyncStorage } from "react-native";
import { Linking, Permissions, Notifications } from "expo";
import { connect } from "react-redux";
import { ApolloProvider } from "react-apollo";
import { graphql, compose } from "react-apollo";
import _ from "underscore";
import { setApolloClient, bootSite, bootSiteLoading, switchAppView, setActiveCommunity, resetActiveCommunity, resetBootStatus } from "../../redux/actions/app";
import { refreshToken, logOut, voidAuth } from "../../redux/actions/auth";
import MultiCommunityNavigation from "../../navigation/MultiCommunityNavigation";
import { PromptModal } from "../../ecosystems/PushNotifications";
import CommunityRoot from "./CommunityRoot";
import Button from "../../atoms/Button";
import AppLoading from "../../atoms/AppLoading";
import NavigationService from "../../utils/NavigationService";
import getUserAgent from "../../utils/getUserAgent";

class AppRoot extends Component {
	constructor(props) {
		super(props);

		this._isSingleApp = !Expo.Constants.manifest.extra.multi;
		this._notificationSubscription = null;
		this._alerts = {
			offline: false
		};

		this.state = {
			waitingForClient: this._isSingleApp,
			showNotificationPrompt: false
		};

		this.handleOpenUrl = this.handleOpenUrl.bind(this);
		this.closeNotificationPrompt = this.closeNotificationPrompt.bind(this);
		this.handleNotification = this.handleNotification.bind(this);

		Linking.addEventListener("url", this.handleOpenUrl);
	}

	/**
	 * Mount. If we're in a single-app environment, immediately switch to the
	 * community.
	 *
	 * @return 	void
	 */
	async componentDidMount() {
		// Push notification stuff
		this.maybeDoNotificationPrompt();
		this._notificationSubscription = Notifications.addListener(this.handleNotification);

		// If we're running in single-site mode
		if (this._isSingleApp) {
			this.props.dispatch(
				setActiveCommunity({
					apiUrl: Expo.Constants.manifest.extra.api_url,
					apiKey: Expo.Constants.manifest.extra.oauth_client_id
				})
			);
		}

		const initialUrl = await Linking.getInitialURL();
		this.checkUrlForAuth(initialUrl);
	}

	handleNotification(notification) {
		console.log(`APP_ROOT: Received notification data: ${notification}`);

		if (notification.origin == "received") {
			Alert.alert("In-app notification!", "App was foregrounded", [{ text: "OK", onPress: () => console.log("OK Pressed") }], { cancelable: false });
		} else {
			Alert.alert("Selected notification", "Fringilla Malesuada Ultricies Dapibus", [{ text: "OK", onPress: () => console.log("OK Pressed") }], {
				cancelable: false
			});
		}
	}

	/**
	 * Unmount; clear up our timer.
	 *
	 * @return 	void
	 */
	componentWillUnmount() {
		clearTimeout(this._notificationPromptTimeout);
	}

	/**
	 * Handles incoming URLs. If it's an authentication url (e.g. post-registering), then
	 * process it.
	 *
	 * @param 	string 		url 	The incoming URL
	 * @return 	void
	 */
	checkUrlForAuth(url) {
		console.log(`APP_ROOT: Initial URL: ${url}`);

		let { path, queryParams } = Linking.parse(url);

		if (_.isUndefined(path) || path !== "auth") {
			return;
		}

		if (!_.isUndefined(queryParams["state"])) {
			// @todo handle incoming validation
			//dispatch(incomingValidation(queryParams));
		}

		// Do we have an authentication token to process?
	}

	/**
	 * Event handling for the 'url' event, passes url to `this.checkUrlForAuth`
	 *
	 * @param 	{url: string} 		url 		The incoming URL
	 * @return 	void
	 */
	handleOpenUrl({ url }) {
		this.checkUrlForAuth(url);
	}

	/**
	 * If necessary, show the notification prompt
	 *
	 * @param 	{url: string} 		url 		The incoming URL
	 * @return 	void
	 */
	async maybeDoNotificationPrompt() {
		// We only need to prompt for this on iOS - android handles notifications
		// on app install.
		if (!Expo.Constants.platform.ios) {
			return;
		}

		// Have we already been granted permission?
		const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
		console.log(`APP_ROOT: Notification status: ${status}`);

		if (status == "granted") {
			return;
		}

		// Only show the prompt if there's no previous prompt data, or there is and the status is 'later'.
		// We can't show the prompt again if the user previously choose 'enable', even if they didn't actually
		// enable them when asked.
		try {
			const promptData = await AsyncStorage.getItem("@notificationPrompt");
			const promptJson = promptData !== null ? JSON.parse(promptData) : null;

			console.log(`APP_ROOT: Notification prompt JSON:`);
			console.log(promptJson);

			if (promptData === null || (promptJson.status == "later" && promptJson.timestamp < Math.floor(Date.now() / 1000) - 604800)) {
				this._notificationPromptTimeout = setTimeout(() => {
					this.setState({
						showNotificationPrompt: true
					});
				}, 3000);
			}
		} catch (err) {
			console.log(`APP_ROOT: Failed to show notification prompt: ${err}`);
		}
	}

	/**
	 * Component update. Handes booting a new community if the URL has changed, and switching
	 * view if we're in the multi-community environment
	 *
	 * @param 	object 		prevProps 		Previous prop values
	 * @return
	 */
	async componentDidUpdate(prevProps) {
		const { dispatch } = this.props;
		const { apiKey, apiUrl } = this.props.app.currentCommunity;
		const prevApiUrl = prevProps.app.currentCommunity.apiUrl;

		// If we have a new API url in our store, authorize and boot that community
		if (prevApiUrl !== apiUrl && apiUrl !== null) {
			//await dispatch(setApolloClient({ client: this.getClient() }));
			await dispatch(refreshToken({ apiKey, apiUrl }));
			console.log("About to run bootsite:");
			await dispatch(bootSite({ apiKey, apiUrl }));

			NavigationService.setBaseUrl(this.props.site.settings.base_url);

			if (this._isSingleApp) {
				this.setState({
					waitingForClient: false
				});
			}
		}

		// If our authenticated state has changed, we need to get a new client and reboot the community
		// We only want to do this if we're still using the same community URL
		if (prevApiUrl === apiUrl && prevProps.auth.isAuthenticated !== this.props.auth.isAuthenticated) {
			//console.log("APP_ROOT: Getting new client instance...");
			//await dispatch(setApolloClient({ client: this.getClient() }));
			console.log("APP_ROOT: Rebooting site after authentication change.");
			await dispatch(bootSite({ apiKey, apiUrl }));
		}

		// --------------------------------------------------------------------
		// Multi-community stuff

		if (!this._isSingleApp) {
			// If we were booting a community and that's finished, switch to our community
			if ((!prevProps.app.bootStatus.loaded && this.props.app.bootStatus.loaded) || (!prevProps.app.bootStatus.error && this.props.app.bootStatus.error)) {
				this.multiCommunityCheckStatusAndRedirect();
			}

			// If we've switched back to the multi community, reset stuff
			if (prevProps.app.view !== "multi" && this.props.app.view === "multi") {
				this.props.dispatch(
					setActiveCommunity({
						apiKey: null,
						apiUrl: null
					})
				);
				this.props.dispatch(resetBootStatus());
			}
		}
	}

	/**
	 * Called once a community has loaded; checks whether we're actually able to access it,
	 * and shows an alert if need be. If all is well, redirect to the community screen.
	 *
	 * @return 	void
	 */
	multiCommunityCheckStatusAndRedirect() {
		const { apiUrl, apiKey } = this.props.app.currentCommunity;

		// Did we have an error loading this community?
		if (this.props.app.bootStatus.error) {
			this.multiCommunityShowAlert(
				"error",
				{ title: "Error", body: `Sorry, there was a problem loading ${this.props.site.settings.board_name}.` },
				"Try Again",
				() => {
					this.props.dispatch(resetBootStatus());
					this.props.dispatch(resetActiveCommunity());
					this.props.dispatch(
						setActiveCommunity({
							apiKey,
							apiUrl
						})
					);
				},
				true
			);
			return;
		}

		// If we can't access this community, we might either be banned or need to log in to see it
		if (!this.props.user.group.canAccessSite) {
			if (this.props.user.group.groupType !== "GUEST") {
				this.multiCommunityShowAlert(
					"banned",
					{
						title: "No Permission",
						body: `Sorry, you do not have permission to access ${this.props.site.settings.board_name}.`
					},
					"OK",
					() => {
						this.props.dispatch(resetBootStatus());
						this.props.dispatch(resetActiveCommunity());
					}
				);
				return;
			} else {
				this.multiCommunityShowAlert(
					"login",
					{
						title: "Sign In Required",
						body: `${this.props.site.settings.board_name} requires you to sign in to view the community.`
					},
					"Sign In",
					() => {
						NavigationService.launchAuth();
					},
					true
				);
				return;
			}
		}

		// If the site is offline, and we don't have permission to access it...
		// @future Right now we don't give them to option to sign in in this situation
		if (!this.props.site.settings.site_online) {
			if (!this.props.user.group.canAccessOffline) {
				this.multiCommunityShowAlert(
					"offline",
					{
						title: "Community Offline",
						body: `${this.props.site.settings.board_name} is currently offline. Please try again later.`
					},
					"OK",
					() => {
						this.props.dispatch(resetBootStatus());
						this.props.dispatch(resetActiveCommunity());
					}
				);
				return;
			}
		}

		this.multiCommunitySwitchToCommunity();
	}

	/**
	 * Show an alert to the user with the specific message
	 *
	 * @param 	string 		type 			The type of message. Used to prevent multiples of the same type appearing at once.
	 * @param 	object 		message 		Object containing `title`: title of the alert, and `body`: message to show in it
	 * @param 	boolean 	enabledButtons	Pass a button config object. Merged with defaults.
	 * @return 	void
	 */
	multiCommunityShowAlert(type, message, primaryText = "OK", primaryAction = () => {}, showCancel = false) {
		// If the alert is already showing, don't show it again.
		if (!_.isUndefined(this._alerts[type]) && this._alerts[type] === true) {
			return;
		}

		this._alerts[type] = true;

		const buttons = [];

		// Cancel goes first since it should be on the left
		if (showCancel) {
			buttons.push({
				text: "Cancel",
				style: "cancel",
				onPress: () => {
					this._alerts[type] = false;
					this.props.dispatch(resetBootStatus());
					this.props.dispatch(resetActiveCommunity());
				}
			});
		}

		buttons.push({
			text: primaryText,
			style: "default",
			onPress: () => {
				primaryAction();
				this._alerts[type] = false;
			}
		});

		Alert.alert(message.title, message.body, buttons, {
			cancelable: false
		});
	}

	/**
	 * Switch the app status to show the community screen
	 *
	 * @return 	void
	 */
	multiCommunitySwitchToCommunity() {
		this.props.dispatch(
			switchAppView({
				view: "community"
			})
		);
	}

	/**
	 * Close the prompt for notifications
	 *
	 * @return 	void
	 */
	closeNotificationPrompt() {
		this.setState({
			showNotificationPrompt: false
		});
	}

	render() {
		if (this.state.waitingForClient) {
			return <AppLoading loading />;
		}

		let ScreenToRender = CommunityRoot;

		if (Expo.Constants.manifest.extra.multi) {
			if (this.props.app.view === "multi") {
				ScreenToRender = MultiCommunityNavigation;
			}
		}

		return (
			<View style={{ flex: 1 }}>
				<ScreenToRender />
				<PromptModal isVisible={this.state.showNotificationPrompt} close={this.closeNotificationPrompt} />
			</View>
		);
	}
}

export default connect(state => ({
	auth: state.auth,
	app: state.app,
	site: state.site,
	user: state.user
}))(AppRoot);
