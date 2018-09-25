import React, { Component } from "react";
import { Text, View, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import gql from "graphql-tag";
import { graphql, compose, withApollo } from "react-apollo";
import { withNavigation } from 'react-navigation';

import Lang from "../../utils/Lang";
import { isSupportedType, isSupportedUrl } from "../../utils/isSupportedType";
import ErrorBox from "../../atoms/ErrorBox";
import MemberRow from "../../atoms/MemberRow";
import StreamCard from "../../ecosystems/StreamCard";
import StreamCardFragment from "../../ecosystems/StreamCard/StreamCardFragment";

const SearchQuery = gql`
	query OverviewSearchQuery($term: String, $type: core_search_types_input) {
		core {
			search(term: $term, type: $type) {
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
					... on core_ContentSearchResult {
						...StreamCardFragment
					}
				}
			}
		}
	}
	${StreamCardFragment}
`;

class SearchResultPanel extends Component {

	constructor(props){
		super(props);
		this.state = {
			loading: false,
			error: false,
			lastTerm: '',
			results: null
		};
	}

	componentDidUpdate(prevProps){
		// If we were not previously showing results but now we are, then start fetching them
		// so they can be displayed when loaded
		if( !prevProps.showResults && this.props.showResults ){
			// If the term hasn't changed, then just rebuild the results from what we already had
			if( prevProps.term !== this.props.term || this.state.results === null && !this.state.loading ){
				this.fetchResults();
			}
		}
	}

	async fetchResults() {
		this.setState({
			loading: true
		});

		try {
			const { data } = await this.props.client.query({
				query: SearchQuery,
				variables: {
					term: this.props.term,
					type: this.props.type
				},
				fetchPolicy: 'no-cache'
			});

			this.setState({
				results: data.core.search.results || [],
				loading: false
			});
		} catch (err) {
			this.setState({
				error: true,
				loading: false
			});
		}
	}

	renderItem(item) {
		let onPress;
		const isSupported = isSupportedUrl([ item.url.app, item.url.module, item.url.controller ]);

		if( isSupported ){
			onPress = () => this.props.navigation.navigate( isSupported, {
				id: item.itemID
			});
		} else {
			onPress = () => this.props.navigation.navigate("WebView", {
				url: item.url.full
			});
		}

		return <StreamCard data={item} isSupported={!!isSupported} onPress={onPress} />
	}

	render() {
		if( this.state.loading || this.state.results === null ){
			return (
				<View style={[ componentStyles.panel, componentStyles.panelLoading ]}>
					{this.state.loading && <ActivityIndicator size='large' />}
				</View>
			);
		} else if( this.state.error ) {
			return (
				<View style={componentStyles.panel}>
					<ErrorBox message={Lang.get('error_searching')} />;
				</View>
			);
		}

		return (
			<View style={componentStyles.panel}>
				<FlatList
					data={this.state.results}
					keyExtractor={item => item.indexID}
					renderItem={({ item }) => this.renderItem(item)}
					ListEmptyComponent={() => <ErrorBox message={Lang.get("no_results")} showIcon={false} />}
				/>
			</View>
		);
	}
}

export default compose(
	withApollo,
	withNavigation
)(SearchResultPanel);

const componentStyles = StyleSheet.create({
	panel: {
		flex: 1
	},
	panelLoading: {
		alignItems: 'center',
		justifyContent: 'center'
	}
});
