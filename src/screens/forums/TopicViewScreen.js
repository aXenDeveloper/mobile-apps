import React, { Component } from "react";
import { Text, View, Button, ScrollView, FlatList, TouchableOpacity, TextInput } from "react-native";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import Modal from "react-native-modal";
import _ from "underscore";

import relativeTime from "../../utils/RelativeTime";
import { PlaceholderRepeater } from "../../atoms/Placeholder";
import getErrorMessage from "../../utils/getErrorMessage";
import TwoLineHeader from "../../atoms/TwoLineHeader";
import { Post, PostFragment } from "../../ecosystems/Post";
import Tag from "../../atoms/Tag";
import TagList from "../../atoms/TagList";
import Pager from "../../atoms/Pager";
import PagerButton from "../../atoms/PagerButton";
import DummyTextInput from "../../atoms/DummyTextInput";
import UnreadIndicator from "../../atoms/UnreadIndicator";
import LoadMoreComments from "../../atoms/LoadMoreComments";

const TopicViewQuery = gql`
	query TopicViewQuery($id: ID!, $offset: Int, $limit: Int, $fromUnread: Boolean) {
		forums {
			topic(id: $id) {
				__typename
				id
				url {
					__typename
					full
					app
					module
					controller
				}
				timeLastRead
				unreadPostPosition
				started
				title
				author {
					__typename
					name
				}
				tags {
					__typename
					name
				}
				locked
				itemPermissions {
					__typename
					canComment
				}
				posts(offset: $offset, limit: $limit, fromUnread: $fromUnread) {
					...PostFragment
				}
			}
		}
	}
	${PostFragment}
`;

class TopicViewScreen extends Component {
	constructor(props) {
		super(props);
		this._flatList = null;
		this.shownUnreadBar = false;
		this.state = {
			reachedEnd: false,
			earlierPostsAvailable: null,
			loadingEarlierPosts: false
		};
	}

	/**
	 * React Navigation config
	 */
	static navigationOptions = ({ navigation }) => ({
		headerTitle:
			!navigation.state.params.title || !navigation.state.params.author || !navigation.state.params.started ? (
				<TwoLineHeader loading={true} />
			) : (
				<TwoLineHeader
					title={navigation.state.params.title}
					subtitle={`Started by ${navigation.state.params.author}, ${relativeTime.long(navigation.state.params.started)}`}
				/>
			)
	});

	/**
	 * GraphQL error types
	 */
	static errors = {
		NO_TOPIC: "The topic does not exist."
	};

	/**
	 * If we have a goToEnd param, we've probably just added a new post
	 * After scrolling, reset that flag.
	 * Here we also update the navigation params to set the title if we came direct, e.g. from search
	 *
	 * @param 	object 	prevProps 	Previous prop values
	 * @return 	void
	 */
	componentDidUpdate(prevProps, prevState) {
		// If goToEnd has been passed in, then scroll to it
		if (!_.isUndefined(this.props.navigation.state.params.goToEnd)) {
			if (!prevProps.navigation.state.params.goToEnd && this.props.navigation.state.params.goToEnd) {
				this._flatList.scrollToEnd();
				this.props.navigation.setParams({
					goToEnd: false
				});
			}
		}

		// If we mounted without the info we need to set the screen title, then set them now
		if (!this.props.navigation.state.params.author) {
			this.props.navigation.setParams({
				author: this.props.data.forums.topic.author.name,
				started: this.props.data.forums.topic.started,
				title: this.props.data.forums.topic.title
			});
		}

		// Figure out if we need to change the state that determines whether the
		// Load Earlier Posts button shows
		let showEarlierPosts = false;

		if( this.props.data.variables.fromUnread && this.props.data.forums.topic.unreadPostPosition ){
			showEarlierPosts = true;
		} 

		if( prevState.earlierPostsAvailable == null || prevState.earlierPostsAvailable !== this.state.earlierPostsAvailable ){
			if( this.state.earlierPostsAvailable !== false ){
				this.setState({
					earlierPostsAvailable: showEarlierPosts
				});

				// Figure out if we need to scroll to hide the Load Earlier Posts button
				if (!this.props.data.loading && !this.props.data.error) {
					if (showEarlierPosts) {
						this._flatList.scrollToOffset({
							offset: 40,
							animated: false
						});
					}
				}
			}
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
					fromUnread: false, // When infinite loading, we must disable this otherwise the same unread posts will load again
					offset: this.props.data.forums.topic.posts.length + (this.props.data.forums.topic.unreadPostPosition || 0)
				},
				updateQuery: (previousResult, { fetchMoreResult }) => {
					// Don't do anything if there wasn't any new items
					if (!fetchMoreResult || fetchMoreResult.forums.topic.posts.length === 0) {
						this.setState({
							reachedEnd: true
						});

						return previousResult;
					}

					// Now APPEND the new posts to the existing ones
					const result = Object.assign({}, previousResult, {
						forums: {
							...previousResult.forums,
							topic: {
								...previousResult.forums.topic,
								posts: [...previousResult.forums.topic.posts, ...fetchMoreResult.forums.topic.posts]
							}
						}
					});

					return result;
				}
			});
		}
	}

	/**
	 * Loads earlier posts on demand
	 *
	 * @return 	void
	 */
	loadEarlierComments() {
		if (!this.props.data.loading) {

			this.setState({
				loadingEarlierPosts: true
			});

			// Initial offset
			const initialOffset = this.props.data.forums.topic.posts.length + (this.props.data.forums.topic.unreadPostPosition || 0);

			this.props.data.fetchMore({
				variables: {
					// When infinite loading, we must disable this otherwise the same unread posts will load again
					fromUnread: false,
					// Ensure the offset doesn't go below 0
					offset: Math.max(initialOffset - Expo.Constants.manifest.extra.per_page, 0)
				},
				updateQuery: (previousResult, { fetchMoreResult }) => {
					// We use this state to track whether we should show the Load Earlier Posts button
					this.setState({
						earlierPostsAvailable: ( initialOffset - Expo.Constants.manifest.extra.per_page ) > 0,
						loadingEarlierPosts: false
					});
					
					// Don't do anything if there wasn't any new items
					if (!fetchMoreResult || fetchMoreResult.forums.topic.posts.length === 0) {
						return previousResult;
					}

					// Now PREPEND the loaded posts to the existing ones
					// Since we're going backwards here, it's possible we're also pulling some of our
					// existing posts. To make sure we only show each post once, we need to ensure
					// the post array contains unique values.
					const postArray = [...fetchMoreResult.forums.topic.posts, ...previousResult.forums.topic.posts];
					const uniq = _.uniq(postArray, false, post => post.id);

					const result = Object.assign({}, previousResult, {
						forums: {
							...previousResult.forums,
							topic: {
								...previousResult.forums.topic,
								posts: uniq
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
			return <Post loading={true} />;
		}

		return <View style={{ height: 150 }} />;
	}

	/**
	 * Return the header component. Shows locked status, tags, etc.
	 *
	 * @return 	Component
	 */
	getHeaderComponent(topicData) {
		return (
			<React.Fragment>
				{this.getLoadPreviousButton()}
				{topicData.locked && <Text>This topic is locked</Text>}
				{topicData.tags.length && <TagList>{topicData.tags.map(tag => <Tag key={tag.name}>{tag.name}</Tag>)}</TagList>}
			</React.Fragment>
		);
	}

	/**
	 * Returns a "Load earlier posts" button, for cases where we're starting the post listing
	 * halfway through (e.g. when user chooses to go to first unread).
	 *
	 * @return 	Component
	 */
	getLoadPreviousButton() {
		if (this.state.earlierPostsAvailable) {
			return <LoadMoreComments loading={this.state.loadingEarlierPosts} onPress={() => this.loadEarlierComments()} label="Load Earlier Posts" />;
		}

		return null;
	}

	/**
	 * Render a post
	 *
	 * @param 	object 	item 		A post object (already transformed by this.buildPostData)
	 * @param 	object 	topicData 	The topic data
	 * @return 	Component
	 */
	renderItem(item, topicData) {
		let unreadBar = null;

		if (!this.shownUnreadBar && topicData.timeLastRead && item.timestamp > topicData.timeLastRead) {
			this.shownUnreadBar = true;
			unreadBar = <UnreadIndicator label="Unread Posts" />;
		}

		return (
			<React.Fragment>
				{unreadBar}
				<Post
					data={item}
					canReply={topicData.itemPermissions.canComment}
					profileHandler={() =>
						this.props.navigation.navigate("Profile", {
							id: item.author.id,
							name: item.author.name,
							photo: item.author.photo
						})
					}
					onPressReply={() =>
						this.props.navigation.navigate("ReplyTopic", {
							topicID: topicData.id,
							quotedPost: item
						})
					}
				/>
			</React.Fragment>
		);
	}

	render() {
		// status 3 == fetchMore, status 4 == refreshing
		if (this.props.data.loading && this.props.data.networkStatus !== 3 && this.props.data.networkStatus !== 4) {
			return (
				<PlaceholderRepeater repeat={4}>
					<Post loading={true} />
				</PlaceholderRepeater>
			);
		} else if (this.props.data.error) {
			const error = getErrorMessage(this.props.data.error, TopicViewScreen.errors);
			return <Text>Error: {this.props.data.error}</Text>;
		} else {
			const topicData = this.props.data.forums.topic;
			const listData = topicData.posts;

			// Reset unread marker
			this.shownUnreadBar = false;

			return (
				<View style={{ flex: 1 }}>
					<View style={{ flex: 1, flexGrow: 1 }}>
						<FlatList
							style={{ flex: 1 }}
							ref={flatList => (this._flatList = flatList)}
							keyExtractor={item => item.id}
							ListHeaderComponent={() => this.getHeaderComponent(topicData)}
							ListFooterComponent={() => this.getFooterComponent()}
							renderItem={({ item }) => this.renderItem(item, topicData)}
							data={listData}
							refreshing={this.props.data.networkStatus == 4}
							onRefresh={() => this.onRefresh()}
							onEndReached={() => this.onEndReached()}
						/>
						{this.props.data.forums.topic.itemPermissions.canComment && (
							<Pager light>
								<DummyTextInput
									onPress={() => {
										this.props.navigation.navigate("ReplyTopic", {
											topicID: topicData.id
										});
									}}
									placeholder="Write a reply..."
								/>
							</Pager>
						)}
					</View>
				</View>
			);
		}
	}
}

export default graphql(TopicViewQuery, {
	options: props => ({
		notifyOnNetworkStatusChange: true,
		variables: {
			id: props.navigation.state.params.id,
			fromUnread: true,
			limit: Expo.Constants.manifest.extra.per_page
		}
	})
})(TopicViewScreen);
