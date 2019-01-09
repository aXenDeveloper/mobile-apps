import React, { Component } from "react";
import { Text, Image, View, Button, ScrollView, FlatList, TouchableOpacity, TextInput, StyleSheet, Alert } from "react-native";
import gql from "graphql-tag";
import { graphql, compose, withApollo } from "react-apollo";
import { connect } from "react-redux";
import Modal from "react-native-modal";
import _ from "underscore";
import shortNumber from "short-number";

import Lang from "../../utils/Lang";
import relativeTime from "../../utils/RelativeTime";
import { PlaceholderRepeater } from "../../ecosystems/Placeholder";
import getErrorMessage from "../../utils/getErrorMessage";
import TwoLineHeader from "../../atoms/TwoLineHeader";
import ShadowedArea from "../../atoms/ShadowedArea";
import { Post, PostFragment } from "../../ecosystems/Post";
import { PollPreview, PollModal, PollFragment } from "../../ecosystems/Poll";
import { QuestionVote, BestAnswer } from "../../ecosystems/TopicView";
import Tag from "../../atoms/Tag";
import TagList from "../../atoms/TagList";
import ErrorBox from "../../atoms/ErrorBox";
import Pager from "../../atoms/Pager";
import ContentItemStat from "../../atoms/ContentItemStat";
import PagerButton from "../../atoms/PagerButton";
import DummyTextInput from "../../atoms/DummyTextInput";
import UnreadIndicator from "../../atoms/UnreadIndicator";
import LoadMoreComments from "../../atoms/LoadMoreComments";
import EndOfComments from "../../atoms/EndOfComments";
import LoginRegisterPrompt from "../../ecosystems/LoginRegisterPrompt";
import FollowButton from "../../atoms/FollowButton";
import { FollowModal, FollowModalFragment, FollowMutation, UnfollowMutation } from "../../ecosystems/FollowModal";

import styles, { styleVars } from "../../styles";
import icons from "../../icons";

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
				isUnread
				timeLastRead
				postCount
				views
				unreadCommentPosition
				findCommentPosition(findComment: $findComment)
				started
				updated
				title
				author {
					__typename
					name
				}
				tags {
					__typename
					name
				}
				isLocked
				poll {
					...PollFragment
				}
				itemPermissions {
					__typename
					canComment
					canCommentIfSignedIn
					canMarkAsRead
				}
				posts(offsetAdjust: $offsetAdjust, offsetPosition: $offsetPosition, limit: $limit, findComment: $findComment) {
					...PostFragment
					isQuestion
					answerVotes
					isBestAnswer
					canVoteUp
					canVoteDown
					vote
				}
				follow {
					...FollowModalFragment
				}
				isQuestion
				questionVotes
				canVoteUp
				canVoteDown
				vote
				hasBestAnswer
				canSetBestAnswer
				bestAnswerID
			}
		}
	}
	${PollFragment}
	${PostFragment}
	${FollowModalFragment}
`;

const MarkTopicRead = gql`
	mutation MarkTopicRead($id: ID!) {
		mutateForums {
			markTopicRead(id: $id) {
				timeLastRead
				unreadCommentPosition
				isUnread
			}
		}
	}
`;

const VoteQuestion = gql`
	mutation VoteQuestion($id: ID!, $vote: forums_InputVoteQuestionType!) {
		mutateForums {
			voteQuestion(id: $id, vote: $vote) {
				id
				questionVotes
				canVoteUp
				canVoteDown
				vote
				hasBestAnswer
			}
		}
	}
`;

const VoteAnswer = gql`
	mutation VoteAnswer($id: ID!, $vote: forums_InputVoteAnswerType!) {
		mutateForums {
			voteAnswer(id: $id, vote: $vote) {
				id
				answerVotes
				isBestAnswer
				canVoteUp
				canVoteDown
				vote
			}
		}
	}
`;

const SetBestAnswer = gql`
	mutation SetBestAnswer($id: ID!) {
		mutateForums {
			setBestAnswer(id: $id) {
				id
				isBestAnswer
			}
		}
	}
`;

class TopicViewScreen extends Component {
	/**
	 * React Navigation config
	 */
	static navigationOptions = ({ navigation }) => ({
		headerTitle:
			!navigation.state.params.title || !navigation.state.params.author ? (
				<TwoLineHeader loading={true} />
			) : (
				<TwoLineHeader
					title={navigation.state.params.title}
					subtitle={`Started by ${navigation.state.params.author}`} //@todo lang abstraction
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
		NO_TOPIC: Lang.get("no_topic"),
		INVALID_ID: Lang.get("invalid_topic"),
		NON_QUESTION: Lang.get("not_question"),
		CANNOT_VOTE: Lang.get("cannot_vote")
	};

	constructor(props) {
		super(props);
		this._flatList = null; // Ref to the flatlist
		//this._startingOffset = 0; // The offset we're currently displaying in the view
		this._initialOffsetDone = false; // Flag to indicate we've set our initial offset on render
		this._aboutToScrollToEnd = false; // Flag to indicate a scrollToEnd is pending so we can avoid other autoscrolls
		this._answerVoteUpHandlers = {}; // Stores memoized event handlers for voting answers up
		this._answerVoteDownHandlers = {}; // Stores memoized event handlers for voting answers up
		this._bestAnswerHandlers = {}; // Stores memoized event handlers for settings answers as best
		this.state = {
			reachedEnd: false,
			earlierPostsAvailable: null,
			loadingEarlierPosts: false,
			startingOffset: this.props.data.variables.offset || 0,
			pollModalVisible: false,
			followModalVisible: false
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
		this.goToPollScreen = this.goToPollScreen.bind(this);
		this.onEndReached = this.onEndReached.bind(this);
		this.onRefresh = this.onRefresh.bind(this);
		this.onFollow = this.onFollow.bind(this);
		this.onUnfollow = this.onUnfollow.bind(this);
		this.addReply = this.addReply.bind(this);
		this.onVoteQuestionUp = this.onVoteQuestionUp.bind(this);
		this.onVoteQuestionDown = this.onVoteQuestionDown.bind(this);
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
					title: this.props.data.forums.topic.title
				});
			}

			// Check if we should mark this read
			this.maybeMarkAsRead();

			// If follow controls are available, show them
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
					startingOffset: this.props.data.forums.topic.findCommentPosition
				});
				this._initialOffsetDone = true;
			} else if (this.props.data.variables.offsetPosition == "UNREAD" && this.props.data.forums.topic.unreadCommentPosition) {
				// If we're showing by unread, then the offset will be the last unread post position
				this.setState({
					startingOffset: this.props.data.forums.topic.unreadCommentPosition
				});
				this._initialOffsetDone = true;
			} else if (this.props.data.variables.offsetPosition == "LAST" && this.props.data.variables.offsetAdjust !== 0) {
				// If we're showing the last post, the offset will be the total post count plus our adjustment
				this.setState({
					reachedEnd: true,
					startingOffset: this.props.data.forums.topic.commentCount + this.props.data.variables.offsetAdjust
				});
				this.scrollToEnd();
				this._initialOffsetDone = true;
			}
		}

		// Figure out if we need to change the state that determines whether the
		// Load Earlier Posts button shows
		if (prevState.earlierPostsAvailable == null || prevState.startingOffset !== this.state.startingOffset) {
			//if (this.state.earlierPostsAvailable !== false) {
			const showEarlierPosts = this.state.startingOffset > 0;

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
			const offsetAdjust = this.state.startingOffset + this.props.data.forums.topic.posts.length;

			// Don't try loading more if we're already showing everything in the topic
			if (offsetAdjust >= this.props.data.forums.topic.commentCount) {
				return;
			}

			this.props.data.fetchMore({
				variables: {
					// When infinite loading, we must reset this otherwise the same unread posts will load again
					offsetPosition: "FIRST",
					offsetAdjust,
					limit: Expo.Constants.manifest.extra.per_page
				},
				updateQuery: (previousResult, { fetchMoreResult }) => {
					// Don't do anything if there were no new items
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

					// Check if we should mark this read
					this.maybeMarkAsRead();

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
			const offsetAdjust = Math.max(this.state.startingOffset - Expo.Constants.manifest.extra.per_page, 0);

			this.props.data.fetchMore({
				variables: {
					offsetPosition: "FIRST",
					offsetAdjust,
					limit: Expo.Constants.manifest.extra.per_page
				},
				updateQuery: (previousResult, { fetchMoreResult }) => {
					// We use this state to track whether we should show the Load Earlier Posts button
					this.setState({
						earlierPostsAvailable: this.state.startingOffset - Expo.Constants.manifest.extra.per_page > 0,
						loadingEarlierPosts: false,
						startingOffset: offsetAdjust
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

	async maybeMarkAsRead() {
		const offsetAdjust = this.state.startingOffset + this.props.data.forums.topic.posts.length;

		// If we are unread and on the last 'page' of results...
		if (
			this.props.data.forums.topic.itemPermissions.canMarkRead &&
			this.props.data.forums.topic.isUnread &&
			offsetAdjust >= this.props.data.forums.topic.postCount - Expo.Constants.manifest.extra.per_page
		) {
			try {
				const { data } = await this.props.client.mutate({
					mutation: MarkTopicRead,
					variables: {
						id: this.props.data.forums.topic.id
					},
					optimisticResponse: {
						mutateForums: {
							__typename: "mutate_Forums",
							markTopicRead: {
								...this.props.data.forums.topic,
								isUnread: false
							}
						}
					}
				});
			} catch (err) {
				console.log("Couldn't mark topic as read: " + err);
			}
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
	 * Event handler for voting the question up
	 *
	 * @return 	void
	 */
	onVoteQuestionUp() {
		const topicData = this.props.data.forums.topic;

		if (topicData.vote == "UP" || !topicData.canVoteUp) {
			return;
		}

		this.onVoteQuestion("UP");
	}

	/**
	 * Event handler for voting the question down
	 *
	 * @return 	void
	 */
	onVoteQuestionDown() {
		const topicData = this.props.data.forums.topic;

		if (topicData.vote == "DOWN" || !topicData.canVoteDown) {
			return;
		}

		this.onVoteQuestion("DOWN");
	}

	/**
	 * Update the question with the given vote type and optimistically update UI
	 *
	 * @param 	string 		vote 		'UP' or 'DOWN'
	 * @return 	void
	 */
	async onVoteQuestion(vote) {
		const topicData = this.props.data.forums.topic;
		let questionVotes = topicData.questionVotes;

		// If we've already voted, reverse that first
		if (topicData.vote) {
			if (topicData.vote == "UP") {
				questionVotes--;
			} else {
				questionVotes++;
			}
		}

		// Now adjust for this new vote
		questionVotes = questionVotes + (vote == "UP" ? 1 : -1);

		try {
			const { data } = await this.props.client.mutate({
				mutation: VoteQuestion,
				variables: {
					id: this.props.data.forums.topic.id,
					vote
				},
				optimisticResponse: {
					mutateForums: {
						__typename: "mutate_Forums",
						voteQuestion: {
							...this.props.data.forums.topic,
							questionVotes,
							canVoteUp: vote !== "UP",
							canVoteDown: vote !== "DOWN",
							vote
						}
					}
				}
			});
		} catch (err) {
			const error = getErrorMessage(err, TopicViewScreen.errors);
			Alert.alert(Lang.get("error"), error ? error : Lang.get("error_voting_question"), [{ text: Lang.get("ok") }], { cancelable: false });
		}
	}

	/**
	 * Update an answer with the given vote type and optimistically update UI
	 *
	 * @param 	string|int 	id 			Post ID
	 * @param 	string 		vote 		'UP' or 'DOWN'
	 * @return 	void
	 */
	async onVoteAnswer(id, vote) {
		const postData = _.find(this.props.data.forums.topic.posts, post => parseInt(post.id) === parseInt(id));

		if (!postData) {
			Alert.alert(Lang.get("error"), error ? error : Lang.get("error_voting_answer"), [{ text: Lang.get("ok") }], { cancelable: false });
			return;
		}

		let answerVotes = postData.answerVotes;

		// If we've already voted, reverse that first
		if (postData.vote) {
			if (postData.vote == "UP") {
				answerVotes--;
			} else {
				answerVotes++;
			}
		}

		// Now adjust for this new vote
		answerVotes = answerVotes + (vote == "UP" ? 1 : -1);

		try {
			const { data } = await this.props.client.mutate({
				mutation: VoteAnswer,
				variables: {
					id,
					vote
				},
				optimisticResponse: {
					mutateForums: {
						__typename: "mutate_Forums",
						voteAnswer: {
							...postData,
							answerVotes,
							canVoteUp: vote !== "UP",
							canVoteDown: vote !== "DOWN",
							vote
						}
					}
				}
			});
		} catch (err) {
			const error = getErrorMessage(err, TopicViewScreen.errors);
			Alert.alert(Lang.get("error"), error ? error : Lang.get("error_voting_question"), [{ text: Lang.get("ok") }], { cancelable: false });
		}
	}

	/**
	 * Return the header component. Shows locked status, tags, etc.
	 *
	 * @return 	Component
	 */
	getHeaderComponent(topicData) {
		return (
			<React.Fragment>
				<ShadowedArea style={[styles.flexRow, styles.flexAlignStretch, styles.pvStandard, styles.mbStandard]}>
					{topicData.isQuestion && (
						<View style={styles.flexAlignSelfCenter}>
							<QuestionVote
								score={topicData.questionVotes}
								hasVotedUp={topicData.vote == "UP"}
								hasVotedDown={topicData.vote == "DOWN"}
								canVoteUp={topicData.canVoteUp}
								canVoteDown={topicData.canVoteDown}
								downvoteEnabled={this.props.site.settings.forums_questions_downvote}
								onVoteUp={this.onVoteQuestionUp}
								onVoteDown={this.onVoteQuestionDown}
							/>
						</View>
					)}
					<View style={[styles.flexGrow, styles.flexAlignSelfCenter, !topicData.isQuestion ? styles.phWide : null]}>
						<View style={styles.flexRow}>
							<ContentItemStat value={relativeTime.short(topicData.started)} name="Started" />
							<ContentItemStat value={relativeTime.short(topicData.updated)} name="Updated" />
							<ContentItemStat value={shortNumber(topicData.postCount)} name="Replies" />
							<ContentItemStat value={shortNumber(topicData.views)} name="Views" />
						</View>
						{(topicData.tags.length || topicData.isLocked) && (
							<View style={[styles.mtStandard, styles.ptStandard, componentStyles.metaInfo, topicData.isQuestion ? styles.plWide : null]}>
								{topicData.tags.length && <TagList>{topicData.tags.map(tag => <Tag key={tag.name}>{tag.name}</Tag>)}</TagList>}
								{topicData.isLocked && <Text>This topic is locked</Text>}
							</View>
						)}
					</View>
				</ShadowedArea>
				{topicData.poll !== null && <PollPreview data={topicData.poll} onPress={this.goToPollScreen} />}
				{this.getLoadPreviousButton()}
			</React.Fragment>
		);
	}

	goToPollScreen() {
		/*this.setState({
			pollModalVisible: !this.state.pollModalVisible
		});*/
		this.props.navigation.navigate("Poll", {
			data: this.props.data.forums.topic.poll,
			itemID: this.props.data.forums.topic.id
		});
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

		const voteControl = this.getAnswerVoteComponent(item);
		const questionHeaderControl = this.getQuestionHeaderComponent(item);
		const additionalPostStyle = this.getAdditionalPostStyles(item);

		return (
			<Post
				data={item}
				key={item.id}
				canReply={topicData.itemPermissions.canComment}
				topic={topicData}
				leftComponent={voteControl}
				topComponent={questionHeaderControl}
				style={additionalPostStyle}
			/>
		);
	}

	getAdditionalPostStyles(post) {
		if (!this.props.data.forums.topic.isQuestion) {
			return null;
		}

		if (post.isQuestion || post.isBestAnswer) {
			return [styles.mbStandard];
		}
	}

	getQuestionHeaderComponent(post) {
		if (!this.props.data.forums.topic.isQuestion) {
			return null;
		}

		if (post.isQuestion) {
			return (
				<View style={[styles.mhWide, styles.pbStandard, styles.mbStandard, styles.bBorder, styles.mediumBorder]}>
					<Text style={[styles.standardText, styles.mediumText]}>Question asked by {this.props.data.forums.topic.author.name}</Text>
				</View>
			);
		}

		if (post.isBestAnswer) {
			return (
				<View style={[styles.mhWide, styles.pbStandard, styles.mbStandard, styles.bBorder, styles.mediumBorder]}>
					<Text style={[styles.standardText, styles.mediumText]}>Best answer to this question</Text>
				</View>
			);
		}
	}

	getAnswerVoteComponent(post) {
		const topicData = this.props.data.forums.topic;
		
		if (!topicData.isQuestion || post.isQuestion) {
			return null;
		}

		return (
			<View>
				<QuestionVote
					score={post.answerVotes}
					hasVotedUp={post.vote == "UP"}
					hasVotedDown={post.vote == "DOWN"}
					canVoteUp={post.canVoteUp}
					canVoteDown={post.canVoteDown}
					downvoteEnabled={this.props.site.settings.forums_questions_downvote}
					onVoteUp={this.getQuestionVoteUpHandler(post.id)}
					onVoteDown={this.getQuestionVoteDownHandler(post.id)}
					smaller
				/>

				{(post.isBestAnswer || topicData.canSetBestAnswer) && (
					<View style={[styles.flexRow, styles.flexJustifyCenter, styles.mvStandard]}>
						<BestAnswer
							setBestAnswer={topicData.canSetBestAnswer && !post.isBestAnswer ? this.getSetBestAnswerHandler(post.id) : null}
							isBestAnswer={post.isBestAnswer}
						/>
					</View>
				)}
			</View>
		);
	}

	getSetBestAnswerHandler(id) {
		if (_.isUndefined(this._bestAnswerHandlers[id])) {
			this._bestAnswerHandlers[id] = () => this.onSetBestAnswer(id);
		}

		return this._bestAnswerHandlers[id];
	}

	getQuestionVoteDownHandler(id) {
		if (_.isUndefined(this._answerVoteDownHandlers[id])) {
			this._answerVoteDownHandlers[id] = () => this.onVoteAnswer(id, "DOWN");
		}

		return this._answerVoteDownHandlers[id];
	}

	getQuestionVoteUpHandler(id) {
		if (_.isUndefined(this._answerVoteUpHandlers[id])) {
			this._answerVoteUpHandlers[id] = () => this.onVoteAnswer(id, "UP");
		}

		return this._answerVoteUpHandlers[id];
	}

	onSetBestAnswer(id) {
		const topicData = this.props.data.forums.topic;

		// If the selected post isn't the same as the one that's already best answer, prompt for the change
		if (topicData.hasBestAnswer && parseInt(topicData.bestAnswerID) !== parseInt(id)) {
			Alert.alert(
				Lang.get("replace_best_answer_title"), 
				Lang.get("replace_best_answer_text"), 
				[
					{ text: Lang.get("cancel"), onPress: () => console.log("cancel") },
					{ text: Lang.get("replace"), onPress: () => this.updateBestAnswer(id) }
				], 
				{ cancelable: false }
			);
		} else {
			this.updateBestAnswer(id);
		}
	}

	async updateBestAnswer(id) {
		const topicData = this.props.data.forums.topic;
		const newBestAnswer = _.find(topicData.posts, post => parseInt(post.id) === parseInt(id));
		const existingBestAnswer = topicData.hasBestAnswer ? _.find(topicData.posts, post => parseInt(post.id) === parseInt(topicData.bestAnswerID)) : null;

		try {
			const { data } = await this.props.client.mutate({
				mutation: SetBestAnswer,
				variables: {
					id
				},
				optimisticResponse: {
					mutateForums: {
						__typename: "mutate_Forums",
						setBestAnswer: {
							...newBestAnswer,
							isBestAnswer: true
						}
					}
				},
				update: (proxy) => {
					// So, what's happening here...
					// We need to update both the topic and the existing Best Answer (if one is set) in our local cache so that the UI reflects
					// this change. We do this by writing fragments to the local cache in GraphQL syntax.
					try {
						proxy.writeQuery({
							query: gql`
								query Topic {
									__typename
									forums {
										__typename
										topic(id: ${topicData.id}) {
											id
											__typename
											bestAnswerID
											hasBestAnswer
										}
									}
								}
							`,
							data: {
								__typename: 'Query',
								forums: {
									__typename: 'forums',
									topic: {
										__typename: 'forums_Topic',
										id: topicData.id,
										bestAnswerID: newBestAnswer.id,
										hasBestAnswer: true
									}
								}
							}
						});
					} catch (err) {
						console.log(err);
					}

					if( existingBestAnswer !== null ){
						try {
							proxy.writeQuery({
								query: gql`
									query Post {
										__typename
										forums {
											__typename
											post(id: ${existingBestAnswer.id}) {
												id
												__typename
												isBestAnswer
											}
										}
									}
								`,
								data: {
									__typename: 'Query',
									forums: {
										__typename: 'forums',
										post: {
											id: existingBestAnswer.id,
											__typename: 'forums_Post',
											isBestAnswer: false
										}
									}
								}
							});
						} catch (err) {
							console.log(err);
						}
					}
				}
			});
		} catch (err) {
			console.log("Couldn't set post as best answer: " + err); // @todo error
		}
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
						{this.props.data.forums.topic.poll !== null && (
							<PollModal isVisible={this.state.pollModalVisible} data={this.props.data.forums.topic.poll} />
						)}
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

const componentStyles = StyleSheet.create({
	metaInfo: {
		borderTopWidth: 1,
		borderTopColor: styleVars.borderColors.medium
	}
});
