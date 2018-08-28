import React, { Component } from "react";
import { Text, View, Button, ScrollView, FlatList, TouchableOpacity, TextInput } from "react-native";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import Modal from "react-native-modal";
import _ from "underscore";

import Lang from "../../utils/Lang";
import relativeTime from "../../utils/RelativeTime";
import { PlaceholderRepeater } from "../../ecosystems/Placeholder";
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
import EndOfComments from "../../atoms/EndOfComments";

const TopicViewQuery = gql`
	query TopicViewQuery($id: ID!, $offsetAdjust: Int, $offsetPosition: posts_offset_position, $limit: Int, $findComment: Int) {
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
				commentCount
				unreadCommentPosition
				findCommentPosition(findComment: $findComment)
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
				posts(offsetAdjust: $offsetAdjust, offsetPosition: $offsetPosition, limit: $limit, findComment: $findComment) {
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
		this._flatList = null; // Ref to the flatlist
		this._currentOffset = 0; // The offset we're currently displaying in the view
		this._initialOffsetDone = false; // Flag to indicate we've set our initial offset on render
		this._aboutToScrollToEnd = false; // Flag to indicate a scrollToEnd is pending so we can avoid other autoscrolls
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

	componentDidMount() {
		this.setCurrentOffset(this.props.data.variables.offset || 0);
	}

	/**
	 * Set the current offset that we're displaying
	 *
	 * @param 	number 		offset 		Offset to set
	 * @return 	void
	 */
	setCurrentOffset(offset) {
		this._currentOffset = offset;
	}

	/**
	 * Scroll to the end of our listing
	 *
	 * @return 	void
	 */
	scrollToEnd() {
		this._aboutToScrollToEnd = true;

		// I don't like this, but it appears to be necessary to trigger the
		// scroll after a short timeout to allow time for the list to render
		setTimeout(() => {
			this._flatList.scrollToEnd();
			this._aboutToScrollToEnd = false;
		}, 500);
	}

	/**
	 * Manage several areas that might need to change as we get data:
	 * - setting screen params if the screen loaded without them
	 * - setting the offset, and scrolling to the end of the view if needed
	 * - toggling the 'load earlier posts' button
	 *
	 * @param 	object 	prevProps 	Previous prop values
	 * @param 	object 	prevState 	Previous state values
	 * @return 	void
	 */
	componentDidUpdate(prevProps, prevState) {
		// If we mounted without the info we need to set the screen title, then set them now
		if (!this.props.navigation.state.params.author) {
			this.props.navigation.setParams({
				author: this.props.data.forums.topic.author.name,
				started: this.props.data.forums.topic.started,
				title: this.props.data.forums.topic.title
			});
		}

		// Update our offset tracker, but only if we haven't done it before, otherwise
		// we'll replace our offset with the initial offset every time the component updates
		if (!this._initialOffsetDone && !this.props.data.loading && !this.props.data.error) {
			if (this.props.data.variables.offsetPosition == "ID" && this.props.data.forums.topic.findCommentPosition) {
				// If we're starting at a specific post, then set the offset to that post's position
				this.setCurrentOffset(this.props.data.forums.topic.findCommentPosition);
				this._initialOffsetDone = true;
			} else if (this.props.data.variables.offsetPosition == "UNREAD" && this.props.data.forums.topic.unreadCommentPosition) {
				// If we're showing by unread, then the offset will be the last unread post position
				this.setCurrentOffset(this.props.data.forums.topic.unreadCommentPosition);
				this._initialOffsetDone = true;
			} else if (this.props.data.variables.offsetPosition == "LAST" && this.props.data.variables.offsetAdjust !== 0) {
				// If we're showing the last post, the offset will be the total post count plus our adjustment
				this.setCurrentOffset(this.props.data.forums.topic.commentCount + this.props.data.variables.offsetAdjust);
				this.setState({ reachedEnd: true });
				this.scrollToEnd();
				this._initialOffsetDone = true;
			}
		}

		// Figure out if we need to change the state that determines whether the
		// Load Earlier Posts button shows
		let showEarlierPosts = this._currentOffset > 0;

		if (prevState.earlierPostsAvailable == null || prevState.earlierPostsAvailable !== this.state.earlierPostsAvailable) {
			if (this.state.earlierPostsAvailable !== false) {
				this.setState({
					earlierPostsAvailable: showEarlierPosts
				});

				// Figure out if we need to scroll to hide the Load Earlier Posts button
				if (!this.props.data.loading && !this.props.data.error) {
					if (showEarlierPosts && !this._aboutToScrollToEnd) {
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

			const offsetAdjust = this._currentOffset + this.props.data.forums.topic.posts.length;

			// Don't try loading more if we're already showing everything in the topic
			if( offsetAdjust >= this.props.data.forums.topic.commentCount ){
				return;
			}			

			this.props.data.fetchMore({
				variables: {
					// When infinite loading, we must reset this otherwise the same unread posts will load again
					offsetPosition: "FIRST",
					offsetAdjust
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

			// Ensure the offset doesn't go below 0
			const offsetAdjust = Math.max(this._currentOffset - Expo.Constants.manifest.extra.per_page, 0);

			this.props.data.fetchMore({
				variables: {
					offsetPosition: "FIRST",
					offsetAdjust
				},
				updateQuery: (previousResult, { fetchMoreResult }) => {
					// We use this state to track whether we should show the Load Earlier Posts button
					this.setState({
						earlierPostsAvailable: this._currentOffset - Expo.Constants.manifest.extra.per_page > 0,
						loadingEarlierPosts: false
					});

					this.setCurrentOffset(offsetAdjust);

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

		return <EndOfComments />;
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
			return <LoadMoreComments loading={this.state.loadingEarlierPosts} onPress={() => this.loadEarlierComments()} label={Lang.get("load_earlier")} />;
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
		// If this is the unread bar, just return it
		if (!_.isUndefined(item.isUnreadBar)) {
			return <UnreadIndicator label={Lang.get("unread_posts")} />;
		}

		return (
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
			return <Text>Error: {error}</Text>;
		} else {
			const topicData = this.props.data.forums.topic;
			const listData = [...topicData.posts]; // Need to clone here in case we splice shortly...

			// Figure out if we need to show the unread bar. Get the index of the first
			// unread item and insert an unread object into our post array.
			// @todo check member id here to skip faster
			if (topicData.unreadCommentPosition && topicData.timeLastRead) {
				let firstUnread = listData.findIndex(post => post.timestamp > topicData.timeLastRead);

				if (firstUnread !== -1) {
					listData.splice(firstUnread, 0, {
						id: "unread", // We need a dummy id for keyExtractor to read
						isUnreadBar: true
					});
				}
			}

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
									placeholder={Lang.get("write_reply")}
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
	options: props => {
		let offsetPosition = "FIRST";
		let offsetAdjust = 0;
		let findComment = null;

		if (_.isNumber(props.navigation.state.params.findComment)) {
			offsetPosition = "ID";
			findComment = props.navigation.state.params.findComment;
		} else if (props.navigation.state.params.showLastComment || Expo.Constants.manifest.extra.contentBehavior == "last") {
			// If we're showing the last comment, we'll load the previous 'page' of posts too
			// via the offsetAdjust arg
			offsetPosition = "LAST";
			offsetAdjust = Expo.Constants.manifest.extra.per_page * -1;
		} else {
			if (Expo.Constants.manifest.extra.contentBehavior == "unread") {
				offsetPosition = "UNREAD";
			}

			offsetAdjust = props.navigation.state.params.offsetAdjust || 0;
		}

		return {
			notifyOnNetworkStatusChange: true,
			variables: {
				id: props.navigation.state.params.id,
				limit: Expo.Constants.manifest.extra.per_page,
				offsetPosition,
				offsetAdjust,
				findComment
			}
		};
	}
})(TopicViewScreen);
