import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';

export default class DummyTextInput extends Component {	
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<TouchableOpacity style={styles.textbox} onPress={this.props.onPress}>
				<Text style={styles.placeholder}>
					{this.props.placeholder}
				</Text>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	textbox: {
		backgroundColor: '#fff',
		borderWidth: 1,
		height: 34,
		borderColor: 'rgba(0,0,0,0.15)',
		borderRadius: 20,
		paddingHorizontal: 10,
		display: 'flex',
		justifyContent: 'center',
		flex: 1,
		width: '100%'
	},
	placeholder: {
		color: '#888',
	}
});