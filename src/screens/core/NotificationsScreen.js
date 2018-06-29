import React, { Component } from 'react';
import { Text, View, FlatList, ScrollView } from 'react-native';
import gql from "graphql-tag";
import { graphql } from "react-apollo";

import NotificationRow from "../../ecosystems/NotificationRow";

const NotificationQuery = gql`
	query NotificationQuery {
		core {
			me {
				notifications {
					id
					type
					app
					class
					itemID
					sentDate
					updatedDate
					readDate
					author {
						photo
					}
					title
					content
					url
					unread
				}
			}
		}
	}
`;

class NotificationsScreen extends Component {
	static navigationOptions = {
		title: 'Notifications',
	};
	
	render() {
		if (this.props.data.loading || this.props.data.error) {
			console.log(this.props.data.error);
			return <View repeat={7}>{this.props.data.error ? <Text>Error</Text> : <Text>Loading</Text>}</View>;
		} else {

			const listData = this.props.data.core.me.notifications.map( (notification) => ({
				key: notification.id,
				data: {
					id: notification.id,
					itemID: notification.itemID,
					unread: notification.unread,
					title: notification.title,
					photo: notification.author.photo,
					content: notification.content,
					date: notification.updatedDate
				}
			}) );

			return (
				<ScrollView style={{flex: 1}}>
					<FlatList 
						style={{flex: 1}}
						renderItem={({item}) => <NotificationRow key={item.key} data={item.data} onPress={() => this.props.navigation.navigate('TopicView', { id: item.data.itemID })} />} 
						data={ listData }
						refreshing={this.props.data.networkStatus == 4}
						onRefresh={() => console.log('refreshing!')}
					/>
				</ScrollView>
			);
		}
	}
}

export default graphql(NotificationQuery)(NotificationsScreen);