import React, { Component } from 'react';
import { Text, View, Button } from 'react-native';

export default class HomeScreen extends Component {
	static navigationOptions = {
		title: "Community"
	};

	render() {
		return (
			<View>
				<Text>Home</Text>
				<Button
					onPress={() => this.props.navigation.navigate('ForumIndex')}
					title="Forums"
				/>
			</View>
		);
	}
}