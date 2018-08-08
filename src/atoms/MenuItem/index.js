import React, { Component } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';

import { styles, styleVars } from '../../styles';

export default class MenuItem extends Component {	
	constructor(props) {
		super(props);
	}

	render() {
		console.log( this.props );
		return (
			<TouchableOpacity onPress={this.props.data.onPress || null} style={componentStyles.menuItemWrap}>
				{this.props.data.icon && <Image source={this.props.data.icon} style={componentStyles.icon} />}
				<Text style={componentStyles.menuItem}>{this.props.data.text}</Text>
			</TouchableOpacity>
		);
	}
}

const componentStyles = StyleSheet.create({
	menuItemWrap: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 9
	},
	icon: {
		width: 24,
		height: 24,
		tintColor: styleVars.lightText,
		marginRight: 12
	},
	menuItem: {
		fontSize: 15,
		color: styleVars.text
	}
});