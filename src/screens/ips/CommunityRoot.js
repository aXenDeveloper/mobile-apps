import React, { Component } from "react";
import { Text, Alert, View, Image, TouchableHighlight, StyleSheet, ActivityIndicator, AsyncStorage, StatusBar } from "react-native";
import { Permissions, Notifications } from "expo";
import { ApolloProvider } from "react-apollo";
import apolloLogger from "apollo-link-logger";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { ApolloLink } from "apollo-link";
import { onError } from "apollo-link-error";
import { InMemoryCache } from "apollo-cache-inmemory";
import { connect } from "react-redux";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { IntrospectionFragmentMatcher } from "apollo-cache-inmemory";
import _ from "underscore";

import introspectionQueryResultData from "../../fragmentTypes.json";
import AppLoading from "../../atoms/AppLoading";
import NavigationService from "../../utils/NavigationService";
import LoginScreen from "../core/LoginRegister/LoginScreen";
import RichTextContent from "../../ecosystems/RichTextContent";
import Lang from "../../utils/Lang";
import { userLoaded, guestLoaded, setUserStreams, updateNotificationCount } from "../../redux/actions/user";
import { setSiteSettings, setLoginHandlers } from "../../redux/actions/site";
import { bootSite } from "../../redux/actions/app";
import { refreshToken } from "../../redux/actions/auth";
import CommunityNavigation from "../../navigation/CommunityNavigation";
import ToFormData from "../../utils/ToFormData";
import LangFragment from "../../LangFragment";
import { styleVars } from "../../styles";
import icons from "../../icons";

const NOTIFICATION_TIMEOUT = Expo.Constants.manifest.extra.notification_timeout || 30000;

const NotificationQuery = gql`
	query NotificationQuery {
		core {
			me {
				id
				notificationCount
			}
		}
	}
`;

const SessionStartMutation = gql`
	mutation SessionStartMutation($token: String) {
		mutateCore {
			sessionStart(token: $token) {
				id
			}
		}
	}
`;

class CommunityRoot extends Component {
	constructor(props) {
		super(props);

		this.state = {
			bypassOfflineMessage: false
		};
		this._notificationTimeout = null;

		this.tryAfterNetworkError = this.tryAfterNetworkError.bind(this);
		this.bypassOfflineMessage = this.bypassOfflineMessage.bind(this);
		this.launchAuth = this.launchAuth.bind(this);
	}

	/**
	 * Mount point
	 *
	 * @return 	void
	 */
	componentDidMount() {
		if (this.props.auth.isAuthenticated) {
			this.initializeNotificationInterval();
			this.maybeSendPushToken();
		}

		if (this.props.redirect !== null) {
			this.handleRedirectProp();
		}
	}

	/**
	 * Called after component update
	 *
	 * @param 	object 		prevProps 		Old props
	 * @param 	object 		prevState 		Old state
	 * @return 	void
	 */
	componentDidUpdate(prevProps, prevState) {
		// If we're now authenticated, and weren't before, start checking notifications
		if (!prevProps.auth.isAuthenticated && this.props.auth.isAuthenticated) {
			this.initializeNotificationInterval();
			this.maybeSendPushToken();
		}

		// However, if we were authenticated but aren't now, then *stop* notifications
		if (prevProps.auth.isAuthenticated && !this.props.auth.isAuthenticated) {
			this.stopNotificationInterval();
		}

		if (prevProps.redirect !== this.props.redirect && this.props.redirect !== null) {
			this.handleRedirectProp();
		}
	}

	/**
	 * When component unmounts, clear up our intervals
	 *
	 * @return 	void
	 */
	componentWillUnmount() {
		this.stopNotificationInterval();
		clearTimeout(this._redirectTimeout);
	}

	/**
	 * If a `redirect` prop is passed to this component, this method will redirect
	 * the nav to the appropriate screen
	 *
	 * @return 	void
	 */
	handleRedirectProp() {
		const { app, module, controller } = this.props.redirect;
		const params = {};

		["id", "findComment", "findReview"].forEach(param => {
			if (!_.isUndefined(this.props.redirect[param])) {
				params[param] = this.props.redirect[param];
			}
		});

		console.log("In CommunityRoot mount, we'll redirect");
		this._redirectTimeout = setTimeout(() => {
			NavigationService.navigate(
				{
					app,
					module,
					controller
				},
				params
			);
		}, 1000);
	}

	/**
	 * Start checking for notifications
	 *
	 * @return 	void
	 */
	initializeNotificationInterval() {
		this.stopNotificationInterval();
		this._notificationTimeout = setInterval(() => this.runNotificationQuery(), NOTIFICATION_TIMEOUT);
	}

	/**
	 * Stop checking for notifications
	 *
	 * @return 	void
	 */
	stopNotificationInterval() {
		clearInterval(this._notificationTimeout);
	}

	/**
	 * Run a query to check our notification count
	 *
	 * @return 	void
	 */
	async runNotificationQuery() {
		try {
			const { data } = await this.props.auth.client.query({
				query: NotificationQuery,
				fetchPolicy: "network-only"
			});

			console.log(`COMMUNITY_ROOT: Ran notification update, got count ${data.core.me.notificationCount}`);

			if (parseInt(data.core.me.notificationCount) !== parseInt(this.props.user.notificationCount)) {
				this.props.dispatch(updateNotificationCount(data.core.me.notificationCount));
			}
		} catch (err) {
			// If this failed for some reason, stop checking from now on
			console.log(`COMMUNITY_ROOT: Error running notification update: ${err}`);
			this.stopNotificationInterval();
		}
	}

	/**
	 * Sends the user's push token to the community if they're logged in,
	 * and have accepted notifications.
	 *
	 * @return 	void
	 */
	async maybeSendPushToken() {
		if (!this.props.auth.isAuthenticated) {
			return;
		}

		const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
		let token = null;

		// If they haven't granted access then we don't need to do anything here
		if (status === "granted") {
			try {
				token = await Notifications.getExpoPushTokenAsync();
			} catch (err) {}
		}

		// Get the token that uniquely identifies this device
		try {
			console.log(`COMMUNITY_ROOT: Starting session...`);
			const { data } = await this.props.auth.client.mutate({
				mutation: SessionStartMutation,
				variables: {
					token
				}
			});
			console.log(`COMMUNITY_ROOT: Session start sent.`);
		} catch (err) {
			console.log(`COMMUNITY_ROOT: Couldn't send push token: ${err}`);
			return;
		}
	}

	/**
	 * Try loading the community again
	 *
	 * @return 	void
	 */
	async tryAfterNetworkError() {
		const { apiKey, apiUrl } = this.props.app.currentCommunity;
		const { dispatch } = this.props;

		this.setState({
			loading: true
		});

		await dispatch(refreshToken({ apiKey, apiUrl }));
		await dispatch(bootSite({ apiKey, apiUrl }));
	}

	/**
	 * Show the auth browser
	 *
	 * @return 	void
	 */
	launchAuth() {
		NavigationService.launchAuth();
	}

	/**
	 * Bypass the offline message and show community on next render
	 *
	 * @return 	void
	 */
	bypassOfflineMessage() {
		this.setState({
			bypassOfflineMessage: true
		});
	}

	render() {
		let appContent;

		if (this.props.app.bootStatus.loading || this.props.auth.client === null) {
			appContent = <AppLoading loading />;
		} else if (this.props.app.bootStatus.error) {
			appContent = (
				<AppLoading
					icon={icons.OFFLINE}
					title="Network Error"
					message="Sorry, there was a problem loading this community"
					buttonText="Try Again"
					buttonOnPress={this.tryAfterNetworkError}
				/>
			);
		} else if (!this.props.site.settings.site_online && !this.state.bypassOfflineMessage) {
			if (!this.props.user.group.canAccessOffline) {
				// Site is offline and this user cannot access it
				appContent = (
					<AppLoading
						icon={icons.OFFLINE}
						title="Community Unavailable"
						message={
							// Only use this message if there's no offline message - otherwise we'll provide a RichTextContent
							// component a few lines down.
							!Boolean(this.props.site.settings.site_offline_message) &&
							Lang.get("offline", {
								siteName: this.props.site.settings.board_name
							})
						}
						buttonText="Sign In"
						buttonOnPress={!Boolean(this.props.auth.isAuthenticated) ? this.tryAfterNetworkError : null}
					>
						{Boolean(this.props.site.settings.site_offline_message) && <RichTextContent dark>{this.props.site.settings.site_offline_message}</RichTextContent>}
					</AppLoading>
				);
			} else {
				// Site is offline and this user cannot access it
				appContent = (
					<AppLoading
						icon={icons.OFFLINE}
						title="Community Offline"
						message={`${this.props.site.settings.board_name} is offline, but your permissions allow you to access it.`}
						buttonText="Go To Community"
						buttonOnPress={this.bypassOfflineMessage}
					/>
				);
			}
		} else if (!this.props.user.group.canAccessSite) {
			if (this.props.user.group.groupType !== "GUEST") {
				// User is in a banned group
				appContent = (
					<AppLoading
						icon={icons.BANNED}
						title="No Permission"
						message={`Sorry, you do not have permission to access ${this.props.site.settings.board_name}`}
					/>
				);
			} else {
				// User is a guest, so site requires a login to view anything
				appContent = (
					<AppLoading
						icon={icons.LOGIN}
						title="Sign In Required"
						message={`Please sign in to access ${this.props.site.settings.board_name}`}
						buttonText="Sign In"
						buttonOnPress={this.launchAuth}
					/>
				);
			}
		} else if (this.props.auth.swapToken.loading) {
			appContent = <AppLoading loading message={`Logging you in...`} />;
		} else {
			appContent = <CommunityNavigation />;
		}

		return <ApolloProvider client={this.props.auth.client}>{appContent}</ApolloProvider>;
	}
}

const styles = StyleSheet.create({
	wrapper: {
		backgroundColor: "#333",
		flex: 1,
		alignItems: "center",
		justifyContent: "center"
	}
});

export default connect(state => ({
	app: state.app,
	auth: state.auth,
	user: state.user,
	site: state.site
}))(CommunityRoot);
