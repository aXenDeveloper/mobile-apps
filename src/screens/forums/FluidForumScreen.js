import React, { Component } from "react";
import { Text, Image, View, Button, ScrollView, FlatList } from "react-native";
import gql from "graphql-tag";
import { graphql, compose, withApollo } from "react-apollo";
import { connect } from "react-redux";
import _ from "underscore";

import Lang from "../../utils/Lang";
import { PlaceholderRepeater } from "../../ecosystems/Placeholder";
import relativeTime from "../../utils/RelativeTime";
import getErrorMessage from "../../utils/getErrorMessage";
import FollowButton from "../../atoms/FollowButton";
import ErrorBox from "../../atoms/ErrorBox";
import TwoLineHeader from "../../atoms/TwoLineHeader";
import Pager from "../../atoms/Pager";
import PagerButton from "../../atoms/PagerButton";
import SectionHeader from "../../atoms/SectionHeader";
import ForumItem from "../../ecosystems/ForumItem";
import TopicRow from "../../ecosystems/TopicRow";
import AddButton from "../../atoms/AddButton";
import EndOfComments from "../../atoms/EndOfComments";

const FluidForumQuery = gql`
	query FluidForumQuery($offset: Int, $limit: Int) {
		forums {
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
				contentImages
			}
		}
	}
`;

class FluidForumScreen extends Component {
	static navigationOptions = ({ navigation }) => ({
		headerTitle: <TwoLineHeader title='All Topics' subtitle='Showing all topics from all forums' />,
	});

	/**
	 * GraphQL error types
	 */
	static errors = {
		
	};

	constructor(props) {
		super(props);
		this.state = {
			reachedEnd: false,
		};
	}

	/**
	 * Update the navigation params to set the title if we came direct, e.g. from search
	 *
	 * @param 	object 	prevProps 	Previous prop values
	 * @return 	void
	 */
	componentDidUpdate(prevProps) {
		
	}

	/**
	 * Handles infinite loading when user scrolls to end
	 *
	 * @return 	void
	 */
	onEndReached() {
		/*if (!this.props.data.loading && !this.state.reachedEnd) {
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
		}*/
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
			return <TopicRow loading={true} />;
		}

		return <EndOfComments label={Lang.get("end_of_forum")} />;
	}

	/**
	 * Given a post and topic data, return an object with a more useful structure
	 *
	 * @param 	object 	topic 	The topic data
	 * @return 	object
	 */
	buildTopicData(topic) {
		return {
			id: topic.id,
			type: "topic",
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
			lastPostPhoto: topic.lastPostAuthor.photo,
			contentImages: topic.contentImages
		};
	}

	/**
	 * Render a topic or a subforum, depending on the item type
	 *
	 * @param 	object 	item 		An item object for a topic or subforum
	 * @return 	Component
	 */
	renderItem(item) {
		return (
			<TopicRow
				data={item}
				isGuest={!this.props.auth.authenticated}
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
		// status 3 == fetchMore, status 4 == refreshing
		if (this.props.data.loading && this.props.data.networkStatus !== 3 && this.props.data.networkStatus !== 4) {
			return (
				<PlaceholderRepeater repeat={7}>
					<TopicRow loading={true} />
				</PlaceholderRepeater>
			);
		} else if (this.props.data.error) {
			const error = getErrorMessage(this.props.data.error, TopicListScreen.errors);
			const message = error ? error : Lang.get("topic_view_error");
			return <ErrorBox message={message} refresh={() => this.refreshAfterError()} />;
		} else {
			const topicData = this.props.data.forums.topics.map(topic => this.buildTopicData(topic));

			return (
				<View contentContainerStyle={{ flex: 1 }} style={{ flex: 1 }}>
					<View style={{ flex: 1 }}>
						<FlatList
							style={{ flex: 1 }}
							keyExtractor={item => item.id}
							renderSectionHeader={({ section }) => this.renderHeader(section)}
							renderItem={({ item }) => this.renderItem(item)}
							data={topicData}
							refreshing={this.props.data.networkStatus == 4}
							onRefresh={() => this.onRefresh()}
							onEndReached={() => this.onEndReached()}
							ListEmptyComponent={() => <ErrorBox message={Lang.get("no_topics")} showIcon={false} />}
						/>
					</View>
				</View>
			);
		}
	}
}

/*
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
) : null}*/

export default compose(
	connect(state => ({
		auth: state.auth,
		forums: state.forums
	})),
	graphql(FluidForumQuery, {
		options: props => ({
			notifyOnNetworkStatusChange: true,
			variables: {
				offset: 0,
				limit: Expo.Constants.manifest.extra.per_page
			}
		})
	}),
	withApollo
)(FluidForumScreen);