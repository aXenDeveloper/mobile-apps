import React, { Component } from 'react';
import { Text, View, Image, Switch, StyleSheet, TouchableOpacity } from 'react-native';

import Lang from '../utils/Lang';
import styles, { styleVars } from '../styles';

export default class NotificationSettingRow extends Component {	
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={[styles.row, componentStyles.menuItemWrap]}>
				<View style={componentStyles.menuItem}>
					<Text style={componentStyles.label}>{this.props.data.title}</Text>
					{!this.props.data.enabled && <Text style={componentStyles.metaText}>{Lang.get('disabled_notification')}</Text>}
				</View>
				<Switch onTintColor={styleVars.toggleTint} value={this.props.data.on} disabled={!this.props.data.enabled} style={componentStyles.switch} />
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
	metaText: {
		color: styleVars.veryLightText,
		fontSize: 12
	},
	switch: {
		marginLeft: styleVars.spacing.standard
	}
});