import React, { Component } from "react";
import { Text, View, Button, SectionList, TouchableHighlight } from "react-native";
import gql from "graphql-tag";
import { graphql } from "react-apollo";

import SectionHeader from "../../ecosystems/SectionHeader";
import ForumItem from "../../ecosystems/ForumItem";

const ForumQuery = gql`
	query ForumQuery {
		forums {
			forums {
				id
				name
				topicCount
				postCount
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
			}
		}
	}
`;

class ForumListScreen extends Component {
	static navigationOptions = {
		title: "Forums"
	};

	constructor(props) {
		super(props);
	}

	render() {
		if (this.props.data.loading || this.props.data.error) {
			console.log(this.props.data.error);
			return <View repeat={7}>{this.props.data.error ? <Text>Error</Text> : <Text>Loading</Text>}</View>;
		} else {
			const sectionData = this.props.data.forums.forums.map(category => {
				return {
					title: category.name,
					data: category.subforums.map(forum => ({
						key: forum.id,
						data: {
							id: forum.id,
							unread: forum.hasUnread,
							title: forum.name,
							topics: parseInt(forum.topicCount),
							posts: parseInt(forum.postCount) + parseInt(forum.topicCount),
							lastPostPhoto: forum.lastPostAuthor ? forum.lastPostAuthor.photo : null,
							lastPostDate: forum.lastPostDate
						}
					}))
				};
			});

			return (
				<View style={{ flexGrow: 1 }}>
					<SectionList
						renderItem={({ item }) => (
							<ForumItem
								key={item.key}
								data={item.data}
								onPress={() =>
									this.props.navigation.navigate("TopicList", {
										id: item.data.id,
										title: item.data.title,
										topics: item.data.topics
									})
								}
							/>
						)}
						renderSectionHeader={({ section }) => <SectionHeader title={section.title} />}
						sections={sectionData}
					/>
				</View>
			);
		}
	}
}

export default graphql(ForumQuery)(ForumListScreen);
