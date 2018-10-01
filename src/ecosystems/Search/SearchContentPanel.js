import React, { Component } from "react";
import {
	Text,
	View,
	FlatList,
	StyleSheet,
	ActivityIndicator
} from "react-native";
import gql from "graphql-tag";
import { graphql, compose, withApollo } from "react-apollo";
import { withNavigation } from "react-navigation";

import Lang from "../../utils/Lang";
import { isSupportedType, isSupportedUrl } from "../../utils/isSupportedType";
import ErrorBox from "../../atoms/ErrorBox";
import MemberRow from "../../atoms/MemberRow";
import { PlaceholderRepeater } from "../../ecosystems/Placeholder";
import SearchResult from "./SearchResult";
import SearchResultFragment from "../../ecosystems/Search/SearchResultFragment";

const SearchQuery = gql`
	query SearchQuery($term: String, $type: core_search_types_input, $offset: Int, $limit: Int) {
		core {
			search(term: $term, type: $type, offset: $offset, limit: $limit) {
				count
				results {
					... on core_ContentSearchResult {
						...SearchResultFragment
					}
				}
			}
		}
	}
	${SearchResultFragment}
`;

const LIMIT = 25;

class ContentPanel extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			error: false,
			lastTerm: "",
			results: null,
			reachedEnd: false,
			offset: 0
		};
	}

	/**
	 * On update, figure out if we need to fetch our results
	 *
	 * @param 	object 		prevProps 		Previous prop object
	 * @return 	void
	 */
	componentDidUpdate(prevProps) {
		// If we were not previously showing results but now we are, then start fetching them
		// so they can be displayed when loaded
		if (!prevProps.showResults && this.props.showResults) {
			// If the term hasn't changed, then just rebuild the results from what we already had
			if (
				prevProps.term !== this.props.term ||
				(this.state.results === null && !this.state.loading)
			) {
				this.fetchResults();
			}
		}
	}

	/**
	 * Load our results from the server
	 *
	 * @return 	void
	 */
	async fetchResults() {
		if( this.state.loading || this.state.reachedEnd ){
			return;
		}

		this.setState({
			loading: true
		});

		try {
			console.log('running query: offset ' + this.state.offset);
			console.log( this.props.type );

			const variables = {
				term: this.props.term,
				offset: this.state.offset,
				limit: LIMIT
			};

			// Type is optional, so only add it if we aren't showing all
			if( this.props.type !== 'all' ){
				variables['type'] = this.props.type;
			}

			const { data } = await this.props.client.query({
				query: SearchQuery,
				variables,
				fetchPolicy: "no-cache" // important, so that each search fetches new results
			});

			console.log('got results');

			const currentResults = this.state.results == null ? [] : this.state.results;
			const updatedResults = [...currentResults, ...data.core.search.results];

			this.setState({
				results: updatedResults,
				reachedEnd: !data.core.search.results.length || data.core.search.results.length < LIMIT,
				loading: false,
				offset: updatedResults.length
			});
		} catch (err) {

			console.log( err );

			this.setState({
				error: true,
				loading: false
			});
		}
	}

	/**
	 * Render a result item
	 *
	 * @param 	object		item 	The item to render
	 * @return 	Component
	 */
	renderItem(item) {
		let onPress;
		const isSupported = isSupportedUrl([
			item.url.app,
			item.url.module,
			item.url.controller
		]);

		if (isSupported) {
			onPress = () =>
				this.props.navigation.navigate(isSupported, {
					id: item.itemID
				});
		} else {
			onPress = () =>
				this.props.navigation.navigate("WebView", {
					url: item.url.full
				});
		}

		return (
			<SearchResult
				data={item}
				onPress={onPress}
				term={this.props.term}
			/>
		);
	}

	onEndReached() {
		if( !this.state.loading && !this.state.reachedEnd ){
			this.fetchResults();
		}
	}

	getFooterComponent() {
		if( this.state.loading && !this.state.reachedEnd ){
			return (
				<PlaceholderRepeater repeat={this.state.offset > 0 ? 1 : 6}>
					<SearchResult loading={true} />
				</PlaceholderRepeater>
			);
		}

		return null;
	}

	render() {
		console.log('search panel');
		if (this.state.loading && this.state.results == null) {
			return (
				<PlaceholderRepeater repeat={6}>
					<SearchResult loading={true} />
				</PlaceholderRepeater>
			);
		} else if (this.state.error) {
			return (
				<View style={componentStyles.panel}>
					<ErrorBox message={Lang.get("error_searching")} />;
				</View>
			);
		}

		return (
			<View style={componentStyles.panel}>
				<FlatList
					data={this.state.results}
					keyExtractor={item => item.indexID}
					renderItem={({ item }) => this.renderItem(item)}
					onEndReached={() => this.onEndReached()}
					ListFooterComponent={() => this.getFooterComponent()}
					ListEmptyComponent={() => (
						<ErrorBox
							message={Lang.get("no_results_in_x", {
								type: this.props.typeName.toLowerCase()
							})}
							showIcon={false}
						/>
					)}
				/>
			</View>
		);
	}
}

export default compose(withApollo, withNavigation)(ContentPanel);

const componentStyles = StyleSheet.create({
	panel: {
		flex: 1
	},
	panelLoading: {
		alignItems: "center",
		justifyContent: "center"
	}
});
