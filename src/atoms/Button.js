import React, { Component } from 'react';
import { StyleSheet, Image, TouchableOpacity, Text } from 'react-native';

import styles, { styleVars } from '../styles';

export default class Button extends Component {	
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<TouchableOpacity style={componentStyles.button} onPress={this.props.onPress}>
				<React.Fragment>
					<Image style={componentStyles.icon} resizeMode='stretch' source={this.props.icon} /> 
					<Text style={componentStyles.text}>{this.props.title}</Text>
				</React.Fragment>
			</TouchableOpacity>
		);
	}
}

const componentStyles = StyleSheet.create({
	button: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: styleVars.primaryButton.backgroundColor,
		borderRadius: 3,
		padding: styleVars.spacing.tight
	},
	icon: {
		width: 16,
		height: 16
	},
	text: {
		color: styleVars.primaryButton.color,
		fontSize: 15,
		marginLeft: 6
	}
});