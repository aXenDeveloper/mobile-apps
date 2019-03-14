import React, { Component } from 'react';
import { Text, View } from 'react-native';

import Button from "../../atoms/Button";

export default class MultiHomeScreen extends Component {
	static navigationOptions = {
		title: 'MultiHomeScreen',
	};
	
	render() {
		return (
			<View>
				<Text>Multi home</Text>
				<Button filled title="Browse a category" onPress={() => this.props.navigation.navigate("MultiCategory")} />
			</View>
		);
	}
}