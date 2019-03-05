import React, { Component } from 'react';
import { Text, View } from 'react-native';

import Button from "../../atoms/Button";
import NavigationService from "../../utils/NavigationService";

export default class MultiHomeScreen extends Component {
	static navigationOptions = {
		title: 'MultiHomeScreen',
	};
	
	render() {
		return (
			<View>
				<Text>Multihome</Text>
				<Button filled title="Go to InvisionAlpha" onPress={() => NavigationService.navigateToScreen("HomeScreen", {}, 'home')} />
			</View>
		);
	}
}