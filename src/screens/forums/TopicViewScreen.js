import React, { Component } from "react";
import { Text, View, Button, ScrollView, FlatList, TouchableOpacity, TextInput } from "react-native";
import gql from "graphql-tag";
import { graphql, compose, withApollo } from "react-apollo";
import { connect } from "react-redux";
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
import ErrorBox from "../../atoms/ErrorBox";
import Pager from "../../atoms/Pager";
import PagerButton from "../../atoms/PagerButton";
import DummyTextInput from "../../atoms/DummyTextInput";
import UnreadIndicator from "../../atoms/UnreadIndicator";
import LoadMoreComments from "../../atoms/LoadMoreComments";
import EndOfComments from "../../atoms/EndOfComments";
import LoginRegisterPrompt from "../../ecosystems/LoginRegisterPrompt";
import FollowButton from "../../atoms/FollowButton";
import { FollowModal, FollowModalFragment, FollowMutation, UnfollowMutation } from "../../ecosystems/FollowModal";

import styles from "../../styles";

const TopicViewQuery = gql`
	query TopicViewQuery($id: ID!, $offsetAdjust: Int, $offsetPosition: forums_Post_offset_position, $limit: Int, $findComment: Int) {
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
				postCount
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
					canCommentIfSignedIn
				}
				posts(offsetAdjust: $offsetAdjust, offsetPosition: $offsetPosition, limit: $limit, findComment: $findComment) {
					...PostFragment
				}
				follow {
					...FollowModalFragment
				}
			}
		}
	}
	${PostFragment}
	${FollowModalFragment}
`;

class TopicViewScreen extends Component {
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
					subtitle={`Started by ${navigation.state.params.author}, ${relativeTime.long(navigation.state.params.started)}`} //@todo lang abstraction
				/>
			),
		headerRight: navigation.state.params.showFollowControl && (
			<FollowButton followed={navigation.state.params.isFollowed} onPress={navigation.state.params.onPressFollow} />
		)
	});

	/**
	 * GraphQL error types
	 */
	static errors = {
		NO_TOPIC: Lang.get("no_topic")
	};

	constructor(props) {
		super(props);
		this._flatList = null; // Ref to the flatlist
		//this._currentOffset = 0; // The offset we're currently displaying in the view
		this._initialOffsetDone = false; // Flag to indicate we've set our initial offset on render
		this._aboutToScrollToEnd = false; // Flag to indicate a scrollToEnd is pending so we can avoid other autoscrolls
		this.state = {
			reachedEnd: false,
			earlierPostsAvailable: null,
			loadingEarlierPosts: false,
			currentOffset: this.props.data.variables.offset || 0
		};

		if (this.props.auth.authenticated) {
			this.props.navigation.setParams({
				showFollowControl: false,
				isFollowed: false,
				onPressFollow: this.toggleFollowModal
			});
		}

		this.loadEarlierComments = this.loadEarlierComments.bind(this);
		this.toggleFollowModal = this.toggleFollowModal.bind(this);
		this.onEndReached = this.onEndReached.bind(this);
		this.onRefresh = this.onRefresh.bind(this);
		this.onFollow = this.onFollow.bind(this);
		this.onUnfollow = this.onUnfollow.bind(this);
		this.addReply = this.addReply.bind(this);
	}

	/**
	 * Toggles between showing/hiding the follow modal
	 *
	 * @return 	void
	 */
	toggleFollowModal() {
		this.setState({
			followModalVisible: !this.state.followModalVisible
		});
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
		// If we're no longer loading, toggle the follow button if needed
		if (prevProps.data.loading && !this.props.data.loading && !this.props.data.error) {
			// If we mounted without the info we need to set the screen title, then set them now
			if (!this.props.navigation.state.params.author) {
				this.props.navigation.setParams({
					author: this.props.data.forums.topic.author.name,
					started: this.props.data.forums.topic.started,
					title: this.props.data.forums.topic.title
				});
			}

			if (!this.props.data.forums.topic.passwordProtected) {
				this.props.navigation.setParams({
					showFollowControl: true,
					isFollowed: this.props.data.forums.topic.follow.isFollowing
				});
			}
		} else if (!prevProps.data.error && this.props.data.error) {
			this.props.navigation.setParams({
				showFollowControl: false
			});
		}

		// Update our offset tracker, but only if we haven't done it before, otherwise
		// we'll replace our offset with the initial offset every time the component updates
		if (!this._initialOffsetDone && !this.props.data.loading && !this.props.data.error) {
			if (this.props.data.variables.offsetPosition == "ID" && this.props.data.forums.topic.findCommentPosition) {
				// If we're starting at a specific post, then set the offset to that post's position
				this.setState({
					currentOffset: this.props.data.forums.topic.findCommentPosition
				});
				this._initialOffsetDone = true;
			} else if (this.props.data.variables.offsetPosition == "UNREAD" && this.props.data.forums.topic.unreadCommentPosition) {
				// If we're showing by unread, then the offset will be the last unread post position
				this.setState({
					currentOffset: this.props.data.forums.topic.unreadCommentPosition
				});
				this._initialOffsetDone = true;
			} else if (this.props.data.variables.offsetPosition == "LAST" && this.props.data.variables.offsetAdjust !== 0) {
				// If we're showing the last post, the offset will be the total post count plus our adjustment
				this.setState({
					reachedEnd: true,
					currentOffset: this.props.data.forums.topic.commentCount + this.props.data.variables.offsetAdjust
				});
				this.scrollToEnd();
				this._initialOffsetDone = true;
			}
		}

		// Figure out if we need to change the state that determines whether the
		// Load Earlier Posts button shows
		if (prevState.earlierPostsAvailable == null || prevState.currentOffset !== this.state.currentOffset) {
			//if (this.state.earlierPostsAvailable !== false) {
			const showEarlierPosts = this.state.currentOffset > 0;

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
			//}
		}
	}

	/**
	 * Handles infinite loading when user scrolls to end
	 *
	 * @return 	void
	 */
	onEndReached() {
		if (!this.props.data.loading && !this.state.reachedEnd) {
			const offsetAdjust = this.state.currentOffset + this.props.data.forums.topic.posts.length;

			// Don't try loading more if we're already showing everything in the topic
			if (offsetAdjust >= this.props.data.forums.topic.commentCount) {
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
			const offsetAdjust = Math.max(this.state.currentOffset - Expo.Constants.manifest.extra.per_page, 0);

			this.props.data.fetchMore({
				variables: {
					offsetPosition: "FIRST",
					offsetAdjust
				},
				updateQuery: (previousResult, { fetchMoreResult }) => {
					// We use this state to track whether we should show the Load Earlier Posts button
					this.setState({
						earlierPostsAvailable: this.state.currentOffset - Expo.Constants.manifest.extra.per_page > 0,
						loadingEarlierPosts: false,
						currentOffset: offsetAdjust
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
			return <LoadMoreComments loading={this.state.loadingEarlierPosts} onPress={this.loadEarlierComments} label={Lang.get("load_earlier")} />;
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
		if (item.id === "unread") {
			return <UnreadIndicator label={Lang.get("unread_posts")} />;
		} else if (item.id === "loginPrompt") {
			return (
				<LoginRegisterPrompt
					style={{ marginBottom: 7 }}
					register={this.props.site.settings.allow_reg !== "DISABLED"}
					registerUrl={this.props.site.settings.allow_reg_target || null}
					navigation={this.props.navigation}
					message={Lang.get(this.props.site.settings.allow_reg !== "DISABLED" ? "login_register_prompt_comment" : "login_prompt_comment", {
						siteName: this.props.site.settings.board_name
					})}
				/>
			);
		}

		return <Post data={item} key={item.id} canReply={topicData.itemPermissions.canComment} topic={topicData} />;
	}

	/**
	 * Modify our raw posts array to insert components for login prompt, unread bar etc.
	 * This function inserts a dummy object that renderItem() will see to use the correct component
	 *
	 * @return 	array
	 */
	getListData() {
		const topicData = this.props.data.forums.topic;
		const returnedData = [...topicData.posts]; // Need to clone here in case we splice shortly...

		// If they're a guest, insert an item so that a login prompt will show
		// Only if we're at the start of the topic
		if (!this.props.auth.authenticated && topicData.posts[0].isFirstPost && topicData.itemPermissions.canCommentIfSignedIn) {
			returnedData.splice(1, 0, {
				id: "loginPrompt"
			});
		}

		// Figure out if we need to show the unread bar. Get the index of the first
		// unread item and insert an unread object into our post array.
		if (this.props.auth.authenticated && topicData.unreadCommentPosition && topicData.timeLastRead) {
			let firstUnread = topicData.posts.findIndex(post => post.timestamp > topicData.timeLastRead);

			if (firstUnread !== -1) {
				returnedData.splice(firstUnread, 0, {
					id: "unread" // We need a dummy id for keyExtractor to read
				});
			}
		}

		return returnedData;
	}

	/**
	 * Event handler for following the forum
	 *
	 * @param 	object 		followData 		Object with the selected values from the modal
	 * @return 	void
	 */
	async onFollow(followData) {
		this.setState({
			followModalVisible: false
		});

		try {
			await this.props.client.mutate({
				mutation: FollowMutation,
				variables: {
					app: "forums",
					area: "topic",
					id: this.props.data.forums.topic.id,
					anonymous: followData.anonymous,
					type: followData.option.toUpperCase()
				}
			});

			this.props.navigation.setParams({
				isFollowed: true
			});
		} catch (err) {
			Alert.alert(Lang.get("error"), Lang.get("error_following"), [{ text: Lang.get("ok") }], { cancelable: false });
		}
	}

	/**
	 * Event handler for unfollowing the forum
	 *
	 * @return 	void
	 */
	async onUnfollow() {
		this.setState({
			followModalVisible: false
		});

		try {
			await this.props.client.mutate({
				mutation: UnfollowMutation,
				variables: {
					app: "forums",
					area: "topic",
					id: this.props.data.forums.topic.id,
					followID: this.props.data.forums.topic.follow.followID
				}
			});

			this.props.navigation.setParams({
				isFollowed: false
			});
		} catch (err) {
			Alert.alert(Lang.get("error"), Lang.get("error_unfollowing"), [{ text: Lang.get("ok") }], { cancelable: false });
		}
	}

	addReply() {
		this.props.navigation.navigate("ReplyTopic", {
			topicID: this.props.data.forums.topic.id
		});
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
			const message = error ? error : Lang.get("topic_view_error");
			return <ErrorBox message={message} />;
		} else {
			const topicData = this.props.data.forums.topic;
			const listData = this.getListData();

			return (
				<View style={styles.flex}>
					<View style={[styles.flex, styles.flexGrow]}>
						<FollowModal
							isVisible={this.state.followModalVisible}
							followData={topicData.follow}
							onFollow={this.onFollow}
							onUnfollow={this.onUnfollow}
							close={this.toggleFollowModal}
						/>
						<FlatList
							style={styles.flex}
							ref={flatList => (this._flatList = flatList)}
							keyExtractor={item => item.id}
							ListHeaderComponent={this.getHeaderComponent(topicData)}
							ListFooterComponent={this.getFooterComponent()}
							renderItem={({ item }) => this.renderItem(item, topicData)}
							data={listData}
							refreshing={this.props.data.networkStatus == 4}
							onRefresh={this.onRefresh}
							onEndReached={this.onEndReached}
						/>
						{this.props.data.forums.topic.itemPermissions.canComment && (
							<Pager light>
								<DummyTextInput onPress={this.addReply} placeholder={Lang.get("write_reply")} />
							</Pager>
						)}
					</View>
				</View>
			);
		}
	}
}

export default compose(
	graphql(TopicViewQuery, {
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
	}),
	connect(state => ({
		auth: state.auth,
		site: state.site
	})),
	withApollo
)(TopicViewScreen);
