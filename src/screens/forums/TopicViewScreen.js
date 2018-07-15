import React, { Component } from "react";
import { Text, View, Button, ScrollView, FlatList, TextInput } from "react-native";
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

const TopicViewQuery = gql`
	query TopicViewQuery($id: ID!, $offset: Int, $limit: Int) {
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
				posts(offset: $offset, limit: $limit) {
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
		this.flatList = null;
		this.shownUnreadBar = false;
		this.state = {
			reachedEnd: false
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
	componentDidUpdate(prevProps) {
		if (!_.isUndefined(this.props.navigation.state.params.goToEnd)) {
			if (!prevProps.navigation.state.params.goToEnd && this.props.navigation.state.params.goToEnd) {
				this._flatList.scrollToEnd();
				this.props.navigation.setParams({
					goToEnd: false
				});
			}
		}

		if (!this.props.navigation.state.params.author) {
			this.props.navigation.setParams({
				author: this.props.data.forums.topic.author.name,
				started: this.props.data.forums.topic.started,
				title: this.props.data.forums.topic.title
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
					offset: this.props.data.forums.topic.posts.length
				},
				updateQuery: (previousResult, { fetchMoreResult }) => {
					// Don't do anything if there wasn't any new items
					if (!fetchMoreResult || fetchMoreResult.forums.topic.posts.length === 0) {
						this.setState({
							reachedEnd: true
						});

						return previousResult;
					}

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
			console.log("Show unread Bar");
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
						{topicData.locked ? <Text>This topic is locked</Text> : null}
						{topicData.tags.length ? <TagList>{topicData.tags.map(tag => <Tag key={tag.name}>{tag.name}</Tag>)}</TagList> : null}
						<FlatList
							style={{ flex: 1 }}
							ref={flatList => (this._flatList = flatList)}
							keyExtractor={item => item.id}
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
			offset: 0,
			limit: Expo.Constants.manifest.extra.per_page
		}
	})
})(TopicViewScreen);
