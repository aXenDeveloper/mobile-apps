import React, { Component } from "react";
import { Text, View } from "react-native";
import { Linking } from "expo";
import { connect } from "react-redux";
import { ApolloProvider } from "react-apollo";
import apolloLogger from "apollo-link-logger";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { ApolloLink } from "apollo-link";
import { onError } from "apollo-link-error";
import { InMemoryCache } from "apollo-cache-inmemory";
import { graphql, compose } from "react-apollo";
import { IntrospectionFragmentMatcher } from "apollo-cache-inmemory";

import introspectionQueryResultData from "../../fragmentTypes.json";
import { setApolloClient, bootSite, switchAppView, setActiveCommunity, resetBootStatus } from "../../redux/actions/app";
import { refreshToken } from "../../redux/actions/auth";
import MultiCommunityNavigation from "../../navigation/MultiCommunityNavigation";
import CommunityRoot from "./CommunityRoot";
import CommunityRootScreen from "./CommunityRootScreen";
import Button from "../../atoms/Button";
import NavigationService from "../../utils/NavigationService";

class AppRoot extends Component {
	constructor(props) {
		super(props);
		this.handleOpenUrl.bind(this);
	}

	componentDidMount() {}

	handleOpenUrl(event) {}

	async componentDidUpdate(prevProps) {
		const { dispatch } = this.props;
		const { apiKey, apiUrl } = this.props.app.currentCommunity;
		const prevApiUrl = prevProps.app.currentCommunity.apiUrl;

		// If we have a new API url in our store, authorize and boot that community
		if (prevApiUrl !== apiUrl && apiUrl !== null) {
			await dispatch(setApolloClient({ client: this.getClient() }));
			await dispatch(refreshToken({ apiKey, apiUrl }));
			await dispatch(bootSite({ apiKey, apiUrl }));

			NavigationService.setBaseUrl(this.props.site.settings.base_url);
		}

		// If our authenticated state has changed, we need to get a new client and reboot the community
		// We only want to do this if we're still using the same community URL
		if (prevApiUrl === apiUrl && prevProps.auth.isAuthenticated !== this.props.auth.isAuthenticated) {
			await dispatch(setApolloClient({ client: this.getClient() }));
			await dispatch(bootSite({ apiKey, apiUrl }));
		}

		// If we were booting a community and that's finished, switch to our community
		if (!prevProps.app.bootStatus.loaded && this.props.app.bootStatus.loaded) {
			this.props.dispatch(
				switchAppView({
					view: "community"
				})
			);
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

	/**
	 * Gets an Apollo client instance
	 *
	 * @return 	void
	 */
	getClient() {
		// In order for Apollo to use fragments with union types, as we do for generic core_Content
		// queries, we need to pass it the schema definition in advance.
		// See https://www.apollographql.com/docs/react/advanced/fragments.html#fragment-matcher
		const fragmentMatcher = new IntrospectionFragmentMatcher({
			introspectionQueryResultData
		});

		const accessToken = this.props.auth.authData.accessToken;
		const apiKey = this.props.app.currentCommunity.apiKey;

		// Apollo config & setup
		const authLink = (operation, next) => {
			operation.setContext(context => ({
				...context,
				credentials: "same-origin",
				headers: {
					...context.headers,
					Authorization: accessToken ? `Bearer ${accessToken}` : `Basic ${Buffer.from(apiKey).toString("base64")}`
				}
			}));
			return next(operation);
		};

		const errorLink = onError(({ graphQLErrors, networkError }) => {
			if (graphQLErrors)
				graphQLErrors.map(({ message, locations, path }) => console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`));

			if (networkError) {
				try {
					const parsedError = JSON.parse(networkError);
					console.log("[Network error]:");
					console.log(parsedError);
				} catch (err) {
					console.log(`[Network error]: ${networkError}`);
				}
			}
		});

		const link = ApolloLink.from([
			errorLink,
			authLink,
			//apolloLogger,
			new HttpLink({
				uri: `${this.props.app.currentCommunity.apiUrl}/api/graphql/`
			})
		]);
		const client = new ApolloClient({
			link: link,
			cache: new InMemoryCache({ fragmentMatcher })
		});

		return client;
	}

	render() {
		let ScreenToRender = CommunityRoot;

		if (Expo.Constants.manifest.extra.multi) {
			if (this.props.app.view === "multi") {
				ScreenToRender = MultiCommunityNavigation;
			}
		}

		return (
			<View style={{ flex: 1 }}>
				<ScreenToRender />
			</View>
		);
	}
}

export default connect(state => ({
	auth: state.auth,
	app: state.app,
	site: state.site
}))(AppRoot);
