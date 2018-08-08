import React, { Component } from 'react';
import { Text, View, Image, Switch, StyleSheet, TouchableOpacity } from 'react-native';

import Lang from '../../utils/Lang';
import styles, { styleVars } from '../../styles';

export default class SettingRow extends Component {	
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={[styles.row, componentStyles.menuItemWrap]}>
				<View style={componentStyles.menuItem}>
					<Text style={componentStyles.label}>{this.props.data.title}</Text>
					<Text style={componentStyles.value}>
						{this.props.data.value}
					</Text>
				</View>
			</View>
		);
	}
}

const componentStyles = StyleSheet.create({
	menuItemWrap: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: styleVars.spacing.tight,
		paddingHorizontal: styleVars.spacing.wide
	},
	icon: {
		width: 24,
		height: 24,
		tintColor: styleVars.lightText,
		marginRight: 12
	},
	menuItem: {
		flex: 1
	},
	label: {
		fontSize: 15,
		color: styleVars.text,
		fontWeight: '500',
	},
	value: {
		color: styleVars.veryLightText,
		fontSize: 13
	},
});