import React, { Component } from 'react';
import { Text, View, Image, Switch, StyleSheet, TouchableOpacity } from 'react-native';

import Lang from '../utils/Lang';
import styles, { styleVars } from '../styles';

export default class CheckListRow extends Component {	
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={[styles.row, componentStyles.menuItemWrap]}>
				<Image source={this.props.checked ? require('../../resources/checkmark.png') : null} style={componentStyles.check} resizeMode='cover' />
				<Text style={componentStyles.label}>{this.props.title}</Text>
			</View>
		);
	}
}

const componentStyles = StyleSheet.create({
	menuItemWrap: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: styleVars.spacing.wide,
		paddingHorizontal: styleVars.spacing.wide
	},
	check: {
		width: 16,
		height: 13,
		marginRight: styleVars.spacing.standard,
		tintColor: styleVars.checkmarkColor
	},
	label: {
		fontSize: 15,
		color: styleVars.text,
	}
});