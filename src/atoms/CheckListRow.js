import React, { Component } from 'react';
import { Text, View, Image, Switch, StyleSheet, TouchableHighlight } from 'react-native';

import Lang from '../utils/Lang';
import styles, { styleVars } from '../styles';

export default class CheckListRow extends Component {	
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<TouchableHighlight onPress={this.props.onPress || null}>
				<View style={[styles.row, componentStyles.menuItemWrap]}>
					<Text style={componentStyles.label}>{this.props.title}</Text>
					<Image source={this.props.checked ? require('../../resources/checkmark.png') : null} style={componentStyles.check} resizeMode='cover' />
				</View>
			</TouchableHighlight>
		);
	}
}

const componentStyles = StyleSheet.create({
	menuItemWrap: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: styleVars.spacing.wide,
		paddingHorizontal: styleVars.spacing.wide
	},
	check: {
		width: 16,
		height: 13,
		tintColor: styleVars.checkmarkColor
	},
	label: {
		fontSize: 15,
		fontWeight: "500",
		color: styleVars.text,
	}
});