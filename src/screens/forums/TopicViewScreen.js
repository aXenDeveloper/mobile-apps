import React, { Component } from "react";
import { Text, View, Button, ScrollView, FlatList } from "react-native";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import Modal from "react-native-modal";
import _ from "underscore";

import TwoLineHeader from "../../atoms/TwoLineHeader";
import Post from "../../ecosystems/Post";
import Tag from "../../atoms/Tag";
import TagList from "../../atoms/TagList";
import Pager from "../../atoms/Pager";
import PagerButton from "../../atoms/PagerButton";

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

	render() {
		if (this.props.data.loading) {
			return (
				<View repeat={7}>
					<Text>Loading</Text>
				</View>
			);
		} else {
			const topicData = this.props.data.forums.topic;
			const listData = topicData.posts.map(post => ({
				key: post.id,
				data: {
					id: post.id,
					author: post.author,
					content: post.content,
					timestamp: post.timestamp,
					reactions: post.reputation.reactions,
					reputation: post.reputation,
					canReply: topicData.itemPermissions.canComment
				}
			}));

			return (
				<View style={{ flex: 1 }}>
					<View style={{ flex: 1, flexGrow: 1 }}>
						{topicData.locked ? <Text>This topic is locked</Text> : null}
						{topicData.tags.length ? <TagList>{topicData.tags.map(tag => <Tag key={tag.name}>{tag.name}</Tag>)}</TagList> : null}
						<FlatList
							style={{ flex: 1 }}
							ref={flatList => (this._flatList = flatList)}
							ListFooterComponent={() => <View style={{ height: 150 }} />}
							renderItem={({ item }) => (
								<Post
									key={item.key}
									data={item.data}
									profileHandler={() =>
										this.props.navigation.navigate("Profile", {
											id: item.data.author.id,
											name: item.data.author.name,
											photo: item.data.author.photo
										})
									}
									onPressReply={() =>
										this.props.navigation.navigate("ReplyTopic", {
											topicID: topicData.id,
											quotedPost: item.data
										})
									}
								/>
							)}
							data={listData}
							refreshing={this.props.data.networkStatus == 4}
							onRefresh={() => this.props.data.refetch()}
						/>
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
			limit: 25
		}
	})
})(TopicViewScreen);
