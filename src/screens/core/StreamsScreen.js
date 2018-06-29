import React, { Component } from 'react';
import { Text, View } from 'react-native';

export default class StreamsScreen extends Component {
	static navigationOptions = {
		title: 'Streams',
	};
	
	render() {
		return (
			<View>
				<Text>Streams</Text>
			</View>
		);
	}
}