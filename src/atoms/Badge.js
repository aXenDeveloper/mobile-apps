import React, { Component } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

import styles, { styleVars } from "../styles";

const Badge = (props) => {	
	return (
		<View style={[componentStyles.notificationBadge, props.style]}>
			<Text style={componentStyles.notificationBadgeText}>{props.count}</Text>
		</View>
	);
}

export default Badge;

const componentStyles = StyleSheet.create({
	notificationBadge: {
		width: 19,
		height: 19,
		borderRadius: 19,
		backgroundColor: styleVars.badgeBackground,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	},
	notificationBadgeText: {
		color: styleVars.badgeText,
		fontSize: 11,
		fontWeight: '500'
	}
});