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
			<TouchableOpacity style={[styles.row, componentStyles.menuItemWrap]} onPress={this.props.data.onPress || null}>
				<View style={componentStyles.menuItem}>
					<Text style={componentStyles.label}>{this.props.data.title}</Text>
					<Text style={componentStyles.value}>
						{this.props.data.value}
					</Text>
				</View>
				<Image source={require('../../../resources/row_arrow.png')} style={componentStyles.arrow} resizeMode='cover' />
			</TouchableOpacity>
		);
	}
}

const componentStyles = StyleSheet.create({
	menuItemWrap: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: styleVars.spacing.standard,
		paddingHorizontal: styleVars.spacing.wide
	},
	icon: {
		width: 24,
		height: 24,
		tintColor: styleVars.lightText,
		marginRight: styleVars.spacing.standard
	},
	menuItem: {
		flex: 1
	},
	label: {
		fontSize: 17,
		color: styleVars.text,
		fontWeight: '500',
	},
	value: {
		color: styleVars.lightText,
		fontSize: 15,
		marginTop: 2
	},
	arrow: {
		width: 11,
		height: 17,
		tintColor: styleVars.lightText,
		marginLeft: styleVars.spacing.standard
	}
});