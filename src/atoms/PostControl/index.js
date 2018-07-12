import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Image } from 'react-native';

export default class PostControl extends Component {	
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<TouchableOpacity style={styles.control} onPress={this.props.onPress || null}>
				<Text style={styles.text}>{this.props.label}</Text>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	control: {
		paddingVertical: 12,
		flex: 1
	},
	text: {
		fontSize: 15,
		fontWeight: "500",
		color: '#171717',
		textAlign: 'center'
	}
});