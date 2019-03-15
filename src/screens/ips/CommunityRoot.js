import React, { Component } from "react";
import { Text, Alert, View, Image, TouchableHighlight, StyleSheet, ActivityIndicator, AsyncStorage, StatusBar } from "react-native";
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
import NavigationService from "../../utils/NavigationService";
import LoginScreen from "../core/LoginRegister/LoginScreen";
import RichTextContent from "../../ecosystems/RichTextContent";
import Lang from "../../utils/Lang";
import { userLoaded, guestLoaded, setUserStreams, updateNotificationCount } from "../../redux/actions/user";
import { setSiteSettings, setLoginHandlers } from "../../redux/actions/site";
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

class CommunityRoot extends Component {
	constructor(props) {
		super(props);

		this._alerts = {
			networkError: false,
			offline: false
		};

		this.state = {};

		this._notificationTimeout = null;
	}

	/**
	 * Mount point
	 *
	 * @return 	void
	 */
	componentDidMount() {
		if (this.props.auth.isAuthenticated) {
			this.initializeNotificationInterval();
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
		}

		// However, if we were authenticated but aren't now, then *stop* notifications
		if (prevProps.auth.isAuthenticated && !this.props.auth.isAuthenticated) {
			this.stopNotificationInterval();
		}

		// If we're done checking authentication, run our boot query to get initial data
		/*if (
			// If prev auth state doesn't match current auth state...
			prevProps.auth.authenticated !== this.props.auth.authenticated ||
			// or we've finished processing auth - but only if we aren't auehenticated (i.e. don't run if we're just refreshing the token)
			(prevProps.auth.checkAuthProcessing && !this.props.auth.checkAuthProcessing && !this.props.auth.authenticated) ||
			// or if our user is now a guest, or vice-versa
			prevProps.user.isGuest !== this.props.user.isGuest
		) {
			this.runBootQuery();
		}*/
		// If we're no longer logged in, stop checking notifications
		/*if ((!prevProps.user.isGuest && this.props.user.isGuest) || !this.props.auth.authenticated) {
			clearInterval(this._notificationTimeout);
		}

		// If the site isn't online, but we can access the site, let the user know
		if (!this.props.site.settings.site_online && this.props.user.group.canAccessOffline) {
			if (!this._alerts.offline) {
				this.showOfflineMessage();
				this._alerts.offline = true;
			}
		}*/
	}

	/**
	 * When component unmounts, clear up our intervals
	 *
	 * @return 	void
	 */
	componentWillUnmount() {
		this.stopNotificationInterval();
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
			const { data } = await this.props.app.client.query({
				query: NotificationQuery,
				fetchPolicy: "network-only"
			});

			console.log(`Ran notification update, got count ${data.core.me.notificationCount}`);

			if (parseInt(data.core.me.notificationCount) !== parseInt(this.props.user.notificationCount)) {
				this.props.dispatch(updateNotificationCount(data.core.me.notificationCount));
			}
		} catch (err) {
			// If this failed for some reason, stop checking from now on
			console.log(`Error running notification update: ${err}`);
			this.stopNotificationInterval();
		}
	}

	/**
	 * Try loading the community again
	 *
	 * @return 	void
	 */
	tryAfterNetworkError() {
		this.setState({
			loading: true
		});

		//this.props.dispatch(refreshAuth(this.props.app.currentCommunity));
	}

	/**
	 * Show an offline message to users who can access the site offline
	 *
	 * @return 	void
	 */
	showOfflineMessage(siteName) {
		Alert.alert(
			"Community Offline",
			`${this.props.site.settings.board_name} is currently offline, but your permissions allow you to access it.`,
			[
				{
					text: "OK"
				}
			],
			{ cancelable: false }
		);
	}

	/**
	 * Show an error alert. Called when we can't connect to the community.
	 *
	 * @return 	void
	 */
	showLoadError() {
		this.setState({
			loading: false
		});

		// Track whether the alert is showing so we don't bombard the user
		if (!this._alerts.networkError) {
			Alert.alert(
				"Network Error",
				"Sorry, the community you are trying to access isn't available right now.",
				[
					{
						text: "OK",
						onPress: () => (this._alerts.networkError = false)
					}
				],
				{ cancelable: false }
			);

			this._alerts.networkError = true;
		}
	}

	render() {
		let appContent;

		if (this.props.app.bootStatus.loading || this.props.app.client === null) {
			appContent = (
				<View style={styles.wrapper}>
					<StatusBar barStyle="light-content" />
					<ActivityIndicator size="large" color="#ffffff" />
				</View>
			);
		} else if (this.props.app.bootStatus.error && this.props.app.bootStatus.error == "network_error") {
			appContent = (
				<View style={styles.wrapper}>
					<StatusBar barStyle="light-content" />
					<TouchableHighlight style={styles.tryAgain} onPress={() => this.tryAfterNetworkError()}>
						<Text style={styles.tryAgainText}>Try Again</Text>
					</TouchableHighlight>
				</View>
			);
		} else if (!this.props.site.settings.site_online && !this.props.user.group.canAccessOffline) {
			// Site is offline and this user cannot access it
			appContent = (
				<View style={[styles.wrapper, styles.offlineWrapper]}>
					<StatusBar barStyle="light-content" />
					<Image source={require("../../../resources/offline.png")} resizeMode="contain" style={styles.icon} />
					<Text style={styles.title}>
						{Lang.get("offline", {
							siteName: this.props.site.settings.board_name
						})}
					</Text>
					{Boolean(this.props.site.settings.site_offline_message) && (
						<RichTextContent dark style={styles.offlineMessage}>
							{this.props.site.settings.site_offline_message}
						</RichTextContent>
					)}
					{!Boolean(this.props.auth.authenticated) && (
						<TouchableHighlight style={styles.tryAgain} onPress={() => this.tryAfterNetworkError()}>
							<Text style={styles.tryAgainText}>Sign In Now</Text>
						</TouchableHighlight>
					)}
				</View>
			);
		} else if (!this.props.user.group.canAccessSite) {
			if (this.props.user.group.groupType !== "GUEST") {
				// User is in a banned group
				appContent = (
					<View style={styles.wrapper}>
						<StatusBar barStyle="light-content" />
						<Image source={require("../../../resources/banned.png")} resizeMode="contain" style={styles.icon} />
						<Text style={styles.title}>You are banned</Text>
						<Text style={styles.offlineMessage}>Sorry, you do not have permission to access {this.props.site.settings.board_name}.</Text>
					</View>
				);
			} else {
				// User is a guest, so site requires a login to view anything
				appContent = <LoginScreen hideClose />;
			}
		} else {
			appContent = (
				<React.Fragment>
					<CommunityNavigation />
					{this.props.auth.swapToken.loading && (
						<View style={styles.authLoading}>
							<Text>Logging in...</Text>
						</View>
					)}
				</React.Fragment>
			);
		}

		return <ApolloProvider client={this.props.app.client}>{appContent}</ApolloProvider>;
	}
}

const styles = StyleSheet.create({
	wrapper: {
		backgroundColor: "#333",
		flex: 1,
		alignItems: "center",
		justifyContent: "center"
	},
	authLoading: {
		backgroundColor: "#000",
		borderRadius: 5,
		position: "absolute",
		left: 50,
		top: 50
	},
	tryAgain: {
		//backgroundColor: 'rgba(255,255,255,0.1)',
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.5)",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 4
	},
	tryAgainText: {
		color: "rgba(255,255,255,0.5)",
		fontSize: 15
	},
	title: {
		fontSize: 19,
		color: "#fff",
		fontWeight: "500",
		marginTop: styleVars.spacing.veryWide,
		marginBottom: styleVars.spacing.standard
	},
	offlineWrapper: {
		justifyContent: "flex-start",
		alignItems: "flex-start",
		paddingTop: 60,
		paddingHorizontal: styleVars.spacing.veryWide
	},
	offlineMessage: {
		marginBottom: styleVars.spacing.veryWide
	},
	icon: {
		width: 60,
		height: 60,
		tintColor: "#fff",
		opacity: 0.6
	}
});

export default connect(state => ({
	app: state.app,
	auth: state.auth,
	user: state.user,
	site: state.site
}))(CommunityRoot);
