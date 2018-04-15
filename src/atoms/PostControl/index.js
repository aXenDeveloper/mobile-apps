import React, { Component } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';

export default class PostControl extends Component {	
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Text style={styles.control}>{this.props.children}</Text>
		);
	}
}

const styles = StyleSheet.create({
	control: {
		fontSize: 15,
		fontWeight: "500",
		color: '#171717',
		paddingVertical: 12,
		flex: 1,
		textAlign: 'center'
	}
});