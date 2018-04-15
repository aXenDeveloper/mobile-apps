import React, { Component } from 'react';
import { Text, View, Button, ScrollView, FlatList } from 'react-native';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Modal from 'react-native-modal';

import TwoLineHeader from '../atoms/TwoLineHeader';
import Post from '../ecosystems/Post';
import Tag from '../atoms/Tag';
import TagList from '../atoms/TagList';
import Pager from '../atoms/Pager';
import PagerButton from '../atoms/PagerButton';

const TopicViewQuery = gql`
	query TopicViewQuery($topic: ID!, $offset: Int, $limit: Int) {
		forums {
			topic (id: $topic) {
				id
				url
				tags {
					name
				}
				locked
				posts (offset: $offset, limit: $limit) {
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
	}

	static navigationOptions = ({ navigation }) => ({
		headerTitle: ( <TwoLineHeader title={`${navigation.state.params.title}`} subtitle={`Started by ${navigation.state.params.author}, ${navigation.state.params.started}`} /> )
	});
	
	render() {
		if( this.props.data.loading ){
			return (
				<View repeat={7}>
					<Text>Loading</Text>
				</View>
			);
		} else {
			//console.log( this.props );

			const topicData = this.props.data.forums.topic; 
			const listData = topicData.posts.map( (post) => ({
				key: post.id,
				data: {
					id: post.id,
					author: post.author,
					content: post.content,
					timestamp: post.timestamp,
					reactions: post.reputation.reactions,
					reputation: post.reputation
				}
			}) );

			return (
				<View style={{flex: 1}}>
					<ScrollView style={{flex: 1, flexGrow: 1}}>
						{topicData.locked ? 
							<Text>This topic is locked</Text>
						: null}
						{topicData.tags.length ?
							<TagList>
								{topicData.tags.map( tag => (
									<Tag key={tag.name}>{tag.name}</Tag>
								))}
							</TagList>
						: null}
						<FlatList 
							style={{flex: 1}}
							renderItem={({item}) => <Post key={item.key} data={item.data} profileHandler={() => this.props.navigation.navigate('Profile', { id: item.data.author.id, name: item.data.author.name, photo: item.data.author.photo })} />} 
							data={ listData }
						/>
					</ScrollView>
				</View>
			);
		}
	}
}

export default graphql( TopicViewQuery, {
	options: (props) => ({
        variables: { 
        	topic: props.navigation.state.params.id,
        	offset: 0,
        	limit: 25
        }
    })
} )( TopicViewScreen );