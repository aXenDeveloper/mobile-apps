import React, { Component } from "react";
import { Text, View, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import gql from "graphql-tag";
import { graphql, compose, withApollo } from "react-apollo";
import { withNavigation } from "react-navigation";

import Lang from "../../utils/Lang";
import { isSupportedType, isSupportedUrl } from "../../utils/isSupportedType";
import { PlaceholderRepeater } from "../../ecosystems/Placeholder";
import ErrorBox from "../../atoms/ErrorBox";
import MemberRow from "../../atoms/MemberRow";

const SearchQuery = gql`
	query MemberSearchQuery($term: String) {
		core {
			search(term: $term, type: core_members) {
				count
				results {
					... on core_Member {
						id
						photo
						name
						group {
							name
						}
					}
				}
			}
		}
	}
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
			if (prevProps.term !== this.props.term || (this.state.results === null && !this.state.loading)) {
				this.fetchResults();
			}
		}
	}

	/**
	 * Fetch our results from the server
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
			const { data } = await this.props.client.query({
				query: SearchQuery,
				variables: {
					term: this.props.term,
					offset: this.state.offset,
					limit: LIMIT,
				},
				fetchPolicy: "no-cache"
			});

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
	 * Event handler for scrolling to the bottom of the list
	 * Initiates a load to get more results
	 *
	 * @return 	void
	 */
	onEndReached() {
		if( !this.state.loading && !this.state.reachedEnd ){
			this.fetchResults();
		}
	}

	/**
	 * Shows placeholder loading elements if we're loading new items
	 *
	 * @return 	Component|null
	 */
	getFooterComponent() {
		if( this.state.loading && !this.state.reachedEnd ){
			return (
				<PlaceholderRepeater repeat={this.state.offset > 0 ? 1 : 6}>
					<MemberRow loading={true} />
				</PlaceholderRepeater>
			);
		}

		return null;
	}

	/**
	 * Render a member row
	 *
	 * @param 	object 		item 	Member item to render
	 * @return 	Component
	 */
	renderItem(item) {
		const onPress = () =>
			this.props.navigation.navigate("Profile", {
				id: item.id,
				name: item.name,
				photo: item.photo
			});

		return <MemberRow data={item} onPress={onPress} />;
	}

	render() {
		if (this.state.loading || this.state.results === null) {
			return <View style={[componentStyles.panel]}>
				<PlaceholderRepeater repeat={6}>
					<MemberRow loading={true} />
				</PlaceholderRepeater>
			</View>;
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
					keyExtractor={item => item.id}
					renderItem={({ item }) => this.renderItem(item)}
					onEndReached={() => this.onEndReached()}
					ListFooterComponent={() => this.getFooterComponent()}
					ListEmptyComponent={() => <ErrorBox message={Lang.get("no_results_in_x", { type: this.props.typeName.toLowerCase() })} showIcon={false} />}
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
