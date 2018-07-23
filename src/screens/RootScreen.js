import React, { Component } from "react";
import { Text, Alert, View, TouchableHighlight, StyleSheet, ActivityIndicator, AsyncStorage } from "react-native";
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { ApolloLink } from "apollo-link";
import { onError } from "apollo-link-error";
import { InMemoryCache } from "apollo-cache-inmemory";
import { connect } from "react-redux";
import gql from "graphql-tag";
import { graphql } from "react-apollo";

import { refreshAuth } from "../redux/actions/auth";
import { userLoaded, guestLoaded } from "../redux/actions/user";
import AppNavigation from "../navigation/AppNavigation";
import ToFormData from "../utils/ToFormData";

const BootQuery = gql`
	query BootQuery {
		core {
			me {
				id
				name
				photo
			}
		}
	}
`;

class RootScreen extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: true
		};

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
			cache: new InMemoryCache()
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
	}

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
			return this.showLoadError();
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
		if( prevProps.auth.checkAuthProcessing && !this.props.auth.checkAuthProcessing ){
			this.runBootQuery();
		}
	}

	/**
	 * Manually execute the boot query to fetch community data
	 *
	 * @return 	void
	 */
	async runBootQuery() {
		const { dispatch } = this.props;
		
		try {
			const { data } = await this._client.query({
				query: BootQuery,
				variables: {}
			});

			// Send out our user info
			if( this.props.auth.authenticated && data.core.me.id ){
				dispatch(userLoaded({
					...data.core.me
				}));
			} else {
				dispatch(guestLoaded());
			}

			// We can now proceed to show the home screen
			this.setState({
				loading: false
			});
		} catch (err) {
			console.log(err);
			return this.showLoadError();
		}
	}

	/**
	 * Show an error alert. Called when we can't connect to the community.
	 *
	 * @return 	void
	 */
	showLoadError() {
		Alert.alert(
			"Network Error",
			"Sorry, the community you are trying to access isn't available right now.",
			[
				{
					text: "OK"
				}
			],
			{ cancelable: false }
		);
	}

	render() {
		return (
			<ApolloProvider client={this._client}>
				{this.state.loading || this.props.auth.networkError ? (
					<View style={styles.wrapper}>
						{this.state.loading ? (
							<ActivityIndicator size="large" color="#ffffff" />
						) : (
							<TouchableHighlight style={styles.tryAgain} onPress={() => this.tryAfterNetworkError()}>
								<Text style={styles.tryAgainText}>Try Again</Text>
							</TouchableHighlight>
						)}
					</View>
				) : (
					<AppNavigation isMember={this.props.auth.authenticated} />
				)}
			</ApolloProvider>
		);
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
	}
});

export default connect(state => ({
	auth: state.auth,
	user: state.user
}))(RootScreen);
