import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class StreamHeader extends Component {	
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={[ componentStyles.container, this.props.style ]}>
				<View style={componentStyles.header}>
					<Text style={componentStyles.text}>{this.props.title}</Text>
				</View>
			</View>
		);
	}
}

const componentStyles = StyleSheet.create({
	container: {
		display: 'flex',
		alignItems: 'flex-start',
		marginHorizontal: 9,
		marginTop: 9,
		marginBottom: 15,
	},
	header: {
		backgroundColor: '#000',
		height: 28,
		borderRadius: 30,
		paddingHorizontal: 15,
		display: 'flex',
		justifyContent: 'center'
	},
	text: {
		color: '#fff',
		fontSize: 13
	}
});