import React, { Component } from "react";
import { Text, View, ScrollView, FlatList, StyleSheet, Image, StatusBar, Animated, Platform } from "react-native";
import gql from "graphql-tag";
import { graphql, compose, withApollo } from "react-apollo";
import _ from "underscore";

import Lang from "../../utils/Lang";
import { StreamCard, StreamCardFragment } from "../../ecosystems/Stream";
import { PlaceholderRepeater, PlaceholderContainer, PlaceholderElement } from "../../ecosystems/Placeholder";
import ErrorBox from "../../atoms/ErrorBox";
import EndOfComments from "../../atoms/EndOfComments";

const MemberContentQuery = gql`
	query MemberContentQuery($id: ID!, $offset: Int, $limit: Int) {
		core {
			member(id: $id) {
				content(offset: $offset, limit: $limit) {
					... on core_ContentSearchResult {
						...StreamCardFragment
					}
				}
			}
		}
	}
	${StreamCardFragment}
`;

const LIMIT = 25;

class ProfileContent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			results: null,
			reachedEnd: false,
			offset: 0
		};
	}

	componentDidMount() {
		if (this.props.showResults) {
			this.fetchResults();
		}
	}

	componentDidUpdate(prevProps) {
		if (!prevProps.showResults && prevProps.showResults !== this.props.showResults) {
			this.fetchResults();
		}
	}

	async fetchResults() {
		if (this.state.loading || this.state.reachedEnd) {
			return;
		}

		this.setState({
			loading: true
		});

		try {
			const variables = {
				offset: this.state.offset,
				limit: LIMIT,
				id: this.props.member
			};

			const { data } = await this.props.client.query({
				query: MemberContentQuery,
				variables,
				fetchPolicy: 'no-cache'
			});

			const currentResults = this.state.results == null ? [] : this.state.results;
			const updatedResults = [...currentResults, ...data.core.member.content];

			this.setState({
				results: updatedResults,
				reachedEnd: !data.core.member.content.length || data.core.member.content.length < LIMIT,
				loading: false,
				offset: updatedResults.length
			});
		} catch (err) {
			console.log(err);
		}
	}

	/**
	 * Handles infinite loading when user scrolls to end
	 *
	 * @return 	void
	 */
	onEndReached = () => {
		if (!this.state.loading && !this.state.reachedEnd) {
			this.fetchResults();
		}
	};

	/**
	 * Returns placeholder components if our state indicates we need them
	 *
	 * @return 	Component|null
	 */
	getFooterComponent = () => {
		if (this.state.loading && !this.state.reachedEnd) {
			return this.getPlaceholder();
		}

		return <EndOfComments label={Lang.get("end_of_profile_content")} />;
	};

	/**
	 * Return the list empty component
	 *
	 * @return 	Component
	 */
	getListEmptyComponent = () => {
		return (
			<ErrorBox
				message="No results" // @todo language
				showIcon={false}
			/>
		);
	};

	/**
	 * Build placeholder components
	 *
	 * @return 	Component
	 */
	getPlaceholder() {
		return (
			<PlaceholderRepeater repeat={this.state.offset > 0 ? 1 : 4} style={{ marginTop: 7 }}>
				<StreamCard loading={true} />
			</PlaceholderRepeater>
		);
	}

	render() {
		if (this.state.loading && this.state.results == null) {
			return this.getPlaceholder();
		} else if (this.state.error) {
			return (
				<View style={componentStyles.panel}>
					<ErrorBox message={Lang.get("error_searching")} />;
				</View>
			);
		}

		return (
			<FlatList
				scrollEnabled={false}
				data={this.state.results}
				keyExtractor={item => item.indexID}
				renderItem={({ item }) => <StreamCard data={item} />}
				onEndReached={this.onEndReached}
				ListFooterComponent={this.getFooterComponent}
				ListEmptyComponent={this.getListEmptyComponent}
			/>
		);
	}
}

export default compose(withApollo)(ProfileContent);
