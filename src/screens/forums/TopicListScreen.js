import React, { Component } from "react";
import { Text, Image, View, Button, ScrollView, SectionList } from "react-native";
import gql from "graphql-tag";
import { graphql, compose, withApollo } from "react-apollo";
import { connect } from "react-redux";
import _ from "underscore";

import Lang from "../../utils/Lang";
import { PlaceholderRepeater } from "../../ecosystems/Placeholder";
import relativeTime from "../../utils/RelativeTime";
import getErrorMessage from "../../utils/getErrorMessage";
import FollowButton from "../../atoms/FollowButton";
import TwoLineHeader from "../../atoms/TwoLineHeader";
import ErrorBox from "../../atoms/ErrorBox";
import Pager from "../../atoms/Pager";
import PagerButton from "../../atoms/PagerButton";
import SectionHeader from "../../atoms/SectionHeader";
import ForumItem from "../../ecosystems/ForumItem";
import TopicRow from "../../ecosystems/TopicRow";
import AddButton from "../../atoms/AddButton";
import EndOfComments from "../../atoms/EndOfComments";
import { FollowModal, FollowModalFragment, FollowMutation, UnfollowMutation } from "../../ecosystems/FollowModal";

const TopicListQuery = gql`
	query TopicListQuery($forum: ID!, $offset: Int, $limit: Int, $password: String) {
		forums {
			forum(id: $forum) {
				id
				name
				topicCount
				passwordProtected
				passwordRequired
				subforums {
					id
					name
					topicCount
					postCount
					hasUnread
					lastPostAuthor {
						photo
					}
					lastPostDate
				}
				topics(offset: $offset, limit: $limit, password: $password) {
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
				follow {
					...FollowModalFragment
				}
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
	${FollowModalFragment}
`;

class TopicListScreen extends Component {
	static navigationOptions = ({ navigation }) => ({
		headerTitle:
			!navigation.state.params.title || !navigation.state.params.subtitle ? (
				<TwoLineHeader loading={true} />
			) : (
				<TwoLineHeader title={navigation.state.params.title} subtitle={navigation.state.params.subtitle} />
			),
		headerRight: navigation.state.params.showFollowControl && (
			<FollowButton followed={navigation.state.params.isFollowed} onPress={navigation.state.params.onPressFollow} />
		)
	});

	/**
	 * GraphQL error types
	 */
	static errors = {
		NO_FORUM: Lang.get("no_forum"),
		INCORRECT_PASSWORD: Lang.get("incorrect_forum_password")
	};

	constructor(props) {
		super(props);
		this.state = {
			reachedEnd: false,
			followModalVisible: false
		};

		if (this.props.auth.authenticated) {
			this.props.navigation.setParams({
				showFollowControl: false,
				isFollowed: false,
				onPressFollow: this.toggleFollowModal
			});
		}
	}

	/**
	 * Toggles between showing/hiding the follow modal
	 *
	 * @return 	void
	 */
	toggleFollowModal = () => {
		this.setState({
			followModalVisible: !this.state.followModalVisible
		});
	};

	/**
	 * Update the navigation params to set the title if we came direct, e.g. from search
	 *
	 * @param 	object 	prevProps 	Previous prop values
	 * @return 	void
	 */
	componentDidUpdate(prevProps) {
		if (prevProps.data.loading && !this.props.data.loading && !this.props.data.error) {
			if (!prevProps.navigation.state.params.title || !prevProps.navigation.state.params.subtitle) {
				this.props.navigation.setParams({
					title: this.props.data.forums.forum.name,
					subtitle: Lang.pluralize(Lang.get("topics"), this.props.data.forums.forum.topicCount)
				});
			}

			if (!this.props.data.forums.forum.passwordProtected) {
				this.props.navigation.setParams({
					showFollowControl: true,
					isFollowed: this.props.data.forums.forum.follow.isFollowing
				});
			}
		} else if (!prevProps.data.error && this.props.data.error) {
			this.props.navigation.setParams({
				showFollowControl: false
			});
		}
	}

	/**
	 * Handles infinite loading when user scrolls to end
	 *
	 * @return 	void
	 */
	onEndReached = () => {
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
	};

	/**
	 * Handle refreshing the view
	 *
	 * @return 	void
	 */
	onRefresh = () => {
		this.setState({
			reachedEnd: false
		});

		this.props.data.refetch();
	};

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
	 * @param 	object 	post 		A raw post object from GraphQL
	 * @param 	object 	topicData 	The topic data
	 * @return 	object
	 */
	buildTopicData(topic, forumData) {
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
	 * Build the subforum data object
	 *
	 * @param 	object 	subforums 	Subforum data
	 * @return 	array
	 */
	buildSubforumData(subforums) {
		return subforums.map(forum => ({
			key: forum.id,
			type: "forum",
			data: {
				id: forum.id,
				unread: forum.hasUnread,
				title: forum.name,
				topics: parseInt(forum.topicCount),
				posts: parseInt(forum.postCount) + parseInt(forum.topicCount),
				lastPostPhoto: forum.lastPostAuthor ? forum.lastPostAuthor.photo : null,
				lastPostDate: forum.lastPostDate
			}
		}));
	}

	/**
	 * Render a topic or a subforum, depending on the item type
	 *
	 * @param 	object 	item 		An item object for a topic or subforum
	 * @param 	object 	forumData 	The forum data
	 * @return 	Component
	 */
	renderItem(item, forumData) {
		if (item.type == "topic") {
			return <TopicRow data={item} />;
		} else {
			return <ForumItem key={item.key} data={item.data} />;
		}
	}

	/**
	 * Render a section header, but only if we have subforums to show
	 *
	 * @param 	object 	section 	The section we're rendering
	 * @return 	Component|null
	 */
	renderHeader(section) {
		if (!this.props.data.forums.forum.subforums.length) {
			return null;
		}

		return <SectionHeader title={section.title} />;
	}

	/**
	 * Event handler for following the forum
	 *
	 * @param 	object 		followData 		Object with the selected values from the modal
	 * @return 	void
	 */
	onFollow = async followData => {
		this.setState({
			followModalVisible: false
		});

		try {
			await this.props.client.mutate({
				mutation: FollowMutation,
				variables: {
					app: "forums",
					area: "forum",
					id: this.props.data.forums.forum.id,
					anonymous: followData.anonymous,
					type: followData.option.toUpperCase()
				}
			});

			this.props.navigation.setParams({
				isFollowed: true
			});
		} catch (err) {
			console.log(err); // @todo show proper error
		}
	};

	/**
	 * Event handler for unfollowing the forum
	 *
	 * @return 	void
	 */
	onUnfollow = async () => {
		this.setState({
			followModalVisible: false
		});

		try {
			await this.props.client.mutate({
				mutation: UnfollowMutation,
				variables: {
					app: "forums",
					area: "forum",
					id: this.props.data.forums.forum.id,
					followID: this.props.data.forums.forum.follow.followID
				}
			});

			this.props.navigation.setParams({
				isFollowed: false
			});
		} catch (err) {
			console.log(err); // @todo show proper error
		}
	};

	/**
	 * Event handler for tapping Create New Topic
	 *
	 * @return 	void
	 */
	createTopic = () => {
		const forumData = this.props.data.forums.forum;
		const settingsData = this.props.data.core.settings;

		this.props.navigation.navigate("CreateTopic", {
			forumID: this.props.navigation.state.params.id,
			tagsEnabled: forumData.create.tags.enabled,
			definedTags: forumData.create.tags.definedTags,
			tags_min: settingsData.tags_min,
			tags_len_min: settingsData.tags_len_min,
			tags_max: settingsData.tags_max,
			tags_len_max: settingsData.tags_len_max
		});
	};

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
			const forumData = this.props.data.forums.forum;
			const subforums = forumData.subforums;
			const topicData = forumData.topics.map(topic => this.buildTopicData(topic, forumData));
			const settingsData = this.props.data.core.settings;
			const forumSections = [];
			const ListEmptyComponent = <ErrorBox message={Lang.get("no_topics")} showIcon={false} />;

			// Add subforums if we have them
			if (forumData.subforums.length) {
				forumSections.push({
					title: Lang.get("subforums_title"),
					data: forumData.subforums.length ? this.buildSubforumData(forumData.subforums) : null
				});
			}

			// Add topics
			if (topicData.length) {
				forumSections.push({
					title: Lang.get("topics_title"),
					data: topicData
				});
			}

			return (
				<View contentContainerStyle={{ flex: 1 }} style={{ flex: 1 }}>
					<FollowModal
						isVisible={this.state.followModalVisible}
						followData={forumData.follow}
						onFollow={this.onFollow}
						onUnfollow={this.onUnfollow}
						close={this.toggleFollowModal}
					/>
					<View style={{ flex: 1 }}>
						<SectionList
							style={{ flex: 1 }}
							keyExtractor={item => item.type + item.id}
							renderSectionHeader={({ section }) => this.renderHeader(section)}
							renderItem={({ item }) => this.renderItem(item, forumData)}
							sections={forumSections}
							refreshing={this.props.data.networkStatus == 4}
							onRefresh={this.onRefresh}
							onEndReached={this.onEndReached}
							ListEmptyComponent={ListEmptyComponent}
						/>
						{forumData.create.canCreate && (
							<Pager>
								<AddButton icon={require("../../../resources/compose.png")} title={Lang.get("create_new_topic")} onPress={this.createTopic} />
							</Pager>
						)}
					</View>
				</View>
			);
		}
	}
}

export default compose(
	connect(state => ({
		auth: state.auth,
		forums: state.forums
	})),
	graphql(TopicListQuery, {
		options: props => ({
			notifyOnNetworkStatusChange: true,
			variables: {
				forum: props.navigation.state.params.id,
				offset: 0,
				limit: Expo.Constants.manifest.extra.per_page,
				password: props.forums[props.navigation.state.params.id] || null
			}
		})
	}),
	withApollo
)(TopicListScreen);
