import React, { Component } from "react";
import { Text, View, Button, ScrollView, FlatList } from "react-native";
import gql from "graphql-tag";
import { graphql } from "react-apollo";

import { PlaceholderRepeater } from "../../atoms/Placeholder";
import relativeTime from "../../utils/RelativeTime";
import TwoLineHeader from "../../atoms/TwoLineHeader";
import Pager from "../../atoms/Pager";
import PagerButton from "../../atoms/PagerButton";
import SectionHeader from "../../atoms/SectionHeader";
import TopicRow from "../../ecosystems/TopicRow";
import AddButton from "../../atoms/AddButton";

const TopicListQuery = gql`
	query TopicListQuery($forum: ID!, $offset: Int, $limit: Int) {
		forums {
			forum(id: $forum) {
				topics(offset: $offset, limit: $limit) {
					id
					title
					postCount
					content(stripped: true, singleLine: true, truncateLength: 100)
					pinned
					locked
					started
					isUnread
					lastPostAuthor {
						name
						photo
					}
					lastPostDate
					author {
						name
					}
				}
				name
				topicCount
				create {
					canCreate
					tags {
						enabled
						definedTags
					}
				}
			}
		}
		core {
			settings {
				tags_min
				tags_len_min
				tags_max
				tags_len_max
			}
		}
	}
`;

class TopicListScreen extends Component {
	static navigationOptions = ({ navigation }) => ({
		headerTitle: (
			!navigation.state.params.title || !navigation.state.params.topics ? 
				<TwoLineHeader loading={true} />
			:
				<TwoLineHeader
					title={navigation.state.params.title}
					subtitle={`${navigation.state.params.topics} topics`}
				/>
		)
	});

	/**
	 * GraphQL error types
	 */
	static errors = {
		NO_FORUM: "The forum does not exist."
	};

	constructor(props) {
		super(props);
		this.state = {
			reachedEnd: false
		};
	}

	/**
	 * Update the navigation params to set the title if we came direct, e.g. from search
	 *
	 * @param 	object 	prevProps 	Previous prop values
	 * @return 	void
	 */
	componentDidUpdate(prevProps) {
		if (!prevProps.navigation.state.params.title || !prevProps.navigation.state.params.topics) {
			this.props.navigation.setParams({
				title: this.props.data.forums.forum.name,
				topics: this.props.data.forums.forum.topicCount
			});
		}
	}

	/**
	 * Handles infinite loading when user scrolls to end
	 *
	 * @return 	void
	 */
	onEndReached() {
		if (!this.props.data.loading && !this.state.reachedEnd) {
			this.props.data.fetchMore({
				variables: {
					offset: this.props.data.forums.forum.topics.length
				},
				updateQuery: (previousResult, { fetchMoreResult }) => {
					// Don't do anything if there wasn't any new items
					if (!fetchMoreResult || fetchMoreResult.forums.forum.topics.length === 0) {
						this.setState({
							reachedEnd: true
						});

						return previousResult;
					}

					const result = Object.assign({}, previousResult, {
						forums: {
							...previousResult.forums,
							forum: {
								...previousResult.forums.forum,
								topics: [...previousResult.forums.forum.topics, ...fetchMoreResult.forums.forum.topics]
							}
						}
					});

					return result;
				}
			});
		}
	}

	/**
	 * Handle refreshing the view
	 *
	 * @return 	void
	 */
	onRefresh() {
		this.setState({
			reachedEnd: false
		});

		this.props.data.refetch();
	}

	/**
	 * Return the footer component. Show a spacer by default, but a loading post
	 * if we're fetching more items right now.
	 *
	 * @return 	Component
	 */
	getFooterComponent() {
		// If we're loading more items in
		if (this.props.data.networkStatus == 3 && !this.state.reachedEnd) {
			return <Text style={{ textAlign: "center" }}>Loading...</Text>;
		}

		return <View style={{ height: 150 }} />;
	}

	/**
	 * Given a post and topic data, return an object with a more useful structure
	 *
	 * @param 	object 	post 		A raw post object from GraphQL
	 * @param 	object 	topicData 	The topic data
	 * @return 	object
	 */
	buildTopicData(topic, forumData) {
		return {
			id: topic.id,
			unread: topic.isUnread,
			title: topic.title,
			replies: parseInt(topic.postCount),
			author: topic.author.name,
			started: topic.started,
			snippet: topic.content.trim(),
			hot: false,
			pinned: topic.pinned,
			locked: topic.locked,
			lastPostDate: topic.lastPostDate,
			lastPostPhoto: topic.lastPostAuthor.photo
		};
	}

	/**
	 * Render a topic
	 *
	 * @param 	object 	item 		A topic object (already transformed by this.buildTopicData)
	 * @param 	object 	forumData 	The forum data
	 * @return 	Component
	 */
	renderItem(item, forumData) {
		return (
			<TopicRow
				data={item}
				onPress={() =>
					this.props.navigation.navigate("TopicView", {
						id: item.id,
						title: item.title,
						author: item.author,
						posts: item.replies,
						started: item.started
					})
				}
			/>
		);
	}

	render() {
		if (this.props.data.loading && this.props.data.networkStatus !== 3 && this.props.data.networkStatus !== 4) {
			return (
				<PlaceholderRepeater repeat={7}>
					<TopicRow loading={true} />
				</PlaceholderRepeater>
			);
		} else if (this.props.data.error) {
			const error = getErrorMessage(this.props.data.error, TopicListScreen.errors);
			return <Text>{error}</Text>;
		} else {
			const forumData = this.props.data.forums.forum;
			const settingsData = this.props.data.core.settings;
			const listData = forumData.topics.map(topic => this.buildTopicData(topic, forumData));

			return (
				<View contentContainerStyle={{ flex: 1 }} style={{ flex: 1 }}>
					<View style={{ flex: 1 }}>
						<FlatList
							style={{ flex: 1 }}
							keyExtractor={item => item.id}
							ListFooterComponent={() => this.getFooterComponent()}
							renderItem={({ item }) => this.renderItem(item, forumData)}
							data={listData}
							refreshing={this.props.data.networkStatus == 4}
							onRefresh={() => this.onRefresh()}
							onEndReached={() => this.onEndReached()}
						/>
						{forumData.create.canCreate ? (
							<Pager>
								<AddButton
									icon={require("../../../resources/compose.png")}
									title="Create New Topic"
									onPress={() =>
										this.props.navigation.navigate("CreateTopic", {
											forumID: this.props.navigation.state.params.id,
											tagsEnabled: forumData.create.tags.enabled,
											definedTags: forumData.create.tags.definedTags,
											tags_min: settingsData.tags_min,
											tags_len_min: settingsData.tags_len_min,
											tags_max: settingsData.tags_max,
											tags_len_max: settingsData.tags_len_max
										})
									}
								/>
							</Pager>
						) : null}
					</View>
				</View>
			);
		}
	}
}

export default graphql(TopicListQuery, {
	options: props => ({
		notifyOnNetworkStatusChange: true,
		variables: {
			forum: props.navigation.state.params.id,
			offset: 0,
			limit: Expo.Constants.manifest.extra.per_page
		}
	})
})(TopicListScreen);
