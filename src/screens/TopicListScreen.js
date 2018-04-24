import React, { Component } from 'react';
import { Text, View, Button, ScrollView, FlatList } from 'react-native';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import relativeTime from '../utils/RelativeTime';

import TwoLineHeader from '../atoms/TwoLineHeader';
import Pager from '../atoms/Pager';
import PagerButton from '../atoms/PagerButton';
import SectionHeader from '../ecosystems/SectionHeader';
import TopicRow from '../ecosystems/TopicRow';

const TopicListQuery = gql`
	query TopicListQuery($forum: ID!, $offset: Int, $limit: Int) {
		forums {
			forum (id: $forum) {
				topics (offset: $offset, limit: $limit) {
					id
					title
					postCount
					content (stripped: true, singleLine: true, truncateLength: 100 )
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
				}
			}
		}
	}
`;

class TopicListScreen extends Component {
	static navigationOptions = ({ navigation }) => ({
		headerTitle: ( <TwoLineHeader title={`${navigation.state.params.title}`} subtitle={`${navigation.state.params.topics} topics`} /> )
	});

	constructor(props) {
		super(props);
	}
	
	render() {
		if( this.props.data.loading ){
			return (
				<View repeat={7}>
					<Text>Loading</Text>
				</View>
			);
		} else {

			const listData = this.props.data.forums.forum.topics.map( (topic) => ({
				key: topic.id,
				data: {
					id: topic.id,
					unread: topic.isUnread,
					title: topic.title,
					replies: parseInt( topic.postCount ),
					author: topic.author.name,
					started: topic.started,
					snippet: topic.content.trim(),
					hot: false,
					pinned: topic.pinned,
					locked: topic.locked,
					lastPostDate: topic.lastPostDate,
					lastPostPhoto: topic.lastPostAuthor.photo
				}
			}) );

			return (
				<View contentContainerStyle={{flex: 1}} style={{flex: 1}}>
					<Button title='New Topic' onPress={() => this.props.navigation.navigate('CreateTopic')} />
					<ScrollView style={{flex: 1}}>
						<FlatList 
						style={{flex: 1}}
						renderItem={({item}) => <TopicRow key={item.key} data={item.data} onPress={() => this.props.navigation.navigate('TopicView', { id: item.data.id, title: item.data.title, author: item.data.author, posts: item.data.replies, started: relativeTime.long(item.data.started) })} />} 
						data={ listData }
						refreshing={this.props.data.networkStatus == 4}
						onRefresh={() => console.log('refreshing!')}
					/>
					</ScrollView>
				</View>
			);
		}
	}
}

export default graphql( TopicListQuery, {
	options: (props) => ({
        variables: { 
        	forum: props.navigation.state.params.id,
        	offset: 0,
        	limit: 25
        }
    })
} )( TopicListScreen );
