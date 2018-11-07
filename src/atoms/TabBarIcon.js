import React, { Component } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

import Badge from "./Badge";
import styles, { styleVars } from "../styles";

const TabBarIcon = (props) => {	
	return (
		<View>
			<Image
				style={[styles.tabIcon, { tintColor: props.tintColor }]}
				source={props.focused ? props.active : props.inactive}
			/>
			{props.badgeCount > 0 && <Badge count={props.badgeCount} style={componentStyles.notificationBadge} />}
		</View>
	);
}

export default TabBarIcon;

const componentStyles = StyleSheet.create({
	notificationBadge: {
		position: 'absolute',
		top: -8,
		right: -6,
	}
});