import React, { Component } from "react";
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';

export class QuillToolbarButton extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<TouchableOpacity style={[buttonStyles.button, this.props.active ? buttonStyles.activeButton : null]} onPress={this.props.onPress}>
				<Image source={this.props.icon} style={[buttonStyles.image, this.props.active ? buttonStyles.activeImage : null]} />
			</TouchableOpacity>
		)
	}
}

const buttonStyles = StyleSheet.create({
	button: {
		width: 34,
		height: 34,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: 5,
		borderRadius: 34
	},
	activeButton: {
		backgroundColor: '#f5f5f7',
	},
	image: {
		tintColor: '#8e8e93',
		width: 20,
		height: 20
	},
	activeImage: {
		tintColor: '#000'
	}
});