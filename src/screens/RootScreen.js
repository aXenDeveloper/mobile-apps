import React, { Component } from "react";
import { Text, Alert, View, TouchableHighlight, StyleSheet, ActivityIndicator, AsyncStorage } from "react-native";
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { ApolloLink } from "apollo-link";
import { onError } from "apollo-link-error";
import { InMemoryCache } from "apollo-cache-inmemory";
import { connect } from "react-redux";
import { refreshAuth } from "../redux/actions/auth";
import { fetchUser } from "../redux/actions/user";

import AppNavigation from "../navigation/AppNavigation";
import ToFormData from "../utils/ToFormData";
import auth from "../utils/Auth";

class RootScreen extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false
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
		/*const errorLink = onError(({ graphQLErrors, networkError, forward }) => {
			if (graphQLErrors){
				graphQLErrors.map( ({ message, locations, path }) => {
					console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
				});
			}
			if (networkError) {
				console.log(`[Network error]: ${networkError}`);
			}
		});*/

		const link = ApolloLink.from([
			authLink,
			//errorLink,
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
	componentDidMount() {
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

		// Show loading status if we're checking the token *and* aren't already logged in
		// Checks when already logged in shouldn't interrupt the user; if they fail they'll just be logged out anyway
		if (nextProps.auth.checkAuthProcessing && !this.props.auth.authenticated) {
			this.setState({
				loading: true
			});
		} else {
			this.setState({
				loading: false
			});
		}

		if (nextProps.auth.error && nextProps.auth.networkError) {
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
			return;
		}

		// If we're authenticated now, then start a timer so we can refresh the token before it expires
		if (nextProps.auth.authenticated && !this.props.auth.authenticated) {
			this._refreshTimer = setInterval(() => {
				console.log("Refreshing access_token");
				dispatch(refreshAuth());
			}, nextProps.auth.expires_in - Expo.Constants.manifest.extra.refresh_token_advance);

			/*
			if (!this.props.user.loaded) {
				dispatch(fetchUser());
			}*/
		}
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
