import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default class Tag extends Component {	
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Text style={styles.tag}>{this.props.children}</Text>
		);
	}
}

const styles = StyleSheet.create({
	tag: {
		color: '#2080A7',
		fontSize: 13,
		borderColor: '#2080A7',
		borderWidth: 1,
		borderRadius: 14,
		paddingVertical: 4,
		paddingHorizontal: 16,
		marginRight: 9
	}
});