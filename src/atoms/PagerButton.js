import React, { Component } from 'react';
import { StyleSheet, Image, TouchableHighlight, View, Text } from 'react-native';

export default class PagerButton extends Component {	
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<TouchableHighlight style={styles.highlight} onPress={() => { }}>
				<View style={styles.button}>
					<Text style={styles.buttonText}>{this.props.children}</Text>
				</View>
			</TouchableHighlight>
		);
	}
}

const styles = StyleSheet.create({
	highlight: {
		borderRadius: 20,
	},
	button: {
		width: '100%',
		backgroundColor: '#2e577d',
		borderRadius: 20,
		padding: 9,
	},
	buttonText: {
		color: '#fff',
		fontSize: 13,
		fontWeight: "500",
		textAlign: 'center'
	}
});