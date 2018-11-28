import React, { Component } from "react";
import { Text, Alert, View, Image, TouchableHighlight, StyleSheet, ActivityIndicator, AsyncStorage, StatusBar } from "react-native";
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { ApolloLink } from "apollo-link";
import { onError } from "apollo-link-error";
import { InMemoryCache } from "apollo-cache-inmemory";
import { connect } from "react-redux";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { IntrospectionFragmentMatcher } from "apollo-cache-inmemory";
import introspectionQueryResultData from "../fragmentTypes.json";
import _ from "underscore";

import LoginScreen from "./core/LoginRegister/LoginScreen";
import RichTextContent from "../atoms/RichTextContent";
import Lang from "../utils/Lang";
import URL from "../utils/URL";
import { refreshAuth } from "../redux/actions/auth";
import { userLoaded, guestLoaded, setUserStreams, updateNotificationCount } from "../redux/actions/user";
import { setSiteSettings, setLoginHandlers } from "../redux/actions/site";
import AppNavigation from "../navigation/AppNavigation";
import ToFormData from "../utils/ToFormData";
import LangFragment from "../LangFragment";
import { styleVars } from "../styles";
import icons from "../icons";

const NOTIFICATION_TIMEOUT = 30000;

const BootQuery = gql`
	query BootQuery {
		core {
			me {
				id
				name
				photo
				notificationCount
				group {
					canAccessSite
					canAccessOffline
					groupType
					canTag
				}
			}
			settings {
				base_url
				site_online
				site_offline_message
				board_name
				allow_reg
				allow_reg_target
				disable_anonymous
				tags_enabled
				tags_open_system
				tags_min
				tags_len_min
				tags_max
				tags_len_max
				tags_min_req
				reputation_enabled
				reputation_highlight
			}
			loginHandlers {
				id
				title
				icon
				text
				color
				url
			}
			language {
				...LangFragment
			}
			streams {
				id
				title
				isDefault
			}
		}
	}
	${LangFragment}
`;

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

class RootScreen extends Component {
	constructor(props) {
		super(props);

		this._alerts = {
			networkError: false,
			offline: false
		};

		this.state = {
			loading: true,
			siteOffline: false,
			canAccess: false,
			showOfflineBanner: false
		};

		this._notificationTimeout = null;

		// In order for Apollo to use fragments with union types, as we do for generic core_Content
		// queries, we need to pass it the schema definition in advance.
		// See https://www.apollographql.com/docs/react/advanced/fragments.html#fragment-matcher
		const fragmentMatcher = new IntrospectionFragmentMatcher({
			introspectionQueryResultData
		});

		// Apollo config & setup
		const authLink = (operation, next) => {
			operation.setContext(context => ({
				...context,
				credentials: "same-origin",
				headers: {
					...context.headers,
					Authorization: this.props.auth.access_token ? `Bearer ${this.props.auth.access_token}` : `Basic ${Expo.Constants.manifest.extra.api_key}`
				}
			}));
			return next(operation);
		};

		const link = ApolloLink.from([
			authLink,
			new HttpLink({
				uri: `${Expo.Constants.manifest.extra.api_url}/api/graphql/`
			})
		]);
		this._client = new ApolloClient({
			link: link,
			cache: new InMemoryCache({ fragmentMatcher })
		});
	}

	/**
	 * Always refresh the current auth session when we mount this screen
	 *
	 * @return 	void
	 */
	async componentDidMount() {
		const { dispatch } = this.props;

		// Trigger action to look for an access token, and verify it is valid
		dispatch(refreshAuth());
	}

	/**
	 * Stop our automatic refresh timer if we unmount for some reason
	 *
	 * @return 	void
	 */
	componentWillUnmount() {
		if (this._refreshTimer) {
			clearInterval(this._refreshTimer);
		}

		if (this._notificationTimeout) {
			clearInterval(this._notificationTimeout);
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

		this.props.dispatch(refreshAuth());
	}

	/**
	 * When we get new props, decide whether to show loading status to the user
	 * We only need to do this if they aren't already logged in.
	 *
	 * @param 	object 		nextProps 		New props coming in
	 * @return 	void
	 */
	componentWillReceiveProps(nextProps) {
		const { dispatch } = this.props;

		if (nextProps.auth.error && nextProps.auth.networkError) {
			this.showLoadError();
		}

		// If we're authenticated now, then start a timer so we can refresh the token before it expires
		if (nextProps.auth.authenticated && !this.props.auth.authenticated) {
			this._refreshTimer = setInterval(() => {
				console.log("Refreshing access_token");
				dispatch(refreshAuth());
			}, nextProps.auth.expires_in - Expo.Constants.manifest.extra.refresh_token_advance);
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
		// If we're done checking authentication, run our boot query to get initial data
		if (
			// If prev auth state doesn't match current auth state...
			prevProps.auth.authenticated !== this.props.auth.authenticated ||
			// or we've finished processing auth - but only if we aren't auehenticated (i.e. don't run if we're just refreshing the token)
			(prevProps.auth.checkAuthProcessing && !this.props.auth.checkAuthProcessing && !this.props.auth.authenticated) ||
			// or if our user is now a guest, or vice-versa
			prevProps.user.isGuest !== this.props.user.isGuest
		) {
			this.runBootQuery();
		}

		// If we're no longer logged in, stop checking notifications
		if ((!prevProps.user.isGuest && this.props.user.isGuest) || !this.props.auth.authenticated) {
			clearInterval(this._notificationTimeout);
		}

		// If the site isn't online, but we can access the site, let the user know
		if (!this.props.site.settings.site_online && this.props.user.group.canAccessOffline) {
			if (!this._alerts.offline) {
				this.showOfflineMessage();
				this._alerts.offline = true;
			}
		}
	}

	/**
	 * Manually execute the boot query to fetch community data
	 *
	 * @return 	void
	 */
	async runBootQuery() {
		const { dispatch } = this.props;

		this.setState({
			loading: true
		});

		try {
			const { data } = await this._client.query({
				query: BootQuery,
				variables: {}
			});

			// Send out our user info
			if (this.props.auth.authenticated && data.core.me.group.groupType !== "GUEST") {
				dispatch(userLoaded({ ...data.core.me }));
				clearInterval(this._notificationTimeout);
				this._notificationTimeout = setInterval(() => this.runNotificationQuery(), NOTIFICATION_TIMEOUT);
			} else {
				dispatch(guestLoaded({ ...data.core.me }));
			}

			// Set our lang strings
			if (_.size(data.core.language)) {
				// We don't want __typename, so discard that
				const { __typename, ...rest } = data.core.language;
				Lang.setWords(rest);
			}

			// Set our system settings
			dispatch(setSiteSettings(data.core.settings));
			dispatch(setLoginHandlers(data.core.loginHandlers));
			URL.setBaseUrl(data.core.settings.base_url);

			// Store our streams
			dispatch(
				setUserStreams([
					{
						id: "all",
						title: "All Activity",
						isDefault: true
					},
					...data.core.streams
				])
			);

			// We can now proceed to show the home screen
			this.setState({
				loading: false
			});
		} catch (err) {
			console.error(err);
			return this.showLoadError();
		}
	}

	async runNotificationQuery() {
		const { dispatch } = this.props;

		try {
			const { data } = await this._client.query({
				query: NotificationQuery,
				fetchPolicy: 'network-only'
			});

			console.log(`Ran notification update, got count ${data.core.me.notificationCount}`);

			if( parseInt( data.core.me.notificationCount ) !== parseInt( this.props.user.notificationCount ) ){
				dispatch(updateNotificationCount(data.core.me.notificationCount));
			}
		} catch (err) {
			console.log(`Error running notification update: ${err}`);

			// If this failed for some reason, stop checking from now on
			clearInterval(this._notificationTimeout);
		}
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

		if (this.state.loading) {
			appContent = (
				<View style={styles.wrapper}>
					<StatusBar barStyle="light-content" />
					<ActivityIndicator size="large" color="#ffffff" />
				</View>
			);
		} else if (this.props.auth.networkError) {
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
					<Image source={require("../../resources/offline.png")} resizeMode="contain" style={styles.icon} />
					<Text style={styles.title}>
						{Lang.get("offline", {
							siteName: this.props.site.settings.board_name
						})}
					</Text>
					{this.props.site.settings.site_offline_message && (
						<RichTextContent dark style={styles.offlineMessage}>
							{this.props.site.settings.site_offline_message}
						</RichTextContent>
					)}
					{!this.props.auth.authenticated && (
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
						<Image source={require("../../resources/banned.png")} resizeMode="contain" style={styles.icon} />
						<Text style={styles.title}>You are banned</Text>
						<Text style={styles.offlineMessage}>Sorry, you do not have permission to access {this.props.site.settings.board_name}.</Text>
					</View>
				);
			} else {
				// User is a guest, so site requires a login to view anything
				appContent = <LoginScreen hideClose />;
			}
		} else {
			appContent = <AppNavigation />;
		}

		return <ApolloProvider client={this._client}>{appContent}</ApolloProvider>;
	}
}

const styles = StyleSheet.create({
	wrapper: {
		backgroundColor: "#333",
		flex: 1,
		alignItems: "center",
		justifyContent: "center"
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
	auth: state.auth,
	user: state.user,
	site: state.site
}))(RootScreen);
