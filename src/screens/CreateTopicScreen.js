import React, { Component } from 'react';
import { Text, View } from 'react-native';
import CustomHeader from '../ecosystems/CustomHeader';
import styles from '../styles';

export default class CreateTopicScreen extends Component {
	static navigationOptions = {
		title: 'Create Topic',
		header: (props) => {
			return (
				<CustomHeader {...props} title="New Topic" />
			)
		},
		headerTitleStyle: styles.headerTitle,
		headerLeft: ( <Text>Cancel</Text> ),
		headerRight: ( <Text>Post</Text> ),
	};
	
	render() {
		return (
			<View>
				<Text>Create Topic</Text>
			</View>
		);
	}
}