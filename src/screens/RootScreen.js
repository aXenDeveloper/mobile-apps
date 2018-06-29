import React, { Component } from "react";
import { Text, View, StyleSheet, ActivityIndicator, AsyncStorage } from "react-native";
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { ApolloLink } from "apollo-link";
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
					Authorization: this.props.auth.access_token
						? `Bearer ${this.props.auth.access_token}`
						: `Basic ${Expo.Constants.manifest.extra.api_key}`
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
				{this.state.loading ? (
					<View style={styles.wrapper}>
						<ActivityIndicator size="large" color="#ffffff" />
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
	}
});

export default connect(state => ({
	auth: state.auth,
	user: state.user
}))(RootScreen);
