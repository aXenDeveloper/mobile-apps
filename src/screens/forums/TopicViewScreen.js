import React, { Component } from "react";
import { Text, View, Button, ScrollView, FlatList, TextInput } from "react-native";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import Modal from "react-native-modal";
import _ from "underscore";

import getErrorMessage from "../../utils/getErrorMessage";
import TwoLineHeader from "../../atoms/TwoLineHeader";
import Post from "../../ecosystems/Post";
import Tag from "../../atoms/Tag";
import TagList from "../../atoms/TagList";
import Pager from "../../atoms/Pager";
import PagerButton from "../../atoms/PagerButton";
import DummyTextInput from "../../atoms/DummyTextInput";

const TopicViewQuery = gql`
	query TopicViewQuery($topic: ID!, $offset: Int, $limit: Int) {
		forums {
			topic(id: $topic) {
				id
				url
				tags {
					name
				}
				locked
				itemPermissions {
					canComment
				}
				posts(offset: $offset, limit: $limit) {
					id
					url
					timestamp
					author {
						id
						photo
						name
					}
					content
					reputation {
						canViewReps
						reactions {
							id
							image
							name
							count
						}
					}
				}
			}
		}
	}
`;

class TopicViewScreen extends Component {
	constructor(props) {
		super(props);
		this.flatList = null;
	}

	static navigationOptions = ({ navigation }) => ({
		headerTitle: (
			<TwoLineHeader
				title={navigation.state.params.title}
				subtitle={`Started by ${navigation.state.params.author}, ${navigation.state.params.started}`}
			/>
		)
	});

	static errors = {
		NO_TOPIC: "The topic does not exist."
	};

	/**
	 * If we have a goToEnd param, we've probably just added a new post
	 * After scrolling, reset that flag.
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
	}

	buildPostData(post, topicData) {
		return {
			id: post.id,
			author: post.author,
			content: post.content,
			timestamp: post.timestamp,
			reactions: post.reputation.reactions,
			reputation: post.reputation,
			canReply: topicData.itemPermissions.canComment
		};
	}

	render() {
		if (this.props.data.loading) {
			return (
				<View repeat={7}>
					<Text>Loading</Text>
				</View>
			);
		} else if (this.props.data.error) {
			const error = getErrorMessage(this.props.data.error, TopicViewScreen.errors);
			return <Text>{error}</Text>;
		} else {
			const topicData = this.props.data.forums.topic;
			const listData = topicData.posts.map(post => this.buildPostData(post, topicData));

			return (
				<View style={{ flex: 1 }}>
					<View style={{ flex: 1, flexGrow: 1 }}>
						{topicData.locked ? <Text>This topic is locked</Text> : null}
						{topicData.tags.length ? <TagList>{topicData.tags.map(tag => <Tag key={tag.name}>{tag.name}</Tag>)}</TagList> : null}
						<FlatList
							style={{ flex: 1 }}
							ref={flatList => (this._flatList = flatList)}
							keyExtractor={item => item.id}
							ListFooterComponent={() => <View style={{ height: 150 }} />}
							renderItem={({ item }) => (
								<Post
									data={item}
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
							)}
							data={listData}
							refreshing={this.props.data.networkStatus == 4}
							onRefresh={() => this.props.data.refetch()}
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
		variables: {
			topic: props.navigation.state.params.id,
			offset: 0,
			limit: Expo.Constants.manifest.extra.per_page
		}
	})
})(TopicViewScreen);
