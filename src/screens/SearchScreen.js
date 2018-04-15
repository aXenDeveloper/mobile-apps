import React, { Component } from 'react';
import { Text, View } from 'react-native';

export default class SearchScreen extends Component {
	static navigationOptions = {
		title: 'Search',
	};
	
	render() {
		return (
			<View>
				<Text>Search</Text>
			</View>
		);
	}
}